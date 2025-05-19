import { createOrUpdateUser, deleteOneUser } from '@/lib/actions/user'
import { clerkClient } from '@clerk/nextjs/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'

export async function POST(req
    
) {
  try {
    const evt = await verifyWebhook(req)
    
    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt?.data
    const eventType = evt?.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)
    if(eventType==="user.created" || eventType==="user.updated"){
     
        const{id,first_name,last_name,image_url,email_addresses,username}=evt?.data;
        try {
          const user=await createOrUpdateUser(id,first_name,last_name,image_url,email_addresses,username)
          if(user &&evt?.type==="user.created"){
            try {
              await clerkClient.users.updateUserMetadeta(id,{
                publicMetadata:{
                  userMongoId:user._id,
                  isAdmin:user.isAdmin,
                }
              })
            } catch (error) {
              console.log("error updating user metadata",error)
              
            }
          }
          
        } catch (error) {
          console.log("error updating or creating user webhook",error)
          return new Response('Database error', { status: 500 });
          
        }


     
    }
    if(eventType==="user.deleted"){
      const {id}=evt?.data
      try {
        await deleteOneUser(id)
      } catch (error) {
        console.log("error deleting user webhook",error)
        return new Response('Delete error', { status: 500 });
        
      }
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Invalid signature', { status: 400 });

  }
}