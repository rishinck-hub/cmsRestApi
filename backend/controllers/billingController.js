const Billing = require('../models/Billing');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const { validationResult } = require('express-validator');

// Generate Appointment Bill
const generateAppointmentBill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      appointmentId,
      consultationFee,
      additionalCharges,
      discount,
      tax,
      paymentMethod,
      insuranceDetails,
      dueDate,
      notes
    } = req.body;

    // Check if appointment exists
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient')
      .populate('doctor');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if bill already exists for this appointment
    const existingBill = await Billing.findOne({ appointment: appointmentId });
    if (existingBill) {
      return res.status(400).json({ message: 'Bill already exists for this appointment' });
    }

    const billing = new Billing({
      appointment: appointmentId,
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      consultationFee,
      additionalCharges,
      discount,
      tax,
      paymentMethod,
      insuranceDetails,
      dueDate: new Date(dueDate),
      notes,
      generatedBy: req.user._id
    });

    await billing.save();

    const populatedBilling = await Billing.findById(billing._id)
      .populate('appointment')
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .populate('generatedBy', 'name email');

    res.status(201).json({
      message: 'Bill generated successfully',
      billing: populatedBilling
    });
  } catch (error) {
    console.error('Error generating bill:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Appointment Bill
const updateAppointmentBill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { appointmentId } = req.params;
    const updateData = req.body;

    const billing = await Billing.findOne({ appointment: appointmentId });
    if (!billing) {
      return res.status(404).json({ message: 'Bill not found for this appointment' });
    }

    // If payment is being made, update paid amount and date
    if (updateData.paidAmount !== undefined) {
      updateData.paidAmount = billing.paidAmount + updateData.paidAmount;
      if (updateData.paidAmount >= billing.totalAmount) {
        updateData.paidDate = new Date();
      }
    }

    const updatedBilling = await Billing.findByIdAndUpdate(
      billing._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('appointment')
     .populate('patient', 'name email phone patientId')
     .populate('doctor', 'name email')
     .populate('generatedBy', 'name email');

    res.json({
      message: 'Bill updated successfully',
      billing: updatedBilling
    });
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Bill by Appointment ID
const getBillByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const billing = await Billing.findOne({ appointment: appointmentId })
      .populate('appointment')
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .populate('generatedBy', 'name email');

    if (!billing) {
      return res.status(404).json({ message: 'Bill not found for this appointment' });
    }

    res.json({ billing });
  } catch (error) {
    console.error('Error getting bill:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List Bills by Date Range
const listBillsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10, paymentStatus } = req.query;
    
    const query = {};
    
    // Date range filter
    if (startDate && endDate) {
      query.billingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Payment status filter
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const bills = await Billing.find(query)
      .populate('appointment')
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .populate('generatedBy', 'name email')
      .sort({ billingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Billing.countDocuments(query);

    // Calculate summary
    const summary = await Billing.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalBilled: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$paidAmount' },
          totalPending: { $sum: '$balanceAmount' },
          billCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      bills,
      summary: summary[0] || {
        totalBilled: 0,
        totalPaid: 0,
        totalPending: 0,
        billCount: 0
      },
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error listing bills:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Bill by ID
const getBillById = async (req, res) => {
  try {
    const { billingId } = req.params;

    const billing = await Billing.findById(billingId)
      .populate('appointment')
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .populate('generatedBy', 'name email');

    if (!billing) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json({ billing });
  } catch (error) {
    console.error('Error getting bill:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Process Payment
const processPayment = async (req, res) => {
  try {
    const { billingId } = req.params;
    const { amount, paymentMethod, notes } = req.body;

    const billing = await Billing.findById(billingId);
    if (!billing) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    if (billing.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Bill is already paid' });
    }

    billing.paidAmount += amount;
    billing.paymentMethod = paymentMethod;
    billing.notes = notes ? `${billing.notes || ''}\n${notes}` : billing.notes;

    if (billing.paidAmount >= billing.totalAmount) {
      billing.paymentStatus = 'paid';
      billing.paidDate = new Date();
    } else if (billing.paidAmount > 0) {
      billing.paymentStatus = 'partial';
    }

    await billing.save();

    const updatedBilling = await Billing.findById(billingId)
      .populate('appointment')
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .populate('generatedBy', 'name email');

    res.json({
      message: 'Payment processed successfully',
      billing: updatedBilling
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateAppointmentBill,
  updateAppointmentBill,
  getBillByAppointmentId,
  listBillsByDateRange,
  getBillById,
  processPayment
}; 