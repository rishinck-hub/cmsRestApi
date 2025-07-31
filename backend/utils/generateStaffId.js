const Staff=require("../models/Staff");


const getRolePrefix = {
  1: 'ADM', // Admin
  2: 'DOC', // Doctor
  3: 'REC', // Receptionist
  4: 'PHA', // Pharmacist
  5: 'LAB', // LabTech
};


const generateStaffId=async function (roleId) {
    const prefix = getRolePrefix[roleId] || 'STF';
    const count=await Staff.countDocuments({roleId});
    const idNumber=(count+1).toString().padStart(3,"0");
    return `${prefix}${idNumber}`
};

module.exports=generateStaffId;