const mongoose=require("mongoose");

const specializationSchema=new mongoose.Schema({
    specializationId:{type:String,required:true,unique:true},
    specialization:{type:String,required:true,unique:true}
});

module.exports=mongoose.model("Specialization",specializationSchema);