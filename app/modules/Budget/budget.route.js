import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { budgetController } from "./budget.controller.js";

const router = Router();


router.post("/",
    checkAuth(),
    budgetController.createBudget
);

// READ - Get all budget entries for authenticated user
router.get("/",
    checkAuth(),
    budgetController.getAllBudgets
);

// READ - Get budget summary (totals, balance)
router.get("/summary",
    checkAuth(),
    budgetController.getBudgetSummary
);

// READ - Get single budget entry by ID
router.get("/:id",
    checkAuth(),
    budgetController.getBudgetById
);

// READ - Get entries by type (Income/Expense)
router.get("/type/:type",
    checkAuth(),
    budgetController.getBudgetsByType
);

// READ - Get entries by category
router.get("/category/:category",
    checkAuth(),
    budgetController.getBudgetsByCategory
);

// UPDATE - Update budget entry
router.put("/:id",
    checkAuth(),
    budgetController.updateBudget
);

// DELETE - Delete budget entry
router.delete("/:id",
    checkAuth(),
    budgetController.deleteBudget
);

export const budgetRoutes = router;