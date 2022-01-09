const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Review=require('../models/review');
const Campground=require('../models/campground');
const reviews=require('../controllers/reviews');
const {validateReview,isLoggedIn,isreviewauthor} =require('../middleware');

router.post('/',validateReview,isLoggedIn,catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,isreviewauthor,catchAsync(reviews.deleteReview))

module.exports=router;