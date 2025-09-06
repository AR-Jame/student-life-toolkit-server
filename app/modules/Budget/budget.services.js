import AppError from "../../errorHelper/AppError.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { Budget } from "./budget.model.js";

// CREATE - Add new budget entry
const createBudget = async (payload, user) => {
    payload.userId = user._id;

    const data = await Budget.create(payload);
    return data;
};

const getAllBudgets = async (user, query) => {
    const queryBuilder = new QueryBuilder(Budget.find({ userId: user._id }), query);
    const entries = queryBuilder
        .filter()
        .sort()
        .paginate()
        .fieldFilter();

    const [data, meta] = await Promise.all([
        entries.build(),
        entries.getMeta()
    ]);
    return { data, meta };
};


const getBudgetById = async (entryId, user) => {
    const entry = await Budget.findOne({ _id: entryId });

    if (!entry) {
        throw new AppError(404, "Budget entry not found.");
    }

    if (entry.userId.toString() !== user._id.toString()) {
        throw new AppError(403, "You don't have access to this entry.");
    }

    return entry;
};

// READ - Get entries by type (Income/Expense)
const getBudgetsByType = async (type, user) => {
    if (!['Income', 'Expense'].includes(type)) {
        throw new AppError(400, "Invalid type. Must be 'Income' or 'Expense'.");
    }

    const entries = await Budget.find({
        userId: user._id,
        type: type
    }).sort({ date: -1 });

    return entries;
};

// READ - Get entries by category
const getBudgetsByCategory = async (category, user) => {

    const entries = await Budget.find({
        userId: user._id,
        category: category
    }).sort({ date: -1 });

    return entries;
};

// READ - Get budget summary (totals, balance)
const getBudgetSummary = async (user, options = {}) => {
    const { startDate, endDate } = options;

    const dateFilter = {};

    if (startDate || endDate) {
        dateFilter.date = {};

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            dateFilter.date.$gte = start;
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateFilter.date.$lte = end;
        }
    }

    console.log(dateFilter);
    const entries = await Budget.find({
        userId: user._id,
        ...dateFilter
    });

    const summary = entries.reduce((acc, entry) => {
        if (entry.type === 'Income') {
            acc.totalIncome += entry.amount;
        } else {
            acc.totalExpenses += entry.amount;
        }
        return acc;
    }, { totalIncome: 0, totalExpenses: 0 });

    summary.balance = summary.totalIncome - summary.totalExpenses;
    summary.entryCount = entries.length;

    // Category breakdown
    const categoryBreakdown = entries.reduce((acc, entry) => {
        if (!acc[entry.category]) {
            acc[entry.category] = { Income: 0, Expense: 0 };
        }
        acc[entry.category][entry.type] += entry.amount;
        return acc;
    }, {});

    summary.categoryBreakdown = categoryBreakdown;

    return summary;
};

// UPDATE - Update budget entry
const updateBudget = async (entryId, payload, user) => {
    const entry = await Budget.findOne({ _id: entryId });

    if (!entry) {
        throw new AppError(404, "Budget entry not found.");
    }

    if (entry.userId.toString() !== user._id.toString()) {
        throw new AppError(403, "You can't update this entry.");
    }

    // Validate amount if provided
    if (payload.amount !== undefined && payload.amount <= 0) {
        throw new AppError(400, "Amount must be greater than 0.");
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
        { _id: entryId },
        payload,
        { runValidators: true, new: true }
    );

    return updatedBudget;
};

// DELETE - Delete budget entry
const deleteBudget = async (entryId, user) => {
    const entry = await budgetController.findOne({ _id: entryId });

    if (!entry) {
        throw new AppError(404, "Budget entry not found.");
    }

    if (entry.userId.toString() !== user._id.toString()) {
        throw new AppError(403, "You can't delete this entry.");
    }

    await Budget.findByIdAndDelete(entryId);
    return { message: "Budget deleted successfully" };
};


export const budgetServices = {
    createBudget,
    getAllBudgets,
    getBudgetById,
    getBudgetsByType,
    getBudgetsByCategory,
    getBudgetSummary,
    updateBudget,
    deleteBudget,
};