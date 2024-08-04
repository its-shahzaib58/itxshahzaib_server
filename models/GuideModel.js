
const mongoose = require("mongoose");

const GuidesSchema = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    gd_title:{type:String, requided:true},
    gd_author:{type:String, requided:true},
    gd_thumb:{type:String, requided:true},
    gd_desc_html:{type:String, requided:true},
    gd_status:{type:Boolean, requided:true},
    },
    {
        collection:'guides',
        versionKey:false,
        timestamps:true
    }    
);

const Guides = mongoose.model("guides",GuidesSchema);

module.exports = Guides;