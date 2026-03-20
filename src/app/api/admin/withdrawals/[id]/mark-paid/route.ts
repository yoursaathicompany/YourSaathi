import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// POST /api/admin/withdrawals/[id]/mark-paid
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let payout_reference: string | undefined;
  try {
    const body = await req.json();
    payout_reference = body.payout_reference;
  } catch {
    // reference is optional
  }

  const { data, error } = await supabaseAdmin.rpc('mark_withdrawal_paid', {
    p_withdrawal_id: id,
    p_admin_id: session.user.id,
    p_payout_ref: payout_reference ?? null,
  });

  if (error) {
    console.error('[mark_withdrawal_paid] RPC error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  const result = data as { success: boolean; error?: string; message?: string };
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: result.message });
}
