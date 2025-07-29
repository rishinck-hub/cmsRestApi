const Billing = require('../models/Billing');
const Appointment = require('../models/Appointment');

// 1. Generate Appointment Bill
exports.createBill = async (req, res) => {
    try {
        const { appointmentId, consultationFee, additionalCharges } = req.body;

        // Check if bill already exists for appointment
        const existingBill = await Billing.findOne({ appointmentId });
        if (existingBill) {
            return res.status(400).json({ message: 'Bill already exists for this appointment.' });
        }

        const totalAmount = consultationFee + (additionalCharges || 0);

        const bill = new Billing({
            appointmentId,
            consultationFee,
            additionalCharges,
            totalAmount
        });

        await bill.save();
        res.status(201).json(bill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Update Appointment Bill
exports.updateBill = async (req, res) => {
    try {
        const { consultationFee, additionalCharges, paymentStatus } = req.body;
        const totalAmount = consultationFee + (additionalCharges || 0);

        const updatedBill = await Billing.findOneAndUpdate(
            { appointmentId: req.params.appointmentId },
            {
                consultationFee,
                additionalCharges,
                totalAmount,
                paymentStatus
            },
            { new: true }
        );

        if (!updatedBill) {
            return res.status(404).json({ message: 'Bill not found for this appointment.' });
        }

        res.json(updatedBill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Get Bill by Appointment ID
exports.getBillByAppointment = async (req, res) => {
    try {
        const bill = await Billing.findOne({ appointmentId: req.params.appointmentId });

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found for this appointment.' });
        }

        res.json(bill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. List Bills by Date Range
exports.listBillsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const bills = await Billing.find({
            generatedAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('appointmentId');

        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
