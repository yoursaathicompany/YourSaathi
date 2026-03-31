import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/user/offers
 *
 * Returns all active, eligible, unclaimed offers for the authenticated user.
 * Query param: ?type=auto  → only signup_bonus and custom (auto-shown modals)
 *              ?type=promo → only promo_code offers (for promo code input UI)
 *              (omit)      → all eligible offers
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ offers: [] });
  }

  const userId = session.user.id;
  const url = new URL(req.url);
  const typeFilter = url.searchParams.get('type'); // 'auto' | 'promo' | null

  const now = new Date().toISOString();

  // 1. Fetch candidate active offers within date window
  let query = supabaseAdmin
    .from('bonus_offers')
    .select('*')
    .eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`);

  if (typeFilter === 'auto') {
    query = query.in('type', ['signup_bonus', 'custom']);
  } else if (typeFilter === 'promo') {
    query = query.eq('type', 'promo_code');
  }

  const { data: offers, error } = await query.order('created_at', { ascending: true });

  if (error || !offers?.length) {
    return NextResponse.json({ offers: [] });
  }

  // 2. Fetch this user's existing claims for these offers
  const offerIds = offers.map((o: any) => o.id);
  const { data: claims } = await supabaseAdmin
    .from('offer_claims')
    .select('offer_id')
    .eq('user_id', userId)
    .in('offer_id', offerIds);

  const claimedSet = new Set((claims ?? []).map((c: any) => c.offer_id));

  // 3. Fetch claim counts for offers that have a cap
  const cappedOfferIds = offers
    .filter((o: any) => o.max_recipients != null)
    .map((o: any) => o.id);

  const claimCountMap: Record<string, number> = {};
  if (cappedOfferIds.length > 0) {
    const { data: countRows } = await supabaseAdmin
      .from('offer_claims')
      .select('offer_id')
      .in('offer_id', cappedOfferIds);

    for (const row of countRows ?? []) {
      claimCountMap[row.offer_id] = (claimCountMap[row.offer_id] ?? 0) + 1;
    }
  }

  // 4. Filter to only eligible (unclaimed, under cap)
  const eligible = offers
    .filter((o: any) => {
      if (claimedSet.has(o.id)) return false; // already claimed
      if (o.max_recipients != null) {
        const used = claimCountMap[o.id] ?? 0;
        if (used >= o.max_recipients) return false; // cap reached
      }
      return true;
    })
    .map((o: any) => ({
      id: o.id,
      name: o.name,
      type: o.type,
      coin_amount: o.coin_amount,
      max_recipients: o.max_recipients,
      remaining: o.max_recipients != null
        ? Math.max(0, o.max_recipients - (claimCountMap[o.id] ?? 0))
        : null,
      modal_title: o.modal_title,
      modal_body: o.modal_body,
      ends_at: o.ends_at,
    }));

  return NextResponse.json({ offers: eligible });
}
