# PDF Report Generation Feature

## Overview
The kidney stone detection app now includes comprehensive PDF report generation with patient details and severity analysis.

## Features Added

### 1. Patient Information Form
- Patient Name
- Patient ID
- Age
- Gender (dropdown: Male/Female/Other)
- Referring Doctor name

### 2. Severity Rating System
The system automatically calculates severity based on:
- **Number of stones detected**
  - 0 stones: No risk
  - 1 stone: Low risk (+1 score)
  - 2-3 stones: Medium risk (+2 score)
  - 4-5 stones: High risk (+3 score)
  - 6+ stones: Very high risk (+4 score)

- **Maximum stone diameter** (approximated in mm)
  - < 2mm: No additional risk
  - 2-4mm: Low additional risk (+1 score)
  - 4-6mm: Medium additional risk (+2 score)
  - 6-10mm: High additional risk (+3 score)
  - > 10mm: Very high additional risk (+4 score)

### Severity Levels:
- **Mild** (Score ≤ 1): Low risk. Small stones may pass naturally.
- **Moderate** (Score 2-3): Medium risk. Medical monitoring recommended.
- **Severe** (Score 4-5): High risk. Medical intervention may be required.
- **Critical** (Score 6+): Very high risk. Immediate medical attention recommended.

### 3. PDF Report Contents
The generated PDF includes:
- **Report Header**: Professional medical report layout
- **Report Date & Time**: When the analysis was performed
- **Patient Information Table**: All patient details
- **Detection Results**:
  - Number of stones detected
  - Severity level with color coding
  - Assessment description
- **Individual Stone Details Table**:
  - Stone ID
  - Diameter in pixels
  - Size (width × height)
  - Detection confidence percentage
- **Annotated Image**: The detected stones with bounding boxes
- **Medical Disclaimer**: AI-generated report notice

### 4. Professional Formatting
- Color-coded severity levels
  - 🟢 Mild: Green
  - 🟠 Moderate: Orange
  - 🔴 Severe: Red
  - ⚫ Critical: Dark Red
- Tables with proper styling
- High-quality image embedding
- Professional medical document layout

## How to Use

1. **Open the app** at http://localhost:3000

2. **Fill in Patient Information**:
   - Enter patient name, ID, age, gender, and referring doctor
   - All fields are optional but recommended for complete reports

3. **Upload Image**:
   - Click "Choose Image"
   - Select a kidney stone X-ray or ultrasound image

4. **Analyze**:
   - Click "Analyze Image"
   - Wait for AI detection to complete

5. **View Results**:
   - See severity rating with color coding
   - View number of stones detected
   - See individual stone details

6. **Download PDF Report**:
   - Click "📄 Download PDF Report"
   - PDF will be downloaded automatically
   - File name format: `kidney_stone_report_YYYYMMDD_HHMMSS.pdf`

## Technical Details

### Backend API Endpoints

#### POST /api/detect
Accepts multipart/form-data with:
- `image`: Image file
- `patient_name`: String
- `patient_age`: String/Number
- `patient_gender`: String
- `patient_id`: String
- `doctor_name`: String

Returns JSON with detection results and severity analysis.

#### POST /api/generate-pdf
Accepts JSON with detection results.
Returns PDF file for download.

### File Storage
- **uploads/**: Input images
- **outputs/**: Annotated images with detections
- **reports/**: Generated PDF reports

## Dependencies
- `reportlab`: PDF generation library (already installed)
- All other dependencies remain the same

## Example Workflow
1. Patient John Doe, ID: P12345, comes for kidney stone screening
2. Doctor uploads ultrasound image
3. System detects 2 stones (diameters: 45px and 38px)
4. Severity calculated as "Moderate"
5. PDF report generated with all details
6. Doctor downloads and includes in patient's medical record

## Notes
- Diameter calculations are approximations based on bounding box dimensions
- 1 pixel ≈ 0.1mm assumed for severity calculations
- Reports are for screening purposes and should be reviewed by medical professionals
- All generated files are saved locally for record-keeping
