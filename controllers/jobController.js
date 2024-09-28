const JobApplication = require('../models/jobApplicationModel');
const s3Service = require('../services/s3services');
const fs = require('fs');

exports.createJobApplication = async (req, res) => {
  try {
    const { companyName, jobTitle, applicationDate, status, notes } = req.body;
    let attachmentUrl = null;

    if (req.file) {
      const fileContent = fs.readFileSync(req.file.path);
      const filename = `job-applications/${Date.now()}-${req.file.originalname}`;
      attachmentUrl = await s3Service.uploadToS3(fileContent, filename);
      
      // Delete the temporary file
      fs.unlinkSync(req.file.path);
    }

    const jobApplication = await JobApplication.create({
      companyName,
      jobTitle,
      applicationDate,
      status,
      notes,
      attachmentUrl,
      userId: req.user.id
    });

    res.status(201).json(jobApplication);
  } catch (error) {
    console.error('Error in createJobApplication:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const jobApplications = await JobApplication.findAll({ where: { userId: req.user.id } });
    res.status(200).json(jobApplications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, jobTitle, applicationDate, status, notes } = req.body;
    const jobApplication = await JobApplication.findOne({ where: { id, userId: req.user.id } });
    if (!jobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    await jobApplication.update({ companyName, jobTitle, applicationDate, status, notes });
    res.status(200).json(jobApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const jobApplication = await JobApplication.findOne({ where: { id, userId: req.user.id } });
    if (!jobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    await jobApplication.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};