const express = require('express');
const router = express.Router();
const jobListingController = require('../controllers/jobListingController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, jobListingController.createJobListing);
router.get('/', authenticate, jobListingController.getJobListings);
router.put('/:id', authenticate, jobListingController.updateJobListing);
router.delete('/:id', authenticate, jobListingController.deleteJobListing);
router.get('/:id', authenticate, jobListingController.getJobListing);

module.exports = router;