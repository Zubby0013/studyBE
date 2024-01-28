import { Router } from "express";
import { createUser, loginUser, logoutUser, verifyUser } from "../controller/userController";


const router:Router = Router();

router.route('/create-user').post(createUser);
router.route('/verify-user').patch(verifyUser);
router.route('/login-user').post(loginUser);
router.route('/logout-user').delete(logoutUser);

export default router;