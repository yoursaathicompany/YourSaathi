import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/user/balance — returns the current user's coin balance
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('coins_balance, display_name, avatar_url, role, email_verified')
    .eq('id', session.user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    coins_balance: data.coins_balance || 0,
    display_name: data.display_name || '',
    avatar_url: data.avatar_url,
    role: data.role,
    email_verified: data.email_verified || false,
  });
}
