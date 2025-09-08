import { Router } from "express";
import { plannerController } from "./planner.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

const router = Router();

router.post("/add-planner",
    checkAuth(),
    plannerController.addPlanner
)

router.patch("/add-milestone/:plannerId",
    checkAuth(),
    plannerController.addMilestone
)

router.patch("/add-task/:plannerId/:milestoneId",
    checkAuth(),
    plannerController.addTask
)


export const plannerRoutes = router;