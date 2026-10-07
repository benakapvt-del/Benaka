import { ClinicDatabaseState } from '../types/clinic';

export const INITIAL_CLINIC_DATA: ClinicDatabaseState = {
  clinicInfo: {
    name: 'WeMakeSmile',
    tagline: 'Healthy Teeth. Confident Smiles.',
    type: 'Dental Clinic / Dental Hospital',
    address: '14/B, Lotus Boulevard, 100 Feet Road, Indiranagar',
    landmark: 'Opposite Metro Pillar 114',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    phonePrimary: '+91 80 4952 8800',
    phoneSecondary: '+91 98450 12345',
    emergencyPhone: '+91 98450 99911',
    email: 'care@wemakesmile.com',
    timezone: 'Asia/Kolkata',
    currency: 'INR (₹)',
    announcement: 'Accepting new patients · Walk-in consultations & digital appointments open Monday through Saturday.',
    gstin: '29AAACW1234F1Z8',
    licenseNumber: 'KAR/BLR/DENT/2019/0428'
  },
  workingHours: [
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
    { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
    { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '14:00' }
  ],
  holidays: [
    { id: 'hol-1', date: '2026-10-20', reason: 'Dussehra / Vijayadashami' },
    { id: 'hol-2', date: '2026-11-08', reason: 'Deepavali Festival' },
    { id: 'hol-3', date: '2026-12-25', reason: 'Christmas Day' },
    { id: 'hol-4', date: '2027-01-26', reason: 'Republic Day' }
  ],
  treatments: [
    {
      id: 'trt-consultation',
      name: 'Dental Consultation',
      category: 'Preventive',
      shortDesc: 'Comprehensive oral examination with high-resolution digital X-rays and personalized treatment roadmap.',
      fullDesc: 'Our thorough 30-minute clinical examination evaluates teeth, gums, occlusion, jaw joints, and oral soft tissues. We utilize intraoral high-magnification cameras and digital radiovisiography (RVG) to identify hidden cavities and micro-fractures with 90% less radiation than conventional films.',
      durationMins: 30,
      startingPrice: 500,
      iconName: 'Stethoscope',
      benefits: [
        'Complete 32-tooth digital health mapping',
        'Low-radiation digital RVG sensor X-rays',
        'Early detection of decay, cracks, and periodontal issues',
        'Transparent fee estimates with zero hidden costs'
      ],
      procedureSteps: [
        'Medical history review & chief complaint assessment',
        'High-resolution intraoral camera photography',
        'Digital RVG X-ray scans as clinically indicated',
        'Doctor discussion & tailored care planning'
      ],
      recoveryTime: 'Immediate — no downtime required'
    },
    {
      id: 'trt-cleaning',
      name: 'Teeth Cleaning & Scaling',
      category: 'Preventive',
      shortDesc: 'Gentle ultrasonic scaling to remove stubborn calculus, tartar, and coffee stains, followed by prophy polish.',
      fullDesc: 'Professional prophylaxis targets hardened bacterial tartar that regular brushing cannot eliminate. We use piezoelectric ultrasonic scalers that vibrate calculus away gently without scraping tooth enamel, followed by fine airflow polishing for a smooth, stain-free finish.',
      durationMins: 45,
      startingPrice: 1500,
      iconName: 'Sparkles',
      benefits: [
        'Eliminates bad breath (halitosis) causing bacteria',
        'Prevents gingivitis and bleeding gums',
        'Safe, enamel-preserving ultrasonic technology',
        'Restores natural tooth brightness'
      ],
      procedureSteps: [
        'Plaque and calculus zone identification',
        'Ultrasonic micro-vibration scaling across all quadrants',
        'Subgingival gentle irrigation with antiseptic rinse',
        'Diamond-grit prophylactic paste polishing'
      ],
      recoveryTime: 'None (mild sensitivity for 2-4 hours is normal)'
    },
    {
      id: 'trt-filling',
      name: 'Tooth Filling',
      category: 'Restorative',
      shortDesc: 'Biomimetic nano-hybrid composite fillings that match your exact tooth shade seamlessly.',
      fullDesc: 'We exclusively use 100% mercury-free, high-strength aesthetic composites from 3M and Ivoclar. After removing decayed tooth tissue under magnification, the composite resin is cured with high-intensity LED light, restoring the tooth shape and chewing strength seamlessly.',
      durationMins: 45,
      startingPrice: 1200,
      iconName: 'ShieldCheck',
      benefits: [
        'Natural appearance matching your enamel shade',
        'Conserves maximum healthy natural tooth structure',
        'Strong bonding prevents secondary leakage',
        'Completely mercury-free and bio-compatible'
      ],
      procedureSteps: [
        'Precise decay removal under local anesthesia if needed',
        'Enamel etching and high-affinity dentin bonding',
        'Incremental nano-composite sculpting and LED curing',
        'Occlusal check and high-gloss anatomic polish'
      ],
      recoveryTime: 'Immediate eating allowed after 1 hour'
    },
    {
      id: 'trt-rct',
      name: 'Root Canal Treatment',
      category: 'Restorative',
      shortDesc: 'Painless microscopic root canal therapy in 1–2 comfortable sessions to save deeply infected teeth.',
      fullDesc: 'Root canal therapy relieves excruciating pain and preserves infected teeth that would otherwise require extraction. Using computerized apex locators and rotary nickel-titanium instruments under rubber dam isolation, the inflamed pulp is gently cleared, sanitized, and sealed with biocompatible gutta-percha.',
      durationMins: 60,
      startingPrice: 4500,
      iconName: 'Activity',
      benefits: [
        'Instant relief from severe throbbing toothaches',
        'Saves your natural tooth for lifetime function',
        'Painless treatment under precision local anesthesia',
        'Single-visit options available for suitable cases'
      ],
      procedureSteps: [
        'Profound local anesthesia and tooth isolation with rubber dam',
        'Micro-access opening to reach pulp chambers',
        'Rotary NiTi mechanical cleaning and laser/ultrasonic irrigation',
        'Thermoplasticized gutta-percha 3D hermetic sealing'
      ],
      recoveryTime: 'Mild soreness for 24-48 hours, managed with mild analgesics'
    },
    {
      id: 'trt-extraction',
      name: 'Tooth Extraction',
      category: 'Surgical',
      shortDesc: 'Atraumatic tooth removal and surgical wisdom tooth extractions with gentle anesthesia techniques.',
      fullDesc: 'When a severely broken, impacted, or non-restorable tooth causes repeated infections, atraumatic extraction preserves the surrounding jawbone. Our oral surgeons use periotomes and minimally invasive techniques to ensure smooth healing and minimal swelling.',
      durationMins: 45,
      startingPrice: 1800,
      iconName: 'AlertCircle',
      benefits: [
        'Relief from impacted wisdom tooth crowding and pericoronitis',
        'Bone preservation for future implants or bridges',
        'Pain-managed surgical protocols',
        'Detailed take-home ice pack and medication guidelines'
      ],
      procedureSteps: [
        '3D radiographic assessment of root anatomy and nerve position',
        'Targeted local nerve block anesthesia for complete numbness',
        'Gentle luxation and atraumatic extraction',
        'Socket debridement, sterile gauze compression, and resorbable sutures if needed'
      ],
      recoveryTime: '2 to 4 days for initial soft tissue healing'
    },
    {
      id: 'trt-crowns',
      name: 'Dental Crowns & Bridges',
      category: 'Restorative',
      shortDesc: 'CAD/CAM precision-milled Zirconia and E-max ceramic crowns that look and chew like natural teeth.',
      fullDesc: 'Protect weakened root-canal treated teeth or replace missing teeth with bridge prosthetics. We take optical digital scans without messy putty impressions. High-strength monolithic zirconia offers outstanding longevity and resistance to chipping, contoured to fit your bite perfectly.',
      durationMins: 60,
      startingPrice: 6000,
      iconName: 'Crown',
      benefits: [
        'Monolithic Zirconia & lithium disilicate materials',
        'Digital intraoral 3D scanning — no gagging trays',
        '10 to 15+ years manufacturer warranty against chipping',
        'Seamless color gradation matching adjacent teeth'
      ],
      procedureSteps: [
        'Conservative tooth reduction and margin preparation',
        'High-precision 3D digital optical scan',
        'Temporary crown placement for interim comfort',
        'Permanent crown trial, occlusal adjustment, and resin bonding'
      ],
      recoveryTime: 'Immediate normal chew once permanent crown is cemented'
    },
    {
      id: 'trt-whitening',
      name: 'Teeth Whitening',
      category: 'Cosmetic',
      shortDesc: 'In-office professional dental laser whitening brightening smiles by up to 6–8 shades in a single hour.',
      fullDesc: 'Medical-grade in-office whitening delivers dramatic, uniform brightening without eroding enamel. We apply protective gingival barriers to shield your gums before activating hydrogen peroxide gel with a cool LED accelerator light, followed by mineral desensitizing treatment.',
      durationMins: 60,
      startingPrice: 7500,
      iconName: 'Sun',
      benefits: [
        '6 to 8 shades noticeably brighter in one 60-minute visit',
        'Safe medical supervision protects gums and roots',
        'Long-lasting results with simple home touch-up guidelines',
        'Includes post-whitening enamel re-mineralizing treatment'
      ],
      procedureSteps: [
        'Pre-whitening shade guide measurement & baseline photos',
        'Light-cured gingival barrier application to insulate gums',
        'Three 15-minute cycles of accelerated whitening gel application',
        'Final fluoride desensitizing rinse and maintenance guide'
      ],
      recoveryTime: 'Avoid dark foods (coffee, tea, curry) for 48 hours ("White Diet")'
    },
    {
      id: 'trt-implants',
      name: 'Dental Implants',
      category: 'Surgical',
      shortDesc: 'Gold-standard titanium & zirconia dental implants that replicate natural roots for permanent tooth replacement.',
      fullDesc: 'Dental implants are the most permanent, bone-preserving solution for missing single or multiple teeth. Placed securely into the jawbone using CBCT 3D guided surgical stents, implants osteointegrate over time and support a custom ceramic crown that feels 100% natural.',
      durationMins: 90,
      startingPrice: 28000,
      iconName: 'Anchor',
      benefits: [
        'Prevents facial bone resorption and sunken facial appearance',
        'Does not require cutting down adjacent healthy teeth',
        'Bite strength virtually identical to natural teeth',
        '98%+ clinical success rate with lifetime warranty options'
      ],
      procedureSteps: [
        '3D CBCT bone density scan and digital virtual implant planning',
        'Minimally invasive implant fixture placement in jawbone',
        'Osseointegration healing phase (8-12 weeks)',
        'Custom abutment and permanent screw-retained ceramic crown'
      ],
      recoveryTime: '2 to 3 days for surgical recovery; routine activities next day'
    },
    {
      id: 'trt-orthodontics',
      name: 'Braces & Orthodontics',
      category: 'Cosmetic',
      shortDesc: 'Invisible clear aligners, self-ligating ceramic braces, and conventional orthodontic systems for all ages.',
      fullDesc: 'Straighten crooked teeth, close gaps, and correct open or cross-bites for a symmetrical smile and balanced jaw health. We offer digital 3D smile simulations so you can preview your final results before your first clear aligner tray is fabricated.',
      durationMins: 45,
      startingPrice: 35000,
      iconName: 'Smile',
      benefits: [
        'Clear aligners: Virtually invisible, removable for eating and brushing',
        'Ceramic self-ligating brackets for faster tooth movement',
        '3D digital simulation shows your final smile before starting',
        'Flexible 0% interest monthly installment plans available'
      ],
      procedureSteps: [
        'Full orthodontic diagnostic records (photos, X-rays, 3D scans)',
        'Digital treatment plan & tooth staging simulation',
        'Bracket bonding or delivery of first set of custom aligner trays',
        'Periodic 4-6 week checkups to monitor tooth progression'
      ],
      recoveryTime: 'Mild pressure sensation for 2-3 days after tray or wire changes'
    },
    {
      id: 'trt-pediatric',
      name: 'Pediatric Dentistry',
      category: 'Pediatric',
      shortDesc: 'Warm, fun, and fear-free dental visits designed specifically for toddlers, children, and young teens.',
      fullDesc: 'Our specialized pediatric team knows how to put anxious children at ease. From preventive pit and fissure sealants and topical fluoride varnishes to stainless steel crowns and space maintainers, we make every dental visit a positive, rewarding adventure.',
      durationMins: 45,
      startingPrice: 1200,
      iconName: 'HeartHandshake',
      benefits: [
        'Friendly child-focused communication ("Tell-Show-Do" technique)',
        'Cavity-preventing pit & fissure sealants and fluoride shields',
        'Preventive habit-breaking counseling (thumb sucking, tongue thrust)',
        'Positive reward certificates to build lifelong dental confidence'
      ],
      procedureSteps: [
        'Gentle acclimatization and kid-friendly chair ride',
        'Counting teeth game and soft plaque polish',
        'Topical fluoride gel / varnish application',
        'Parent guidance on nutrition, brushing, and eruption milestones'
      ],
      recoveryTime: 'Immediate — child can play right away'
    },
    {
      id: 'trt-gum',
      name: 'Gum Treatment',
      category: 'Restorative',
      shortDesc: 'Deep scaling, root planing, and gentle diode laser therapy for bleeding gums and periodontitis.',
      fullDesc: 'Healthy gums are the foundation of your teeth. Untreated gingivitis can advance to periodontitis, causing loose teeth and bone loss. We offer deep subgingival ultrasonic curettage, bone grafting, and gentle diode laser decontamination to regenerate healthy pink gums.',
      durationMins: 60,
      startingPrice: 3000,
      iconName: 'Shield',
      benefits: [
        'Halts active gum recession and prevents loose teeth',
        'Eliminates chronic bleeding while brushing or eating',
        'Bacterial decontamination using gentle dental diode lasers',
        'Reduces deep periodontal pocket depths'
      ],
      procedureSteps: [
        'Comprehensive 6-point periodontal pocket depth charting',
        'Deep subgingival scaling and ultrasonic root planing',
        'Laser decontamination of inflamed pocket lining',
        'Antimicrobial gel placement and periodic maintenance schedule'
      ],
      recoveryTime: '1 to 2 days of mild tenderness; warm saline rinses recommended'
    },
    {
      id: 'trt-emergency',
      name: 'Emergency Dental Care',
      category: 'Emergency',
      shortDesc: 'Priority same-day relief for acute throbbing toothaches, fractured teeth, oral trauma, and facial swellings.',
      fullDesc: 'Dental emergencies need swift, experienced attention. We reserve emergency appointment slots every day for acute dental trauma, severe toothache, lost crowns, or bleeding. Our team acts swiftly to stop pain and stabilize the tooth immediately.',
      durationMins: 30,
      startingPrice: 1000,
      iconName: 'Zap',
      benefits: [
        'Same-day priority emergency triage',
        'Immediate pain relief and infection control',
        'Stabilization of knocked-out or fractured teeth',
        'Dedicated emergency helpline on call'
      ],
      procedureSteps: [
        'Immediate triage and diagnostic X-ray',
        'Administration of fast-acting local anesthesia for instant comfort',
        'Emergency pulpotomy, dressing, splinting, or temporary restoration',
        'Prescription of targeted antibiotics and painkillers with review schedule'
      ],
      recoveryTime: 'Immediate pain alleviation; follow-up scheduled within 5 days'
    }
  ],
  doctors: [
    {
      id: 'doc-sharma',
      name: 'Dr. Ananya Sharma',
      title: 'Chief Prosthodontist & Oral Implantologist',
      degrees: 'BDS, MDS (Prosthodontics & Implantology), FICOI (USA)',
      specialization: 'Prosthodontics, Dental Implants & Aesthetic Dentistry',
      experienceYears: 14,
      registrationNumber: 'KDC-14982-A',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      workingHours: { start: '09:30', end: '18:30' },
      bio: 'Dr. Ananya has performed over 3,200 successful dental implant procedures and full-mouth rehabilitations. A fellow of the International Congress of Oral Implantologists, she combines digital surgical guides with artistic tooth aesthetics.',
      treatmentsHandled: ['trt-implants', 'trt-crowns', 'trt-whitening', 'trt-consultation'],
      rating: 4.9,
      totalCases: 3450
    },
    {
      id: 'doc-rao',
      name: 'Dr. Vikram Rao',
      title: 'Senior Endodontist & Micro-Root Canal Specialist',
      degrees: 'BDS, MDS (Conservative Dentistry & Endodontics)',
      specialization: 'Painless Single-Sitting Root Canals & Tooth Preservation',
      experienceYears: 11,
      registrationNumber: 'KDC-18234-A',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      workingHours: { start: '10:00', end: '19:30' },
      bio: 'Known for his gentle touch, Dr. Vikram specializes in microscope-assisted root canals and restorative aesthetics. He believes in conserving maximum natural tooth structure and has treated thousands of patients without pain.',
      treatmentsHandled: ['trt-rct', 'trt-filling', 'trt-emergency', 'trt-consultation'],
      rating: 4.9,
      totalCases: 2890
    },
    {
      id: 'doc-patel',
      name: 'Dr. Priya Patel',
      title: 'Consultant Orthodontist & Dentofacial Orthopedics',
      degrees: 'BDS, MDS (Orthodontics), Certified Clear Aligner Specialist',
      specialization: 'Clear Aligners, Lingual Braces & Jaw Alignment',
      experienceYears: 9,
      registrationNumber: 'KDC-21045-A',
      availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
      workingHours: { start: '11:00', end: '19:00' },
      bio: 'Dr. Priya brings high precision to orthodontic smile design, specializing in invisible aligners and Damon self-ligating braces. She has crafted over 1,400 confident, symmetrical smiles for teenagers and working professionals.',
      treatmentsHandled: ['trt-orthodontics', 'trt-consultation'],
      rating: 4.8,
      totalCases: 1420
    },
    {
      id: 'doc-mehta',
      name: 'Dr. Rahul Mehta',
      title: 'Oral & Maxillofacial Surgeon, Periodontist',
      degrees: 'BDS, MDS (Oral & Maxillofacial Surgery), FDS RCS',
      specialization: 'Wisdom Tooth Surgery, Gum Surgeries & Bone Grafting',
      experienceYears: 13,
      registrationNumber: 'KDC-16472-A',
      availableDays: ['Tue', 'Thu', 'Sat', 'Sun'],
      workingHours: { start: '09:00', end: '17:30' },
      bio: 'Dr. Rahul handles complex third molar impactions, laser gum therapies, and pre-implant bone regenerations. He focuses on fast-healing surgical protocols and traumatic injury rehabilitation.',
      treatmentsHandled: ['trt-extraction', 'trt-gum', 'trt-emergency', 'trt-cleaning', 'trt-consultation'],
      rating: 4.9,
      totalCases: 3100
    },
    {
      id: 'doc-kulkarni',
      name: 'Dr. Sneha Kulkarni',
      title: 'Pediatric Dental Specialist',
      degrees: 'BDS, MDS (Pedodontics & Preventive Dentistry)',
      specialization: 'Child Dental Care, Preventive Therapies & Early Orthodontics',
      experienceYears: 8,
      registrationNumber: 'KDC-23519-A',
      availableDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
      workingHours: { start: '10:00', end: '18:00' },
      bio: 'Dr. Sneha turns dental appointments into a delightful, calm experience for toddlers and children. She is an expert in painless local anesthesia delivery, child psychology, and interceptive orthodontics.',
      treatmentsHandled: ['trt-pediatric', 'trt-cleaning', 'trt-filling', 'trt-consultation'],
      rating: 4.9,
      totalCases: 1980
    }
  ],
  appointments: [
    {
      id: 'WMS-2026-8812',
      patientName: 'Aditya Narayan',
      patientPhone: '+91 98452 77123',
      patientEmail: 'aditya.n@gmail.com',
      patientAge: 32,
      patientGender: 'Male',
      isFirstVisit: false,
      treatmentId: 'trt-cleaning',
      treatmentName: 'Teeth Cleaning & Scaling',
      doctorId: 'doc-sharma',
      doctorName: 'Dr. Ananya Sharma',
      date: '2026-10-06',
      time: '10:30 AM',
      estimatedFee: 1500,
      status: 'confirmed',
      patientNotes: 'Routine 6-month cleaning checkup. Minor coffee stains on lower incisors.',
      doctorNotes: 'Completed ultrasonic scaling, recommended soft interdental brushes.',
      createdAt: '2026-10-05T09:15:00.000Z'
    },
    {
      id: 'WMS-2026-8819',
      patientName: 'Meera Krishnan',
      patientPhone: '+91 97401 54321',
      patientEmail: 'meera.krishnan@outlook.com',
      patientAge: 28,
      patientGender: 'Female',
      isFirstVisit: true,
      treatmentId: 'trt-consultation',
      treatmentName: 'Dental Consultation',
      doctorId: 'doc-patel',
      doctorName: 'Dr. Priya Patel',
      date: '2026-10-06',
      time: '11:45 AM',
      estimatedFee: 500,
      status: 'confirmed',
      patientNotes: 'Inquiring about clear aligners for upper anterior spacing.',
      createdAt: '2026-10-05T14:30:00.000Z'
    },
    {
      id: 'WMS-2026-8824',
      patientName: 'Rohan Deshmukh',
      patientPhone: '+91 99002 88412',
      patientEmail: 'rohan.d@gmail.com',
      patientAge: 45,
      patientGender: 'Male',
      isFirstVisit: false,
      treatmentId: 'trt-rct',
      treatmentName: 'Root Canal Treatment',
      doctorId: 'doc-rao',
      doctorName: 'Dr. Vikram Rao',
      date: '2026-10-06',
      time: '03:00 PM',
      estimatedFee: 4500,
      status: 'confirmed',
      patientNotes: 'Second sitting for molar tooth 36 obturation.',
      doctorNotes: 'Canals dry, obturation planned with bioceramic sealer.',
      createdAt: '2026-10-04T11:20:00.000Z'
    },
    {
      id: 'WMS-2026-8831',
      patientName: 'Kavita Sundaram',
      patientPhone: '+91 98860 11984',
      patientEmail: 'kavita.s@gmail.com',
      patientAge: 39,
      patientGender: 'Female',
      isFirstVisit: true,
      treatmentId: 'trt-whitening',
      treatmentName: 'Teeth Whitening',
      doctorId: 'doc-sharma',
      doctorName: 'Dr. Ananya Sharma',
      date: '2026-10-07',
      time: '04:30 PM',
      estimatedFee: 7500,
      status: 'pending',
      patientNotes: 'Wedding coming up next month; wants bright smile.',
      createdAt: '2026-10-06T08:00:00.000Z'
    },
    {
      id: 'WMS-2026-8837',
      patientName: 'Master Aarav Joshi',
      patientPhone: '+91 94481 66321',
      patientEmail: 'joshi.parents@gmail.com',
      patientAge: 7,
      patientGender: 'Male',
      isFirstVisit: true,
      treatmentId: 'trt-pediatric',
      treatmentName: 'Pediatric Dentistry',
      doctorId: 'doc-kulkarni',
      doctorName: 'Dr. Sneha Kulkarni',
      date: '2026-10-08',
      time: '11:00 AM',
      estimatedFee: 1200,
      status: 'confirmed',
      patientNotes: 'First dental visit. Mother reports small brown spot on lower milk molar.',
      createdAt: '2026-10-06T07:45:00.000Z'
    },
    {
      id: 'WMS-2026-8790',
      patientName: 'Sanjay Hegde',
      patientPhone: '+91 98450 33211',
      patientEmail: 'sanjay.h@gmail.com',
      patientAge: 52,
      patientGender: 'Male',
      isFirstVisit: false,
      treatmentId: 'trt-implants',
      treatmentName: 'Dental Implants',
      doctorId: 'doc-sharma',
      doctorName: 'Dr. Ananya Sharma',
      date: '2026-10-05',
      time: '10:00 AM',
      estimatedFee: 28000,
      status: 'completed',
      patientNotes: 'Single implant placed in tooth 46 site.',
      doctorNotes: 'Implant 4.5x10mm placed with good primary stability (35Ncm). Sutured.',
      createdAt: '2026-10-02T16:00:00.000Z'
    }
  ],
  settings: {
    slotDurationMins: 30,
    bufferBetweenSlotsMins: 15,
    advanceBookingDays: 30,
    autoConfirmEmergency: true,
    notifyEmail: true,
    notifySms: true,
    notificationLogs: [
      {
        id: 'notif-1',
        timestamp: '2026-10-06T08:00:10.000Z',
        type: 'SMS',
        recipient: '+91 98860 11984',
        message: 'WeMakeSmile: Appointment request received for Kavita Sundaram on 07-Oct-2026 at 04:30 PM. Ref: WMS-2026-8831'
      },
      {
        id: 'notif-2',
        timestamp: '2026-10-05T09:15:22.000Z',
        type: 'SMS',
        recipient: '+91 98452 77123',
        message: 'WeMakeSmile: Confirmed! Your appointment with Dr. Ananya Sharma is set for 06-Oct-2026 at 10:30 AM. Address: 14/B Lotus Blvd, Indiranagar. Call 080-49528800 for help.'
      }
    ]
  }
};
