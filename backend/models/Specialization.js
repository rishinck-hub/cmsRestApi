<<<<<<< HEAD
const mongoose=require("mongoose");

const docRegSchema=new mongoose.Schema({
    specializationId:{type:String,required:true,unique:true},
    specialization:String,
});

module.exports=mongoose.model("Specialization",specializationSchema);
=======
const mongoose = require('mongoose');

const SpecializationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Specialization', SpecializationSchema); 
>>>>>>> teamLeadTask
