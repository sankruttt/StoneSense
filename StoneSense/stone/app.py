from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import os
from datetime import datetime
import base64
import numpy as np
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib import colors
import io
import requests
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth, firestore
from functools import wraps

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
try:
    # Try to initialize with service account (you'll need to set this up)
    # For now, initialize without credentials (will work with emulator or if already initialized)
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    db = firestore.client()
    print("✓ Firebase Admin initialized")
except Exception as e:
    print(f"⚠️ Firebase Admin initialization: {e}")
    print("Note: You'll need to set up a service account JSON file for production")
    db = None

# Token verification decorator
def firebase_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        id_token = auth_header.split(' ')[1]
        
        try:
            # Verify the ID token
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Get user profile from Firestore
            user_ref = db.collection('users').document(uid)
            user_doc = user_ref.get()
            
            if user_doc.exists:
                user_data = user_doc.to_dict()
            else:
                user_data = {
                    'name': decoded_token.get('name', 'User'),
                    'email': decoded_token.get('email', ''),
                    'patientId': f"P{int(datetime.now().timestamp())}",
                    'age': None,
                    'gender': None,
                    'doctorName': None
                }
            
            # Attach user data to request
            request.user_data = user_data
            request.uid = uid
            
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Token verification error: {e}")
            return jsonify({'error': 'Invalid or expired token'}), 401
    
    return decorated_function

# Load YOLO model
MODEL_PATH = 'runs/detect/train2/weights/best.pt'
model = YOLO(MODEL_PATH)
print(f"✓ Model loaded from {MODEL_PATH}")

# Create directories
os.makedirs('uploads', exist_ok=True)
os.makedirs('outputs', exist_ok=True)
os.makedirs('reports', exist_ok=True)

# Severity calculation function
def calculate_severity(num_stones, max_diameter):
    """Calculate severity based on number and size of stones"""
    # Handle no stones detected
    if num_stones == 0:
        return "Normal", "The uploaded image doesn't contain any kidney stones."
    
    severity_score = 0
    
    # Score based on number of stones
    if num_stones == 1:
        severity_score += 1
    elif num_stones <= 3:
        severity_score += 2
    elif num_stones <= 5:
        severity_score += 3
    else:
        severity_score += 4
    
    # Score based on max diameter (assuming 1px ≈ 0.1mm)
    diameter_mm = max_diameter * 0.1
    if diameter_mm < 2:
        severity_score += 0
    elif diameter_mm < 4:
        severity_score += 1
    elif diameter_mm < 6:
        severity_score += 2
    elif diameter_mm < 10:
        severity_score += 3
    else:
        severity_score += 4
    
    # Determine severity level
    if severity_score <= 1:
        return "Mild", "Low risk. Small stones may pass naturally."
    elif severity_score <= 3:
        return "Moderate", "Medium risk. Medical monitoring recommended."
    elif severity_score <= 5:
        return "Severe", "High risk. Medical intervention may be required."
    else:
        return "Critical", "Very high risk. Immediate medical attention recommended."

def generate_pdf_content(pdf_buffer, data):
    """Generate PDF content to a buffer"""
    # Extract data
    patient_info = data.get('patient_info', {})
    num_stones = data.get('num_stones', 0)
    stones = data.get('stones', [])
    severity = data.get('severity', 'N/A')
    severity_desc = data.get('severity_description', '')
    timestamp = data.get('timestamp', datetime.now().strftime('%Y%m%d_%H%M%S'))
    
    # Create PDF with margins
    doc = SimpleDocTemplate(
        pdf_buffer, 
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.5*inch,
        bottomMargin=0.75*inch
    )
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles - using website color palette
    logo_style = ParagraphStyle(
        'LogoStyle',
        parent=styles['Normal'],
        fontSize=28,
        textColor=colors.HexColor('#2a3342'),
        fontName='Helvetica-Bold',
        alignment=TA_CENTER,
        spaceAfter=5
    )
    
    tagline_style = ParagraphStyle(
        'TaglineStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#666666'),
        fontName='Helvetica',
        alignment=TA_CENTER,
        spaceAfter=12
    )
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#2a3342'),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#2a3342'),
        spaceAfter=12,
        spaceBefore=15,
        fontName='Helvetica-Bold'
    )
    
    # Stone Sense Logo and Header
    from reportlab.platypus import HRFlowable, KeepTogether
    
    # Add logo image centered
    logo_path = 'frontend/src/components/logo.png'
    if os.path.exists(logo_path):
        logo_img = RLImage(logo_path, width=1.5*inch, height=1.5*inch)
        # Create table to center the logo
        logo_table = Table([[logo_img]], colWidths=[1.5*inch])
        logo_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'CENTER'),
            ('VALIGN', (0, 0), (0, 0), 'MIDDLE'),
        ]))
        story.append(logo_table)
        story.append(Spacer(1, 0.1 * inch))
    
    # Brand name and separator
    story.append(Paragraph('STONE SENSE', logo_style))
    story.append(Spacer(1, 0.25 * inch))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#A5E9C5'), spaceAfter=20))
    
    # Report title and info combined
    report_date = datetime.now().strftime('%B %d, %Y at %I:%M %p')
    story.append(Paragraph('Kidney Stone Detection Report', title_style))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph(f'Report Generated: {report_date}', tagline_style))
    story.append(Spacer(1, 0.3 * inch))
    
    # Patient Information
    story.append(Paragraph('Patient Information', heading_style))
    patient_data = [
        ['Patient Name:', patient_info.get('name', 'N/A')],
        ['Patient ID:', patient_info.get('id', 'N/A')],
        ['Age:', patient_info.get('age', 'N/A')],
        ['Gender:', patient_info.get('gender', 'N/A')],
        ['Referring Doctor:', patient_info.get('doctor', 'N/A')]
    ]
    
    patient_table = Table(patient_data, colWidths=[2 * inch, 4 * inch])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ddeeff')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#2a3342')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#2a3342'))
    ]))
    story.append(patient_table)
    story.append(Spacer(1, 0.3 * inch))
    
    # Detection Results
    story.append(Paragraph('Detection Results', heading_style))
    
    # Severity box
    severity_color = {
        'Mild': colors.green,
        'Moderate': colors.orange,
        'Severe': colors.red,
        'Critical': colors.darkred
    }.get(severity, colors.grey)
    
    severity_data = [
        ['Number of Stones:', str(num_stones)],
        ['Severity Level:', severity],
        ['Assessment:', severity_desc]
    ]
    
    severity_table = Table(severity_data, colWidths=[2 * inch, 4 * inch])
    severity_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ddeeff')),
        ('BACKGROUND', (1, 1), (1, 1), severity_color),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#2a3342')),
        ('TEXTCOLOR', (1, 1), (1, 1), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 1), (1, 1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#2a3342'))
    ]))
    story.append(severity_table)
    story.append(Spacer(1, 0.3 * inch))
    
    # Stone Details
    if stones and len(stones) > 0:
        story.append(Paragraph('Individual Stone Details', heading_style))
        
        stone_data = [['Stone #', 'Diameter (px)', 'Size (px)', 'Confidence']]
        for stone in stones:
            stone_data.append([
                str(stone['id']),
                str(stone['diameter_px']),
                f"{stone['width_px']} × {stone['height_px']}",
                f"{stone['confidence'] * 100:.1f}%"
            ])
        
        stone_table = Table(stone_data, colWidths=[1.2 * inch, 1.5 * inch, 1.8 * inch, 1.5 * inch])
        stone_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2a3342')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#2a3342')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#ddeeff')])
        ]))
        story.append(stone_table)
        story.append(Spacer(1, 0.3 * inch))
    
    # Add output image if exists
    output_image_path = f'outputs/output_{timestamp}.jpg'
    if os.path.exists(output_image_path):
        story.append(Paragraph('Annotated Image', heading_style))
        img = RLImage(output_image_path, width=5 * inch, height=3.75 * inch)
        story.append(img)
    
    # Footer
    story.append(Spacer(1, 0.5 * inch))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#A5E9C5'), spaceBefore=10, spaceAfter=10))
    
    footer_style = ParagraphStyle(
        'FooterStyle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#2a3342'),
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    footer_text = f'''<b>STONE SENSE</b> - AI-Powered Kidney Stone Detection System<br/>
    Report Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}<br/>
    <i>This report is generated by AI-powered detection system. Please consult with a medical professional for diagnosis and treatment.</i>'''
    story.append(Paragraph(footer_text, footer_style))
    
    # Build PDF
    doc.build(story)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': MODEL_PATH})

@app.route('/outputs/<filename>', methods=['GET'])
def serve_pdf(filename):
    """Serve PDF files for WhatsApp media attachments"""
    try:
        pdf_path = os.path.join('outputs', filename)
        if os.path.exists(pdf_path):
            return send_file(pdf_path, mimetype='application/pdf')
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/detect', methods=['POST'])
@firebase_required
def detect():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        # Get patient details from Firebase authentication
        user_data = request.user_data
        patient_name = user_data.get('name', 'N/A')
        patient_age = str(user_data.get('age', 'N/A')) if user_data.get('age') else 'N/A'
        patient_gender = user_data.get('gender', 'N/A')
        patient_id = user_data.get('patientId', 'N/A')
        doctor_name = user_data.get('doctorName', 'N/A')
        
        # Save uploaded image
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        input_path = f'uploads/input_{timestamp}.jpg'
        image_file.save(input_path)
        
        # Check if image is grayscale/black and white
        img = cv2.imread(input_path)
        if img is None:
            return jsonify({'error': 'Failed to load image'}), 400
        
        # Check if image is grayscale by comparing all channels
        # If all channels are equal, it's grayscale
        if len(img.shape) == 3:
            b, g, r = cv2.split(img)
            # Calculate the difference between channels
            diff_br = cv2.absdiff(b, r)
            diff_bg = cv2.absdiff(b, g)
            diff_rg = cv2.absdiff(r, g)
            
            # If average difference is more than 10, it's colored
            avg_diff = (diff_br.mean() + diff_bg.mean() + diff_rg.mean()) / 3
            
            if avg_diff > 10:  # Threshold to determine if image is colored
                return jsonify({
                    'success': True,
                    'num_stones': 0,
                    'stones': [],
                    'severity': 'normal',
                    'severity_description': 'No stones detected. Please upload a different image',
                    'output_image': None,
                    'timestamp': timestamp,
                    'patient_info': {
                        'name': patient_name,
                        'age': patient_age,
                        'gender': patient_gender,
                        'id': patient_id,
                        'doctor': doctor_name
                    }
                }), 200
        
        # Run detection
        results = model(input_path)
        result = results[0]
        
        # Get detections
        boxes = result.boxes
        num_stones = len(boxes)
        
        # Calculate diameters (approximate from bounding box)
        stones_info = []
        max_diameter = 0
        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
            width = x2 - x1
            height = y2 - y1
            # Approximate diameter as average of width and height
            diameter = (width + height) / 2
            confidence = float(box.conf[0])
            
            if diameter > max_diameter:
                max_diameter = diameter
            
            stones_info.append({
                'id': i + 1,
                'diameter_px': round(float(diameter), 2),
                'width_px': round(float(width), 2),
                'height_px': round(float(height), 2),
                'confidence': round(confidence, 3)
            })
        
        # Calculate severity
        severity_level, severity_desc = calculate_severity(num_stones, max_diameter)
        
        # Save annotated image
        output_path = f'outputs/output_{timestamp}.jpg'
        annotated_img = result.plot()
        cv2.imwrite(output_path, annotated_img)
        
        # Convert output image to base64
        with open(output_path, 'rb') as f:
            img_data = f.read()
            img_base64 = base64.b64encode(img_data).decode('utf-8')
        
        response = {
            'success': True,
            'num_stones': num_stones,
            'stones': stones_info,
            'severity': severity_level,
            'severity_description': severity_desc,
            'output_image': f'data:image/jpeg;base64,{img_base64}',
            'timestamp': timestamp,
            'patient_info': {
                'name': patient_name,
                'age': patient_age,
                'gender': patient_gender,
                'id': patient_id,
                'doctor': doctor_name
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error in detection: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-pdf', methods=['POST'])
@firebase_required
def generate_pdf():
    try:
        data = request.json
        
        # Extract timestamp
        timestamp = data.get('timestamp', datetime.now().strftime('%Y%m%d_%H%M%S'))
        
        # Create PDF file using the shared generate_pdf_content function
        pdf_filename = f'reports/report_{timestamp}.pdf'
        
        # Use the shared PDF generation function
        with open(pdf_filename, 'wb') as pdf_file:
            generate_pdf_content(pdf_file, data)
        
        # Send PDF file
        return send_file(pdf_filename, as_attachment=True, download_name=f'kidney_stone_report_{timestamp}.pdf')
    
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return jsonify({'error': str(e)}), 500

@firebase_required
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        scan_results = data.get('scan_results', None)
        chat_history = data.get('history', [])
        
        # Get OpenRouter API key from environment variable
        api_key = os.environ.get('OPENROUTER_API_KEY', '')
        
        if not api_key:
            return jsonify({'error': 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.'}), 500
        
        # Build context from scan results if available
        context = ""
        if scan_results:
            context = f"""
You are a medical AI assistant specialized in kidney stone analysis. The patient has uploaded a scan with the following results:

**Scan Results:**
- Number of stones detected: {scan_results.get('num_stones', 0)}
- Severity: {scan_results.get('severity', 'N/A')}
- Severity Description: {scan_results.get('severity_description', 'N/A')}

**Individual Stone Details:**
"""
            stones = scan_results.get('stones', [])
            for stone in stones:
                context += f"- Stone #{stone['id']}: Diameter {stone['diameter_px']}px, Size {stone['width_px']}×{stone['height_px']}px, Confidence {stone['confidence']*100:.1f}%\n"
            
            context += """
**Patient Information:**
"""
            patient_info = scan_results.get('patient_info', {})
            context += f"- Name: {patient_info.get('name', 'N/A')}\n"
            context += f"- Age: {patient_info.get('age', 'N/A')}\n"
            context += f"- Gender: {patient_info.get('gender', 'N/A')}\n"
            context += f"- ID: {patient_info.get('id', 'N/A')}\n"
            context += f"- Doctor: {patient_info.get('doctor', 'N/A')}\n"
        
        # Build system context as part of first user message (Gemma doesn't support system role)
        system_context = f"""You are a helpful medical AI assistant specializing in kidney stone analysis and kidney health. 

CRITICAL: Keep ALL responses under 8-10 lines maximum. Be extremely concise.

Format guidelines:
- Use bullet points for clarity
- Maximum 8-10 lines total per response
- No lengthy explanations
- Direct, practical answers only
- If scan results available, reference them briefly

Important:
- Be empathetic and supportive
- Provide accurate, evidence-based info
- Remind to consult healthcare professionals
- Keep explanations simple and short

{context if context else "No scan results available yet. You can answer general questions about kidney health."}

User's question: {user_message}"""

        messages = []
        
        # Add chat history
        for msg in chat_history:
            messages.append({
                "role": msg.get('role', 'user'),
                "content": msg.get('content', '')
            })
        
        # Add current message with context if it's the first message
        if len(chat_history) == 0:
            messages.append({
                "role": "user",
                "content": system_context
            })
        else:
            messages.append({
                "role": "user",
                "content": user_message
            })
        
        # Call OpenRouter API
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "stone"
            },
            json={
                "model": "openai/gpt-oss-120b",
                "messages": messages
            }
        )
        
        if response.status_code != 200:
            return jsonify({'error': f'OpenRouter API error: {response.text}'}), 500
        
        result = response.json()
        assistant_message = result['choices'][0]['message']['content']
        
        return jsonify({
            'success': True,
            'message': assistant_message
        })
    
    except Exception as e:
        print(f"Error in chat: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/send-whatsapp', methods=['POST'])
@firebase_required
def send_whatsapp():
    """Send PDF report to WhatsApp using Twilio"""
    try:
        data = request.json
        results = data.get('results')
        phone_number = data.get('phoneNumber')
        
        if not results or not phone_number:
            return jsonify({'error': 'Missing results or phone number'}), 400
        
        # Get Twilio credentials from environment
        account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        from_whatsapp = os.getenv('TWILIO_WHATSAPP_NUMBER')  # e.g., 'whatsapp:+14155238886'
        
        if not account_sid or not auth_token or not from_whatsapp:
            return jsonify({'error': 'Twilio credentials not configured'}), 500
        
        # Import Twilio client
        try:
            from twilio.rest import Client
        except ImportError:
            return jsonify({'error': 'Twilio library not installed. Run: pip install twilio'}), 500
        
        # Initialize Twilio client
        client = Client(account_sid, auth_token)
        
        # Generate PDF in memory
        pdf_buffer = io.BytesIO()
        generate_pdf_content(pdf_buffer, results)
        pdf_buffer.seek(0)
        
        # Save PDF temporarily for Twilio (Twilio needs a publicly accessible URL)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        pdf_filename = f'report_{timestamp}.pdf'
        pdf_path = os.path.join('outputs', pdf_filename)
        
        with open(pdf_path, 'wb') as f:
            f.write(pdf_buffer.getvalue())
        
        # Format phone number for WhatsApp
        to_whatsapp = f"whatsapp:{phone_number}"
        
        # Get base URL for serving PDFs (ngrok URL or production domain)
        base_url = os.getenv('BASE_URL', '')
        
        # Send WhatsApp message with media
        message_body = f"""🏥 Kidney Stone Detection Report

Patient: {results.get('patient_info', {}).get('name', 'N/A')}
Stones Detected: {results.get('num_stones', 0)}
Severity: {results.get('severity', 'N/A')}

{results.get('severity_description', '')}

{"Your detailed PDF report is attached." if base_url else "Download the PDF from your dashboard."}"""
        
        # Create message parameters
        message_params = {
            'from_': from_whatsapp,
            'body': message_body,
            'to': to_whatsapp
        }
        
        # Add PDF media URL if BASE_URL is configured
        if base_url:
            pdf_url = f"{base_url.rstrip('/')}/outputs/{pdf_filename}"
            message_params['media_url'] = [pdf_url]
        
        message = client.messages.create(**message_params)
        
        return jsonify({
            'success': True,
            'message_sid': message.sid,
            'status': message.status
        })
        
    except Exception as e:
        print(f"Error sending WhatsApp: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')
