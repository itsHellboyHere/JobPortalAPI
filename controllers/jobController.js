const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const CustomError = require('../errors');
const nodemailer = require('nodemailer')
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    console.log(req.body.createdBy)
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}
const getAllJobs = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 9; // Consistent limit of 9 jobs per page
    const skip = (page - 1) * limit;

    const searchQuery = req.query.q || '';
    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    const searchCriteria = {
        $or: [
            { company: { $regex: searchQuery, $options: 'i' } }, // Match company name
            { position: { $regex: searchQuery, $options: 'i' } }, // Match position name
            // Add more search criteria if needed
        ]
    };

    const total = await Job.countDocuments(searchCriteria);
    const jobs = await Job.find(searchCriteria)
        .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 }) // Sort by the specified field and order
        .skip(skip)
        .limit(limit);

    const metadata = {
        total,
        page,
        pageCount: Math.ceil(total / limit),
        pageSize: jobs.length,
    };

    res.status(StatusCodes.OK).json({ jobs, metadata });
};



const getSingleJob = async (req, res) => {
    const jobid = req.params.id;
    // console.log(req);
    const job = await Job.findOne({ _id: jobid })
    if (!jobid) {
        throw new CustomError.BadRequestError(`No job with id ${jobid} is present`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const applyForJobWithResume = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(req.file);
        const job = await Job.findOne({ _id: id })
        const { company, position, jobType } = job
        // console.log(company, position, jobType);
        // console.log(job);
        const { name, email, message, phone } = req.body;
        const resume = req.file.buffer; // Get the buffer of the uploaded resume file
        const resumeOriginalName = req.file.originalname; // Original name of the uploaded resume file


        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'rohitkumarsingh337@gmail.com',
                pass: process.env.App_Pass,
            },
        });
        const mailOptions = {
            from: '"Rohit" <rohitkumarsingh337@gmail.com>',
            to: 'rohitkumarsingh337@gmail.com',
            subject: 'New Job Application',
            html: `
                <div style="font-family: Arial, sans-serif; margin-bottom: 20px;">
                    <h2 style="color: #333;">New Job Application</h2>
                    <p style="color: #666;"><strong>Name:</strong> ${name}</p>
                    <p style="color: #666;"><strong>Email:</strong> ${email}</p>
                    <p style="color: #666;"><strong>Email:</strong> ${phone}</p>
                    <p style="color: #666;"><strong>Message:</strong> ${message}</p>
                    <p style="color: #666;"><strong>Company:</strong> ${company}</p>
                    <p style="color: #666;"><strong>Position:</strong> ${position}</p>
                    <p style="color: #666;"><strong>Job Type:</strong> ${jobType}</p>
                </div>
            `,
            attachments: [{
                filename: resumeOriginalName,
                content: resume
            }]
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Job application submitted successfully' });
    } catch (error) {
        console.error('Error submitting job application:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    createJob,
    getAllJobs,
    getSingleJob,
    applyForJobWithResume,
}