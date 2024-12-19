const v2 = require('cloudinary').v2;
const dotenv = require('dotenv');

module.exports =  async function uploadImage(localUrl,id) 
{
    v2.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUNIDARY_API_KEY, 
        api_secret: process.env.CLOUNIDARY_API_SECRET,
    });
    
    let public_id = `${id}_${Date.now()}`;
    await v2.uploader.upload(localUrl, { public_id: public_id, }).catch((error) => { console.log(error); });
    const autoCropUrl = v2.url(public_id, {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    return autoCropUrl;
};