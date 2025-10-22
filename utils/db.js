import mongoose from "mongoose";

const db=()=>{
    mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error)=>{
        console.error("Error connecting to MongoDB:",error);
    });
};

export default db;