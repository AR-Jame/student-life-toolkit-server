import { Router } from "express";
import { examController } from "./exam.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

const router = Router();

router.post('/generate',
    checkAuth(),
    examController.generateExam
);

router.get('/load-question/:examId',
    checkAuth(),
    examController.loadExamQuestion
);


router.patch('/submit/:examId',
    checkAuth(),
    examController.submitExam
);

router.get('/',
    checkAuth(),
    examController.prevExam
);

router.get('/:examId',
    checkAuth(),
    examController.examDetails
);


export const examRoutes = router;