# Bekkr — Revenue Intelligence for Subnational Governments

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Bekkr is a revenue intelligence platform that enforces and collects revenue for subnational governments across Africa and the global south — while connecting them to the global capital markets they deserve access to.

## 🌍 Live Site

[View Live Site](https://bekkr-website.onrender.com)

## ✨ Features

- **Revenue Enforcement**: Systematic identification, verification, and enforcement of revenue obligations
- **Digital Collection**: Multi-channel payment infrastructure (mobile money, bank transfer, USSD)
- **Revenue Analytics**: Real-time dashboards and predictive analytics
- **Capital Market Access**: Packaging subnational revenue streams into bankable instruments
- **Compliance Management**: Automated compliance workflows with appeals handling
- **Fiscal Advisory**: Dedicated advisory support for long-term revenue capacity

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer with Namecheap SMTP
- **Hosting**: Render.com
- **Fonts**: Google Fonts (Cormorant Garamond, DM Sans, DM Mono)

## 📁 Project Structure
```
bekkr-website/
├── index.html          # Main website (frontend)
├── server.js           # Node.js backend server
├── package.json        # Node.js dependencies
├── .env                # Environment variables (not in repo)
├── .gitignore          # Git ignore rules
├── README.md           # Project documentation
└── LICENSE             # MIT License
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher) — only if running locally
- npm (v6 or higher)
- Namecheap email account (or any SMTP provider)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/bekkr-website.git
   cd bekkr-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   SMTP_HOST=mail.privateemail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@bekkr.co
   SMTP_PASS=your_password
   ADMIN_EMAIL=hello@bekkr.co
   FROM_EMAIL=hello@bekkr.co
   FROM_NAME=Bekkr
   ```

4. **Run the server**
   ```bash
   npm start
   ```

5. **Visit** `http://localhost:3000` in your browser

### Deployment on Render

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Add environment variables (see above)
7. Click **"Create Web Service"**

## 📧 Email Configuration

This project uses **Nodemailer** with **Namecheap SMTP** to send emails:

| Setting | Value |
|---------|-------|
| SMTP Host | `mail.privateemail.com` |
| SMTP Port | `587` |
| Secure | `false` (TLS) |
| Auth | Email address + password |

### Email Templates

Two emails are sent when a contact form is submitted:

1. **Admin Notification** — Sent to `ADMIN_EMAIL`
2. **User Auto-Reply** — Sent to the form submitter

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (587 for TLS) |
| `SMTP_SECURE` | Use SSL (false for TLS) |
| `SMTP_USER` | Email address for SMTP auth |
| `SMTP_PASS` | Email password |
| `ADMIN_EMAIL` | Where admin notifications are sent |
| `FROM_EMAIL` | "From" email address |
| `FROM_NAME` | Display name for sender |

## 🎨 Design

- **Color Palette**: Navy, Teal, and White
- **Typography**: Cormorant Garamond (display), DM Sans (body), DM Mono (monospace)
- **Responsive**: Mobile-first design with graceful degradation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 📬 Contact

- **Email**: [hello@bekkr.co](mailto:hello@bekkr.co)
- **Phone**: [+233 240 827 857](tel:+233240827857)
- **Website**: [bekkr-website.onrender.com](https://bekkr-website.onrender.com)

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) — Web framework
- [Nodemailer](https://nodemailer.com/) — Email sending
- [Render](https://render.com/) — Hosting
- [Google Fonts](https://fonts.google.com/) — Typography

---

**Built with ❤️ for subnational governments across the Global South**