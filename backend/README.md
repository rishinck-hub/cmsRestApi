# Clinic Management System - Backend API

A comprehensive REST API for managing a clinic's operations including staff, patients, appointments, consultations, prescriptions, lab tests, and billing.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Staff, doctors, receptionists, lab technicians, and pharmacists
- **Patient Management**: Complete patient registration and information management
- **Appointment System**: Schedule, manage, and track appointments
- **Consultation Management**: Doctor consultation notes and medical records
- **Prescription System**: Medicine and lab test prescriptions
- **Inventory Management**: Medicine stock tracking and low stock alerts
- **Billing System**: Generate and manage appointment bills
- **Lab Test Management**: Lab test prescriptions and results tracking

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ClinicManagementSystem/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/clinicdb
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Administrator Endpoints

#### Staff Management
- `POST /api/staff` - Create staff member
- `PUT /api/staff/{staffId}` - Update staff information
- `GET /api/staff/{staffId}` - Get staff by ID
- `GET /api/staff` - List all staff
- `PATCH /api/staff/{staffId}/deactivate` - Deactivate staff

#### Role Management
- `POST /api/roles` - Create role
- `PUT /api/roles/{roleId}` - Update role
- `GET /api/roles/{roleId}` - Get role by ID
- `GET /api/roles` - List all roles
- `PATCH /api/roles/{roleId}/deactivate` - Deactivate role

#### Doctor Management
- `POST /api/doctors` - Create doctor profile
- `PUT /api/doctors/{doctorId}` - Update doctor profile
- `GET /api/doctors/{doctorId}` - Get doctor by ID
- `GET /api/doctors` - List all doctors
- `PATCH /api/doctors/{doctorId}/deactivate` - Deactivate doctor

#### Specialization Management
- `POST /api/specializations` - Add specialization
- `PUT /api/specializations/{specializationId}` - Update specialization
- `GET /api/specializations/{specializationId}` - Get specialization by ID
- `GET /api/specializations` - List all specializations

### Receptionist Endpoints

#### Patient Management
- `POST /api/patients` - Register patient
- `PUT /api/patients/{patientId}` - Update patient information
- `GET /api/patients/{patientId}` - Get patient by ID
- `GET /api/patients` - List all patients
- `PATCH /api/patients/{patientId}/deactivate` - Deactivate patient

#### Appointment Management
- `POST /api/appointments` - Schedule appointment
- `PUT /api/appointments/{appointmentId}` - Update appointment
- `GET /api/appointments/{appointmentId}` - Get appointment by ID
- `GET /api/appointments?date={date}` - List appointments by date
- `PATCH /api/appointments/{appointmentId}/cancel` - Cancel appointment
- `GET /api/appointments/patient/{patientId}` - List appointments by patient
- `GET /api/appointments/doctor/{doctorId}` - List appointments by doctor
- `GET /api/appointments?status={status}` - Get appointments by status

#### Billing
- `POST /api/billing` - Generate appointment bill
- `PUT /api/billing/{appointmentId}` - Update appointment bill
- `GET /api/billing/{appointmentId}` - Get bill by appointment ID
- `GET /api/billing?startDate={startDate}&endDate={endDate}` - List bills by date range

### Doctor Endpoints

#### Consultation Notes
- `POST /api/consultations` - Add consultation note
- `PUT /api/consultations/{consultationId}` - Update consultation note
- `GET /api/consultations/appointment/{appointmentId}` - Get consultation by appointment ID
- `GET /api/consultations/doctor/{doctorId}` - List consultations by doctor
- `GET /api/consultations/patient/{patientId}` - List consultation history by patient
- `GET /api/consultations/history/appointment/{appointmentId}` - Get consultation history by appointment ID

#### Medicine Prescriptions
- `POST /api/prescriptions/medicine` - Create medicine prescription
- `PUT /api/prescriptions/medicine/{prescriptionId}` - Update medicine prescription
- `GET /api/prescriptions/medicine/appointment/{appointmentId}` - Get prescription by appointment ID
- `GET /api/prescriptions/medicine/patient/{patientId}` - List prescriptions by patient
- `GET /api/prescriptions/medicine/history/patient/{patientId}` - List prescription history by patient
- `GET /api/prescriptions/medicine/history/doctor/{doctorId}` - List prescription history by doctor
- `GET /api/prescriptions/medicine/history/appointment/{appointmentId}` - Get prescription history by appointment ID

#### Lab Test Prescriptions
- `POST /api/labtests/prescription` - Create lab test prescription
- `PUT /api/labtests/prescription/{prescriptionId}` - Update lab test prescription
- `GET /api/labtests/prescription/appointment/{appointmentId}` - Get lab test prescription by appointment ID
- `GET /api/labtests/prescription/patient/{patientId}` - List lab test prescriptions by patient

### Lab Technician Endpoints

#### Lab Test Management
- `POST /api/labtests` - Add new lab test
- `PUT /api/labtests/{labTestId}` - Update lab test details
- `GET /api/labtests/{labTestId}` - Get lab test by ID
- `GET /api/labtests` - List all lab tests
- `PATCH /api/labtests/{labTestId}/deactivate` - Deactivate lab test

#### Lab Test Results
- `PUT /api/labtests/results/{labTestPrescriptionId}` - Record lab test result
- `GET /api/labtests/results/appointment/{appointmentId}` - Get lab test result by appointment ID
- `GET /api/labtests/results?startDate={startDate}&endDate={endDate}` - List lab test results by date range
- `PATCH /api/labtests/{labTestPrescriptionId}/deactivate` - Deactivate lab test prescription

### Pharmacist Endpoints

#### Medicine Management
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/{medicineId}` - Update medicine details
- `GET /api/medicines/{medicineId}` - Get medicine by ID
- `GET /api/medicines` - List all medicines
- `PATCH /api/medicines/{medicineId}/deactivate` - Deactivate medicine

#### Inventory Management
- `POST /api/inventory/medicine` - Add new inventory item
- `PUT /api/inventory/medicine/{medicineStockId}` - Update inventory quantity
- `GET /api/inventory/medicine/{medicineId}` - Get inventory by medicine ID
- `GET /api/inventory/medicine` - List all inventory items
- `PATCH /api/inventory/medicine/{medicineStockId}/flag-low` - Flag low stock

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## User Roles

- **admin** - Full system access
- **doctor** - Patient consultations, prescriptions, medical records
- **receptionist** - Patient management, appointments, billing
- **labtech** - Lab test management and results
- **pharmacist** - Medicine and inventory management

## Database Models

- **User** - Authentication and user management
- **Staff** - Staff member profiles
- **Role** - System roles
- **Doctor** - Doctor profiles with specializations
- **Specialization** - Medical specializations
- **Patient** - Patient information and medical history
- **Appointment** - Appointment scheduling and management
- **Consultation** - Doctor consultation notes
- **Medicine** - Medicine catalog
- **MedicinePrescription** - Medicine prescriptions
- **LabTest** - Lab test catalog
- **LabTestPrescription** - Lab test prescriptions
- **Inventory** - Medicine inventory management
- **Billing** - Appointment billing

## Error Handling

The API returns consistent error responses:
```json
{
  "message": "Error description",
  "error": "Detailed error information (in development)"
}
```

## Health Check

- `GET /health` - Check if the API is running

## Development

To run in development mode with auto-reload:
```bash
npm run dev
```

## Production

To run in production mode:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 