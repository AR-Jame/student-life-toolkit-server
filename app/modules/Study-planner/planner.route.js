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

router.patch("/toggle-task/:plannerId/:milestoneId/:taskId",
    checkAuth(),
    plannerController.toggleTask
)

router.get('/',
    checkAuth(),
    plannerController.getPlanners
)


export const plannerRoutes = router;