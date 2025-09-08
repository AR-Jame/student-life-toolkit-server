import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { examServices } from "./exam.services.js";

const generateExam = catchAsync(async (req, res) => {
    const subject = req.body.topic;
    const user = req.user
    const exam = await examServices.generateExam(subject, user);
    sendResponse(res, {
        statusCode: 201,
        data: exam,
        message: "Exam generated successfully.",
        success: true
    })

})


const loadExamQuestion = catchAsync(async (req, res) => {
    const examId = req.params.examId
    const user = req.user
    const exam = await examServices.loadExamQuestion(examId, user);
    sendResponse(res, {
        statusCode: 201,
        data: exam,
        message: "Exam questions loaded successfully.",
        success: true
    })

})


const submitExam = catchAsync(async (req, res) => {
    const examId = req.params.examId;
    const user = req.user;
    const payload = req.body;
    const exam = await examServices.submitExam(examId, payload, user);
    sendResponse(res, {
        statusCode: 201,
        data: exam,
        message: "Exam submitted successfully.",
        success: true
    })

})


const prevExam = catchAsync(async (req, res) => {
    const user = req.user;
    const exam = await examServices.prevExam(user);
    sendResponse(res, {
        statusCode: 200,
        data: exam,
        message: "Exams retrieved successfully.",
        success: true
    })

})

const examDetails = catchAsync(async (req, res) => {
    const user = req.user;
    const examId = req.params.examId
    const exam = await examServices.examDetails(examId, user);
    sendResponse(res, {
        statusCode: 200,
        data: exam,
        message: "Exam retrieved successfully.",
        success: true
    })

})

export const examController = {
    generateExam,
    loadExamQuestion,
    submitExam,
    prevExam,
    examDetails
}