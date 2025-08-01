# Receptionist API Documentation

This document outlines all the API endpoints available for receptionist functionality in the Clinic Management System.

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 2.1. Patient Management

### Register Patient
**POST** `/api/patients`

Register a new patient in the system.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "0987654321"
  },
  "allergies": ["Penicillin", "Peanuts"],
  "bloodGroup": "A+"
}
```

**Response:**
```json
{
  "message": "Patient registered successfully",
  "patient": {
    "_id": "patient_id",
    "patientId": "PAT0001",
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "address": {...},
    "emergencyContact": {...},
    "allergies": ["Penicillin", "Peanuts"],
    "bloodGroup": "A+",
    "isActive": true,
    "registeredBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Patient Information
**PUT** `/api/patients/{patientId}`

Update patient information.

**Request Body:** (All fields optional)
```json
{
  "name": "John Smith",
  "phone": "9876543210",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "country": "USA"
  }
}
```

### Get Patient by ID
**GET** `/api/patients/{patientId}`

Retrieve patient information by ID.

**Response:**
```json
{
  "patient": {
    "_id": "patient_id",
    "patientId": "PAT0001",
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "address": {...},
    "emergencyContact": {...},
    "allergies": ["Penicillin"],
    "bloodGroup": "A+",
    "isActive": true,
    "registeredBy": {
      "_id": "user_id",
      "name": "Receptionist Name",
      "email": "receptionist@clinic.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### List All Patients
**GET** `/api/patients`

Retrieve all patients with pagination and search functionality.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, phone, or patient ID
- `status` (optional): Filter by status ('active' or 'inactive')

**Example:** `GET /api/patients?page=1&limit=10&search=john&status=active`

**Response:**
```json
{
  "patients": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

### Deactivate Patient
**PATCH** `/api/patients/{patientId}/deactivate`

Deactivate a patient (soft delete).

**Response:**
```json
{
  "message": "Patient deactivated successfully",
  "patient": {
    "_id": "patient_id",
    "patientId": "PAT0001",
    "name": "John Doe",
    "isActive": false,
    ...
  }
}
```

## 2.2. Appointment Management

### Schedule Appointment
**POST** `/api/appointments`

Schedule a new appointment.

**Request Body:**
```json
{
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "14:30",
  "duration": 30,
  "type": "consultation",
  "reason": "Regular checkup",
  "notes": "Patient prefers afternoon appointments",
  "symptoms": ["Headache", "Fatigue"],
  "priority": "medium"
}
```

**Response:**
```json
{
  "message": "Appointment scheduled successfully",
  "appointment": {
    "_id": "appointment_id",
    "appointmentId": "APT0001",
    "patient": {
      "_id": "patient_id",
      "name": "John Doe",
      "email": "john.doe@email.com",
      "phone": "1234567890",
      "patientId": "PAT0001"
    },
    "doctor": {
      "_id": "doctor_id",
      "name": "Dr. Smith",
      "email": "dr.smith@clinic.com"
    },
    "appointmentDate": "2024-01-15T00:00:00.000Z",
    "appointmentTime": "14:30",
    "duration": 30,
    "type": "consultation",
    "reason": "Regular checkup",
    "status": "scheduled",
    "priority": "medium",
    "scheduledBy": {
      "_id": "user_id",
      "name": "Receptionist Name",
      "email": "receptionist@clinic.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Appointment
**PUT** `/api/appointments/{appointmentId}`

Update appointment details.

**Request Body:** (All fields optional)
```json
{
  "appointmentTime": "15:00",
  "duration": 45,
  "reason": "Follow-up consultation",
  "priority": "high"
}
```

### Get Appointment by ID
**GET** `/api/appointments/{appointmentId}`

Retrieve appointment details by ID.

### List Appointments by Date
**GET** `/api/appointments?date={appointmentDate}`

Retrieve appointments for a specific date.

**Query Parameters:**
- `date` (required): Date in YYYY-MM-DD format
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:** `GET /api/appointments?date=2024-01-15&page=1&limit=10`

### Cancel Appointment
**PATCH** `/api/appointments/{appointmentId}/cancel`

Cancel an appointment.

**Request Body:**
```json
{
  "cancellationReason": "Patient requested cancellation due to illness"
}
```

## 2.3. Consultation Billing

### Generate Appointment Bill
**POST** `/api/billing`

Generate a bill for an appointment.

**Request Body:**
```json
{
  "appointmentId": "appointment_id",
  "consultationFee": 150.00,
  "additionalCharges": [
    {
      "description": "Lab Test",
      "amount": 75.00
    },
    {
      "description": "X-Ray",
      "amount": 120.00
    }
  ],
  "discount": 25.00,
  "tax": 15.00,
  "paymentMethod": "cash",
  "insuranceDetails": {
    "provider": "Blue Cross",
    "policyNumber": "BC123456",
    "coverageAmount": 200.00
  },
  "dueDate": "2024-01-30",
  "notes": "Payment due within 15 days"
}
```

**Response:**
```json
{
  "message": "Bill generated successfully",
  "billing": {
    "_id": "billing_id",
    "billingId": "BILL0001",
    "appointment": {...},
    "patient": {...},
    "doctor": {...},
    "consultationFee": 150.00,
    "additionalCharges": [...],
    "discount": 25.00,
    "tax": 15.00,
    "totalAmount": 335.00,
    "paidAmount": 0,
    "balanceAmount": 335.00,
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "insuranceDetails": {...},
    "billingDate": "2024-01-15T00:00:00.000Z",
    "dueDate": "2024-01-30T00:00:00.000Z",
    "generatedBy": {...},
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

### Update Appointment Bill
**PUT** `/api/billing/{appointmentId}`

Update bill details.

**Request Body:** (All fields optional)
```json
{
  "consultationFee": 175.00,
  "discount": 30.00,
  "paidAmount": 100.00
}
```

### Get Bill by Appointment ID
**GET** `/api/billing/{appointmentId}`

Retrieve bill details for a specific appointment.

### List Bills by Date Range
**GET** `/api/billing?startDate={startDate}&endDate={endDate}`

Retrieve bills within a date range.

**Query Parameters:**
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format
- `page` (optional): Page number
- `limit` (optional): Items per page
- `paymentStatus` (optional): Filter by payment status

**Example:** `GET /api/billing?startDate=2024-01-01&endDate=2024-01-31&paymentStatus=pending`

**Response:**
```json
{
  "bills": [...],
  "summary": {
    "totalBilled": 15000.00,
    "totalPaid": 12000.00,
    "totalPending": 3000.00,
    "billCount": 50
  },
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

### Process Payment
**POST** `/api/billing/{billingId}/payment`

Process a payment for a bill.

**Request Body:**
```json
{
  "amount": 100.00,
  "paymentMethod": "card",
  "notes": "Partial payment received"
}
```

## 2.4. Appointment Listing

### List Appointments by Patient
**GET** `/api/appointments/patient/{patientId}`

Retrieve all appointments for a specific patient.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by appointment status

**Example:** `GET /api/appointments/patient/patient_id?status=scheduled`

### List Appointments by Doctor
**GET** `/api/appointments/doctor/{doctorId}`

Retrieve all appointments for a specific doctor.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by appointment status
- `date` (optional): Filter by specific date

**Example:** `GET /api/appointments/doctor/doctor_id?date=2024-01-15&status=scheduled`

### Get Appointments with Status
**GET** `/api/appointments?status={status}`

Retrieve appointments filtered by status.

**Query Parameters:**
- `status` (optional): Appointment status ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show')
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:** `GET /api/appointments?status=scheduled&page=1&limit=20`

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

## Role-Based Access Control

The receptionist role has access to:
- All patient management operations
- All appointment management operations
- All billing operations
- View access to patient and appointment data

Receptionists cannot:
- Access admin-only endpoints
- Modify system configurations
- Access sensitive medical records beyond basic patient information

## Rate Limiting

To ensure system stability, API endpoints are subject to rate limiting:
- 100 requests per minute per user
- 1000 requests per hour per user

## Support

For technical support or questions about the API, please contact the development team. 