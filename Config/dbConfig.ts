import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConfig = async () => {
  try {
    return await connect(process.env.MONGO_DB_URL!)
      .then(() => {
        console.log("database connection🔥");
      })
      .catch((err) => console.error());
  } catch (error) {
    return error;
  }
};
