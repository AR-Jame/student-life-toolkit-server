import { Router } from "express";
import { scheduleTrackerController } from "./schedule-tracker.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

const router = Router();

router.post("/subject",
    checkAuth(),
    scheduleTrackerController.createSubject
);

router.get("/subject",
    checkAuth(),
    scheduleTrackerController.getAllSubject
);

router.get("/subject/:subjectId",
    checkAuth(),
    scheduleTrackerController.getSingleSubject
);

router.patch("/subject/:subjectId",
    checkAuth(),
    scheduleTrackerController.updateSubject
)

router.delete("/subject/:subjectId",
    checkAuth(),
    scheduleTrackerController.deleteSubject
)

export const scheduleRoute = router;