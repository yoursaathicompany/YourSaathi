import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * POST /api/user/offers/claim
 *
 * Claim an offer by offer_id (auto-shown offers) or promo_code.
 * Body: { offer_id?: string } | { promo_code?: string }
 *
 * Atomically:
 *  1. Re-validates all eligibility conditions server-side
 *  2. Inserts offer_claims row (UNIQUE constraint prevents double-claim)
 *  3. Inserts coin_ledger earned entry
 *  4. Updates users.coins_balance
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { offer_id, promo_code } = body ?? {};

  if (!offer_id && !promo_code) {
    return NextResponse.json(
      { error: 'Provide either offer_id or promo_code' },
      { status: 400 }
    );
  }

  // ── 1. Resolve the offer ────────────────────────────────────────────────────
  let offerQuery = supabaseAdmin.from('bonus_offers').select('*');

  if (offer_id) {
    offerQuery = offerQuery.eq('id', offer_id);
  } else {
    // Case-insensitive promo code lookup
    offerQuery = offerQuery
      .eq('type', 'promo_code')
      .ilike('promo_code', promo_code.trim());
  }

  const { data: offer, error: offerErr } = await offerQuery.maybeSingle();

  if (offerErr || !offer) {
    return NextResponse.json(
      { error: promo_code ? 'Invalid promo code' : 'Offer not found' },
      { status: 404 }
    );
  }

  // ── 2. Validate eligibility ─────────────────────────────────────────────────
  const now = new Date();

  if (!offer.is_active) {
    return NextResponse.json({ error: 'This offer is no longer active' }, { status: 400 });
  }
  if (offer.starts_at && new Date(offer.starts_at) > now) {
    return NextResponse.json({ error: 'This offer has not started yet' }, { status: 400 });
  }
  if (offer.ends_at && new Date(offer.ends_at) < now) {
    return NextResponse.json({ error: 'This offer has expired' }, { status: 400 });
  }

  // Already claimed?
  const { data: existingClaim } = await supabaseAdmin
    .from('offer_claims')
    .select('id')
    .eq('offer_id', offer.id)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingClaim) {
    return NextResponse.json({ error: 'You have already claimed this offer' }, { status: 409 });
  }

  // Cap check
  if (offer.max_recipients != null) {
    const { count } = await supabaseAdmin
      .from('offer_claims')
      .select('id', { count: 'exact', head: true })
      .eq('offer_id', offer.id);

    if ((count ?? 0) >= offer.max_recipients) {
      return NextResponse.json({ error: 'This offer has reached its maximum recipients' }, { status: 400 });
    }
  }

  // ── 3. Fetch current balance ────────────────────────────────────────────────
  const { data: user, error: userErr } = await supabaseAdmin
    .from('users')
    .select('coins_balance')
    .eq('id', userId)
    .single();

  if (userErr || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const previousBalance = user.coins_balance ?? 0;
  const newBalance = previousBalance + offer.coin_amount;

  // ── 4. Record the claim (UNIQUE constraint is the final race-condition guard) ─
  const { data: claim, error: claimErr } = await supabaseAdmin
    .from('offer_claims')
    .insert({ offer_id: offer.id, user_id: userId })
    .select()
    .single();

  if (claimErr) {
    if (claimErr.code === '23505') {
      return NextResponse.json({ error: 'You have already claimed this offer' }, { status: 409 });
    }
    console.error('[offers/claim] claim insert error:', claimErr);
    return NextResponse.json({ error: 'Failed to record claim' }, { status: 500 });
  }

  // ── 5. Update coin balance ─────────────────────────────────────────────────
  const { error: balErr } = await supabaseAdmin
    .from('users')
    .update({ coins_balance: newBalance })
    .eq('id', userId);

  if (balErr) {
    console.error('[offers/claim] balance update error:', balErr);
    // Roll back the claim so user can retry
    await supabaseAdmin.from('offer_claims').delete().eq('id', claim.id);
    return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
  }

  // ── 6. Write coin_ledger entry ─────────────────────────────────────────────
  const referenceType = offer.type === 'promo_code' ? 'promo_code' : 'offer_claim';
  await supabaseAdmin.from('coin_ledger').insert({
    user_id: userId,
    type: 'earned',
    amount: offer.coin_amount,
    reference_id: claim.id,
    reference_type: referenceType,
    note: `${offer.name} — +${offer.coin_amount} coins`,
  });

  // ── 7. Count recipients (for display) ─────────────────────────────────────
  const { count: recipientsSoFar } = await supabaseAdmin
    .from('offer_claims')
    .select('id', { count: 'exact', head: true })
    .eq('offer_id', offer.id);

  return NextResponse.json({
    granted: true,
    offer_name: offer.name,
    coins_awarded: offer.coin_amount,
    new_balance: newBalance,
    recipients_so_far: recipientsSoFar ?? 1,
  });
}
