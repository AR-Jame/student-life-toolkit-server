import mongoose from "mongoose";
import { ExamAttempt, QuestionBank } from "./exam.model.js";
import AppError from "../../errorHelper/AppError.js";


const generateExam = async (subject, user) => {
    const questions = await QuestionBank.aggregate([
        { $match: { subject: subject } },
        { $sample: { size: 10 } },
        { $project: { _id: 1, correctAnswer: 1 } }
    ])

    const examAttemptInfo = {
        userId: user._id,
        subject: subject,
        questions: []
    }

    questions.forEach(q => examAttemptInfo.questions.push({ questionId: q._id, correctAnswer: q.correctAnswer }))

    const examAttempt = await ExamAttempt.create(examAttemptInfo);
    console.log({ questions, examAttempt });
    return { questions, examAttempt: examAttempt._id }
}


const loadExamQuestion = async (examId, user) => {
    const examAttempt = await ExamAttempt.findOne({ _id: new mongoose.Types.ObjectId(examId) })


    if (!examAttempt) {
        throw new AppError(404, 'Exam not found');
    }
    if (examAttempt.userId.toString() !== user._id) {
        throw new AppError(500, "You aren't the examinee for this exam")
    }


    const questionIds = examAttempt.questions.map(q => q.questionId);

    const questionsFromBank = await QuestionBank.find({
        _id: { $in: questionIds }
    }).select(" _id options question");

    return { _id: examId, questions: questionsFromBank }
}

const submitExam = async (examId, payload, user) => {

    const examAttempt = await ExamAttempt.findById(examId);

    if (!examAttempt) {
        throw new Error('Exam not found');
    }

    let correctCount = 0;

    // Update each question's studentAnswer and isCorrect
    payload.forEach(answer => {
        const questionIndex = examAttempt.questions.findIndex(
            q => q.questionId.toString() === answer.questionId
        );

        if (questionIndex !== -1) {
            const question = examAttempt.questions[questionIndex];

            // Update studentAnswer
            question.studentAnswer = answer.selectedOption;

            // Check if answer is correct and update isCorrect
            const isAnswerCorrect = question.correctAnswer === answer.selectedOption;
            question.isCorrect = isAnswerCorrect;

            if (isAnswerCorrect) {
                correctCount++;
            }
        }
    });

    examAttempt.score = correctCount;

    examAttempt.status = 'FINISHED';
    examAttempt.finishedAt = Date.now()

    await examAttempt.save();

    return {
        examId: examAttempt._id,
        score: correctCount,
        totalQuestions: examAttempt.totalQuestions,
        percentage: examAttempt.percentage,
        status: examAttempt.status
    };

}

const prevExam = async (user) => {
    const exam = await ExamAttempt.find({ userId: user._id }).select("-questions");
    return exam
}

const examDetails = async (examId, user) => {
    let data = await ExamAttempt.findById(examId)
        .populate({
            path: 'questions.questionId',
            select: 'question options'
        });

    if (data.userId.toString() !== user._id.toString()) throw new AppError(401, "You can't access this data")

    data = {
        ...data.toObject(),
        questions: data.questions.map(q => ({
            _id: q.questionId._id,
            question: q.questionId.question,
            options: q.questionId.options,
            studentAnswer: q.studentAnswer,
            isCorrect: q.isCorrect,
            correctAnswer: q.correctAnswer
        }))
    }

    return data;
}

export const examServices = {
    generateExam,
    loadExamQuestion,
    submitExam,
    prevExam,
    examDetails
}