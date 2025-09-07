import mongoose from "mongoose";
import { ExamAttempt } from "./exam.model.js";
import AppError from "../../errorHelper/AppError.js";


const generateExam = async (subject, user) => {
    const Question = mongoose.connection.db.collection("QuestionBank")
    const questions = await Question.aggregate([
        { $match: { subject: subject } },
        { $sample: { size: 10 } },
        { $project: { _id: 1, correctAnswer: 1 } }
    ]).toArray();

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
    const Question = mongoose.connection.db.collection("QuestionBank");
    const examAttempt = await ExamAttempt.findOne({ _id: new mongoose.Types.ObjectId(examId) })


    if (!examAttempt) {
        throw new AppError(404, 'Exam not found');
    }
    if (examAttempt.userId.toString() !== user._id) {
        throw new AppError(500, "You aren't the examinee for this exam")
    }


    const questionIds = examAttempt.questions.map(q => q.questionId);

    const questionsFromBank = await Question.find({
        _id: { $in: questionIds }
    }).project({ _id: 1, options: 1, question: 1 }).toArray();

    return { _id: examId, questions: questionsFromBank }
}

const submitExam = async (examId, payload, user) => {
    // const examAttempt = await ExamAttempt.findById(examId);

    // if (!examAttempt) {
    //     throw new Error('Exam not found');
    // }

    // payload.forEach(answer => {
    //     const questionIndex = examAttempt.questions.findIndex(
    //         q => q.questionId.toString() === answer.questionId
    //     );

    //     if (questionIndex !== -1) {
    //         examAttempt.questions[questionIndex].studentAnswer = answer.selectedOption;
    //     }
    // });

    // await examAttempt.save();
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

    await examAttempt.save();

    return {
        examId: examAttempt._id,
        score: correctCount,
        totalQuestions: examAttempt.totalQuestions,
        percentage: examAttempt.percentage,
        status: examAttempt.status
    };

}

export const examServices = {
    generateExam,
    loadExamQuestion,
    submitExam
}