const Appointment = require('../models/Appointment');

// 1. Schedule Appointment
exports.createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, timeSlot, reason } = req.body;

        const appointment = new Appointment({
            patientId,
            doctorId,
            appointmentDate,
            timeSlot,
            reason
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Update Appointment
exports.updateAppointment = async (req, res) => {
    try {
        const { appointmentDate, timeSlot, reason, status } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.appointmentId,
            { appointmentDate, timeSlot, reason, status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Get Appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId)
            .populate('patientId')
            .populate('doctorId');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. List Appointments by Date
exports.listAppointmentsByDate = async (req, res) => {
    try {
        const { date } = req.query;

        const appointments = await Appointment.find({
            appointmentDate: {
                $gte: new Date(date + 'T00:00:00'),
                $lte: new Date(date + 'T23:59:59')
            }
        }).populate('patientId doctorId');

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. Cancel Appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.appointmentId,
            { status: 'Cancelled' },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.json({ message: 'Appointment cancelled.', appointment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. List Appointments by Patient
exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.patientId })
            .populate('doctorId');

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 7. List Appointments by Doctor
exports.getAppointmentsByDoctor = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.params.doctorId })
            .populate('patientId');

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 8. Get Appointments by Status
exports.getAppointmentsByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        const appointments = await Appointment.find({ status })
            .populate('doctorId patientId');

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
