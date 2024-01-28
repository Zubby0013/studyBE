import { Router } from "express";
import { createStudy } from "../controller/studyController";
import { createStudyTest } from "../controller/see";


const router:Router = Router();

router.route('/create-study-test/:userID').post(createStudyTest);
router.route('/create-study/:userID').post(createStudy);

export default router;