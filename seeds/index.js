const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://0.0.0.0:27017/camp-with-ease', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0;i<=50;i++)
    {
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '6460741b9fd198edbe8e7677',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            /* image: 'https://source.unsplash.com/collection/4480516', */
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem nam eveniet atque totam a dolores aliquam cum? Commodi eaque quasi dolores exercitationem ipsa impedit unde consequuntur! Sunt accusamus suscipit laboriosam.',
            price,
            geometry:{
                  type: "Point",
                  coordinates: [ cities[random1000].longitude, cities[random1000].latitude]
              },
            images: [
              {
                url: 'https://res.cloudinary.com/dlhaipi0u/image/upload/v1683698248/CAMP_WITH_EASE/wolo18rymtysmiml4csa.png',
                filename: 'CAMP_WITH_EASE/wolo18rymtysmiml4csa'
              },
              {
                url: 'https://res.cloudinary.com/dlhaipi0u/image/upload/v1683698248/CAMP_WITH_EASE/mu5wulj9oxmraixwbhaq.png',
                filename: 'CAMP_WITH_EASE/mu5wulj9oxmraixwbhaq'
              },
              {
                url: 'https://res.cloudinary.com/dlhaipi0u/image/upload/v1683698249/CAMP_WITH_EASE/fvbfcqntgjiegaaxsnkf.png',
                filename: 'CAMP_WITH_EASE/fvbfcqntgjiegaaxsnkf'
              }
              ]
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});