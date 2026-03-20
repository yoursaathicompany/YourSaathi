import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// POST /api/admin/withdrawals/[id]/reject
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let admin_notes: string | undefined;
  try {
    const body = await req.json();
    admin_notes = body.admin_notes;
  } catch {
    // notes are optional
  }

  const { data, error } = await supabaseAdmin.rpc('reject_withdrawal', {
    p_withdrawal_id: id,
    p_admin_id: session.user.id,
    p_notes: admin_notes ?? null,
  });

  if (error) {
    console.error('[reject_withdrawal] RPC error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  const result = data as { success: boolean; error?: string; message?: string };
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: result.message });
}
