import express, { Application,Response,Request,NextFunction } from "express";
import dotEnv from "dotenv";
import cors from "cors";
import { dbConfig } from "./Config/dbConfig";
import { mainApp } from "./mainApp";
import session from "express-session";

import MongoDB from "connect-mongodb-session";

const MongoDBStore = MongoDB(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URL_ONLINE!,
  collection: "sessions",
});

dotEnv.config();

const port:number = parseInt(process.env.PORT!);
const app:Application = express();

app.use(cors());
app.use(express.json());
mainApp(app);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", process.env.APP_URL);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });


app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
  
      cookie: {
        maxAge: 1000 * 60 * 24 * 60,
        sameSite: "lax",
        secure: false,
      },
  
      store,
    })
);

const server = app.listen(port, ()=>{
    console.clear();
    console.log("first");
    dbConfig();
});

process.on("uncaughtException", (error: Error) => {
    console.log("uncaughtException: ", error);
  
    process.exit(1);
  });
  
  process.on("unhandledRejection", (reason: any) => {
    console.log("unhandledRejection: ", reason);
  
    server.close(() => {
      process.exit(1);
    });
  });
  