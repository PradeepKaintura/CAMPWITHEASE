const Campground = require("../models/campground");
const Review = require('../models/review');

module.exports.createReview = async (req, res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author  = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Review is saved');
    res.redirect(`/campgrounds/${campground._id}`);
}

/* module.exports.UpdateReview = async(req,res)=>{
    try {
        // Find the campground by its ID
        const campground = await Campground.findById(req.params.id).populate('reviews').exec();
        
        if (!campground) {
          req.flash('error', 'Campground not found');
          return res.redirect('/campgrounds/');
        }
        
        // Find the review within the campground's reviews
        const review = campground.reviews.find(review => review._id.equals(req.params.reviewId));
        
        if (!review) {
          req.flash('error', 'Review not found');
          return res.redirect('/campgrounds/' + campground._id);
        }
        
        // Check if the logged-in user is the author of the review
        if (!req.user._id.equals(review.author)) {
          req.flash('error', 'You do not have permission to edit this review');
          return res.redirect('/campgrounds/' + campground._id);
        }
        
        // Update the review's body
        review.body = req.body.review.body;
        
        // Save the updated review
        await review.save();
        
        req.flash('success', 'Review updated successfully');
        res.redirect('/campgrounds/' + campground._id);
      } catch (err) {
        req.flash('error', 'Failed to update review');
        res.redirect('/campgrounds/' + campground._id);
      }
}
 */
module.exports.deleteReview = async(req, res)=>{
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{pull:{ reviews: reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Review Deleted');
    res.redirect(`/campgrounds/${id}`);
}