import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/withdrawals/tiers — returns active redemption tiers
export async function GET(_req: NextRequest) {
  const { data, error } = await supabaseAdmin
    .from('withdrawal_settings')
    .select('id, label, coins_required, rupee_amount, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to load tiers' }, { status: 500 });
  }

  return NextResponse.json({ tiers: data ?? [] });
}
