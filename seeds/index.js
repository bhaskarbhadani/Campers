if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

const incities=require('./incities');
const mongoose=require('mongoose');
const Campground=require('../models/campground');
const {places,descriptors}=require('./seedHelper');
const dbUrl= process.env.DB_URL|| 'mongodb://localhost:27017/yelpcamp';

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db= mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open', ()=>{
    console.log('database connected');
});

const sample= arr => arr[Math.floor(Math.random()*arr.length)];

const seedDB =async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<250;i++){
        let random1000 = Math.floor(Math.random()*100);
        const price=Math.floor(Math.random()* 200)+500;
        let camp=new Campground({
            author: '61bf85eec4711b07bf7be920',
            location : `${incities[random1000].city},${incities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            //image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi officia hic molestias iste. Magnam natus dolor quae pariatur commodi, inventore at quod dolore blanditiis! Illo veniam nulla omnis fuga sequi.',
            price,
            geometry:{
               type: 'Point',
               coordinates: [
                   incities[random1000].lng,
                   incities[random1000].lat
               ]
            },
            images:[{
                url: 'https://res.cloudinary.com/bholaji/image/upload/v1639814333/YelpCamp/ogzvky7smtb0ibkjpden.jpg',
                filename: 'YelpCamp/ogzvky7smtb0ibkjpden',
            },
            {
                url: 'https://res.cloudinary.com/bholaji/image/upload/v1639944302/YelpCamp/tcqhsmpjvi3doixch5k0.jpg',
                filename: 'YelpCamp/tcqhsmpjvi3doixch5k0'
            }
        ] 
        });
    await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});