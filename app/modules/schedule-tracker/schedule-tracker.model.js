import { Schema, model } from "mongoose";

const subjectSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        required: true,
        unique: true
    },
})

const scheduleSchema = new Schema({
    subjectId: {
        type: Schema.ObjectId,
        ref: "Subject",
        required: true
    },
    userId: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    location: {
        type: String,
    },
    notes: {
        type: String,
    },
    instructor: {
        type: String,
    }
}, {
    versionKey: false,
    timestamps: true
}
)




export const Subject = model("Subject", subjectSchema)
export const Schedule = model("Schedule", scheduleSchema)