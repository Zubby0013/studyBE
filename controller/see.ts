import {Request,Response} from 'express';
import userModel from "../model/userModel";
import moment from 'moment';

export const createStudyTest = async(req:Request, res:Response)=>{
  try {
    
    const {userID} = req.params;
    const user = await userModel.findByIdAndUpdate(userID);
    
    if (user) {
      const {duration, breakTime,endTime,subject,stretchTime} = req.body;
      const start = new Date();
      
      const durationT = +duration * 60;
      const breakT = durationT / +breakTime;
      const stretchT = stretchTime * breakT;
      const totalT = durationT + stretchT;
      console.log("duration:",durationT);
      console.log("break:",breakT);
      console.log("stretchT:",stretchT);
      console.log("totalT:",totalT);
    } else {
      return res.status(404).json({
      message: 'no user found'
    });
    }
  } catch (error) {
    return res.status(404).json({
      message: 'error creating study'
    });
  }
};