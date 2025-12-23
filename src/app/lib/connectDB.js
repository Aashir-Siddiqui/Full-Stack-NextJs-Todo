import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  try {
    mongoose.set("strictQuery", true);

    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "todoapp",
      maxPoolSize: 10,
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("MongoDB connected successfully!");
    console.log(`Database: ${db.connections[0].name}`);
    console.log(`Host: ${db.connections[0].host}`);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    isConnected = false;
    throw error;
  }
};

export const isDBConnected = () => isConnected;
