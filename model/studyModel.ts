import { Schema, Types, model } from "mongoose";
import { iStudyData } from "../utils/interface";


const studyModel = new Schema<iStudyData>(
    {
        subject: {
            type: String,
        },
        startTime: {
            type: String,
        },
        duration: {
            type: String,
        },
        endTime: {
            type: String,
        },
        breakTime: {
            type: String,
        },
        stretchTime: {
            type: String,
        },
        summary: {
            type: String,
        },
        verifyTime: {
            type: Boolean,
            default: false
        },
        user: { 
            type: Types.ObjectId,
             ref: "users" 
        },
    },
    {timestamps: true}
);

export default model<iStudyData>("studys",studyModel);