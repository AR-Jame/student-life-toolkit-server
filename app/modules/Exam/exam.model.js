import { model, Schema } from "mongoose"


const questionSchema = new Schema({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'QuestionBank',
        required: true
    },
    correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    studentAnswer: {
        type: Number,
        min: 0,
        max: 3,
        default: null
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
}, {
    _id: false,
    versionKey: false
})

const examAttemptSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    subject: {
        type: String,
        required: true,
        enum: ['Math', 'Programming', 'History', 'English', "GK"]
    },
    questions: [questionSchema],
    status: {
        type: String,
        enum: ["INIT", "FINISHED"],
        default: "INIT"
    },
    // Scoring
    score: {
        type: Number,
        min: 0
    }
}, { versionKey: false });


export const ExamAttempt = model("ExamAttempt", examAttemptSchema)