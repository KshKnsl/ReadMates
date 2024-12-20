const express = require("express");
const { upload } = require("../middlewares/multer");
const uploadImage  = require("../utils/uploadImage");
const {
  createUser,
  findUser,
  updateUser, loginUser
} = require("../controllers/user.controllers");

const router = express.Router();
router.post("/addUser", async (req, res) => {
  let result = await createUser(req.body);
  if (result.success) 
    res.status(201).send(result);
  else
    res.status(400).send(result);
});

router.post("/login", async (req, res) => {
  let result = await loginUser(req.body);
  if (result.success) 
    res.status(200).send(result);
  else
    res.status(404).send({message: "User not found"});
});




router.put("/updateUser", async (req, res) => {
  let result = await updateUser(req.body);
  if (result.success) {
    console.log(result);
    res.status(201).send(result);
  } else {
    console.log(result);
    res.status(400).send(result);
  }
});

router.get("/:id", async (req, res) => {
  let foundUser = await findUser(req.params.id);
  res.send(foundUser);
});

router.post("/:id/uploadAvatar", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    const foundUser = await findUser(userId);
    if (!foundUser || !req.file) 
      return res.status(404).send({ success: false, message: "Not found" });
    foundUser.avatar = await  uploadImage(`uploads/${req.params.id}_${req.file.originalname}`,req.params.id);
    console.log(foundUser.avatar);
    await updateUser(foundUser);
    res.status(200).send({success: true, message: "Avatar uploaded successfully",newAvatar : foundUser.avatar});
  } 
  catch (error) {
    res.status(500).send({ success: false, message: `Internal server error${error}`, });
  }
});

module.exports = router;
