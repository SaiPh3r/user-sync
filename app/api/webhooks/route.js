import { verifyWebhook } from '@clerk/nextjs/webhooks';


export async function POST(req) {
  try {
    const evt = await verifyWebhook(req, {
      secret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    
    const eventType = evt.type;

    console.log('Received webhook:', eventType);

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const {id, first_name, last_name, image_url, email_addresses,username} = evt?.data;
      try {
        await createOrUpdate(id, first_name, last_name, image_url, email_addresses,username);
        return new Response("user is created", { status: 200 });
        
      } catch (error) {
        console.log("error creating user",error)
        return new Response("error creating user", { status: 500 });
        
      }
    }

    if (eventType === 'user.deleted') { 
      const {id} = evt.data;
      try {
      await deleteUser(id);
      return new Response("user is deleted", { status: 200 });
        
      } catch (error) {
        console.log("error deleting user",error)
        return new Response("error deleting user", { status: 500 });
        
      }

    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response('Webhook error', { status: 500 });
  }
}