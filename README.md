# WeMakeSmile — Dental Clinic & Hospital Website

A professional, modern, fully functional dental healthcare platform and appointment management system built for **WeMakeSmile Dental Clinic & Hospital** (Bengaluru, India).

---

## 🌟 Key Features

### 🦷 Patient-Facing Clinic Platform
- **Brand Identity**: Clean, trustworthy medical visual language using pure white and calming dental teal.
- **Hero Presentation**: Prominently features the headline *"Healthy Teeth. Confident Smiles."* and supporting healthcare copy.
- **12 Dental Treatments**:
  1. Dental Consultation (Digital RVG X-rays)
  2. Teeth Cleaning & Scaling (Ultrasonic scaling & polish)
  3. Tooth Filling (Biomimetic nano-hybrid composites)
  4. Root Canal Treatment (Microscopic single-sitting rotary endodontics)
  5. Tooth Extraction (Atraumatic & surgical wisdom removal)
  6. Dental Crowns & Bridges (CAD/CAM Zirconia & E-max)
  7. Teeth Whitening (In-office LED laser acceleration)
  8. Dental Implants (Titanium & Zirconia 3D guided surgery)
  9. Braces & Orthodontics (Clear aligners & ceramic braces)
  10. Pediatric Dentistry (Child-friendly preventive dentistry)
  11. Gum Treatment (Laser decontamination & deep root planing)
  12. Emergency Dental Care (Same-day acute pain relief)
- **Procedure Modals ("Learn More")**: Detailed breakdowns with clinical steps, benefits, recovery times, and transparent pricing in Indian Rupees (INR ₹).
- **Specialist Medical Directory**: Verified profiles of university-accredited MDS specialists with registration numbers, experience, and bios.
- **Clinical Standards**: Showcases 6-stage hospital autoclave sterilization, painless anesthesia, 100% digital workflows, and transparent pricing.

### 📅 6-Step Appointment Booking System
- Branded: **Book Your Appointment at WeMakeSmile**
- **Step 1**: Choose Treatment
- **Step 2**: Select Specialist Doctor
- **Step 3**: Pick Consultation Date (14-day interactive calendar with holiday detection)
- **Step 4**: Select Available Time Slot (Dynamic slots computed based on doctor duty hours and real booking collisions)
- **Step 5**: Patient Details (Full Name, 10-digit Indian Mobile, Email, Age, Gender, First-Visit toggle, Chief Complaint notes)
- **Step 6**: Review & Confirm
- **Instant Booking Confirmation**:
  - Displays: *"Your appointment with WeMakeSmile has been successfully booked."*
  - Shows Appointment ID (e.g. `WMS-2026-XXXX`), Doctor, Treatment, Date, Time, Clinic Address, and Helpline numbers.
  - One-click Google Calendar integration and printable receipt.
  - Secure patient appointment self-lookup using Appointment ID + registered Phone number.

### 🛡️ Owner Admin Dashboard
- Branded: **WeMakeSmile — Owner Dashboard**
- Restricted to authorized clinic administration (`owner@wemakesmile.com` / passcode: `smile2026`).
- **Appointments Management**: Segmented tabs for *Today's*, *Upcoming*, *Pending*, *Confirmed*, *Completed*, and *Cancelled* appointments.
- **Patient Case Details**: Full contact details, medical complaints, status transitions, doctor clinical notes, and rescheduling.
- **Interactive Calendar Schedule**: Weekly appointment matrix by doctor.
- **Doctor Directory Management**: Add/edit consulting doctors, degrees, council registrations, and duty hours.
- **Treatment & Fee Editor**: Modify treatment fees in INR (₹), procedure durations, and clinical descriptions.
- **Operating Hours & Scheduled Holidays**: Configure weekday opening/closing times and clinic closed festival dates.
- **Website Content Management**: Update top announcement banner, addresses, telephone numbers, and GSTIN/Licenses.
- **Notification Logs**: Simulated audit stream of outgoing SMS and Email patient booking dispatches.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, tsx
- **Build Tool**: Vite
- **Data Storage**: File-backed persistent database (`data/wemakesmile_db.json`)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/YOUR_USERNAME/wemakesmile-clinic.git
cd wemakesmile-clinic
npm install
```

### 2. Development Mode
Run the full-stack server (Express API + Vite frontend) on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Production Build
To create a production-ready build:
```bash
npm run build
npm start
```

---

## 🔑 Administrative Access

To access the private **WeMakeSmile — Owner Dashboard**:
1. Click **"Owner Portal"** in the top navigation bar or the footer link.
2. Enter the administrator credentials:
   - **Email**: `owner@wemakesmile.com`
   - **Passcode**: `smile2026` (or set custom via environment variable `OWNER_PASSWORD`)

---

## 🌐 Deployment Options

### Option 1: GitHub Pages (Two Easy Ways)

#### Method A: Instant Static Deployment via `/docs` (Easiest — No Actions Needed)
The repository includes a pre-built production website in the `/docs` folder:
1. Push this project to your GitHub repository on the `main` branch.
2. In your repository on GitHub, click **Settings** (top tab) > **Pages** (left menu).
3. Under **Build and deployment** > **Source**, keep **"Deploy from a branch"**.
4. Under **Branch**:
   - Choose **`main`**
   - In the dropdown next to it, select **`/docs`** (instead of `/ (root)`)
   - Click **Save**.
5. Your website will be live in 30 seconds at `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`!

#### Method B: Automated Deployment via GitHub Actions
The repository also includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. That's it! GitHub Actions will automatically install, build, and deploy the latest website whenever you push code.

### Option 2: Deploy on Vercel / Netlify
1. Import repository on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Option 3: Full-Stack Deploy on Render / Railway
If you want the Node.js Express server running persistently:
1. Connect repository on [Render](https://render.com) or [Railway](https://railway.app).
2. Build Command: `npm install && npm run build`
3. Start Command: `npm run dev` (or `node server.js`)
4. Port: `3000`

---

## 📂 Project Directory Structure

```text
├── data/
│   └── wemakesmile_db.json     # Persistent JSON database
├── src/
│   ├── assets/images/          # High-resolution clinic photography
│   ├── components/
│   │   ├── OwnerDashboard/     # Owner admin console & auth modal
│   │   ├── BookingSystem.tsx   # 6-step appointment booking wizard
│   │   ├── BookingConfirmation.tsx # Post-booking summary & calendar
│   │   ├── ClinicFeatures.tsx  # Hospital sterility & painless care
│   │   ├── DoctorsSection.tsx  # MDS dental specialist directory
│   │   ├── Footer.tsx          # Clinic address, hours, legal info
│   │   ├── Hero.tsx            # Headline & value proposition
│   │   ├── Navbar.tsx          # Top bar navigation
│   │   ├── PatientLookupModal.tsx # Privacy-protected booking lookup
│   │   ├── ServiceModal.tsx    # Treatment deep-dive modal
│   │   └── ServicesSection.tsx # 12 dental treatments grid
│   ├── data/
│   │   └── initialData.ts      # Initial clinic data & seeds
│   ├── services/
│   │   └── api.ts              # API client methods
│   ├── types/
│   │   └── clinic.ts           # TypeScript interfaces
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global typography & Tailwind styles
│   └── main.tsx                # React DOM entry point
├── server.ts                   # Express API server & Vite integration
├── index.html                  # HTML entry point with metadata
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 📄 License
This project is licensed under the Apache 2.0 License.
