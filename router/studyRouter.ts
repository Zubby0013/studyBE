import { Router } from "express";
import { createStudy, getStudentPoint } from "../controller/studyController";


const router:Router = Router();

router.route('/create-study/:userID').post(createStudy);
router.route('/get-all-point/:studentID').get(getStudentPoint);


export default router;