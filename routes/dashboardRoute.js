const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/auth');

router.get('/getDashboardData', authenticate, dashboardController.getDashboardData);

module.exports = router;