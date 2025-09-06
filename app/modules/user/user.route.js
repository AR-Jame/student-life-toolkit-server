import { Router } from "express";
import { userController } from "./user.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

const router = Router();


router.post("/register", userController.createUser)

router.get("/me",
    checkAuth(),
    userController.getMe
)


export const userRoutes = router;