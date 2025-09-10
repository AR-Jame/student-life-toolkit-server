import { Schema, model } from 'mongoose'

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Task date is required']
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    _id: true
});


const milestoneSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Milestone title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: ''
    },
    deadline: {
        type: Date,
        required: [true, 'Milestone deadline is required']
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    tasks: [taskSchema]
}, {
    timestamps: true,
    _id: true
});

const goalSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Goal title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
        default: 'Not Started'
    },
    targetCompletionDate: {
        type: Date,
        required: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    milestones: [milestoneSchema],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Analytics fields
    totalTasks: {
        type: Number,
        default: 0
    },
    completedTasks: {
        type: Number,
        default: 0
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});


goalSchema.pre('save', function (next) {
    let totalTasks = 0;
    let completedTasks = 0;

    this.milestones.forEach(milestone => {
        totalTasks += milestone.tasks.length;
        completedTasks += milestone.tasks.filter(task => task.isCompleted).length;
    });

    this.totalTasks = totalTasks;
    this.completedTasks = completedTasks;
    this.progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    if (this.progressPercentage === 100) {
        this.status = 'Completed';
    } else if (this.progressPercentage > 0) {
        this.status = 'In Progress';
    } else {
        this.status = 'Not Started';
    }

    next();
});



export const Planner = model("Planner", goalSchema)