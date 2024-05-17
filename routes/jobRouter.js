const express = require('express')
const router = express.Router()

const { authenticateUser, authorizeRoles } = require('../middleware/authentication')
const { createJob, getAllJobs, getSingleJob, applyForJobWithResume } = require('../controllers/jobController')



const jobRouter = (upload) => {
    router.post('/', authenticateUser, authorizeRoles('admin'), createJob);
    router.get('/', getAllJobs);
    router.route('/:id').get(getSingleJob)
    // Apply for Job with resume
    router.post('/apply/:id', upload.single('resume'), applyForJobWithResume);
    return router;
};
module.exports = jobRouter;