const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.ClOUDINARY_CLOUD_NAME,
    api_key: process.env.ClOUDINARY_KEY,
    api_secret: process.env.ClOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
            folder: 'CAMP_WITH_EASE',
            allowedFormats: ['jpeg','jpg','png']
    }
});

module.exports = {
    cloudinary,
    storage
}