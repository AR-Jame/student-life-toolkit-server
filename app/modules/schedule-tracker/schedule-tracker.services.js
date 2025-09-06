import AppError from "../../errorHelper/AppError.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { Schedule, Subject } from "./schedule-tracker.model.js"

const createSubject = async (payload, user) => {
    const isSubjectExist = await Subject.findOne({ name: payload.name });

    if (isSubjectExist) {
        throw new AppError(500, "This subject already exists.")
    }

    payload.userId = user._id

    const data = await Subject.create(payload);
    return data

}

const getAllSubject = async (user) => {
    const subject = await Subject.find({ userId: user._id });
    return subject
}


const getSingleSubject = async (subjectId, user) => {

    const subject = await Subject.findOne({ _id: subjectId });

    if (!subject) {
        throw new AppError(404, "subject not found.")
    }

    if (subject.userId.toString() !== user._id) {
        throw new AppError(500, "You can't access this data.")
    }
    return subject
}


const updateSubject = async (subjectId, payload, user) => {
    console.log(subjectId);
    const subject = await Subject.findOne({ _id: subjectId });

    if (!subject) {
        throw new AppError(404, "subject not found.")
    }

    if (subject.userId.toString() !== user._id) {
        throw new AppError(500, "You can't update this data.")
    }
    const updatedSubject = await Subject.findByIdAndUpdate(
        { _id: subjectId },
        payload,
        { runValidators: true, new: true }
    )
    return updatedSubject
}

const deleteSubject = async (subjectId, user) => {
    console.log(subjectId);
    const subject = await Subject.findOne({ _id: subjectId });

    if (!subject) {
        throw new AppError(404, "subject not found.")
    }

    if (subject.userId.toString() !== user._id) {
        throw new AppError(500, "You can't delete this data.")
    }
    await Subject.findByIdAndDelete(
        { _id: subjectId }
    )
    return {}
}


const createSchedule = async (payload, user) => {

    // Check if user provide past date from now
    const eventDate = new Date(payload.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
        throw new AppError(400, "The date cannot be in the past.");
    }

    // check if the endTime and startTime is valid
    const [startHour, startMinute] = payload.startTime.split(":").map(Number);
    const [endHour, endMinute] = payload.endTime.split(":").map(Number);

    if (endHour < startHour) {
        throw new AppError(400, "End time must be after start time.")
    };
    if (endHour === startHour && endMinute <= startMinute) {
        throw new AppError(400, "End time must be after start time.")
    }

    payload.date = new Date(payload?.date)

    payload.userId = user._id;
    const schedule = await Schedule.create(payload);
    return schedule
}


const getAllSchedule = async (query, user) => {
    const queryBuilder = new QueryBuilder(Schedule.find({ userId: user._id }), query);
    const schedules = queryBuilder
        .filter()
        .populate("subjectId")
        .sort()
        .paginate()
        .fieldFilter()

    const [data, meta] = await Promise.all([
        schedules.build(),
        schedules.getMeta()
    ])

    return { data, meta }
}


const updateSchedule = async (scheduleId, payload, user) => {
    const schedule = await Schedule.findOne({ _id: scheduleId });
    if (!schedule) {
        throw new AppError(404, "Schedule not found.")
    }
    if (schedule.userId.toString() !== user._id) {
        throw new AppError(500, "You can't update this data.")
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
        { _id: scheduleId },
        payload,
        { runValidators: true, new: true }
    )
    return updatedSchedule
}

const deleteSchedule = async (scheduleId, user) => {
    const schedule = await Schedule.findOne({ _id: scheduleId });

    if (!schedule) {
        throw new AppError(404, "Schedule not found.")
    }

    if (schedule.userId.toString() !== user._id) {
        throw new AppError(500, "You can't delete this data.")
    }

    await Schedule.findByIdAndDelete(
        { _id: scheduleId }
    )
    return {}
}

export const scheduleTrackerServices = {
    createSubject,
    getAllSubject,
    getSingleSubject,
    updateSubject,
    deleteSubject,
    createSchedule,
    getAllSchedule,
    updateSchedule,
    deleteSchedule,
}


/**
 * 
 *         const baseSlug = payload.name?.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`


        let counter = 1;
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }

        payload.slug = slug
 * */ 