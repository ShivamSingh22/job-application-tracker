const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate } = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', authenticate, upload.single('attachment'), jobController.createJobApplication);
router.get('/', authenticate, jobController.getJobApplications);
router.put('/:id', authenticate, jobController.updateJobApplication);
router.delete('/:id', authenticate, jobController.deleteJobApplication);
router.get('/search', authenticate, jobController.searchJobApplications);
router.get('/filter', authenticate, jobController.filterJobApplications);

module.exports = router;
