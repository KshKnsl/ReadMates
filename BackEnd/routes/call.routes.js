const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const route = require('express').Router();
dotenv.config();

route.get('/token', (req, res) => {
    const API_KEY = process.env.VideoCallSDK_API_KEY;
    const SECRET = process.env.VideoCallSDK_Secret_KEY;
        
const options = { 
    expiresIn: '1d', 
    algorithm: 'HS256' 
   };
   
   const payload = {
    apikey: API_KEY,
    permissions: [`allow_join`],
    version: 2,
   };
const token = jwt.sign(payload, SECRET, options);
res.json({ token });
});


route.post("/create-meeting/", (req, res) => {
    const { token } = req.body;
    const url = `https://api.videosdk.live/v2/rooms`;
    const options = {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({}),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error creating meeting" });
      });
  });

  
route.post("/validate-meeting/:meetingId", (req, res) => {
    const token = req.body.token;
    const meetingId = req.params.meetingId;
    const url = `https://api.videosdk.live/v2/rooms/validate/${meetingId}`;
  
    const options = {
      method: "GET",
      headers: { Authorization: token },
    };
  
    fetch(url, options)
      .then((response) => response.json())
      .then((result) => res.json(result))
      .catch((error) => console.error("error", error));
  });

module.exports = route;