/**
 * Monime Webhook Endpoint
 * 
 * This endpoint receives payment notifications from Monime
 * URL to use in Monime dashboard: https://YOUR_DOMAIN/api/webhooks/monime
 * 
 * For local testing with Expo, you'll need to use a service like ngrok
 * to expose your local server to the internet.
 */

import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const signature = request.headers.get('x-monime-signature');

        // TODO: Verify webhook signature using HMAC
        // const secret = process.env.MONIME_WEBHOOK_SECRET;
        // if (!verifySignature(body, signature, secret)) {
        //   return Response.json({ error: 'Invalid signature' }, { status: 401 });
        // }

        // Handle different event types
        const { event_type, data } = body;

        switch (event_type) {
            case 'checkout_session.completed':
                await handleCheckoutCompleted(data);
                break;

            case 'checkout_session.cancelled':
                await handleCheckoutCancelled(data);
                break;

            case 'payment.succeeded':
                await handlePaymentSucceeded(data);
                break;

            case 'payment.failed':
                await handlePaymentFailed(data);
                break;

            default:
                console.log('Unhandled event type:', event_type);
        }

        return Response.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return Response.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handleCheckoutCompleted(data: any) {
    const { metadata, id: checkoutSessionId } = data;
    const { sponsorship_id, issue_id } = metadata || {};

    if (!sponsorship_id) return;

    // Update sponsorship status
    await supabase
        .from('sponsorships')
        .update({
            payment_status: 'completed',
            transaction_id: checkoutSessionId,
            updated_at: new Date().toISOString(),
        })
        .eq('id', sponsorship_id);

    console.log(`Checkout completed for sponsorship: ${sponsorship_id}`);
}

async function handleCheckoutCancelled(data: any) {
    const { metadata } = data;
    const { sponsorship_id } = metadata || {};

    if (!sponsorship_id) return;

    await supabase
        .from('sponsorships')
        .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
        })
        .eq('id', sponsorship_id);

    console.log(`Checkout cancelled for sponsorship: ${sponsorship_id}`);
}

async function handlePaymentSucceeded(data: any) {
    const { metadata, reference } = data;
    const { sponsorship_id } = metadata || {};

    if (!sponsorship_id) return;

    await supabase
        .from('sponsorships')
        .update({
            payment_status: 'completed',
            payment_reference: reference,
            updated_at: new Date().toISOString(),
        })
        .eq('id', sponsorship_id);

    console.log(`Payment succeeded for sponsorship: ${sponsorship_id}`);
}

async function handlePaymentFailed(data: any) {
    const { metadata } = data;
    const { sponsorship_id } = metadata || {};

    if (!sponsorship_id) return;

    await supabase
        .from('sponsorships')
        .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
        })
        .eq('id', sponsorship_id);

    console.log(`Payment failed for sponsorship: ${sponsorship_id}`);
}
