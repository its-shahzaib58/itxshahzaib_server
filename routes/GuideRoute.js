const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const app = express();
const router = express.Router();
const GuideModel = require("../models/GuideModel");
app.use(express.json());


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.SECRET_KEY,
  secure: true,
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save with original name
  }
});

const upload = multer({ storage: storage });


// Get all Guides 
router.get("/guides",async(req, res)=>{
  try {
    const guides = await GuideModel.find();
    res.status(200).json({guides });
  } catch (error) {
    res.status(500).json({message:"Server Error!"});
  }
  
});

// Insert New Guide

router.post("/add_guide",upload.single('img'), async(req, res)=>{
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);
  const filePath = req.file.path; 
  // Upload to Cloudinary
   await cloudinary.uploader.upload(filePath, { upload_preset: 'guides_preset' }, async(error, result) => {
    if (error) {
      console.log(error)
    }else{
    try {
      const Guide = new GuideModel({
            _id: new mongoose.Types.ObjectId,
            gd_title:req.body.title,
            gd_author:req.body.author,
            gd_thumb:result.secure_url,
            gd_desc_html:req.body.desc_html,
            gd_status:true,
          });
          await Guide.save();
          res.status(201).send({Guide,message:"Guide added successfully."});
    } catch (error) {
      res.status(500).send({message:"Inserting Error!"});
    }
    // Remove file from local directory
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to remove file from local directory:', err);
        return res.status(500).json({ error: 'Failed to remove file from local directory' });
      }
      });
    }
   
  });
});
  // try{
    
  //   const upload = await cloudinary.uploader.upload(req.file.path);
  //   if(upload){
  //     console.log("IMage Uploaded")
  //   }
  //   const Guide = new GuideModel({
  //     _id: new mongoose.Types.ObjectId,
  //     gd_title:req.body.title,
  //     gd_author:req.body.author,
  //     gd_thumb:req.file.path,
  //     gd_desc_html:req.body.desc_html,
  //     gd_status:true,
  //   });
  //   console.log(Guide);
  //   await Guide.save();
  //   res.status(201).send({Guide});
  //   // console.log(req.file.path)
  // }catch(error){
  //   res.status(400).send(error);
  // }


module.exports = router;


