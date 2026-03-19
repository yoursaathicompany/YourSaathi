import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(session.user.id);
    if (error || !user) return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });

    return NextResponse.json({ verified: !!user.email_confirmed_at });
  } catch (error) {
    console.error('Error in GET /verify-email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email: session.user.email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/settings`
      }
    });

    if (error) {
      console.error('Supabase resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /verify-email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
