import mongoose from "mongoose";
import { Planner } from "./planner.model.js";
import AppError from "../../errorHelper/AppError.js";

const addPlanner = async (payload, user) => {
    payload.userId = user._id;
    const data = await Planner.create(payload)
    return data
}

const addMilestone = async (plannerId, payload, user) => {
    const response = await Planner.findOneAndUpdate(
        new mongoose.Types.ObjectId(plannerId) ,
        { $push: { milestones: payload } },
        { new: true, runValidators: true }
    )
    console.log(response);
    return response
}

const addTask = async (plannerId, milestoneId, payload, user) => {
    const response = await Planner.findOneAndUpdate(
        { _id: plannerId, "milestones._id": new mongoose.Types.ObjectId(milestoneId) },
        { $push: { "milestones.$.tasks": payload } },
        { new: true, runValidators: true }
    );
    console.log(response);
    return response
}

const toggleTask = async (plannerId, milestoneId, taskId, user) => {
    const planner = await Planner.findOne({ _id: plannerId });
    const milestone = planner?.milestones?.id?.(milestoneId);
    const task = milestone?.tasks?.id?.(taskId);

    if (!task) throw new AppError(500, "Data does not found")

    task.isCompleted = !task.isCompleted;
    console.log(task);
    await planner.save();

    return planner
}

const getPlanners = async (userId) => {
    const data = Planner.find({ userId, userId });
    return data
}

export const plannerServices = {
    addPlanner,
    addMilestone,
    addTask,
    toggleTask,
    getPlanners
}