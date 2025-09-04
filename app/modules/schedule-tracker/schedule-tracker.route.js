import { Router } from "express";
import { scheduleTrackerController } from "./schedule-tracker.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

const router = Router();


/* Subject related routes */
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
);

/* Schedule related routes */

router.post("/",
    checkAuth(),
    scheduleTrackerController.createSchedule
)

router.get("/",
    checkAuth(),
    scheduleTrackerController.getAllSchedule
);

router.patch('/:scheduleId', 
    checkAuth(),
    scheduleTrackerController.updateSchedule
)

router.delete('/:scheduleId', 
    checkAuth(),
    scheduleTrackerController.deleteSchedule
)


export const scheduleRoute = router;