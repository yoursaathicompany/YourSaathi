import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * POST /api/mock-test/payment/verify
 * Verifies Razorpay payment signature and unlocks 50 credits.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // ── Verify Signature ─────────────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // ── Record Purchase + Unlock Credits ──────────────────────────────────
    const { error: insertErr } = await supabaseAdmin
      .from('mock_test_purchases')
      .upsert(
        {
          user_id: session.user.id,
          razorpay_order_id,
          razorpay_payment_id,
          amount_paise: 4900,
          credits_granted: 50,
          status: 'paid',
          verified_at: new Date().toISOString(),
        },
        { onConflict: 'razorpay_order_id' }
      );

    if (insertErr) {
      console.error('[mock-test/payment/verify] Failed to record purchase:', insertErr);
      return NextResponse.json({ error: 'Failed to unlock credits' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      credits_granted: 50,
      message: '50 mock tests have been unlocked successfully!',
    });

  } catch (err) {
    console.error('[mock-test/payment/verify] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
