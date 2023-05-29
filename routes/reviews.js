const express = require('express')
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require("../models/campground");
const Review = require('../models/review');
const { validateReview , isLoggedIn, isReviewAuthor} = require('../middleware.js')
const reviews = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))
      /* .put('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.UpdateReview) )
 */
module.exports = router;