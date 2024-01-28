import { HTTP } from "./enums";

export interface iUser {
    name: string;
    email:string;
    password: string
    token: string;
    verify: boolean;
    study: Array<{}>;
    status: string
    studyHistory: Array<{}>
    studyPoints: number,
};

export interface iStudy {
    subject: string;
    startTime: string;
    duration: string;
    breakTime: string ;
    endTime: string;
    stretchTime: string;
    verifyTime: boolean;
    summary?: string;
    user: {};
};

export interface iError {
    name: string;
    message: string;
    status: HTTP;
    success: boolean;
  }

export interface iStudyData extends iStudy, Document{};
export interface iUserData extends iUser , Document{};