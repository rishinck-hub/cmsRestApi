const mongoose=require("mongoose");

const roleSchema=new mongoose.Schema({
    roleId:{type:String,required:true,unique:true},
    role:{type:String,required:true,unique:true}
});

module.exports=mongoose.model("Role",roleSchema);