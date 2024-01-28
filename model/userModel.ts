import { Schema, Types, model } from "mongoose";
import { iUserData } from "../utils/interface";


const userModel = new Schema<iUserData>(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        token: {
            type: String
        },
        verify: {
            type: Boolean,
            default: false
        },
        status: {
            type: String
        },
        study: [
            {
              type: Types.ObjectId,
              ref: "studys",
            },
        ],
          studyHistory: [
            {
              type: Types.ObjectId,
              ref: "studys",
            },
          ],
        studyPoints: { 
            type: Number, 
            default: 0 
        },
    },
    {timestamps: true}
);

export default model<iUserData>("users",userModel);