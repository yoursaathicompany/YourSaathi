import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

const BONUS_AMOUNT = 100;
const MAX_BONUS_RECIPIENTS = 100;

/**
 * POST /api/user/signup-bonus
 *
 * Awards 100 coins to a newly signed-up user IF:
 *   1. The user has never received a signup bonus before.
 *   2. The total number of signup bonuses awarded is still < 100.
 *
 * Returns:
 *   { granted: true,  coins_awarded: 100, new_balance: N, recipients_so_far: N }
 *   { granted: false, reason: "already_received" | "limit_reached" }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Check if this user already received a signup bonus
    const { data: existingBonus } = await supabaseAdmin
      .from('coin_ledger')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'signup_bonus')
      .maybeSingle();

    if (existingBonus) {
      return NextResponse.json({ granted: false, reason: 'already_received' });
    }

    // 2. Count total signup bonuses awarded across all users
    const { count: totalBonuses } = await supabaseAdmin
      .from('coin_ledger')
      .select('id', { count: 'exact', head: true })
      .eq('type', 'signup_bonus');

    if ((totalBonuses ?? 0) >= MAX_BONUS_RECIPIENTS) {
      return NextResponse.json({ granted: false, reason: 'limit_reached', total: MAX_BONUS_RECIPIENTS });
    }

    // 3. Fetch current balance
    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('coins_balance')
      .eq('id', userId)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const previousBalance = user.coins_balance ?? 0;
    const newBalance = previousBalance + BONUS_AMOUNT;

    // 4. Update coins_balance
    const { error: updateErr } = await supabaseAdmin
      .from('users')
      .update({ coins_balance: newBalance })
      .eq('id', userId);

    if (updateErr) {
      console.error('[signup-bonus] balance update error:', updateErr);
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    // 5. Record in coin_ledger
    const { error: ledgerErr } = await supabaseAdmin
      .from('coin_ledger')
      .insert({
        user_id: userId,
        type: 'signup_bonus',
        amount: BONUS_AMOUNT,
        reference_type: 'signup',
        note: `Welcome bonus — ${BONUS_AMOUNT} coins for joining YourSaathi (offer for first ${MAX_BONUS_RECIPIENTS} users)`,
      });

    if (ledgerErr) {
      console.warn('[signup-bonus] ledger insert warning:', ledgerErr);
    }

    return NextResponse.json({
      granted: true,
      coins_awarded: BONUS_AMOUNT,
      new_balance: newBalance,
      recipients_so_far: (totalBonuses ?? 0) + 1,
    });
  } catch (err) {
    console.error('[signup-bonus] unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/user/signup-bonus
 * Returns whether the current user is eligible for the signup bonus.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ eligible: false, reason: 'unauthenticated' });
    }

    const userId = session.user.id;

    // Check if already received
    const { data: existingBonus } = await supabaseAdmin
      .from('coin_ledger')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'signup_bonus')
      .maybeSingle();

    if (existingBonus) {
      return NextResponse.json({ eligible: false, reason: 'already_received' });
    }

    // Count total
    const { count: totalBonuses } = await supabaseAdmin
      .from('coin_ledger')
      .select('id', { count: 'exact', head: true })
      .eq('type', 'signup_bonus');

    const remaining = MAX_BONUS_RECIPIENTS - (totalBonuses ?? 0);

    if (remaining <= 0) {
      return NextResponse.json({ eligible: false, reason: 'limit_reached' });
    }

    return NextResponse.json({
      eligible: true,
      bonus_amount: BONUS_AMOUNT,
      remaining_slots: remaining,
    });
  } catch (err) {
    console.error('[signup-bonus] GET error:', err);
    return NextResponse.json({ eligible: false, reason: 'error' });
  }
}
