const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        unique: true
    },
    consultationFee: { type: Number, required: true },
    additionalCharges: { type: Number, default: 0 },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Pending'],
        default: 'Unpaid'
    },
    generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Billing', billingSchema);
