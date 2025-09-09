import mongoose from "mongoose";


export async function connectdb(): Promise<void> {
    const dburl = process.env.DB_URL;
    if (!dburl) {
        throw new Error("DB_URL environment variable is missing");
    }
    try { 
        if (mongoose.connection.readyState === 1) return;
        const connection = await mongoose.connect(dburl);
        console.log("successfully connected with id:", connection.connection.host);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Mongoose connection error:", error); // Log the real error
            throw new Error("unable to establish connection with the database");
        }
        throw error;
    }
}