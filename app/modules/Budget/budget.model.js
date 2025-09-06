import { model, Schema } from "mongoose"
const budgetSchema = new Schema({
    type: {
        type: String,
        enum: ["Income", "Expense"],
        required: true
    },
    category: {
        type: String,
        enum: ["allowance", "job", "scholarship", "food", "transport", "books", "entertainment", "otherIncome", "otherExpense"],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    versionKey: false,
    timestamps: true
})


export const Budget = model("Budget", budgetSchema);