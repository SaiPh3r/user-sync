import mongoose from "mongoose";

let initialised = false;

export const connect = async () => {
    mongoose.set('strictQuery', true);

    if (initialised) {
        console.log('already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "user-sync",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connected to mongodb');
        initialised = true;
    } catch (error) {
        console.error('error connecting to mongodb', error);
    }
};