import mongoose from "mongoose";
import { Planner } from "./planner.model.js";

const addPlanner = async (payload, user) => {
    payload.userId = user._id;
    const data = await Planner.create(payload)
    return data
}

const addMilestone = async (plannerId, payload, user) => {
    const response = await Planner.findByIdAndUpdate(
        plannerId,
        { $push: { milestones: payload } },
        { new: true, runValidators: true }
    )
    console.log(response);
    return response
}

const addTask = async (plannerId, milestoneId, payload, user) => {
    const response = await Planner.findOneAndUpdate(
        { _id: plannerId, "milestones._id": milestoneId },
        { $push: { "milestones.$.tasks": payload } },
        { new: true, runValidators: true }
    );
    console.log(response);
    return response
}

export const plannerServices = {
    addPlanner,
    addMilestone,
    addTask
}