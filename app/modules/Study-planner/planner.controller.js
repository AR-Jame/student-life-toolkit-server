import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { plannerServices } from "./planner.services.js";

const addPlanner = catchAsync(async (req, res) => {
    const plan = req.body;
    const user = req.user;
    const response = await plannerServices.addPlanner(plan, user);
    sendResponse(res, {
        statusCode: 201,
        data: response,
        message: "New plan created successfully.",
        success: true
    })

})

const addMilestone = catchAsync(async (req, res) => {
    const plan = req.body;
    const user = req.user;
    const plannerId = req.params.plannerId;
    const response = await plannerServices.addMilestone(plannerId, plan, user);
    sendResponse(res, {
        statusCode: 201,
        data: response,
        message: "New added milestone successfully.",
        success: true
    })

})

const addTask = catchAsync(async (req, res) => {
    const plan = req.body;
    const user = req.user;
    const plannerId = req.params.plannerId;
    const milestoneId = req.params.milestoneId;
    const response = await plannerServices.addTask(plannerId, milestoneId, plan, user);
    sendResponse(res, {
        statusCode: 201,
        data: response,
        message: "New task added to milestone successfully.",
        success: true
    })
})

const toggleTask = catchAsync(async (req, res) => {
    const user = req.user;
    const plannerId = req.params.plannerId;
    const milestoneId = req.params.milestoneId;
    const taskId = req.params.taskId;
    const response = await plannerServices.toggleTask(plannerId, milestoneId, taskId, user);
    sendResponse(res, {
        statusCode: 201,
        data: response,
        message: "task completion toggled successfully.",
        success: true
    })
})


const getPlanners = catchAsync(async (req, res) => {
    const user = req.user;
    const response = await plannerServices.getPlanners(user);
    sendResponse(res, {
        statusCode: 201,
        data: response,
        message: "task data retrieved successfully.",
        success: true
    })
})



export const plannerController = {
    addPlanner,
    addMilestone,
    addTask,
    toggleTask,
    getPlanners
}