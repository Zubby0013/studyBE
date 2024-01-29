import {Request,Response} from 'express';
import userModel from "../model/userModel";
import studyModel from "../model/studyModel";
import moment from 'moment';
import { Types } from 'mongoose';
import { CronJob } from 'cron';
import lodash from "lodash";


export const createStudy = async(req:Request, res:Response)=>{
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
      // console.log("duration:",durationT);
      // console.log("break:",breakT);
      // console.log("stretchT:",stretchT);
      // console.log("totalT:",totalT);

      const convertTo = start.setMinutes(totalT);
      const time = moment(convertTo).format("h:mm:ss a");
      // console.log(time);

      const task = new CronJob(
        `${time.split(":")[1]} ${time.split(":")[0]} * * * `,
        async function () {
          await userModel.findByIdAndUpdate(
            study?._id,
            { endTime: true, studyPoint: +duration },
            { new: true }
          );
  
          // user.studyPoints! = user?.studyPoints + +duration;
          // user?.save();
  
          console.log("true");
  
          task.stop();
        },
        null,
        true,
        "America/Los_Angeles"
      );
      // console.log("this is cron:",task);
      
      const study = await studyModel.create({
        duration: durationT,
        breakTime: breakT,
        stretchTime: stretchT,
        subject,
        endTime,
      });
      user?.studyHistory.push(new Types.ObjectId(study._id));
      user?.save();
      return res.status(201).json({
         message: "study successfuly created",
         data: study,
         status: 201
      });
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

export const getStudentPoint = async (req: Request, res: Response) => {
  try {
    const { studentID } = req.params;

    const user = await userModel.findById(studentID).populate({
      path: "studyHistory",
    });
    if (user) {
      const history = user?.studyHistory;
      const just = lodash.map(history, (el)=> el)
      const filteredData = lodash.filter(just, (item:any) => item.verifyTime === false);
const result = lodash.map(filteredData, '_id').push();
const getPoint = result.toString().split(" ")[0];
      console.log('result:',getPoint);
      const point = await userModel.findOneAndReplace({
         studyPoints: getPoint , 
        });
        user.studyPoints = user?.studyPoints ;
        user?.save();
        // { new: true }
        console.log(point)
      return res.status(201).json({
        message: "Point added",
        data: point,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      msg: "Error adding points",
      status: 404,
    });
  }
};

// export const getStudentPoint2 = async (req: Request, res: Response) => {
//   try {
//     const { studentID } = req.params;

   

//       return res.status(201).json({
//         message: "Point added",
//         // data: user,
//       });
    
//   } catch (error) {
//     console.error(error);
//     return res.status(404).json({
//       msg: "Error adding points",
//       status: 404,
//     });
//   }
// };


export const getTopSchoolar = async(req:Request, res:Response)=>{
   try {
    const users = await userModel.find();

    const rateTier = lodash.groupBy(users, "studyPoints");
    const topFive = Object.entries(rateTier)
      .sort((a, b) => +b[0] - +a[0])
      .slice(0, 5);
      console.log(topFive);
    return res.status(200).json({
      msg: "getting high schoolar"
    });
   } catch (error) {
    return res.status(404).json({
      msg: "error getting schoolar"
    });
   }
};