import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === 'admin' || (session?.user as any)?.role === 'teacher';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { target_user_id, amount, reason, note } = await req.json();

    if (!target_user_id || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Missing target_user_id or amount' }, { status: 400 });
    }

    // Get current balance
    const { data: user, error: getErr } = await supabaseAdmin
      .from('users')
      .select('coins_balance')
      .eq('id', target_user_id)
      .single();

    if (getErr || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const previousBalance = user.coins_balance;
    const newBalance = Math.max(0, previousBalance + amount);

    // Update balance
    const { error: updErr } = await supabaseAdmin
      .from('users')
      .update({ coins_balance: newBalance })
      .eq('id', target_user_id);

    if (updErr) {
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    // Log transaction
    await supabaseAdmin.from('coin_transactions').insert({
      user_id: target_user_id,
      coins_awarded: amount,
      previous_balance: previousBalance,
      new_balance: newBalance,
      reason: 'admin_adjustment',
      note: note || reason || 'Manual adjustment by admin',
    });

    return NextResponse.json({ success: true, new_balance: newBalance });

  } catch (err) {
    console.error('Admin balance adjustment error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
