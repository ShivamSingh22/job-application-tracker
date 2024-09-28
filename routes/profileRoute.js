const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, profileController.getProfile);
router.put('/', authenticate, profileController.updateProfile);

module.exports = router;
