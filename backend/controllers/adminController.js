const Staff=require("../models/Staff");
const generateStaffId=require("../utils/generateStaffId");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {generateToken}=require("../utils/generateToken");


//to add new staff
exports.addStaff=async(req,res)=>{
    try{
        const { roleId, age, specializationId, consultationFee, workingDays, name, email, address, contactNo } = req.body;
        //age validation
        if (roleId==2 && age<25){
            return res.status(400).json({message:"Doctor must be atleast 25 years of age."})
        } else if (roleId!=2 && age<18){
            return res.status(400).json({message:"Age must be greater than 18."});
        }
        //if doctor, subsequent fields must be filled as well
        if (roleId===2 && (!specializationId || !consultationFee || !workingDays)) return res.status(400).json({message:"Doctor must have specializationId, consultationFee, and workingDays"});
        const hashedPassword=await bcrypt.hash("Password123",10);
        const staffId=await generateStaffId(roleId);
        //if staff already exist
        const exist=await Staff.findOne({email});
        if (exist) return res.status(400).json({message:"Staff already exist"});
        const newStaff=new Staff({
            staffId,
            name,
            email,
            address,
            contactNo,
            age,
            roleId,
            specializationId:roleId===2 ? specializationId:undefined,
            consultationFee:roleId===2 ? consultationFee:undefined,
            workingDays:roleId===2 ? workingDays:undefined,
            password:hashedPassword,
            isActive:true,
        });
        await newStaff.save();
        const { password, ...cleaned } = newStaff.toObject();
        res.status(201).json({message:"Staff created",staff:cleaned});
    } catch(err){
        console.error('Error adding staff:', err);
        res.status(500).json({message:"Server error",error:err.message})
    };
};

//stafflogin
exports.login = async (req, res) => {
  try {
    const { email, password, roleId } = req.body;
    if (!email || !password || !roleId) {
      return res
        .status(400)
        .json({ message: "Email, password, and roleId are required" });
    }
    console.log("Input:", { email, password, roleId });
    console.log("Expected:", {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      ADMIN_ROLE_ID: process.env.ADMIN_ROLE_ID,
    });

    // Check for hardcoded admin credentials
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD &&
      parseInt(roleId) === parseInt(process.env.ADMIN_ROLE_ID)
    ) {
      const token = jwt.sign(
        {
          email: process.env.ADMIN_EMAIL,
          roleId: process.env.ADMIN_ROLE_ID,
          isAdmin: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Admin login successful",
        token,
        role: "admin",
      });
    }

    // Fallback to staff login
    const staff = await Staff.findOne({ email, roleId: parseInt(roleId), isActive: true });
    if (!staff) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = generateToken({
      id: staff._id,
      email: staff.email,
      roleId: staff.roleId,
    });

    res.status(200).json({
      message: "Login Successful",
      token,
      staff: {
        name: staff.name,
        email: staff.email,
        roleId: staff.roleId,
        staffId: staff.staffId,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Reset password
exports.resetPassword=async(req,res)=>{
    try{
        const {staffId}=req.params;
        const staff=await Staff.findOne({staffId});
        if (!staff){
            return res.status(404).json({message:"Staff not found"})
        };
        const defaultPassword="Password123";
        const hashedPassword=await bcrypt.hash(defaultPassword,10);
        staff.password=hashedPassword;
        await staff.save();
        res.status(200).json({message:`Password reset to default for ${staff.name}`})
    } catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
};
//get all staff
exports.getAllStaff=async(req,res)=>{
    try{
        const {roleId,status}=req.query;
        const filter={}
        if (roleId) filter.roleId=parseInt(roleId);
        if (status) filter.isActive=status==="true";
        const staffList=await Staff.find(filter)
        .select("-password");
        res.status(200).json({
            success:true,
            count:staffList.length,
            data:staffList
        });
    }catch(err){
        res.status(500).json({message:"Error fetching staff list",error:err.message});
    }
};
//update staff
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      address,
      contactNo,
      age,
      roleId,
      specializationId,
      consultationFee,
      workingDays,
    } = req.body;
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    // Check if roleId is valid (1-5 are valid role IDs)
    if (roleId && (roleId < 1 || roleId > 5)) {
      return res.status(400).json({ message: "Invalid roleId" });
    }
    if ((roleId === 2 && age < 25) || (roleId !== 2 && age < 18)) {
      return res.status(400).json({ message: "Age does not meet role requirements" });
    }
    const existing = await Staff.findOne({ email, roleId, _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: "Another staff with this email and role exists" });
    }
    staff.name = name || staff.name;
    staff.email = email || staff.email;
    staff.address = address || staff.address;
    staff.contactNo = contactNo || staff.contactNo;
    staff.age = age || staff.age;
    staff.roleId = roleId || staff.roleId;
    // Doctor-specific fields
    if (roleId === 2) {
      if (!specializationId || !consultationFee || !workingDays) {
        return res.status(400).json({
          message: "Specialization, consultation fee, and working days are required for doctors",
        });
      }
      staff.specializationId = specializationId;
      staff.consultationFee = consultationFee;
      staff.workingDays = workingDays;
    } else if (roleId) {
      // Clear doctor-only fields if not a doctor
      staff.specializationId = undefined;
      staff.consultationFee = undefined;
      staff.workingDays = undefined;
    }
    await staff.save();

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: staff,
    });
    } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ message: "Internal server error", error });
}
};
//deactivate staff
exports.deactivateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    if (!staff.isActive) {
      return res.status(400).json({ message: "Staff is already deactivated" });
    }
    staff.isActive = false;
    await staff.save();
    res.status(200).json({
      success: true,
      message: "Staff deactivated successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Error deactivating staff:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
