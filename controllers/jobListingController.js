const JobListing = require('../models/jobListingModel');

exports.createJobListing = async (req, res) => {
  try {
    const { title, company, location, description, salary, applicationDeadline, jobUrl } = req.body;
    const jobListing = await JobListing.create({
      title,
      company,
      location,
      description,
      salary,
      applicationDeadline,
      jobUrl,
      userId: req.user.id
    });
    res.status(201).json(jobListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobListings = async (req, res) => {
  try {
    const jobListings = await JobListing.findAll({ where: { userId: req.user.id } });
    res.status(200).json(jobListings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateJobListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, description, salary, applicationDeadline, jobUrl } = req.body;
    const jobListing = await JobListing.findOne({ where: { id, userId: req.user.id } });
    if (!jobListing) {
      return res.status(404).json({ message: 'Job listing not found' });
    }
    await jobListing.update({ title, company, location, description, salary, applicationDeadline, jobUrl });
    res.status(200).json(jobListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteJobListing = async (req, res) => {
  try {
    const { id } = req.params;
    const jobListing = await JobListing.findOne({ where: { id, userId: req.user.id } });
    if (!jobListing) {
      return res.status(404).json({ message: 'Job listing not found' });
    }
    await jobListing.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobListing = async (req, res) => {
  try {
    const { id } = req.params;
    const jobListing = await JobListing.findOne({ where: { id, userId: req.user.id } });
    if (!jobListing) {
      return res.status(404).json({ message: 'Job listing not found' });
    }
    res.status(200).json(jobListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};