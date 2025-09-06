import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { budgetServices } from "./budget.services.js";


// CREATE - Add new budget budget
const createBudget = catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const budget = await budgetServices.createBudget(payload, user);

    sendResponse(res, {
        statusCode: 201,
        data: budget,
        message: "Budget added successfully.",
        success: true
    });
});

// READ - Get all budget entries for user
const getAllBudgets = catchAsync(async (req, res) => {
    const user = req.user;
    const { data, meta } = await budgetServices.getAllBudgets(user, req.query);

    sendResponse(res, {
        statusCode: 200,
        data: data,
        meta: meta,
        message: "Budget entries retrieved successfully.",
        success: true
    });
});

// READ - Get single budget budget by ID
const getBudgetById = catchAsync(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const budget = await budgetServices.getBudgetById(id, user);

    sendResponse(res, {
        statusCode: 200,
        data: budget,
        message: "Budget budget retrieved successfully.",
        success: true
    });
});

// READ - Get entries by type (Income/Expense)
const getBudgetsByType = catchAsync(async (req, res) => {
    const user = req.user;
    const { type } = req.params;
    const entries = await budgetServices.getBudgetsByType(type, user);

    sendResponse(res, {
        statusCode: 200,
        data: entries,
        message: `${type} entries retrieved successfully.`,
        success: true
    });
});

// READ - Get entries by category
const getBudgetsByCategory = catchAsync(async (req, res) => {
    const user = req.user;
    const { category } = req.params;
    const entries = await budgetServices.getBudgetsByCategory(category, user);

    sendResponse(res, {
        statusCode: 200,
        data: entries,
        message: `${category} entries retrieved successfully.`,
        success: true
    });
});

// READ - Get budget summary (totals, balance)
const getBudgetSummary = catchAsync(async (req, res) => {
    const user = req.user;
    const { startDate, endDate } = req.query;
    const summary = await budgetServices.getBudgetSummary(user, { startDate, endDate });

    sendResponse(res, {
        statusCode: 200,
        data: summary,
        message: "Budget summary retrieved successfully.",
        success: true
    });
});

// UPDATE - Update budget budget
const updateBudget = catchAsync(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const payload = req.body;
    const budget = await budgetServices.updateBudget(id, payload, user);

    sendResponse(res, {
        statusCode: 200,
        data: budget,
        message: "Budget budget updated successfully.",
        success: true
    });
});

// DELETE - Delete budget budget
const deleteBudget = catchAsync(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    await budgetServices.deleteBudget(id, user);

    sendResponse(res, {
        statusCode: 200,
        data: null,
        message: "Budget budget deleted successfully.",
        success: true
    });
});

export const budgetController = {
    createBudget,
    getAllBudgets,
    getBudgetById,
    getBudgetsByType,
    getBudgetsByCategory,
    getBudgetSummary,
    updateBudget,
    deleteBudget,
};