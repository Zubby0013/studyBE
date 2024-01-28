import { Request, Response } from "express";
import studyModel from "../model/studyModel";
import userModel from "../model/userModel";
import moment from 'moment';
import { Types } from 'mongoose';
import { CronJob } from 'cron';

export const createStudy = async (req: Request, res: Response) => {
    try {
        const { subject,endTime, breakTime, duration } = req.body;
        const { userID } = req.params;

        const user = await userModel.findById(userID).populate({path: '_id'})

        if (user) {
        const startTime:any = new Date();
        const endedTime:any = new Date(startTime);
        endedTime.setHours(parseInt(startTime.getHours() + +endTime));
        console.log(endTime);

        const start:any = moment(startTime).format('LT');
        const end:any = moment(endedTime ).format('LT');
        console.log("end",end)

        const subtraction = endedTime - startTime;
        
        const studyDuration = moment(subtraction).hour();
        const totalStudyTime = end - start;
        let count = 0;
        const breakLength = duration * count;


        new CronJob(
            `*/${breakTime} * * * * *`,
            function () {
                // console.log('startBreak');

                setTimeout(() => {
                    count++;

                    // console.log('endBreak');
                }, duration);
            },
            null,
            true,
            // 'America/Los_Angeles'
        );

        const study = await studyModel.create({
            startTime: start,
            endTime: endedTime,
            totalStudyTime,
            breakTime,
            duration,
            studyDuration,
            studyPoint: +studyDuration,
            subject
        });
console.log(study)
        user?.studyHistory.push(new Types.ObjectId(study._id));
        user?.save();
         return res.status(201).json({
            message: 'Study created',
            data: study
        });
        } else {
           return res.status(404).json({
            message: 'Study failed to create',
        }); 
        }

        
    } catch (error:any) {
        console.error(error);
        return res.status(404).json({
            msg: 'Error creating study',
            status: 404,
        });
    }
};