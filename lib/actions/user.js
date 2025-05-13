import User from "../models/user.model";

import {connect} from "../mongodb/mongoose"

export const createOrUpdate = async(id, first_name, last_name, image_url, email_addresses,username) => {
    try {
        await connect();

        const user  = await User.findOneAndUpdate(
            { clerkId: id },
            {
                $set: {
                    clerkId: id,
                    firstName: first_name,
                    lastName: last_name,
                    avatar: image_url,
                    email: email_addresses[0].email_address,
                    username:username
                }
            },
            { upsert: true, new: true }
        )
        return user;

    } catch (error) {
        console.log(error)
       
    }
}

export const deleteUser = async(id)=>{
    try {
        await connect();
        await User.findOneAndDelete({clerkId:id});
        
    } catch (error) {
        console.log("error deleting user",error)
        
    }
}