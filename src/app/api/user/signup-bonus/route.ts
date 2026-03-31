/**
 * /api/user/signup-bonus
 *
 * Legacy shim — now fully delegated to the bonus_offers / offer_claims system.
 * The SignupBonusModal still calls these endpoints; they read config from the
 * bonus_offers table (type = 'signup_bonus') instead of hardcoded constants.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// ── helper: get the active signup_bonus offer ─────────────────────────────────
async function getSignupOffer() {
  const now = new Date().toISOString();
  const { data } = await supabaseAdmin
    .from('bonus_offers')
    .select('*')
    .eq('type', 'signup_bonus')
    .eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

// ── GET /api/user/signup-bonus ────────────────────────────────────────────────
// Returns eligibility info for the signup bonus
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ eligible: false, reason: 'unauthenticated' });
  }

  const offer = await getSignupOffer();
  if (!offer) {
    return NextResponse.json({ eligible: false, reason: 'limit_reached' });
  }

  // Already claimed?
  const { data: claim } = await supabaseAdmin
    .from('offer_claims')
    .select('id')
    .eq('offer_id', offer.id)
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (claim) {
    return NextResponse.json({ eligible: false, reason: 'already_received' });
  }

  // Cap check
  if (offer.max_recipients != null) {
    const { count } = await supabaseAdmin
      .from('offer_claims')
      .select('id', { count: 'exact', head: true })
      .eq('offer_id', offer.id);

    const remaining = offer.max_recipients - (count ?? 0);
    if (remaining <= 0) {
      return NextResponse.json({ eligible: false, reason: 'limit_reached' });
    }

    return NextResponse.json({
      eligible: true,
      bonus_amount: offer.coin_amount,
      remaining_slots: remaining,
      modal_title: offer.modal_title,
      modal_body: offer.modal_body,
    });
  }

  return NextResponse.json({
    eligible: true,
    bonus_amount: offer.coin_amount,
    remaining_slots: null,
    modal_title: offer.modal_title,
    modal_body: offer.modal_body,
  });
}

// ── POST /api/user/signup-bonus ───────────────────────────────────────────────
// Claims the signup bonus — delegates to the unified offer claim logic
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const offer = await getSignupOffer();
  if (!offer) {
    return NextResponse.json({ granted: false, reason: 'limit_reached' });
  }

  // Proxy to the unified claim endpoint
  const claimRes = await fetch(
    new URL('/api/user/offers/claim', req.url).toString(),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward session cookie so auth() works in the claim route
        Cookie: req.headers.get('cookie') ?? '',
      },
      body: JSON.stringify({ offer_id: offer.id }),
    }
  );

  const claimData = await claimRes.json();

  if (!claimRes.ok) {
    if (claimData.error?.includes('already claimed')) {
      return NextResponse.json({ granted: false, reason: 'already_received' });
    }
    if (claimData.error?.includes('maximum recipients')) {
      return NextResponse.json({ granted: false, reason: 'limit_reached' });
    }
    return NextResponse.json({ granted: false, reason: claimData.error }, { status: claimRes.status });
  }

  return NextResponse.json({
    granted: true,
    coins_awarded: claimData.coins_awarded,
    new_balance: claimData.new_balance,
    recipients_so_far: claimData.recipients_so_far,
  });
}
