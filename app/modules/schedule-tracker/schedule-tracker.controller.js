import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { scheduleTrackerServices } from "./schedule-tracker.services.js";


/* Subject related controllers */

const createSubject = catchAsync(async (req, res) => {
    const user = req.user;
    const subject = await scheduleTrackerServices.createSubject(req.body, user);
    sendResponse(res, {
        statusCode: 201,
        data: subject,
        message: "Subject created successfully.",
        success: true
    })

})

const getAllSubject = catchAsync(async (req, res) => {
    const user = req.user;
    const subject = await scheduleTrackerServices.getAllSubject(user);
    sendResponse(res, {
        statusCode: 200,
        data: subject,
        message: "Subjects retrieved successfully.",
        success: true
    })

})

const getSingleSubject = catchAsync(async (req, res) => {
    const user = req.user;
    const subjectId = req.params.subjectId;
    const subject = await scheduleTrackerServices.getSingleSubject(subjectId, user);
    sendResponse(res, {
        statusCode: 200,
        data: subject,
        message: "Subject retrieved successfully.",
        success: true
    })

})

const updateSubject = catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const subjectId = req.params.subjectId;
    const subject = await scheduleTrackerServices.updateSubject(subjectId, payload, user);

    sendResponse(res, {
        statusCode: 201,
        data: subject,
        message: "Subject updated successfully.",
        success: true
    })

})

const deleteSubject = catchAsync(async (req, res) => {
    const user = req.user;
    const subjectId = req.params.subjectId;
    const subject = await scheduleTrackerServices.deleteSubject(subjectId, user);

    sendResponse(res, {
        statusCode: 200,
        data: subject,
        message: "Subject deleted successfully.",
        success: true
    })
})

/* Schedule related controllers */

const createSchedule = catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const schedule = await scheduleTrackerServices.createSchedule(payload, user);

    sendResponse(res, {
        statusCode: 201,
        data: schedule,
        message: "Schedule added successfully.",
        success: true
    })
})

const getAllSchedule = catchAsync(async (req, res) => {
    const schedule = await scheduleTrackerServices.getAllSchedule(req.query, req.user);

    sendResponse(res, {
        statusCode: 200,
        data: schedule.data,
        meta: schedule.meta,
        message: "Schedules retrieved successfully.",
        success: true
    })
})

const updateSchedule = catchAsync(async (req, res) => {
    const scheduleId = req.params.scheduleId;

    const schedule = await scheduleTrackerServices.updateSchedule(scheduleId, req.body, req.user);

    sendResponse(res, {
        statusCode: 201,
        data: schedule,
        message: "Schedules updated successfully.",
        success: true
    })
})

const deleteSchedule = catchAsync(async (req, res) => {
    const scheduleId = req.params.scheduleId;

    const schedule = await scheduleTrackerServices.deleteSchedule(scheduleId, req.user);

    sendResponse(res, {
        statusCode: 201,
        data: schedule,
        message: "Schedules deleted successfully.",
        success: true
    })
})

export const scheduleTrackerController = {
    createSubject,
    getAllSubject,
    getSingleSubject,
    updateSubject,
    deleteSubject,
    createSchedule,
    getAllSchedule,
    updateSchedule,
    deleteSchedule
}