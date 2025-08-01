const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  billingId: {
    type: String,
    required: true,
    unique: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },
  additionalCharges: [{
    description: String,
    amount: {
      type: Number,
      min: 0
    }
  }],
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  balanceAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'insurance', 'online'],
    default: 'cash'
  },
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    coverageAmount: Number
  },
  billingDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: Date,
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Generate billing ID before saving
billingSchema.pre('save', async function(next) {
  if (this.isNew && !this.billingId) {
    const count = await mongoose.model('Billing').countDocuments();
    this.billingId = `BILL${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate total amount
  const additionalChargesTotal = this.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
  this.totalAmount = this.consultationFee + additionalChargesTotal - this.discount + this.tax;
  
  // Calculate balance amount
  this.balanceAmount = this.totalAmount - this.paidAmount;
  
  // Update payment status
  if (this.balanceAmount === 0) {
    this.paymentStatus = 'paid';
  } else if (this.paidAmount > 0) {
    this.paymentStatus = 'partial';
  } else if (new Date() > this.dueDate) {
    this.paymentStatus = 'overdue';
  }
  
  next();
});

// Index for efficient queries
billingSchema.index({ appointment: 1 });
billingSchema.index({ patient: 1 });
billingSchema.index({ billingDate: 1 });
billingSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Billing', billingSchema); 