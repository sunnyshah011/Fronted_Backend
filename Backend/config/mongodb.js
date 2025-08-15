import mongoose from "mongoose";
import { DB_NAME } from "../contansts.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MONGODB CONNECTED!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR :: " + error);
    process.exit(1);
  }
};

export default connectDB;

//  mongoose.connection.on("connected", () => { console.log("DB CONNECTED")});
//  await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`);
