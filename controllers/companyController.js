const Company = require('../models/companyModel');

exports.createCompany = async (req, res) => {
  try {
    const { name, website, industry, description, size, contactPerson, contactEmail, contactPhone } = req.body;
    const company = await Company.create({
      name,
      website,
      industry,
      description,
      size,
      contactPerson,
      contactEmail,
      contactPhone,
      userId: req.user.id
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ where: { userId: req.user.id } });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, website, industry, description, size, contactPerson, contactEmail, contactPhone } = req.body;
    const company = await Company.findOne({ where: { id, userId: req.user.id } });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    await company.update({ name, website, industry, description, size, contactPerson, contactEmail, contactPhone });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findOne({ where: { id, userId: req.user.id } });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    await company.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findOne({ where: { id, userId: req.user.id } });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};