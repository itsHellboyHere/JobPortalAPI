const { required } = require('joi')

const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Please provide company name'],
            maxlength: 50,
        },
        position: {
            type: String,
            required: [true, 'Please provide position'],
            maxlength: 100,
        },

        description: {
            type: String,
            required: [true, 'Please provide description'],
            maxlength: 300,
        },
        jobType: {
            type: String,
            enum: ['Fulltime', 'Parttime', 'Contract', 'Internship'],
            required: true
        },
        qualification: {
            type: String,
            required: true,
            maxlength: 100,
        },
        location: {
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true,
            },

        },

        salary: {
            type: Number,
            required: [true, 'Please provide salary'],
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Job', JobSchema)
