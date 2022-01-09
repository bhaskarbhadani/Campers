const {campgroundSchema,reviewSchema} =require('./schemas');
const ExpressError=require('./utils/ExpressError');
const Campground=require('./models/campground');
const Review= require('./models/review');

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const mssg=error.details.map(el => el.message).join(',')
        throw new ExpressError(mssg,400);
    }
    else next();
}

module.exports.isauthor =async(req,res,next)=>{
    const {id}=req.params;
    const campg= await Campground.findById(id);
    if(!campg.author.equals(req.user._id)){
        req.flash('error','You do not have permission');
        return res.redirect(`/campgrounds/${id}`);
    }
    else next();
}

module.exports.validateReview= (req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const mssg=error.details.map(el => el.message).join(',')
        throw new ExpressError(mssg,400);
    }
    else next()
}

module.exports.isreviewauthor =async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review= await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission');
        return res.redirect(`/campgrounds/${id}`);
    }
    else next();
}