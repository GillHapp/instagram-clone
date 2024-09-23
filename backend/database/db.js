import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default dbConnect;