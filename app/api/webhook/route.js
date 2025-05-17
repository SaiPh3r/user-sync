import { verifyWebhook } from '@clerk/nextjs/webhooks';
// import { createOrUpdate, deleteUser } from '@/lib/actions/user.actions'; // adjust path as needed
import { createOrUpdate, deleteUser } from '@/lib/actions/user'; // adjust path as needed

export async function POST(req) {
  console.log("📬 Clerk webhook received");

  try {
    const evt = await verifyWebhook(req, {
      secret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    const eventType = evt.type;
    const eventData = evt.data;

    console.log('✅ Verified Clerk webhook:', eventType);
    console.log('📦 Webhook payload:', eventData);

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      } = eventData;

      console.log("👤 Creating or updating user:", {
        id,
        first_name,
        last_name,
        email: email_addresses?.[0]?.email_address,
        username,
      });

      try {
        await createOrUpdate(id, first_name, last_name, image_url, email_addresses, username);
        return new Response("✅ User created/updated", { status: 200 });
      } catch (error) {
        console.error("❌ Error creating/updating user:", error);
        return new Response("❌ Error creating/updating user", { status: 500 });
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = eventData;

      console.log("🗑️ Deleting user:", id);

      try {
        await deleteUser(id);
        return new Response("✅ User deleted", { status: 200 });
      } catch (error) {
        console.error("❌ Error deleting user:", error);
        return new Response("❌ Error deleting user", { status: 500 });
      }
    }

    return new Response('✅ Webhook received (no matching event type)', { status: 200 });
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return new Response('❌ Webhook verification failed', { status: 500 });
  }
}