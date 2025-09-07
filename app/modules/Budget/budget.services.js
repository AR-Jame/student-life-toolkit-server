import mongoose from "mongoose";
import AppError from "../../errorHelper/AppError.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { Budget } from "./budget.model.js";

// CREATE - Add new budget entry
const createBudget = async (payload, user) => {
    payload.userId = new mongoose.Types.ObjectId(user._id);
    payload.date = new Date(payload.date).toISOString()
    const data = await Budget.create(payload);
    return data;
};

const getAllBudgets = async (user, query) => {
    const queryBuilder = new QueryBuilder(Budget.find({ userId: user._id }), query);
    const entries = queryBuilder
        .filter()
        .sort()
        .fieldFilter()
        .paginate()

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

    const data = await Budget.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(user._id), type: type }
        },
        {
            $group: { _id: "$category", amount: { $sum: "$amount" } }
        }
    ])
    return data;
};


// READ - Get entries by category
const getBudgetsByCategory = async (category, user) => {

    const entries = await Budget.find({
        userId: user._id,
        category: category
    }).sort({ date: -1 });

};

// READ - Get budget summary (totals, balance)
const getBudgetSummary = async (user, query) => {
    const matchCondition = { userId: new mongoose.Types.ObjectId(user._id) };
    if (query) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchCondition.date = { $gte: thirtyDaysAgo };
    }

    const total = Budget.aggregate([
        {
            $match: matchCondition
        },
        {
            $facet: {
                "byType": [
                    {
                        $group: {
                            _id: "$type",
                            totalAmount: { $sum: "$amount" }
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    }
                ],

                "byCategory": [
                    {
                        $group: {
                            _id: {
                                type: "$type",
                                category: "$category"
                            },
                            totalAmount: { $sum: "$amount" }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.type",
                            categories: {
                                $push: {
                                    category: "$_id.category",
                                    amount: "$totalAmount"
                                }
                            }
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    }
                ]
            }
        }
    ]);
    return total

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