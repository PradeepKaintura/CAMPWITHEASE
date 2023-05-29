const mongoose = require('mongoose');
const city = require('./seeds')
const Campground = require('../models/campground');

console.log(city.length)

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
    for(let i = 0;i<=59;i++)
    {
        const random1000 = Math.floor(Math.random() *59);
        const price = Math.floor(Math.random()*4960)+567;
        const contact  = "+91-" + (Math.floor(Math.random()*(99999-62000+1))+62000)+(Math.floor(Math.random()*(99999-59421+1))+59421)
        const camp = new Campground({
            author: '6460741b9fd198edbe8e7677',
            location :  `${city[random1000].city}, ${city[random1000].state}` ,
            actLoc : `${city[random1000].activity_location}`,
            title : `${city[random1000].name}`,
            description : `${city[random1000].description}`,
            price,
            geometry:{
                  type: "Point",
                  coordinates : [`${city[random1000].lat_long[1]}`,`${city[random1000].lat_long[0]}`]
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
              ],
            contact: contact,
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});