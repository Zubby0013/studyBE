import { Application, NextFunction, Request, Response } from "express";
import { mainError } from "./error/mainError";
import { HTTP } from "./utils/enums";
import { handleError } from "./error/handleError";
import auth from "./router/userRouter";
import study from "./router/studyRouter";

export const mainApp = (app:Application)=>{
    try {
        app.use('/api',auth);
        app.use('/api',study);
        app.get("/", (req:Request, res:Response)=>{
            try {
                return res.status(200).json({
                    message: "welome to my study api"
                });
            } catch (error) {
                return res.status(404).json({
                    message: "default error"
                });
            }
        });
        app.all("*", (req: Request, res: Response, next: NextFunction) => {
            next(
              new mainError({
                name: `Route Error`,
                message: `Route Error: because the page, ${req.originalUrl} doesn't exist`,
                status: HTTP.BAD_REQUEST,
                success: false,
              })
            );
          });
          
    app.use(handleError);
        
    } catch (error) {
        return error
    }
};