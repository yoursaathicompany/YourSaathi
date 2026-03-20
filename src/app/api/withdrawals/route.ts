import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { validateUpiId } from '@/lib/withdrawal-utils';

// POST /api/withdrawals — create a withdrawal request
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { tier_id?: string; upi_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { tier_id, upi_id } = body;

  if (!tier_id) {
    return NextResponse.json({ error: 'Redemption tier is required.' }, { status: 400 });
  }

  if (!upi_id || !validateUpiId(upi_id.trim())) {
    return NextResponse.json(
      { error: 'Invalid UPI ID. Expected format: yourname@bankname (e.g. john@okicici)' },
      { status: 400 }
    );
  }

  // Call the secure DB function — it handles all validation atomically
  const { data, error } = await supabaseAdmin.rpc('create_withdrawal_request', {
    p_user_id: session.user.id,
    p_tier_id: tier_id,
    p_upi_id: upi_id.trim().toLowerCase(),
  });

  if (error) {
    console.error('[POST /api/withdrawals] RPC error:', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }

  const result = data as { success: boolean; error?: string; withdrawal_id?: string; message?: string };

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    withdrawal_id: result.withdrawal_id,
    message: result.message,
  });
}

// GET /api/withdrawals — list current user's withdrawals
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '10', 10));
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('withdrawals')
    .select('*, withdrawal_settings(label)', { count: 'exact' })
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: 'Failed to load withdrawals' }, { status: 500 });
  }

  return NextResponse.json({
    withdrawals: data ?? [],
    total: count ?? 0,
    page,
    limit,
  });
}
