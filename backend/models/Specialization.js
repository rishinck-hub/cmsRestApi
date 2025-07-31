const mongoose=require("mongoose");

const docRegSchema=new mongoose.Schema({
    specializationId:{type:String,required:true,unique:true},
    specialization:String,
});

module.exports=mongoose.model("Specialization",specializationSchema);