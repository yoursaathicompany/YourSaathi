import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

function isAdmin(session: any) {
  return session?.user && (session.user as any).role === 'admin';
}

// ─── GET /api/admin/offers ───────────────────────────────────────────────────
// Returns all offers with claim count and remaining slots
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all offers + claim count via aggregate
  const { data: offers, error } = await supabaseAdmin
    .from('bonus_offers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin/offers GET]', error);
    return NextResponse.json({ error: 'Failed to load offers' }, { status: 500 });
  }

  // Fetch claim counts per offer
  const offerIds = offers.map((o: any) => o.id);
  const { data: claimRows } = await supabaseAdmin
    .from('offer_claims')
    .select('offer_id')
    .in('offer_id', offerIds.length ? offerIds : ['00000000-0000-0000-0000-000000000000']);

  const claimCount: Record<string, number> = {};
  for (const row of claimRows ?? []) {
    claimCount[row.offer_id] = (claimCount[row.offer_id] ?? 0) + 1;
  }

  const enriched = offers.map((o: any) => ({
    ...o,
    claims_count: claimCount[o.id] ?? 0,
    remaining: o.max_recipients != null
      ? Math.max(0, o.max_recipients - (claimCount[o.id] ?? 0))
      : null,
  }));

  return NextResponse.json({ offers: enriched });
}

// ─── POST /api/admin/offers ──────────────────────────────────────────────────
// Create a new offer
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    name, type, coin_amount, max_recipients,
    is_active, promo_code, starts_at, ends_at,
    description, modal_title, modal_body,
  } = body;

  // Validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!['signup_bonus', 'promo_code', 'custom'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type. Must be signup_bonus, promo_code, or custom' }, { status: 400 });
  }
  if (!coin_amount || typeof coin_amount !== 'number' || coin_amount < 1) {
    return NextResponse.json({ error: 'coin_amount must be a positive integer' }, { status: 400 });
  }
  if (type === 'promo_code') {
    if (!promo_code || typeof promo_code !== 'string' || !promo_code.trim()) {
      return NextResponse.json({ error: 'promo_code is required for promo_code offers' }, { status: 400 });
    }
  }
  if (starts_at && ends_at && new Date(starts_at) >= new Date(ends_at)) {
    return NextResponse.json({ error: 'starts_at must be before ends_at' }, { status: 400 });
  }

  const { data: offer, error } = await supabaseAdmin
    .from('bonus_offers')
    .insert({
      name: name.trim(),
      type,
      coin_amount: Math.floor(coin_amount),
      max_recipients: max_recipients != null ? Math.floor(max_recipients) : null,
      is_active: is_active !== false,
      promo_code: type === 'promo_code' ? promo_code.trim().toUpperCase() : null,
      starts_at: starts_at || null,
      ends_at: ends_at || null,
      description: description?.trim() || null,
      modal_title: modal_title?.trim() || null,
      modal_body: modal_body?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[admin/offers POST]', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }

  return NextResponse.json({ offer }, { status: 201 });
}
