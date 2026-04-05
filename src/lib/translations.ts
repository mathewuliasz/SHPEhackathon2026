export type Lang = "en" | "es";

const translations = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_about: "About Us",
    nav_reviews: "Reviews",
    nav_contact: "Contact Us",
    nav_login: "Log In",
    nav_getStarted: "Get Started",
    nav_backToLogin: "Back to Login",
    nav_bookAppointment: "Book Appointment",
    brand: "SHPE Medical",

    // Landing Hero
    hero_kicker: "Trusted Online Healthcare",
    hero_title_1: "Looking for a ",
    hero_title_accent: "Trusted",
    hero_title_2: " & Secured Online Doctor?",
    hero_text_1: "Welcome to ",
    hero_text_bold: "SHPE HealthCare",
    hero_text_2:
      " connect with licensed medical professionals for virtual consultations from the comfort of your home.",
    hero_bookAppointment: "Book Appointment",
    hero_learnMore: "Learn More",
    hero_virtualSupport: "24/7 Virtual Support",
    hero_doctorCount: "120+",
    hero_doctorLabel: "Certified doctors",
    hero_rating: "4.9/5",
    hero_ratingLabel: "Patient rating",
    hero_responseTime: "15 min",
    hero_responseLabel: "Average response",

    // Services
    services_kicker: "Our Services",
    services_title: "We provide accessible & licensed doctors",
    services_text:
      "Our network of certified professionals is here to support every aspect of your health journey.",
    services_learnMore: "Learn more →",
    service1_title: "Health Plan & Process",
    service1_desc:
      "Personalized health strategies tailored to your lifestyle and long-term goals.",
    service2_title: "Supplemental Benefits",
    service2_desc:
      "Comprehensive benefit packages to support your overall wellbeing and recovery.",
    service3_title: "Healthcare Strategy Experts",
    service3_desc:
      "Expert guidance from certified healthcare planning professionals.",

    // Categories
    categories_kicker: "Browse",
    categories_title: "Categories",
    categories_text: "Browse our full range of healthcare services",
    cat_doctorList: "Doctor List",
    cat_hospitals: "Hospitals",
    cat_departments: "Departments",
    cat_location: "Location",
    cat_disease: "Disease",
    cat_prescriptions: "Prescriptions",

    // Contact band
    contact_eyebrow: "Ready to get started?",
    contact_title: "Speak with a licensed provider today.",
    contact_cta: "Contact Us",

    // Reviews section
    reviews_kicker: "Reviews",
    reviews_title: "What patients are saying",
    reviews_text: "Recent feedback from people using SHPE Health Care.",
    reviews_readAll: "Read All Reviews",
    reviews_starsLabel: "{n} out of 5 stars",

    // Bottom CTAs
    bottom_adviceTitle: "Need more advice?",
    bottom_adviceText:
      "Our care team is standing by to provide guidance for your health questions.",
    bottom_adviceCta: "Get Help",
    bottom_storiesTitle: "Read All About our Success Stories",
    bottom_storiesText:
      "Browse real patient experiences and learn how we've made a difference.",
    bottom_storiesCta: "Read Reviews",

    // Auth page wrapper
    auth_pageKicker: "Secure Access",
    auth_pageTitle:
      "Book your appointment through a calm, secure account flow.",
    auth_pageText:
      "Sign in to manage your care or create an account to schedule your first online consultation with SHPE Health Care.",
    auth_perk1: "Book faster with saved patient details",
    auth_perk2: "Track upcoming appointments and reviews",
    auth_perk3: "Access virtual care updates in one place",
    auth_backHome: "Back Home",

    // Auth
    auth_signIn: "Sign In",
    auth_signUp: "Sign Up",
    auth_welcomeBack: "Welcome back",
    auth_accessDesc:
      "Access your appointments, records, and provider messages.",
    auth_createAccount: "Create your account",
    auth_createDesc:
      "Set up your patient profile to request and manage care.",
    auth_email: "Email Address",
    auth_emailPlaceholder: "you@example.com",
    auth_password: "Password",
    auth_passwordPlaceholder: "Enter your password",
    auth_keepSignedIn: "Keep me signed in",
    auth_forgotPassword: "Forgot password?",
    auth_notMember: "Not a member?",
    auth_signUpLink: "Sign up",
    auth_alreadyMember: "Already a member?",
    auth_signInLink: "Sign in",
    auth_fullName: "Full Name",
    auth_fullNamePlaceholder: "Enter your full name",
    auth_createPassword: "Create Password",
    auth_createPasswordPlaceholder: "Choose a secure password",
    auth_agreeTerms: "I agree to the patient privacy and care terms.",
    auth_createAccountBtn: "Create Account",
    auth_pleaseWait: "Please wait...",
    auth_error: "Something went wrong. Please try again.",

    // Dashboard
    dash_todaySummary: "Today's Summary",
    dash_greeting: "Good morning, {name}",
    dash_summaryText:
      "Here is your health summary for today. Review appointments, messages, prescriptions, and next steps in one place.",
    dash_bookAppointment: "Book Appointment",
    dash_viewReviews: "View Reviews",
    dash_manageAppointments: "Manage Appointments",
    dash_nextCheckIn: "Next Check-In",
    dash_nextCheckInTime: "Tomorrow, 10:00 AM",
    dash_nextCheckInDesc:
      "Internal medicine follow-up with your care team.",
    dash_labResults: "Lab Results",
    dash_updatedToday: "Updated today",
    dash_upcomingAppointments: "Upcoming Appointments",
    dash_nextTomorrow: "Next: Tomorrow 10:00 AM",
    dash_unreadMessages: "Unread Messages",
    dash_fromConsultants: "From 2 consultants",
    dash_pendingReviews: "Pending Reviews",
    dash_shareFeedback: "Share your latest care feedback",
    dash_quickActions: "Quick Actions",
    dash_continueWhereLeft: "Continue where you left off",
    dash_openConsultations: "Open consultations",
    dash_findSpecialist: "Find a specialist",
    dash_findSpecialistDesc:
      "Browse doctors by specialty and compare providers.",
    dash_writeReview: "Write a review",
    dash_writeReviewDesc:
      "Leave feedback after a visit and help other patients.",
    dash_resetAccess: "Reset account access",
    dash_resetAccessDesc:
      "Manage password recovery and security settings.",

    // Dashboard Shell
    shell_openNav: "Open navigation menu",
    shell_closeNav: "Close navigation menu",
    shell_brandMark: "M",
    shell_brandText: "Medical Dashboard",
    shell_searchPlaceholder: "Search patients, prescriptions, records...",
    shell_notifications: "Notifications",

    // Sidebar
    sidebar_dashboard: "Dashboard",
    sidebar_doctors: "Doctor's via Specialty",
    sidebar_consultations: "Your Consultation/Chats",
    sidebar_labResults: "Lab Results",
    sidebar_records: "Medical Records",
    sidebar_profile: "Your Profile",

    // Chatbot
    chatbot_toggle: "Toggle chat",
    chatbot_title: "MediTrack Assistant",
    chatbot_welcome:
      "Hi! I'm your MediTrack assistant. Ask me medical questions or how to find something on the site.",
    chatbot_placeholder: "Ask a question...",
    chatbot_error: "Sorry, something went wrong. Please try again.",

    // Consultations
    consult_title: "Your Consultation/Chats",
    consult_subtitle:
      "Doctors you have visited or have upcoming appointments with",
    consult_emptyTitle: "No consultations yet",
    consult_emptyText:
      "Book an appointment to start chatting with a doctor.",
    consult_noDate: "No date",
    consult_appointment: "appointment",
    consult_appointments: "appointments",
    consult_back: "Back to consultations",
    consult_chatWith: "Chat with",
    consult_at: "at",
    consult_loadingMessages: "Loading messages...",
    consult_noMessages: "No messages yet. Start the conversation.",
    consult_selectAppointment: "Select an appointment to view the conversation.",
    consult_typePlaceholder: "Type a message...",
    consult_sidebarTitle: "Appointments",

    // Prescriptions
    rx_title: "Prescriptions",
    rx_subtitle: "Manage and review your active medications.",
    rx_requestRenewal: "Request Renewal",
    rx_searchPlaceholder: "Search medications or doctors...",
    rx_medication: "Medication",
    rx_dosage: "Dosage",
    rx_startDate: "Start Date",
    rx_endDate: "End Date",
    rx_doctor: "Doctor",
    rx_status: "Status",
    rx_viewDetails: "View Details",
    rx_active: "Active",
    rx_expired: "Expired",
    rx_pending: "Pending",

    // Lab Results
    labResults_title: "Lab Results",
    labResults_subtitle: "View your latest lab test results and trends.",

    // Manage Appointments
    appts_title: "Manage Appointments",
    appts_subtitle: "View, reschedule, or cancel your upcoming appointments.",
    appts_upcoming: "Upcoming",
    appts_past: "Past",
    appts_reschedule: "Reschedule",
    appts_cancel: "Cancel",
    appts_completed: "Completed",
    appts_loading: "Loading appointments...",
    appts_emptyTitle: "No appointments",
    appts_emptyText: "You don't have any scheduled appointments yet.",
    appts_confirmCancel: "Are you sure you want to cancel this appointment?",
    appts_cancelFailed: "Failed to cancel appointment. Please try again.",
    appts_rescheduleFailed: "Failed to reschedule appointment. Please try again.",
    appts_rescheduleTitle: "Reschedule Appointment",
    appts_at: "at",
    appts_selectDate: "Select new date",
    appts_selectTime: "Select new time",
    appts_loadingSlots: "Loading available slots...",
    appts_noSlots: "No available slots found for this doctor.",
    appts_confirmReschedule: "Confirm Reschedule",
    appts_rescheduling: "Rescheduling...",

    // Records
    records_title: "Medical Records",
    records_subtitle: "View and manage your health records.",
    records_upload: "Upload New Record",

    // Dashboard triage card
    dash_triageBadge: "AI-Powered",
    dash_triageTitle: "Not sure which specialist you need?",
    dash_triageText:
      "Describe your symptoms and our AI triage assistant will analyze them and recommend the right type of doctor — then book directly.",
    dash_triageCta: "Start Symptom Check",

    // Records
    records_tabLab: "Lab Results",
    records_tabVisits: "Visit History",
    records_tabUploads: "Uploads",
    records_dragDrop: "Drag & drop files here",
    records_dragDropHint: "PDF screenshots as images, JPG, PNG, or WEBP up to 10MB",
    records_browse: "Browse Files",
    records_scanning: "Scanning...",
    records_scanError: "Could not scan and save this report.",
    records_scanSuccess: "Report scanned and saved to this user account.",
    records_source: "Source:",
    records_empty: "No uploaded records yet. Add a report image to generate a web summary.",

    // Schedule
    schedule_kicker: "Smart Booking Flow",
    schedule_title: "Schedule an Appointment",
    schedule_text:
      "Choose a specialty, review providers, and lock in a visit without jumping between screens.",

    // Step Indicator
    step_chooseSpecialty: "Choose Specialty",
    step_chooseDoctor: "Choose Doctor",
    step_dateTime: "Date & Time",
    step_captionSpecialty: "Select your care type",
    step_captionDoctor: "Pick your provider",
    step_captionDateTime: "Schedule your visit",

    // Specialty Picker
    specialty_title: "Choose a Specialty",
    specialty_text:
      "Start with the type of care you need and we'll narrow the provider list to the right team.",
    specialty_description: "Explore doctors and available visit times.",
    specialty_moreSoon: "More Specialties Soon",
    specialty_moreText:
      "Additional care categories can be added here as the provider network grows.",
    specialty_continue: "Continue →",

    // Doctor Picker
    doctor_title: "Choose a Doctor",
    doctor_text_1: "Providers in ",
    doctor_text_2: " are listed below. Select the doctor you want to schedule with.",
    doctor_searchPlaceholder: "Search by name or keyword...",
    doctor_filterAll: "All",
    doctor_filterAvailable: "Available",
    doctor_filterMale: "Male",
    doctor_filterFemale: "Female",
    doctor_filterSenior: "Senior (10+ yrs)",
    doctor_available: "Available",
    doctor_selectText: "Select this doctor to continue to available visit dates.",
    doctor_viewDates: "View dates →",
    doctor_noDoctors: "No doctors found for this specialty.",
    doctor_noMatch: "No doctors match this search yet.",
    doctor_back: "← Back",
    doctor_continue: "Continue →",

    // Date & Time Picker
    dateTime_title: "Pick a Date & Time",
    dateTime_text_1: "Select an available date and time slot for your appointment with ",
    dateTime_notSelected: "Not selected",
    dateTime_summaryTitle: "Appointment Summary",
    dateTime_labelDoctor: "Doctor",
    dateTime_labelSpecialty: "Specialty",
    dateTime_labelDate: "Date",
    dateTime_labelTime: "Time",
    dateTime_booking: "Booking...",
    dateTime_confirmBooking: "Confirm Booking",
    dateTime_confirmBookingArrow: "Confirm Booking →",
    dateTime_ready: "Ready to confirm your appointment.",
    dateTime_selectPrompt: "Select a date and time to confirm",
    dateTime_back: "← Back",
    dateTime_bookingFailed: "Failed to book appointment. Please try again.",

    // Confirmation
    confirm_title: "Booking Confirmed",
    confirm_text: "Your appointment has been successfully scheduled.",
    confirm_labelSpecialty: "Specialty",
    confirm_labelDoctor: "Doctor",
    confirm_labelDate: "Date",
    confirm_labelTime: "Time",
    confirm_joinZoom: "Join Zoom Meeting",
    confirm_emailNotice: "You should be receiving a confirmation email shortly.",
    confirm_goToChat: "Go to Consultation Chat",
    confirm_backToDashboard: "Back to Dashboard",
    confirm_scheduleAnother: "Schedule Another Appointment",

    // Profile
    profile_title: "Your Profile",
    profile_languageSection: "Language Preference",
    profile_languageText: "Choose your preferred language for the dashboard and all pages.",
    profile_languageSaved: "Language updated.",

    // About page
    about_logIn: "Log In",
    about_getStarted: "Get Started",
    about_heroKicker: "About SHPE Medical",
    about_heroTitle: "Health For Everyone.",
    about_heroText:
      "SHPE Medical is a nonprofit connecting low-income Hispanic households with licensed volunteer doctors. Completely free, bilingual, and from home.",
    about_bookAppointment: "Book Appointment",
    about_bookFreeConsult: "Book Free Consult →",
    about_imADoctor: "I'm a Doctor",
    about_stat1Value: "3,800+",
    about_stat1Label: "Families Served",
    about_stat2Value: "210+",
    about_stat2Label: "Medical Volunteers",
    about_stat3Value: "100%",
    about_stat3Label: "Free of Charge",
    about_stat4Value: "Bilingual",
    about_stat4Label: "Spanish & English Service",
    about_heroQuote: "Health is a human right, not a privilege.",
    about_heroQuoteAttrib: "Founders of SHPE Medical",
    about_storyKicker: "Who We Are",
    about_storyTitle: "Born from necessity, built with heart.",
    about_storyText1:
      "SHPE Medical was founded in 2026 after our co-founders witnessed firsthand how language barriers, fear of deportation, and lack of financial resources left entire families without medical care.",
    about_storyText2:
      "What started as a weekend volunteer clinic in a Houston church basement grew into a national network of over 210 doctors, nurses, and specialists donating their time for free online consultations.",
    about_storyQuote:
      "Health is a human right. No family should have to choose between a doctor and dinner.",
    about_highlight1Title: "501(c)(3) Certified Nonprofit",
    about_highlight1Text:
      "Every dollar donated goes directly to operations, outreach, and keeping every single consultation free of charge.",
    about_highlight2Title: "Fully Bilingual",
    about_highlight2Text:
      "Every consultation, form, follow-up, and support message is available in Spanish and English.",
    about_highlight3Title: "No Insurance Needed",
    about_highlight3Text:
      "Uninsured, undocumented, or underinsured, everyone is welcome. Zero paperwork. Zero judgment. Zero cost.",
    about_audienceKicker: "Who We Serve",
    about_audienceTitle: "Designed for families like yours.",
    about_audienceText:
      "Our services are specifically built for low-income Hispanic households that face systemic barriers to healthcare access.",
    about_audience1: "Low-income Hispanic families",
    about_audience2: "Uninsured individuals",
    about_audience3: "Immigrant and undocumented communities",
    about_audience4: "Spanish-speaking seniors",
    about_audience5: "Mothers and children without pediatric access",
    about_valuesKicker: "Our Values",
    about_valuesTitle: "What Guides Us",
    about_value1Title: "Dignity in Every Visit",
    about_value1Text:
      "Every family regardless of income, insurance status, or immigration background deserves respectful, high-quality medical guidance.",
    about_value2Title: "Culturally Rooted",
    about_value2Text:
      "We bridge language and cultural barriers so Hispanic families feel seen, heard, and trusted. All services are fully bilingual.",
    about_value3Title: "Community First",
    about_value3Text:
      "Built by and for the community. We collaborate with local organizations, churches, and schools to reach those who need us most.",
    about_value4Title: "Volunteer Powered",
    about_value4Text:
      "Licensed physicians, nurses, and specialists donate their expertise to provide free online consultations, changing lives one hour at a time.",
    about_volunteerKicker: "Are you a doctor or specialist?",
    about_volunteerTitle: "Join as a Volunteer",
    about_volunteerText:
      "Doctors, nurses, and specialists sign up to donate online consultations and directly impact families with no other access to care.",
    about_volunteerCta: "Sign Up to Volunteer →",
    about_consultTitle: "Need a Consultation?",
    about_consultText:
      "Book a free online consultation today. No insurance, no fee, no barriers. Available in Spanish and English.",
    about_doctorTitle: "Are You a Doctor or Specialist?",
    about_doctorText:
      "Join our volunteer network. Even one hour a week transforms lives for families with nowhere else to turn. Fully remote.",

    // Reviews page
    reviewsPage_kicker: "Patient Reviews",
    reviewsPage_title: "Here's what our customers have to say.",

    // Forgot/Reset password
    forgot_pageKicker: "Password Help",
    forgot_pageTitle: "Reset access to your account.",
    forgot_pageText:
      "Enter your account email and we'll generate a secure reset link for your password.",
    forgot_formKicker: "Forgot Password",
    forgot_formTitle: "Request reset link",
    forgot_formText:
      "Use your account email to start the password reset process.",
    forgot_sendLink: "Send Reset Link",
    forgot_generating: "Generating...",
    forgot_error: "Could not generate a reset link.",
    forgot_success: "Reset link generated.",

    reset_pageKicker: "Reset Password",
    reset_pageTitle: "Create a new password for your account.",
    reset_pageText:
      "Use the secure reset link to finish updating your account password.",
    reset_formKicker: "New Password",
    reset_formTitle: "Reset password",
    reset_formText: "Create a new password with at least 8 characters.",
    reset_newPassword: "New Password",
    reset_newPasswordPlaceholder: "Choose a secure password",
    reset_confirmPassword: "Confirm Password",
    reset_confirmPlaceholder: "Re-enter your password",
    reset_missingToken: "This reset link is missing a token.",
    reset_noMatch: "Passwords do not match.",
    reset_error: "Could not reset your password.",
    reset_success: "Password updated.",
    reset_submit: "Update Password",
    reset_updating: "Updating...",

    // Language toggle
    lang_english: "English",
    lang_spanish: "Español",

    // Metadata
    meta_title: "SHPE Health Care",
    meta_description: "Online healthcare landing page for SHPE Health Care.",
    meta_scheduleTitle: "Schedule Appointment | MediTrack",

    // Logout
    logout_button: "Log Out",
    logout_signingOut: "Signing out...",
    logout_error: "Could not log out.",

    // Triage
    triage_headerTitle: "Symptom Triage",
    triage_headerSubtitle: "Describe your symptoms to find the right specialist",
    triage_welcome:
      "Hi! I'm your MediTrack triage assistant. Tell me about your symptoms and I'll help you figure out which type of specialist you should see.",
    triage_placeholder: "Describe your symptoms...",
    triage_error: "Sorry, something went wrong. Please try again.",
    triage_urgencyEmergency: "Emergency",
    triage_urgencyHigh: "High Urgency",
    triage_urgencyModerate: "Moderate Urgency",
    triage_urgencyLow: "Low Urgency",
    triage_confidence: "confidence",
    triage_disclaimer:
      "This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation and treatment.",
    triage_bookWith: "Book with",
    triage_startOver: "Start Over",

    // Sidebar (new)
    sidebar_triage: "Symptom Triage",

    // Volunteer page
    vol_brandTag: "Nonprofit",
    vol_navBookAppointment: "Book Appointment",
    vol_navAbout: "About Us",
    vol_navVolunteer: "Volunteer",
    vol_kicker: "Unete · Join Us",
    vol_title: "Volunteer as a Healthcare Professional",
    vol_text:
      "Give back to the community by offering free online consultations to low-income Hispanic families. Your expertise changes lives.",
    vol_benefit1Title: "Flexible Hours",
    vol_benefit1Text: "Volunteer as little as 1 hour/week. Completely on your schedule.",
    vol_benefit2Title: "100% Online",
    vol_benefit2Text: "All consultations are virtual. No travel, no clinic setup needed.",
    vol_benefit3Title: "Real Impact",
    vol_benefit3Text: "Directly help underserved families who would otherwise go without care.",
    vol_benefit4Title: "Coordinated Support",
    vol_benefit4Text: "Our team handles scheduling, translation, and admin. You just show up.",

    // Volunteer form
    volForm_section1: "Personal Information",
    volForm_firstName: "First Name",
    volForm_lastName: "Last Name",
    volForm_email: "Email Address",
    volForm_phone: "Phone Number",
    volForm_section2: "Professional Credentials",
    volForm_license: "Medical License Number",
    volForm_state: "Licensing State",
    volForm_specialty: "Primary Specialty",
    volForm_selectSpecialty: "Select specialty...",
    volForm_experience: "Years of Experience",
    volForm_selectRange: "Select range...",
    volForm_section3: "Availability & Languages",
    volForm_languagesSpoken: "Languages You Speak",
    volForm_whenAvailable: "When Are You Available?",
    volForm_hoursPerMonth: "Hours Available Per Month",
    volForm_selectHours: "Select...",
    volForm_section4: "Why Do You Want to Volunteer?",
    volForm_motivationPlaceholder:
      "Share a bit about your motivation to serve the Hispanic community...",
    volForm_terms:
      "I confirm that I hold a valid medical license and agree to SaludConecta's Volunteer Code of Conduct and Privacy Policy. I understand all consultations are provided on a voluntary, pro bono basis.",
    volForm_submitting: "Submitting...",
    volForm_submit: "Submit Application",
    volForm_success:
      "Application submitted. An admin can now review and approve volunteer access.",
    volForm_error: "Unable to submit application.",

    // Admin
    admin_navAdmin: "Admin",
    admin_kicker: "Admin Review",
    admin_title: "Volunteer Access Approvals",
    admin_text: "Review incoming volunteer applications and approve or reject access.",
    admin_email: "Email:",
    admin_phone: "Phone:",
    admin_license: "License:",
    admin_experience: "Experience:",
    admin_hoursMonth: "Hours/Month:",
    admin_submitted: "Submitted:",
    admin_notProvided: "Not provided",
    admin_languages: "Languages",
    admin_noneSelected: "None selected",
    admin_availability: "Availability",
    admin_motivation: "Motivation",
    admin_noMotivation: "No motivation statement provided.",
    admin_approve: "Approve",
    admin_reject: "Reject",
    admin_empty: "No volunteer applications submitted yet.",
    admin_loadError: "Unable to load volunteer applications.",
    admin_updateError: "Unable to update volunteer application.",
  },

  es: {
    // Navigation
    nav_home: "Inicio",
    nav_about: "Sobre Nosotros",
    nav_reviews: "Reseñas",
    nav_contact: "Contáctanos",
    nav_login: "Iniciar Sesión",
    nav_getStarted: "Comenzar",
    nav_backToLogin: "Volver al Inicio de Sesión",
    nav_bookAppointment: "Agendar Cita",
    brand: "SHPE Medical",

    // Landing Hero
    hero_kicker: "Atención Médica En Línea de Confianza",
    hero_title_1: "¿Buscas un Doctor en Línea ",
    hero_title_accent: "Confiable",
    hero_title_2: " y Seguro?",
    hero_text_1: "Bienvenido a ",
    hero_text_bold: "SHPE HealthCare",
    hero_text_2:
      " conéctate con profesionales médicos licenciados para consultas virtuales desde la comodidad de tu hogar.",
    hero_bookAppointment: "Agendar Cita",
    hero_learnMore: "Más Información",
    hero_virtualSupport: "Soporte Virtual 24/7",
    hero_doctorCount: "120+",
    hero_doctorLabel: "Doctores certificados",
    hero_rating: "4.9/5",
    hero_ratingLabel: "Calificación de pacientes",
    hero_responseTime: "15 min",
    hero_responseLabel: "Tiempo promedio de respuesta",

    // Services
    services_kicker: "Nuestros Servicios",
    services_title: "Ofrecemos doctores accesibles y licenciados",
    services_text:
      "Nuestra red de profesionales certificados está aquí para apoyar cada aspecto de tu salud.",
    services_learnMore: "Más información →",
    service1_title: "Plan y Proceso de Salud",
    service1_desc:
      "Estrategias de salud personalizadas adaptadas a tu estilo de vida y metas a largo plazo.",
    service2_title: "Beneficios Complementarios",
    service2_desc:
      "Paquetes de beneficios integrales para apoyar tu bienestar general y recuperación.",
    service3_title: "Expertos en Estrategia de Salud",
    service3_desc:
      "Orientación experta de profesionales certificados en planificación de salud.",

    // Categories
    categories_kicker: "Explorar",
    categories_title: "Categorías",
    categories_text: "Explora nuestra gama completa de servicios de salud",
    cat_doctorList: "Lista de Doctores",
    cat_hospitals: "Hospitales",
    cat_departments: "Departamentos",
    cat_location: "Ubicación",
    cat_disease: "Enfermedades",
    cat_prescriptions: "Recetas",

    // Contact band
    contact_eyebrow: "¿Listo para comenzar?",
    contact_title: "Habla con un proveedor licenciado hoy.",
    contact_cta: "Contáctanos",

    // Reviews section
    reviews_kicker: "Reseñas",
    reviews_title: "Lo que dicen nuestros pacientes",
    reviews_text:
      "Comentarios recientes de personas que usan SHPE Health Care.",
    reviews_readAll: "Ver Todas las Reseñas",
    reviews_starsLabel: "{n} de 5 estrellas",

    // Bottom CTAs
    bottom_adviceTitle: "¿Necesitas más orientación?",
    bottom_adviceText:
      "Nuestro equipo de atención está listo para brindarte orientación sobre tus preguntas de salud.",
    bottom_adviceCta: "Obtener Ayuda",
    bottom_storiesTitle: "Lee Todas Nuestras Historias de Éxito",
    bottom_storiesText:
      "Explora experiencias reales de pacientes y descubre cómo hemos hecho la diferencia.",
    bottom_storiesCta: "Ver Reseñas",

    // Auth page wrapper
    auth_pageKicker: "Acceso Seguro",
    auth_pageTitle:
      "Agenda tu cita a través de un flujo de cuenta seguro y sencillo.",
    auth_pageText:
      "Inicia sesión para gestionar tu atención o crea una cuenta para programar tu primera consulta en línea con SHPE Health Care.",
    auth_perk1: "Agenda más rápido con datos de paciente guardados",
    auth_perk2: "Sigue tus citas y reseñas próximas",
    auth_perk3: "Accede a actualizaciones de atención virtual en un solo lugar",
    auth_backHome: "Volver al Inicio",

    // Auth
    auth_signIn: "Iniciar Sesión",
    auth_signUp: "Registrarse",
    auth_welcomeBack: "Bienvenido de nuevo",
    auth_accessDesc:
      "Accede a tus citas, expedientes y mensajes de proveedores.",
    auth_createAccount: "Crea tu cuenta",
    auth_createDesc:
      "Configura tu perfil de paciente para solicitar y gestionar atención.",
    auth_email: "Correo Electrónico",
    auth_emailPlaceholder: "tu@ejemplo.com",
    auth_password: "Contraseña",
    auth_passwordPlaceholder: "Ingresa tu contraseña",
    auth_keepSignedIn: "Mantener sesión iniciada",
    auth_forgotPassword: "¿Olvidaste tu contraseña?",
    auth_notMember: "¿No eres miembro?",
    auth_signUpLink: "Regístrate",
    auth_alreadyMember: "¿Ya eres miembro?",
    auth_signInLink: "Inicia sesión",
    auth_fullName: "Nombre Completo",
    auth_fullNamePlaceholder: "Ingresa tu nombre completo",
    auth_createPassword: "Crear Contraseña",
    auth_createPasswordPlaceholder: "Elige una contraseña segura",
    auth_agreeTerms:
      "Acepto los términos de privacidad y atención al paciente.",
    auth_createAccountBtn: "Crear Cuenta",
    auth_pleaseWait: "Por favor espera...",
    auth_error: "Algo salió mal. Por favor intenta de nuevo.",

    // Dashboard
    dash_todaySummary: "Resumen del Día",
    dash_greeting: "Buenos días, {name}",
    dash_summaryText:
      "Aquí está tu resumen de salud de hoy. Revisa citas, mensajes, recetas y próximos pasos en un solo lugar.",
    dash_bookAppointment: "Agendar Cita",
    dash_viewReviews: "Ver Reseñas",
    dash_manageAppointments: "Administrar Citas",
    dash_nextCheckIn: "Próxima Consulta",
    dash_nextCheckInTime: "Mañana, 10:00 AM",
    dash_nextCheckInDesc:
      "Seguimiento de medicina interna con tu equipo de atención.",
    dash_labResults: "Resultados de Laboratorio",
    dash_updatedToday: "Actualizado hoy",
    dash_upcomingAppointments: "Próximas Citas",
    dash_nextTomorrow: "Siguiente: Mañana 10:00 AM",
    dash_unreadMessages: "Mensajes No Leídos",
    dash_fromConsultants: "De 2 consultores",
    dash_pendingReviews: "Reseñas Pendientes",
    dash_shareFeedback: "Comparte tu opinión sobre la atención recibida",
    dash_quickActions: "Acciones Rápidas",
    dash_continueWhereLeft: "Continúa donde lo dejaste",
    dash_openConsultations: "Abrir consultas",
    dash_findSpecialist: "Buscar un especialista",
    dash_findSpecialistDesc:
      "Explora doctores por especialidad y compara proveedores.",
    dash_writeReview: "Escribir una reseña",
    dash_writeReviewDesc:
      "Deja comentarios después de una visita y ayuda a otros pacientes.",
    dash_resetAccess: "Restablecer acceso a la cuenta",
    dash_resetAccessDesc:
      "Administra la recuperación de contraseña y configuración de seguridad.",

    // Dashboard Shell
    shell_openNav: "Abrir menú de navegación",
    shell_closeNav: "Cerrar menú de navegación",
    shell_brandMark: "M",
    shell_brandText: "Panel Médico",
    shell_searchPlaceholder: "Buscar pacientes, recetas, expedientes...",
    shell_notifications: "Notificaciones",

    // Sidebar
    sidebar_dashboard: "Panel Principal",
    sidebar_doctors: "Doctores por Especialidad",
    sidebar_consultations: "Tus Consultas/Chats",
    sidebar_labResults: "Resultados de Laboratorio",
    sidebar_records: "Expedientes Médicos",
    sidebar_profile: "Tu Perfil",

    // Chatbot
    chatbot_toggle: "Abrir/cerrar chat",
    chatbot_title: "Asistente MediTrack",
    chatbot_welcome:
      "¡Hola! Soy tu asistente de MediTrack. Pregúntame sobre temas médicos o cómo encontrar algo en el sitio.",
    chatbot_placeholder: "Haz una pregunta...",
    chatbot_error:
      "Lo sentimos, algo salió mal. Por favor intenta de nuevo.",

    // Consultations
    consult_title: "Tus Consultas/Chats",
    consult_subtitle:
      "Doctores que has visitado o con los que tienes citas próximas",
    consult_emptyTitle: "Aún no hay consultas",
    consult_emptyText:
      "Agenda una cita para comenzar a chatear con un doctor.",
    consult_noDate: "Sin fecha",
    consult_appointment: "cita",
    consult_appointments: "citas",
    consult_back: "Volver a consultas",
    consult_chatWith: "Chat con",
    consult_at: "a las",
    consult_loadingMessages: "Cargando mensajes...",
    consult_noMessages: "Aún no hay mensajes. Inicia la conversación.",
    consult_selectAppointment:
      "Selecciona una cita para ver la conversación.",
    consult_typePlaceholder: "Escribe un mensaje...",
    consult_sidebarTitle: "Citas",

    // Prescriptions
    rx_title: "Recetas",
    rx_subtitle: "Administra y revisa tus medicamentos activos.",
    rx_requestRenewal: "Solicitar Renovación",
    rx_searchPlaceholder: "Buscar medicamentos o doctores...",
    rx_medication: "Medicamento",
    rx_dosage: "Dosis",
    rx_startDate: "Fecha de Inicio",
    rx_endDate: "Fecha de Fin",
    rx_doctor: "Doctor",
    rx_status: "Estado",
    rx_viewDetails: "Ver Detalles",
    rx_active: "Activo",
    rx_expired: "Expirado",
    rx_pending: "Pendiente",

    // Dashboard triage card
    dash_triageBadge: "IA Integrada",
    dash_triageTitle: "¿No sabes qué especialista necesitas?",
    dash_triageText:
      "Describe tus síntomas y nuestro asistente de triaje con IA los analizará y te recomendará el tipo de doctor adecuado — luego agenda directamente.",
    dash_triageCta: "Iniciar Revisión de Síntomas",

    // Lab Results
    labResults_title: "Resultados de Laboratorio",
    labResults_subtitle: "Consulta tus resultados de laboratorio más recientes.",

    // Manage Appointments
    appts_title: "Administrar Citas",
    appts_subtitle: "Consulta, reprograma o cancela tus próximas citas.",
    appts_upcoming: "Próximas",
    appts_past: "Pasadas",
    appts_reschedule: "Reprogramar",
    appts_cancel: "Cancelar",
    appts_completed: "Completada",
    appts_loading: "Cargando citas...",
    appts_emptyTitle: "Sin citas",
    appts_emptyText: "Aún no tienes citas programadas.",
    appts_confirmCancel: "¿Estás seguro de que deseas cancelar esta cita?",
    appts_cancelFailed: "No se pudo cancelar la cita. Inténtalo de nuevo.",
    appts_rescheduleFailed: "No se pudo reprogramar la cita. Inténtalo de nuevo.",
    appts_rescheduleTitle: "Reprogramar Cita",
    appts_at: "a las",
    appts_selectDate: "Selecciona nueva fecha",
    appts_selectTime: "Selecciona nueva hora",
    appts_loadingSlots: "Cargando horarios disponibles...",
    appts_noSlots: "No se encontraron horarios disponibles para este doctor.",
    appts_confirmReschedule: "Confirmar Reprogramación",
    appts_rescheduling: "Reprogramando...",

    // Records
    records_title: "Expedientes Médicos",
    records_subtitle: "Consulta y administra tus expedientes de salud.",
    records_upload: "Subir Nuevo Expediente",
    records_tabLab: "Resultados de Laboratorio",
    records_tabVisits: "Historial de Visitas",
    records_tabUploads: "Subidos",
    records_dragDrop: "Arrastra y suelta archivos aquí",
    records_dragDropHint: "Capturas de PDF como imágenes, JPG, PNG o WEBP hasta 10MB",
    records_browse: "Explorar Archivos",
    records_scanning: "Escaneando...",
    records_scanError: "No se pudo escanear y guardar este informe.",
    records_scanSuccess: "Informe escaneado y guardado en esta cuenta de usuario.",
    records_source: "Fuente:",
    records_empty: "Aún no hay expedientes subidos. Agrega una imagen de informe para generar un resumen web.",

    // Schedule
    schedule_kicker: "Reserva Inteligente",
    schedule_title: "Agendar una Cita",
    schedule_text:
      "Elige una especialidad, revisa proveedores y confirma tu visita sin cambiar de pantalla.",

    // Step Indicator
    step_chooseSpecialty: "Elegir Especialidad",
    step_chooseDoctor: "Elegir Doctor",
    step_dateTime: "Fecha y Hora",
    step_captionSpecialty: "Selecciona tu tipo de atención",
    step_captionDoctor: "Elige tu proveedor",
    step_captionDateTime: "Programa tu visita",

    // Specialty Picker
    specialty_title: "Elige una Especialidad",
    specialty_text:
      "Comienza con el tipo de atención que necesitas y reduciremos la lista de proveedores al equipo adecuado.",
    specialty_description: "Explora doctores y horarios disponibles.",
    specialty_moreSoon: "Más Especialidades Pronto",
    specialty_moreText:
      "Se pueden agregar categorías de atención adicionales aquí a medida que crece la red de proveedores.",
    specialty_continue: "Continuar →",

    // Doctor Picker
    doctor_title: "Elige un Doctor",
    doctor_text_1: "Los proveedores en ",
    doctor_text_2: " se muestran a continuación. Selecciona el doctor con el que deseas agendar.",
    doctor_searchPlaceholder: "Buscar por nombre o palabra clave...",
    doctor_filterAll: "Todos",
    doctor_filterAvailable: "Disponibles",
    doctor_filterMale: "Hombres",
    doctor_filterFemale: "Mujeres",
    doctor_filterSenior: "Senior (10+ años)",
    doctor_available: "Disponible",
    doctor_selectText: "Selecciona este doctor para ver las fechas disponibles.",
    doctor_viewDates: "Ver fechas →",
    doctor_noDoctors: "No se encontraron doctores para esta especialidad.",
    doctor_noMatch: "Ningún doctor coincide con esta búsqueda aún.",
    doctor_back: "← Atrás",
    doctor_continue: "Continuar →",

    // Date & Time Picker
    dateTime_title: "Elige Fecha y Hora",
    dateTime_text_1: "Selecciona una fecha y horario disponible para tu cita con ",
    dateTime_notSelected: "No seleccionado",
    dateTime_summaryTitle: "Resumen de la Cita",
    dateTime_labelDoctor: "Doctor",
    dateTime_labelSpecialty: "Especialidad",
    dateTime_labelDate: "Fecha",
    dateTime_labelTime: "Hora",
    dateTime_booking: "Reservando...",
    dateTime_confirmBooking: "Confirmar Reserva",
    dateTime_confirmBookingArrow: "Confirmar Reserva →",
    dateTime_ready: "Listo para confirmar tu cita.",
    dateTime_selectPrompt: "Selecciona una fecha y hora para confirmar",
    dateTime_back: "← Atrás",
    dateTime_bookingFailed: "No se pudo agendar la cita. Por favor intenta de nuevo.",

    // Confirmation
    confirm_title: "Reserva Confirmada",
    confirm_text: "Tu cita ha sido agendada exitosamente.",
    confirm_labelSpecialty: "Especialidad",
    confirm_labelDoctor: "Doctor",
    confirm_labelDate: "Fecha",
    confirm_labelTime: "Hora",
    confirm_joinZoom: "Unirse a la Reunión de Zoom",
    confirm_emailNotice: "Deberías recibir un correo de confirmación en breve.",
    confirm_goToChat: "Ir al Chat de Consulta",
    confirm_backToDashboard: "Volver al Panel",
    confirm_scheduleAnother: "Agendar Otra Cita",

    // Profile
    profile_title: "Tu Perfil",
    profile_languageSection: "Preferencia de Idioma",
    profile_languageText: "Elige tu idioma preferido para el panel y todas las páginas.",
    profile_languageSaved: "Idioma actualizado.",

    // About page
    about_logIn: "Iniciar Sesión",
    about_getStarted: "Comenzar",
    about_heroKicker: "Sobre SHPE Medical",
    about_heroTitle: "Salud Para Todos.",
    about_heroText:
      "SHPE Medical es una organización sin fines de lucro que conecta hogares hispanos de bajos ingresos con doctores voluntarios licenciados. Completamente gratis, bilingüe y desde casa.",
    about_bookAppointment: "Agendar Cita",
    about_bookFreeConsult: "Consulta Gratis →",
    about_imADoctor: "Soy Doctor",
    about_stat1Value: "3,800+",
    about_stat1Label: "Familias Atendidas",
    about_stat2Value: "210+",
    about_stat2Label: "Voluntarios Médicos",
    about_stat3Value: "100%",
    about_stat3Label: "Sin Costo Alguno",
    about_stat4Value: "Bilingüe",
    about_stat4Label: "Servicio en Español e Inglés",
    about_heroQuote: "La salud es un derecho humano, no un privilegio.",
    about_heroQuoteAttrib: "Fundadores de SHPE Medical",
    about_storyKicker: "Quiénes Somos",
    about_storyTitle: "Nacido de la necesidad, construido con corazón.",
    about_storyText1:
      "SHPE Medical fue fundado en 2026 después de que nuestros cofundadores presenciaron de primera mano cómo las barreras del idioma, el miedo a la deportación y la falta de recursos financieros dejaron a familias enteras sin atención médica.",
    about_storyText2:
      "Lo que comenzó como una clínica voluntaria de fin de semana en el sótano de una iglesia en Houston creció hasta convertirse en una red nacional de más de 210 doctores, enfermeras y especialistas que donan su tiempo para consultas gratuitas en línea.",
    about_storyQuote:
      "La salud es un derecho humano. Ninguna familia debería tener que elegir entre un doctor y la cena.",
    about_highlight1Title: "Organización 501(c)(3) Certificada",
    about_highlight1Text:
      "Cada dólar donado va directamente a operaciones, alcance comunitario y a mantener cada consulta completamente gratuita.",
    about_highlight2Title: "Completamente Bilingüe",
    about_highlight2Text:
      "Cada consulta, formulario, seguimiento y mensaje de apoyo está disponible en español e inglés.",
    about_highlight3Title: "Sin Seguro Médico Necesario",
    about_highlight3Text:
      "Sin seguro, indocumentados o con seguro insuficiente, todos son bienvenidos. Sin papeleo. Sin juicio. Sin costo.",
    about_audienceKicker: "A Quién Servimos",
    about_audienceTitle: "Diseñado para familias como la tuya.",
    about_audienceText:
      "Nuestros servicios están diseñados específicamente para hogares hispanos de bajos ingresos que enfrentan barreras sistémicas para acceder a la atención médica.",
    about_audience1: "Familias hispanas de bajos ingresos",
    about_audience2: "Personas sin seguro médico",
    about_audience3: "Comunidades inmigrantes e indocumentadas",
    about_audience4: "Adultos mayores hispanohablantes",
    about_audience5: "Madres y niños sin acceso a pediatría",
    about_valuesKicker: "Nuestros Valores",
    about_valuesTitle: "Lo Que Nos Guía",
    about_value1Title: "Dignidad en Cada Visita",
    about_value1Text:
      "Cada familia sin importar ingresos, estatus de seguro o antecedentes migratorios merece orientación médica respetuosa y de alta calidad.",
    about_value2Title: "Raíces Culturales",
    about_value2Text:
      "Eliminamos las barreras del idioma y la cultura para que las familias hispanas se sientan vistas, escuchadas y confiadas. Todos los servicios son completamente bilingües.",
    about_value3Title: "Comunidad Primero",
    about_value3Text:
      "Construido por y para la comunidad. Colaboramos con organizaciones locales, iglesias y escuelas para llegar a quienes más nos necesitan.",
    about_value4Title: "Impulsado por Voluntarios",
    about_value4Text:
      "Médicos, enfermeras y especialistas licenciados donan su experiencia para brindar consultas gratuitas en línea, cambiando vidas una hora a la vez.",
    about_volunteerKicker: "¿Eres doctor o especialista?",
    about_volunteerTitle: "Únete como Voluntario",
    about_volunteerText:
      "Doctores, enfermeras y especialistas se inscriben para donar consultas en línea e impactar directamente a familias sin otro acceso a atención médica.",
    about_volunteerCta: "Regístrate como Voluntario →",
    about_consultTitle: "¿Necesitas una Consulta?",
    about_consultText:
      "Agenda una consulta gratuita en línea hoy. Sin seguro, sin costo, sin barreras. Disponible en español e inglés.",
    about_doctorTitle: "¿Eres Doctor o Especialista?",
    about_doctorText:
      "Únete a nuestra red de voluntarios. Incluso una hora a la semana transforma vidas para familias sin otro lugar a donde acudir. Totalmente remoto.",

    // Reviews page
    reviewsPage_kicker: "Reseñas de Pacientes",
    reviewsPage_title: "Esto es lo que dicen nuestros pacientes.",

    // Forgot/Reset password
    forgot_pageKicker: "Ayuda con Contraseña",
    forgot_pageTitle: "Restablece el acceso a tu cuenta.",
    forgot_pageText:
      "Ingresa el correo de tu cuenta y generaremos un enlace seguro para restablecer tu contraseña.",
    forgot_formKicker: "Olvidé mi Contraseña",
    forgot_formTitle: "Solicitar enlace de restablecimiento",
    forgot_formText:
      "Usa el correo de tu cuenta para iniciar el proceso de restablecimiento.",
    forgot_sendLink: "Enviar Enlace",
    forgot_generating: "Generando...",
    forgot_error: "No se pudo generar un enlace de restablecimiento.",
    forgot_success: "Enlace de restablecimiento generado.",

    reset_pageKicker: "Restablecer Contraseña",
    reset_pageTitle: "Crea una nueva contraseña para tu cuenta.",
    reset_pageText:
      "Usa el enlace seguro para terminar de actualizar la contraseña de tu cuenta.",
    reset_formKicker: "Nueva Contraseña",
    reset_formTitle: "Restablecer contraseña",
    reset_formText:
      "Crea una nueva contraseña con al menos 8 caracteres.",
    reset_newPassword: "Nueva Contraseña",
    reset_newPasswordPlaceholder: "Elige una contraseña segura",
    reset_confirmPassword: "Confirmar Contraseña",
    reset_confirmPlaceholder: "Vuelve a ingresar tu contraseña",
    reset_missingToken: "Este enlace de restablecimiento no tiene un token.",
    reset_noMatch: "Las contraseñas no coinciden.",
    reset_error: "No se pudo restablecer tu contraseña.",
    reset_success: "Contraseña actualizada.",
    reset_submit: "Actualizar Contraseña",
    reset_updating: "Actualizando...",

    // Language toggle
    lang_english: "English",
    lang_spanish: "Español",

    // Metadata
    meta_title: "SHPE Health Care",
    meta_description:
      "Página de atención médica en línea de SHPE Health Care.",
    meta_scheduleTitle: "Agendar Cita | MediTrack",

    // Logout
    logout_button: "Cerrar Sesión",
    logout_signingOut: "Cerrando sesión...",
    logout_error: "No se pudo cerrar sesión.",

    // Triage
    triage_headerTitle: "Triaje de Síntomas",
    triage_headerSubtitle: "Describe tus síntomas para encontrar al especialista adecuado",
    triage_welcome:
      "¡Hola! Soy tu asistente de triaje de MediTrack. Cuéntame tus síntomas y te ayudaré a determinar qué tipo de especialista deberías ver.",
    triage_placeholder: "Describe tus síntomas...",
    triage_error: "Lo sentimos, algo salió mal. Por favor intenta de nuevo.",
    triage_urgencyEmergency: "Emergencia",
    triage_urgencyHigh: "Urgencia Alta",
    triage_urgencyModerate: "Urgencia Moderada",
    triage_urgencyLow: "Urgencia Baja",
    triage_confidence: "confianza",
    triage_disclaimer:
      "Esto no es un diagnóstico médico. Por favor consulta a un profesional de la salud para una evaluación y tratamiento adecuados.",
    triage_bookWith: "Agendar con",
    triage_startOver: "Empezar de Nuevo",

    // Sidebar (new)
    sidebar_triage: "Triaje de Síntomas",

    // Volunteer page
    vol_brandTag: "Sin Fines de Lucro",
    vol_navBookAppointment: "Agendar Cita",
    vol_navAbout: "Sobre Nosotros",
    vol_navVolunteer: "Voluntariado",
    vol_kicker: "Únete · Join Us",
    vol_title: "Sé Voluntario como Profesional de la Salud",
    vol_text:
      "Devuélvele a la comunidad ofreciendo consultas gratuitas en línea a familias hispanas de bajos ingresos. Tu experiencia cambia vidas.",
    vol_benefit1Title: "Horarios Flexibles",
    vol_benefit1Text: "Sé voluntario tan solo 1 hora/semana. Completamente a tu horario.",
    vol_benefit2Title: "100% En Línea",
    vol_benefit2Text: "Todas las consultas son virtuales. Sin viajes, sin configuración de clínica.",
    vol_benefit3Title: "Impacto Real",
    vol_benefit3Text: "Ayuda directamente a familias desatendidas que de otro modo no recibirían atención.",
    vol_benefit4Title: "Apoyo Coordinado",
    vol_benefit4Text: "Nuestro equipo se encarga de la programación, traducción y administración. Tú solo asistes.",

    // Volunteer form
    volForm_section1: "Información Personal",
    volForm_firstName: "Nombre",
    volForm_lastName: "Apellido",
    volForm_email: "Correo Electrónico",
    volForm_phone: "Número de Teléfono",
    volForm_section2: "Credenciales Profesionales",
    volForm_license: "Número de Licencia Médica",
    volForm_state: "Estado de Licencia",
    volForm_specialty: "Especialidad Principal",
    volForm_selectSpecialty: "Seleccionar especialidad...",
    volForm_experience: "Años de Experiencia",
    volForm_selectRange: "Seleccionar rango...",
    volForm_section3: "Disponibilidad e Idiomas",
    volForm_languagesSpoken: "Idiomas que Hablas",
    volForm_whenAvailable: "¿Cuándo Estás Disponible?",
    volForm_hoursPerMonth: "Horas Disponibles al Mes",
    volForm_selectHours: "Seleccionar...",
    volForm_section4: "¿Por Qué Quieres Ser Voluntario?",
    volForm_motivationPlaceholder:
      "Comparte un poco sobre tu motivación para servir a la comunidad hispana...",
    volForm_terms:
      "Confirmo que poseo una licencia médica válida y acepto el Código de Conducta de Voluntarios y la Política de Privacidad de SaludConecta. Entiendo que todas las consultas se brindan de forma voluntaria y pro bono.",
    volForm_submitting: "Enviando...",
    volForm_submit: "Enviar Solicitud",
    volForm_success:
      "Solicitud enviada. Un administrador puede ahora revisar y aprobar el acceso de voluntario.",
    volForm_error: "No se pudo enviar la solicitud.",

    // Admin
    admin_navAdmin: "Admin",
    admin_kicker: "Revisión de Admin",
    admin_title: "Aprobaciones de Acceso de Voluntarios",
    admin_text: "Revisa las solicitudes de voluntarios entrantes y aprueba o rechaza el acceso.",
    admin_email: "Correo:",
    admin_phone: "Teléfono:",
    admin_license: "Licencia:",
    admin_experience: "Experiencia:",
    admin_hoursMonth: "Horas/Mes:",
    admin_submitted: "Enviada:",
    admin_notProvided: "No proporcionado",
    admin_languages: "Idiomas",
    admin_noneSelected: "Ninguno seleccionado",
    admin_availability: "Disponibilidad",
    admin_motivation: "Motivación",
    admin_noMotivation: "No se proporcionó declaración de motivación.",
    admin_approve: "Aprobar",
    admin_reject: "Rechazar",
    admin_empty: "Aún no se han enviado solicitudes de voluntarios.",
    admin_loadError: "No se pudieron cargar las solicitudes de voluntarios.",
    admin_updateError: "No se pudo actualizar la solicitud de voluntario.",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key] ?? translations.en[key] ?? key;
}

export default translations;
