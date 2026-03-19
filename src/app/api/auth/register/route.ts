import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Create user securely via Supabase Auth Admin 
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (authErr || !authData.user) {
      if (authErr?.message?.includes('already registered')) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }
      console.error('Failed to create auth user:', authErr);
      return NextResponse.json({ error: authErr?.message || 'Failed to create user account' }, { status: 400 });
    }

    // Insert the public.users row automatically linked via foreign key
    const { error: publicErr } = await supabaseAdmin
      .from('users')
      .upsert({ 
        id: authData.user.id,
        email: email,
        display_name: name,
        role: 'student',
        coins_balance: 0
      });

    if (publicErr) {
      console.error('Failed to update public user profile:', publicErr);
      return NextResponse.json({ error: 'Failed to setup user profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
