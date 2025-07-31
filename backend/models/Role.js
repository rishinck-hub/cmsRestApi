<<<<<<< HEAD
const mongoose=require("mongoose");

const roleSchema=new mongoose.Schema({
    roleId:{type:String,required:true,unique:true},
    role:{type:String,required:true,unique:true}
});

module.exports=mongoose.model("Role",roleSchema);
=======
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema); 
>>>>>>> teamLeadTask
