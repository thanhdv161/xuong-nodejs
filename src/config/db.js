import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
}