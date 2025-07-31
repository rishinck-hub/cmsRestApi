const mongoose=require("mongoose");

const staffSchema=new mongoose.Schema({
    staffId:{type:String,unique:true},
    name:{type:String,required:true},
    age:{type:Number,required:true,validate:{
        validator:function(value){
            if (this.roleId===2) return value >=25;
            return value>=18;
        },
        message:"Agenot valid for this role",
        }},
    email:{type:Email,required:true,unique:true},
    address:String,
    contactNo:{type:String,required:true},
    password:{type:Password,required:true},
    roleId:{type:Number,required: true,ref:"Role"},
    //if role is doctor
    specializationId:{type:Number,ref:"Specialization", required:function(){
        return this.roleId===2;
    }},
    consultationFee: {type:Number,required:function(){
        return this.roleId===2;
    }},
    workingDays: {type:String,required:function(){
        return this.roleId===2;
    }},
    isActive:{type:Boolean,default:true}
});
module.exports = mongoose.model("Staff", staffSchema);