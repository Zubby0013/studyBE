import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../model/userModel";
import bcrypt from 'bcrypt';
import { sendEmail } from "../utils/email";

export const createUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { email,password,name } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password , salt);
      const id = crypto.randomBytes(4).toString("hex");
      const user = await userModel.create({
        email,
        token: id,
        password:hashedPassword,
        name: "",
      });
      sendEmail(user);
      return res.status(201).json({
        message: "creating user",
        data: user,
        status: 201
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error creating user",
      });
    }
  };



export const verifyUser = async(req:Request, res:Response)=>{
    try {
        const {token} = req.body;

        const user = await userModel.findOne({token});
        if (user) {
            await userModel.findByIdAndUpdate(
                user._id,
                {
                    token: "",
                    verify: true
                },
                {
                    new: true
                }
            )
            return res.status(201).json({
                message: 'user successfully verified',
                data: user,
                status: 201
            })
        } else {
            return res.status(404).json({
                message: "no user found"
            });
        }
    } catch (error:any) {
        return res.status(404).json({
            message: "error finding verifing",
            data: error.message
        });
    }
};

export const loginUser = async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if (user && user.verify) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign({ _id: user._id, email: user.email }, "student", {
          expiresIn: "1d",
        });

        req.session.isAuth = true;
        req.session.isuserID = user._id;

        return res.status(201).json({
          message: "Welcome back",
          data: token,
          status: 201,
        });
      } else {
        return res.status(404).json({
          message: "Incorrect password",
        });
      }
    } else {
      return res.status(404).json({
        message: "User not found or not verified",
      });
    }
  } catch (error:any) {
    return res.status(404).json({
      message: "Error during login",
      data: error.message,
    });
  }
};

export const logoutUser= async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    req.session.destroy();

    return res.status(200).json({
      message: "GoodBye",
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying user",
    });
  }
};