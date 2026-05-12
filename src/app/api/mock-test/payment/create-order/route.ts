import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Razorpay from 'razorpay';

/**
 * POST /api/mock-test/payment/create-order
 * Creates a Razorpay order for ₹49 mock test pack.
 */
export async function POST(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: 4900,          // ₹49 in paise
      currency: 'INR',
      receipt: `mock_${session.user.id}_${Date.now()}`,
      notes: {
        user_id: session.user.id,
        product: '50 Mock Tests',
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });

  } catch (err) {
    console.error('[mock-test/payment/create-order] Error:', err);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
