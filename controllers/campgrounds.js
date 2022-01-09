const Campground=require('../models/campground');
const {cloudinary}=require('../cloudinary');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const images=require('./images');
const mapBoxToken= process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken: mapBoxToken});

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e => next(e));
    }
}

module.exports.index = wrapAsync(async(req,res)=>{
    const camp=await Campground.find({});
    res.render('campgrounds/index',{camp,images});
})

module.exports.renderNewForm =(req,res)=>{
    res.render('campgrounds/new');
}

module.exports.postNewForm = wrapAsync(async (req,res)=>{
    const geodata=await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send();
    const camp=new Campground(req.body.campground);
    camp.geometry= geodata.body.features[0].geometry;
    camp.images=req.files.map(f =>({url:f.path, filename:f.filename}));
    camp.author=req.user._id;
    await camp.save();
    req.flash('success',' Added a new camground');
    res.redirect(`campgrounds/${camp._id}`);
})

module.exports.showCampground=wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error',`  Cannot find campground`);
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
})

module.exports.editCampground=wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const camp= await Campground.findById(id);
    if(!camp){
        req.flash('error',`  Cannot find campground`);
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{camp});
})

module.exports.updateCampground =wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const campg=await Campground.findById(id);
    const imgs= req.files.map(f =>({url:f.path, filename:f.filename}));
    campg.images.push( ...imgs);
    await campg.save();
    const camp= await Campground.findByIdAndUpdate(id,{ ...req.body.campground });
    await camp.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campg.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success',' Updated campground')
    res.redirect(`/campgrounds/${camp._id}`);
})

module.exports.deleteCampground=wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success',' Deleted a campground');
    res.redirect('/campgrounds');
})

