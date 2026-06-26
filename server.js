const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
        // Create SMTP transporter using Namecheap settings
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.privateemail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || 'hello@bekkr.co',
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false // Sometimes needed for Namecheap
            }
        });

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

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        res.json({ 
            success: true, 
            message: `We've sent a confirmation to ${email}. Our team will be in touch within one business day.`
        });

    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Your message could not be sent. Please email us directly at hello@bekkr.co'
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
});