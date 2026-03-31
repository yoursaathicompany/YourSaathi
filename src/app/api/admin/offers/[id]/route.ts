import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

function isAdmin(session: any) {
  return session?.user && (session.user as any).role === 'admin';
}

// ─── PATCH /api/admin/offers/[id] ───────────────────────────────────────────
// Update any field of an offer
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();

  // Whitelist updateable fields — never allow changing claimed history
  const allowed = [
    'name', 'coin_amount', 'max_recipients', 'is_active',
    'promo_code', 'starts_at', 'ends_at', 'description',
    'modal_title', 'modal_body',
  ];

  const updates: Record<string, any> = {};
  for (const key of allowed) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  // Validate type-specific rules
  if ('coin_amount' in updates) {
    if (typeof updates.coin_amount !== 'number' || updates.coin_amount < 1) {
      return NextResponse.json({ error: 'coin_amount must be a positive integer' }, { status: 400 });
    }
    updates.coin_amount = Math.floor(updates.coin_amount);
  }

  if ('max_recipients' in updates && updates.max_recipients !== null) {
    if (typeof updates.max_recipients !== 'number' || updates.max_recipients < 1) {
      return NextResponse.json({ error: 'max_recipients must be a positive integer or null' }, { status: 400 });
    }
    updates.max_recipients = Math.floor(updates.max_recipients);
  }

  if ('starts_at' in updates && 'ends_at' in updates) {
    if (updates.starts_at && updates.ends_at && new Date(updates.starts_at) >= new Date(updates.ends_at)) {
      return NextResponse.json({ error: 'starts_at must be before ends_at' }, { status: 400 });
    }
  }

  if ('promo_code' in updates && updates.promo_code) {
    updates.promo_code = (updates.promo_code as string).trim().toUpperCase();
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data: offer, error } = await supabaseAdmin
    .from('bonus_offers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[admin/offers PATCH]', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 409 });
    }
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }

  return NextResponse.json({ offer });
}

// ─── DELETE /api/admin/offers/[id] ──────────────────────────────────────────
// Delete an offer (cascades to offer_claims)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const { error } = await supabaseAdmin
    .from('bonus_offers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[admin/offers DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
