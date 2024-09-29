const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, companyController.createCompany);
router.get('/', authenticate, companyController.getCompanies);
router.put('/:id', authenticate, companyController.updateCompany);
router.delete('/:id', authenticate, companyController.deleteCompany);
router.get('/:id', authenticate, companyController.getCompany);

module.exports = router;