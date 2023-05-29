const Campground = require("../models/campground");
const { cloudinary } = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
const campground = require("../models/campground");
const {URL, URLSearchParams} = require('url')

const key = process.env.MAPLIBRE_API_KEY;
maptilerClient.config.apiKey = key

/* module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    
    res.render('campgrounds/index',{campgrounds});
} */


module.exports.index = async (req,res)=>{
    try{
        const campgrounds = await Campground.find()
        res.render('campgrounds/index',{
            campgrounds
        });
    } catch(err)
    {
        console.error(err.message)
    } 
}
module.exports.getApisearch = async(req,res)=>{
    try{
        /* console.log(sortBy); */
        let search;
        if (req.body.sortBy) {
            const r = req.body.sortBy
            /* console.log(r) */
            if(r === 'Highest Price'){
                search = await Campground.find({}).sort({ price: -1 });
                res.json(search)
            }
            if(r=== 'Lowest Price' )
            {
                search = await Campground.find({}).sort({ price: 1 });
                res.json(search)
            }
            if(r ==='Rating')
            {
                search = await Campground.find({}).sort({ price: -1,rateCount: -1 });
                res.json(search)
            }
        }
        else {
            search = await Campground.find({});
            res.json(search)
        }
       /*  res.json(search); */
    }catch(err)
    {
        console.log(err.message)
    }
}

module.exports.search = async(req,res)=>{
    try{
        let payload = req.body.payload.trim();
        let search = await Campground.find({$or:[
                                                {title: {$regex:".*"+ payload+".*", $options: "i"}},
                                                {location: {$regex:".*"+ payload+".*", $options: "i"} }             
                                                ]
                                            })
            .limit(req.body.limit)
            .skip(req.body.skip)
        let count = await Campground.countDocuments({$or:[
                                                        {title: {$regex:".*"+ payload+".*", $options: "i"}},
                                                        {location: {$regex:".*"+ payload+".*", $options: "i"} }             
                                                        ]
                                                    })
        
        search = search.slice(0,10)
        let currentPage = Number(req.body.page)
        let nextPage = currentPage+1;
        let previousPage = currentPage-1;
        let lastPage = Math.ceil(count/req.body.limit)
    res.send({payload:search, count, nextPage,currentPage,lastPage,previousPage}) 
    }catch(err)
    {
        /* req.flash('error', 'Campground not exist');
        res.render('error');
        console.log(err.mesage) */
    }
}
 
module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next)=>{
    const result = await maptilerClient.geocoding.forward(req.body.campground.location,{
         limit: 1
    });
    const campground = new Campground(req.body.campground);
    campground.geometry= result.features[0].geometry;
    campground.images = req.files.map(f=>({url: f.path , filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
   /*  console.log(campground); */
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

/* module.exports.showCampground = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
     /* console.log(campground);  
    if(!campground){
        req.flash('error','Campground not exsist');
        return res.redirect('/campgrounds')
    }
    /* res.send("OK") 
    res.render('campgrounds/show',{campground}); 
} */
module.exports.showCampground = async (req, res) => {
    try {
      const campground = await Campground.findById(req.params.id)
        .populate({
          path: 'reviews',
          populate: {
            path: 'author'
          }
        })
        .populate('author')
        .exec();
  
      if (!campground) {
        req.flash('error', 'Campground not exist');
        return res.redirect('/campgrounds');
      }
  
      const ratings = campground.reviews.map((rating) => rating.rating);
      if (ratings.length === 0) {
        campground.rateAvg = 0;
      } else {
        const rateSum = ratings.reduce((total, rate) => total + rate);
        campground.rateAvg =( rateSum / ratings.length).toFixed(1);
        campground.rateCount = campground.reviews.length;
      }
  
      await campground.save();
  
      res.render('campgrounds/show', { campground });
    } catch (err) {
      /* console.log(err); */
      req.flash('error', 'Campground not exist');
      res.render('error');
    }
  };
  

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Campground not exsist');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground});
}

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    const result = await maptilerClient.geocoding.forward(req.body.campground.location, {
        limit: 1
      });
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f=>({url: f.path, filename: f.filename}));
    
    campground.geometry = result.features[0].geometry;
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
       await campground.updateOne({$pull: {images:{filename:{$in: req.body.deleteImages}}}})
       /* console.log(campground) */
    }
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    
    req.flash('success','Campground deleted');
    res.redirect('/campgrounds/?page=1');
}

/* module.exports.LoginCampgrounds = async(req,res)=>{
    const currentUrl = req.originalUrl;
    console.log(currentUrl)
    res.send(/* '../views/users/login', {currentUrl})
} */