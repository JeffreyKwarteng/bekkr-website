const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── DEBUG: Check if .env is loading correctly ───
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 ENVIRONMENT VARIABLES CHECK');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log({
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS_EXISTS: !!process.env.SMTP_PASS,
  SMTP_PASS_LENGTH: process.env.SMTP_PASS?.length || 0,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  FROM_EMAIL: process.env.FROM_EMAIL,
  FROM_NAME: process.env.FROM_NAME,
  NODE_ENV: process.env.NODE_ENV
});
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── Email Sending Endpoint ───
app.post('/api/send-email', async (req, res) => {
    const { firstName, lastName, email, organisation, country, interest, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !organisation || !message) {
        return res.status(400).json({ 
            success: false, 
            error: 'Please complete all required fields.' 
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Please enter a valid email address.' 
        });
    }

    try {
        // ─── Simplified SMTP Transporter ───
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.privateemail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || 'hello@bekkr.co',
                pass: process.env.SMTP_PASS
            }
        });

        // ─── Verify SMTP Connection BEFORE sending ───
        console.log('🔐 Testing SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!');

        // ── Admin Notification Email ──
        const adminMailOptions = {
            from: `"${process.env.FROM_NAME || 'Bekkr'}" <${process.env.FROM_EMAIL || 'hello@bekkr.co'}>`,
            to: process.env.ADMIN_EMAIL || 'hello@bekkr.co',
            replyTo: email,
            subject: `New Bekkr Enquiry — ${organisation} (${interest || 'Not specified'})`,
            text: `
New contact form submission:

Name: ${firstName} ${lastName}
Email: ${email}
Organisation: ${organisation}
Country: ${country || 'Not specified'}
Interest: ${interest || 'Not specified'}

Message:
${message}

---
Sent via Bekkr website
            `,
            html: `
<h2>New Bekkr Enquiry</h2>
<p><strong>Name:</strong> ${firstName} ${lastName}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Organisation:</strong> ${organisation}</p>
<p><strong>Country:</strong> ${country || 'Not specified'}</p>
<p><strong>Interest:</strong> ${interest || 'Not specified'}</p>
<hr>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
<hr>
<p><small>Sent via Bekkr website</small></p>
            `
        };

        // ── User Auto-Reply Email ──
        const userMailOptions = {
            from: `"${process.env.FROM_NAME || 'Bekkr'}" <${process.env.FROM_EMAIL || 'hello@bekkr.co'}>`,
            to: email,
            subject: `We've received your message — Bekkr`,
            text: `
Hi ${firstName},

Thank you for reaching out to Bekkr. We've received your enquiry regarding "${interest || 'our services'}" and a member of our team will be in touch within one business day.

This message was sent from a no-reply address. Please do not reply directly.

— The Bekkr Team
            `,
            html: `
<h2>Hi ${firstName},</h2>
<p>Thank you for reaching out to Bekkr. We've received your enquiry regarding <strong>"${interest || 'our services'}"</strong> and a member of our team will be in touch within one business day.</p>
<p style="color: #888; font-size: 0.9em;">This message was sent from a no-reply address. Please do not reply directly.</p>
<hr>
<p>— The Bekkr Team</p>
            `
        };

        // ─── Send both emails ───
        console.log(`📧 Sending admin notification to ${process.env.ADMIN_EMAIL || 'hello@bekkr.co'}...`);
        await transporter.sendMail(adminMailOptions);
        console.log('✅ Admin notification sent');

        console.log(`📧 Sending auto-reply to ${email}...`);
        await transporter.sendMail(userMailOptions);
        console.log('✅ Auto-reply sent');

        res.json({ 
            success: true, 
            message: `We've sent a confirmation to ${email}. Our team will be in touch within one business day.`
        });

    } catch (error) {
        console.error('❌ Email error:', error);
        
        // ─── More detailed error logging ───
        if (error.code === 'EAUTH') {
            console.error('🔴 AUTHENTICATION FAILED - Check your SMTP credentials:');
            console.error(`   SMTP_USER: ${process.env.SMTP_USER}`);
            console.error(`   SMTP_PASS length: ${process.env.SMTP_PASS?.length || 0}`);
            console.error(`   SMTP_HOST: ${process.env.SMTP_HOST}`);
            console.error(`   SMTP_PORT: ${process.env.SMTP_PORT}`);
        }
        
        res.status(500).json({ 
            success: false, 
            error: 'Your message could not be sent. Please email us directly at hello@bekkr.co'
        });
    }
});

// ─── Test endpoint to check SMTP config ───
app.get('/api/test-smtp', async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.privateemail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || 'hello@bekkr.co',
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.verify();
        res.json({ 
            success: true, 
            message: 'SMTP connection verified successfully!',
            config: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                user: process.env.SMTP_USER,
                secure: process.env.SMTP_SECURE
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            code: error.code,
            config: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                user: process.env.SMTP_USER,
                secure: process.env.SMTP_SECURE
            }
        });
    }
});

// Serve static files - handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Admin email: ${process.env.ADMIN_EMAIL || 'hello@bekkr.co'}`);
    console.log(`📧 From email: ${process.env.FROM_EMAIL || 'hello@bekkr.co'}`);
    console.log(`\n🔗 Test SMTP config: http://localhost:${PORT}/api/test-smtp`);
});