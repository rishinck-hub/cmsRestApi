const mongoose = require('mongoose');
const Billing = require('../models/Billing');
const Appointment = require('../models/Appointment');

// Generate Appointment Bill
exports.generateAppointmentBill = async (req, res) => {
  try {
    const { appointmentId, consultationFee, medicineCost, labTestCost } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (!appointment.patient) {
      return res.status(400).json({ message: 'Appointment has no linked patient' });
    }

    const existingBill = await Billing.findOne({ appointment: appointmentId });
    if (existingBill) {
      return res.status(400).json({ message: 'Bill already exists for this appointment' });
    }

    const totalAmount = (consultationFee || 0) + (medicineCost || 0) + (labTestCost || 0);

    const billing = new Billing({
      appointment: appointmentId,
      patient: appointment.patient,
      consultationFee: consultationFee || 0,
      medicineCost: medicineCost || 0,
      labTestCost: labTestCost || 0,
      totalAmount
    });

    await billing.save();

    res.status(201).json({ message: 'Appointment bill generated successfully', billing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Appointment Bill
exports.updateAppointmentBill = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { consultationFee, medicineCost, labTestCost, paymentStatus, paymentDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const billing = await Billing.findOne({ appointment: appointmentId });
    if (!billing) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    if (consultationFee !== undefined) billing.consultationFee = consultationFee;
    if (medicineCost !== undefined) billing.medicineCost = medicineCost;
    if (labTestCost !== undefined) billing.labTestCost = labTestCost;
    if (paymentStatus !== undefined) billing.paymentStatus = paymentStatus;
    if (paymentDate !== undefined) billing.paymentDate = paymentDate;

    billing.totalAmount = billing.consultationFee + billing.medicineCost + billing.labTestCost;

    await billing.save();

    res.json({ message: 'Appointment bill updated successfully', billing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Bill by Appointment ID
exports.getBillByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const billing = await Billing.findOne({ appointment: appointmentId })
      .populate('patient')
      .populate('appointment');

    if (!billing) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json(billing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Bills by Date Range
exports.listBillsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    end.setDate(end.getDate() + 1); // to include full end day

    const bills = await Billing.find({
      createdAt: { $gte: start, $lt: end },
      isActive: true
    }).populate('patient').populate('appointment');

    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
