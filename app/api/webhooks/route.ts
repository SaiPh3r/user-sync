import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;

    console.log('Received webhook:', eventType);

    if (eventType === 'user.created') {
      console.log('User created:', id);
    }

    if (eventType === 'user.updated') {
      console.log('User updated:', id);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response('Webhook error', { status: 500 });
  }
}