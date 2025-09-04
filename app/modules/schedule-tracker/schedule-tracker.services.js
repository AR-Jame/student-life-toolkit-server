import AppError from "../../errorHelper/AppError.js";
import { Subject } from "./schedule-tracker.model.js"

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
    console.log(subjectId);
    const subject = await Subject.findOne({ _id: subjectId });
    if (subject.userId.toString() !== user._id) {
        throw new AppError(500, "You can't access this data.")
    }
    return subject
}


const updateSubject = async (subjectId, payload, user) => {
    console.log(subjectId);
    const subject = await Subject.findOne({ _id: subjectId });
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
    if (subject.userId.toString() !== user._id) {
        throw new AppError(500, "You can't delete this data.")
    }
    await Subject.findByIdAndDelete(
        { _id: subjectId }
    )
    return {}
}

export const scheduleTrackerServices = {
    createSubject,
    getAllSubject,
    getSingleSubject,
    updateSubject,
    deleteSubject
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