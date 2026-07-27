import { useState, useEffect } from 'react';
import {
  Building2, UserCircle, Phone, Mail, MapPin, Calendar,
  Stethoscope, Users, CreditCard, Pill, Activity, Shield,
  Utensils, HeartPulse, Droplet, Sparkles, CheckCircle,
  ArrowRight, ArrowLeft, Save, Hospital, Languages, Check,
  ThumbsUp, Newspaper, UsersRound, Briefcase, UserCog, FileText, MoreHorizontal, Plus, X,
  Eye, EyeOff, LogOut, Loader2, XCircle, Pencil
} from 'lucide-react';
import { ProgressSteps } from './components/ProgressSteps';
import { EmojiRating } from './components/EmojiRating';
import { StarRating } from './components/StarRating';
import { ThreeStateToggle } from './components/ThreeStateToggle';
import { FeedbackCard } from './components/FeedbackCard';
import { SelectableCard } from './components/SelectableCard';
import { PageTitle } from './components/PageTitle';
import { AdminDashboard } from './components/AdminDashboard';
import { HospitalSelection } from './components/HospitalSelection';
import { WelcomePage } from './components/WelcomePage';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';

interface PatientInfo {
  uhid: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  mobile: string;
  mobileOtpSent: boolean;
  mobileOtp: string;
  mobileVerified: boolean;
  email: string;
  emailOtpSent: boolean;
  emailOtp: string;
  emailVerified: boolean;
  city: string;
  state: string;
  country: string;
  pincode: string;
  address: string;
  visitType: 'OP' | 'IP' | '';
  opNo: string;
  opDate: Date | null;
  ipNo: string;
  ipDate: Date | null;
  admissionDate: Date | null;
  dischargeDate: Date | null;
}

interface FeedbackRatings {
  reception: number;
  admission: number;
  billing: number;
  doctor: number;
  nursing: number;
  pharmacy: number;
  lab: number;
  insurance: number;
  food: number;
  physiotherapy: number;
  bloodBank: number;
  cleanliness: number;
  overall: number;
}

interface Question {
  id: string;
  category: string;
  label: string;
  tamilLabel: string;
  ratingMode: string;
  backgroundColor: string;
}

interface YesNoQuestions {
  cleanlinessIssue: boolean | null;
  cleanlinessIssueDetails: string;
  costExplained: boolean | null;
  costExplainedDetails: string;
  wouldRecommend: boolean | null;
  wouldRecommendDetails: string;
}

interface Appreciation {
  id: number;
  name: string;
  department: string;
  note: string;
}

interface WhyChooseUs {
  selfDecision: boolean;
  advertisement: boolean;
  friendsRelatives: boolean;
  corporate: boolean;
  employee: boolean;
  referralDoctor: boolean;
  others: boolean;
}

interface BrandingSettings {
  logo: string;
  hospitalName: string;
  address: string;
  contactNumber: string;
  email: string;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  
  // Hospital Selection state
  interface SelectedHospital {
    id: number;
    name: string;
    logo: string | null;
    address: string | null;
    contactNumber: string | null;
  }
  const [selectedHospital, setSelectedHospital] = useState<SelectedHospital | null>(null);
  
  const [branding, setBranding] = useState<BrandingSettings>({
    logo: '',
    hospitalName: 'Apollo Healthcare Center',
    address: '123 Health Street, Chennai - 600001',
    contactNumber: '+91 44 1234 5678',
    email: 'contact@apollo.com'
  });
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');

  // Pincode auto-fill state
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeValid, setPincodeValid] = useState<boolean | null>(null);
  const [flashFields, setFlashFields] = useState<string[]>([]);

  // Location search state
  const [locationSearch, setLocationSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSelected, setSearchSelected] = useState(false);
  const [showFilledBadge, setShowFilledBadge] = useState(false);

  // Pincode mapping data - expanded
  const pincodeData: Record<string, { city: string; state: string; country: string }> = {
    '600001': { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    '600002': { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    '641001': { city: 'Coimbatore', state: 'Tamil Nadu', country: 'India' },
    '625001': { city: 'Madurai', state: 'Tamil Nadu', country: 'India' },
    '636001': { city: 'Salem', state: 'Tamil Nadu', country: 'India' },
    '620001': { city: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India' },
    '627001': { city: 'Tirunelveli', state: 'Tamil Nadu', country: 'India' },
    '638001': { city: 'Erode', state: 'Tamil Nadu', country: 'India' },
    '632001': { city: 'Vellore', state: 'Tamil Nadu', country: 'India' },
    '613001': { city: 'Thanjavur', state: 'Tamil Nadu', country: 'India' },
    '624001': { city: 'Dindigul', state: 'Tamil Nadu', country: 'India' },
    '631001': { city: 'Kanchipuram', state: 'Tamil Nadu', country: 'India' },
    '639001': { city: 'Karur', state: 'Tamil Nadu', country: 'India' },
    '607001': { city: 'Cuddalore', state: 'Tamil Nadu', country: 'India' },
    '628001': { city: 'Thoothukudi', state: 'Tamil Nadu', country: 'India' },
    '637001': { city: 'Namakkal', state: 'Tamil Nadu', country: 'India' },
    '635109': { city: 'Hosur', state: 'Tamil Nadu', country: 'India' },
    '629001': { city: 'Nagercoil', state: 'Tamil Nadu', country: 'India' },
    '626001': { city: 'Virudhunagar', state: 'Tamil Nadu', country: 'India' },
    '110001': { city: 'New Delhi', state: 'Delhi', country: 'India' },
    '400001': { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    '560001': { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
    '500001': { city: 'Hyderabad', state: 'Telangana', country: 'India' },
    '700001': { city: 'Kolkata', state: 'West Bengal', country: 'India' },
  };

  // City to State mapping for reverse lookup
  const cityStateMap: Record<string, string> = {
    'Chennai': 'Tamil Nadu',
    'Coimbatore': 'Tamil Nadu',
    'Madurai': 'Tamil Nadu',
    'Tiruchirappalli': 'Tamil Nadu',
    'Tirunelveli': 'Tamil Nadu',
    'Erode': 'Tamil Nadu',
    'Vellore': 'Tamil Nadu',
    'Thanjavur': 'Tamil Nadu',
    'Dindigul': 'Tamil Nadu',
    'Kanchipuram': 'Tamil Nadu',
    'Delhi': 'Delhi',
    'Mumbai': 'Maharashtra',
    'Pune': 'Maharashtra',
    'Bangalore': 'Karnataka',
    'Hyderabad': 'Telangana',
    'Kolkata': 'West Bengal',
    'Jaipur': 'Rajasthan',
    'Ahmedabad': 'Gujarat',
  };

  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    uhid: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    mobile: '',
    mobileOtpSent: false,
    mobileOtp: '',
    mobileVerified: false,
    email: '',
    emailOtpSent: false,
    emailOtp: '',
    emailVerified: false,
    city: '',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '',
    address: '',
    visitType: '',
    opNo: '',
    opDate: null,
    ipNo: '',
    ipDate: null,
    admissionDate: null,
    dischargeDate: null,
  });

  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUs>({
    selfDecision: false,
    advertisement: false,
    friendsRelatives: false,
    corporate: false,
    employee: false,
    referralDoctor: false,
    others: false,
  });

  const [ratings, setRatings] = useState<FeedbackRatings>({
    reception: 0,
    admission: 0,
    billing: 0,
    doctor: 0,
    nursing: 0,
    pharmacy: 0,
    lab: 0,
    insurance: 0,
    food: 0,
    physiotherapy: 0,
    bloodBank: 0,
    cleanliness: 0,
    overall: 0,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [dynamicRatings, setDynamicRatings] = useState<Record<string, number>>({});

  const [fetchedYesNoQuestions, setFetchedYesNoQuestions] = useState<any[]>([]);
  const [dynamicYesNo, setDynamicYesNo] = useState<Record<string, { answer: boolean | null, remarks: string }>>({});

  const [layoutMode, setLayoutMode] = useState<'2-column' | '1-column'>('2-column');
  const [combinePages, setCombinePages] = useState<boolean>(false);
  const [themeColor, setThemeColor] = useState<string>('#0d9488');
  const [fontSize, setFontSize] = useState<string>('Normal');
  const [showPageTitleLabels, setShowPageTitleLabels] = useState<boolean>(true);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hospitalId = urlParams.get('hospital_id') || '1';
    
    const isBackend = window.location.pathname.includes('backend/admin');
    const apiUrl = isBackend 
      ? `../ajax/get-questions.php?hospital_id=${hospitalId}` 
      : `../backend/ajax/get-questions.php?hospital_id=${hospitalId}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.data) {
            setQuestions(data.data);
            const initialRatings: Record<string, number> = {};
            data.data.forEach((q: Question) => {
              initialRatings[q.id] = 0;
            });
            setDynamicRatings(initialRatings);
          }
          if (data.yesno_data) {
            setFetchedYesNoQuestions(data.yesno_data);
            const initialYesNo: Record<string, { answer: boolean | null, remarks: string }> = {};
            data.yesno_data.forEach((yq: any) => {
              initialYesNo[yq.id] = { answer: null, remarks: '' };
            });
            setDynamicYesNo(initialYesNo);
          }
          if (data.settings) {
            setLayoutMode(data.settings.layoutMode);
            setCombinePages(data.settings.combinePages);
            if (data.settings.themeColor) setThemeColor(data.settings.themeColor);
            if (data.settings.fontSize) setFontSize(data.settings.fontSize);
            if (data.settings.showPageTitleLabels !== undefined) setShowPageTitleLabels(data.settings.showPageTitleLabels);
            if (data.settings.departments) setDepartments(data.settings.departments);
          }
          if (data.hospital) {
            setBranding({
              logo: data.hospital.logoUrl || '',
              hospitalName: data.hospital.hospitalName || 'Healthcare Center',
              address: data.hospital.address || '',
              contactNumber: data.hospital.contactNumber || '',
              email: data.hospital.email || ''
            });
          }
        }
      })
      .catch(console.error);
  }, []);

  const [suggestions, setSuggestions] = useState('');
  const [appreciations, setAppreciations] = useState<Appreciation[]>([
    { id: 1, name: '', department: '', note: '' }
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const allSteps = [
    { id: 'hospital', title: 'Select Hospital', tamilTitle: 'மருத்துவமனையைத் தேர்ந்தெடுக்கவும்' },
    { id: 'welcome', title: 'Welcome', tamilTitle: 'வரவேற்கிறோம்' },
    { id: 'patient', title: 'Patient Information', tamilTitle: 'நோயாளி தகவல்' },
    { id: 'service', title: combinePages ? 'Feedback & Questions' : 'Service Feedback', tamilTitle: combinePages ? 'கருத்து & கேள்விகள்' : 'சேவை கருத்து' },
    { id: 'questions', title: 'Questionary Page', tamilTitle: 'கேள்வி பக்கம்' },
    { id: 'review', title: 'Review & Submit', tamilTitle: 'மதிப்பாய்வு' },
  ];

  const steps = combinePages ? allSteps.filter(s => s.id !== 'questions') : allSteps;

  const tamilNaduCities = [
    'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli',
    'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Dindigul',
    'Kanchipuram', 'Karur', 'Cuddalore', 'Thoothukudi', 'Namakkal',
    'Hosur', 'Nagercoil', 'Sivakasi', 'Pollachi', 'Virudhunagar',
    'Tiruppur', 'Rajapalayam', 'Kumbakonam', 'Krishnagiri', 'Pudukkottai',
    'Ariyalur', 'Perambalur', 'Dharmapuri', 'Villupuram', 'Tiruvannamalai',
  ];
  const otherCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];
  const states = ['Tamil Nadu', 'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'West Bengal', 'Gujarat', 'Rajasthan', 'Kerala'];
  const countries = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Singapore', 'UAE'];

  const handleSendMobileOtp = () => {
    // Mock send OTP
    setPatientInfo({ ...patientInfo, mobileOtpSent: true, mobileOtp: '111111' });
    toast.success(language === 'en' ? 'OTP sent to mobile!' : 'OTP அனுப்பப்பட்டது!');
  };

  const handleVerifyMobile = () => {
    // Mock OTP verification
    if (patientInfo.mobileOtp.length === 6) {
      setPatientInfo({ ...patientInfo, mobileVerified: true });
      toast.success(language === 'en' ? 'Mobile verified!' : 'தொலைபேசி சரிபார்க்கப்பட்டது!');
    } else {
      toast.error(language === 'en' ? 'Please enter 6-digit OTP' : '6 இலக்க OTP உள்ளிடவும்');
    }
  };

  const handleSendEmailOtp = () => {
    // Mock send OTP
    setPatientInfo({ ...patientInfo, emailOtpSent: true, emailOtp: '111111' });
    toast.success(language === 'en' ? 'OTP sent to email!' : 'OTP அனுப்பப்பட்டது!');
  };

  const handleVerifyEmail = () => {
    // Mock email verification
    if (patientInfo.emailOtp.length === 6) {
      setPatientInfo({ ...patientInfo, emailVerified: true });
      toast.success(language === 'en' ? 'Email verified!' : 'மின்னஞ்சல் சரிபார்க்கப்பட்டது!');
    } else {
      toast.error(language === 'en' ? 'Please enter 6-digit OTP' : '6 இலக்க OTP உள்ளிடவும்');
    }
  };

  const addAppreciation = () => {
    const newId = appreciations.length > 0 ? Math.max(...appreciations.map(a => a.id)) + 1 : 1;
    setAppreciations([...appreciations, { id: newId, name: '', department: '', note: '' }]);
  };

  const removeAppreciation = (id: number) => {
    setAppreciations(appreciations.filter(a => a.id !== id));
  };

  const updateAppreciation = (id: number, field: keyof Appreciation, value: string) => {
    setAppreciations(appreciations.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleUhidBlur = async () => {
    if (!patientInfo.uhid) return;
    const urlParams = new URLSearchParams(window.location.search);
    const hospitalId = urlParams.get('hospital_id') || '1';
    try {
      const res = await fetch(`../backend/ajax/get-patient.php?uhid=${encodeURIComponent(patientInfo.uhid)}&hospital_id=${hospitalId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setPatientInfo(prev => ({
          ...prev,
          firstName: data.data.firstName || prev.firstName,
          lastName: data.data.lastName || prev.lastName,
          age: data.data.age || prev.age,
          gender: data.data.gender || prev.gender,
          mobile: data.data.mobile || prev.mobile,
          email: data.data.email || prev.email,
          address: data.data.address || prev.address,
          pincode: data.data.pincode || prev.pincode,
          city: data.data.city || prev.city,
          state: data.data.state || prev.state,
          country: data.data.country || prev.country
        }));
        toast.success(language === 'en' ? 'Patient details auto-filled' : 'நோயாளி விவரங்கள் தானாக நிரப்பப்பட்டன');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    // Step 0: Hospital selection
    if (currentStep === 0) {
      if (!selectedHospital) {
        toast.error(language === 'en' ? 'Please select a hospital to continue' : 'தொடர்ந்து செல்ல மருத்துவமனையைத் தேர்ந்தெடுக்கவும்');
        return;
      }
    }
    // Step 1: Welcome page (just proceed)
    if (currentStep === 1) {
      // Welcome page just shows hospital info, no validation needed
    }
    // Step 2: Patient Information
    if (currentStep === 2) {
      if (!patientInfo.mobileVerified || (patientInfo.email && !patientInfo.emailVerified)) {
        toast.error(language === 'en' ? 'Please verify contact details to continue' : 'தொடர தொடர்பு விவரங்களை சரிபார்க்கவும்');
        return;
      }
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHospitalSelect = (hospital: any) => {
    setSelectedHospital(hospital);
    
    // Update branding based on selected hospital
    setBranding({
      logo: hospital.logo || '',
      hospitalName: hospital.name || 'Hospital',
      address: hospital.address || '',
      contactNumber: hospital.contactNumber || '',
      email: ''
    });
    
    toast.success(language === 'en' ? `${hospital.name} selected` : `${hospital.name} தேர்ந்தெடுக்கப்பட்டது`);
  };

  const handleSubmit = () => {
    try {
      const formData = new FormData();
      
      // Get hospital_id from selected hospital or URL
      const hospitalId = selectedHospital?.id || new URLSearchParams(window.location.search).get('hospital_id') || '1';
      formData.append('hospital_id', hospitalId);
      formData.append('feedback_form_id', '1');
      
      // Patient Info
      formData.append('uhid', patientInfo.uhid);
      formData.append('first_name', patientInfo.firstName);
      formData.append('last_name', patientInfo.lastName);
      formData.append('age', patientInfo.age);
      formData.append('gender', patientInfo.gender);
      formData.append('mobile_number', patientInfo.mobile);
      formData.append('email', patientInfo.email);
      formData.append('address', patientInfo.address);
      formData.append('pincode', patientInfo.pincode);
      formData.append('city', patientInfo.city);
      formData.append('state', patientInfo.state);
      formData.append('country', patientInfo.country);
      formData.append('visit_type', patientInfo.visitType || 'OP');
      formData.append('visit_uhid', patientInfo.opNo || patientInfo.ipNo || '');
      
      if (patientInfo.admissionDate) {
        formData.append('admission_date', patientInfo.admissionDate.toISOString().split('T')[0]);
      }
      if (patientInfo.dischargeDate) {
        formData.append('discharge_date', patientInfo.dischargeDate.toISOString().split('T')[0]);
      }

      // Ratings
      formData.append('rating_reception', ratings.reception.toString());
      formData.append('rating_admission', ratings.admission.toString());
      formData.append('rating_billing', ratings.billing.toString());
      formData.append('rating_doctor', ratings.doctor.toString());
      formData.append('rating_nursing', ratings.nursing.toString());
      formData.append('rating_pharmacy', ratings.pharmacy.toString());
      formData.append('rating_lab_scan', ratings.lab.toString());
      formData.append('rating_insurance', ratings.insurance.toString());
      formData.append('rating_food', ratings.food.toString());
      formData.append('rating_physiotherapy', ratings.physiotherapy.toString());
      formData.append('rating_blood_bank', ratings.bloodBank.toString());
      formData.append('rating_cleanliness', ratings.cleanliness.toString());
      formData.append('rating_overall', ratings.overall.toString());

      // Dynamic Ratings
      Object.keys(dynamicRatings).forEach(qId => {
        formData.append(`rating_q_${qId}`, dynamicRatings[qId].toString());
      });

      // Dynamic Yes/No Questions
      Object.keys(dynamicYesNo).forEach(yqId => {
        if (dynamicYesNo[yqId].answer !== null) {
          formData.append(`yesno_q_${yqId}`, dynamicYesNo[yqId].answer ? 'Yes' : 'No');
          formData.append(`yesno_q_${yqId}_text`, dynamicYesNo[yqId].remarks);
        }
      });

      // Other fields
      formData.append('suggestions', suggestions);
      formData.append('signature_confirmed', '1');

      // Create a form element to submit
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '../backend/process/submit-feedback.php';
      
      for (const [key, value] of formData.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      }
      
      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit feedback');
    }
  };

  const handleAdminLogin = async () => {
    setAdminLoginError('');
    try {
      const response = await fetch('../backend/ajax/login-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminUsername,
          password: adminPassword,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        window.location.href = '../backend/admin/dashboard.php';
      } else {
        setAdminLoginError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      setAdminLoginError('Connection error. Please try again.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdminDashboard(false);
    setAdminUsername('');
    setAdminPassword('');
    setAdminLoginError('');
  };

  // Handle pincode change with auto-fill
  const handlePincodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setPatientInfo({ ...patientInfo, pincode: numericValue });

    if (numericValue.length > 0 && numericValue.length < 6) {
      setPincodeLoading(true);
      setPincodeValid(null);
    } else if (numericValue.length === 6) {
      setPincodeLoading(false);
      const data = pincodeData[numericValue];
      if (data) {
        setPincodeValid(true);
        setPatientInfo({
          ...patientInfo,
          pincode: numericValue,
          city: data.city,
          state: data.state,
          country: data.country,
        });
        // Flash animation
        setFlashFields(['city', 'state', 'country']);
        setTimeout(() => setFlashFields([]), 500);
      } else {
        setPincodeValid(false);
      }
    } else {
      setPincodeLoading(false);
      setPincodeValid(null);
    }
  };

  // Handle state change with city filter
  const handleStateChange = (value: string) => {
    setPatientInfo({
      ...patientInfo,
      state: value,
      country: 'India',
      city: '', // Reset city when state changes
    });
    setFlashFields(['country']);
    setTimeout(() => setFlashFields([]), 500);
  };

  // Handle city change with state auto-fill
  const handleCityChange = (value: string) => {
    const state = cityStateMap[value] || patientInfo.state;
    setPatientInfo({
      ...patientInfo,
      city: value,
      state: state,
      country: 'India',
    });
    if (cityStateMap[value]) {
      setFlashFields(['state', 'country']);
      setTimeout(() => setFlashFields([]), 500);
    }
  };

  // Handle country change
  const handleCountryChange = (value: string) => {
    setPatientInfo({
      ...patientInfo,
      country: value,
      state: value === 'India' ? 'Tamil Nadu' : '',
      city: '',
    });
  };

  // Handle location search
  const handleLocationSearch = (value: string) => {
    setLocationSearch(value);
    setSearchSelected(false);
    setShowSuggestions(value.length > 0);
  };

  // Get filtered suggestions based on search
  const getFilteredSuggestions = () => {
    if (!locationSearch) return [];

    const searchLower = locationSearch.toLowerCase();
    const suggestions: Array<{ city: string; state: string; country: string; pincode: string }> = [];

    Object.entries(pincodeData).forEach(([pincode, data]) => {
      if (
        data.city.toLowerCase().includes(searchLower) ||
        data.state.toLowerCase().includes(searchLower) ||
        pincode.includes(searchLower)
      ) {
        suggestions.push({ ...data, pincode });
      }
    });

    // Remove duplicates based on city
    const unique = suggestions.filter((item, index, self) =>
      index === self.findIndex((t) => t.city === item.city)
    );

    return unique.slice(0, 10);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: { city: string; state: string; country: string; pincode: string }) => {
    setLocationSearch(`${suggestion.city}, ${suggestion.state}, ${suggestion.country}`);
    setSearchSelected(true);
    setShowSuggestions(false);

    // Auto-fill fields
    setPatientInfo({
      ...patientInfo,
      country: suggestion.country,
      state: suggestion.state,
      city: suggestion.city,
      pincode: suggestion.pincode,
    });

    // Staggered flash animation with checkmarks
    setTimeout(() => setFlashFields(['country']), 0);
    setTimeout(() => setFlashFields(['country', 'state']), 100);
    setTimeout(() => setFlashFields(['country', 'state', 'city']), 200);
    setTimeout(() => setFlashFields(['country', 'state', 'city', 'pincode']), 300);
    setTimeout(() => setFlashFields([]), 2000);

    // Show filled badge
    setShowFilledBadge(true);
    setTimeout(() => setShowFilledBadge(false), 2000);
  };

  const isDashboardPage = window.location.pathname.includes('dashboard.php');

  // Show Admin Dashboard if authenticated or if on dashboard page
  if (isDashboardPage || (showAdminDashboard && isAdminLoggedIn)) {
    return (
      <AdminDashboard
        onClose={() => {
          if (isDashboardPage) {
            window.location.href = '../../frontend/index.php';
          } else {
            setShowAdminDashboard(false);
          }
        }}
        onLogout={() => {
          if (isDashboardPage) {
            window.location.href = 'logout.php';
          } else {
            handleAdminLogout();
          }
        }}
        onBrandingUpdate={setBranding}
        currentBranding={branding}
      />
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Thank You!' : 'நன்றி!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'en'
              ? 'Your feedback has been submitted successfully. We appreciate your time and will use your input to improve our services.'
              : 'உங்கள் கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. உங்கள் நேரத்திற்கு நன்றி.'}
          </p>
          <button
            onClick={() => {
              setShowSuccess(false);
              setCurrentStep(0);
              // Reset form data
              setPatientInfo({
                uhid: '',
                firstName: '',
                lastName: '',
                age: '',
                gender: '',
                mobile: '',
                mobileOtpSent: false,
                mobileOtp: '',
                mobileVerified: false,
                email: '',
                emailOtpSent: false,
                emailOtp: '',
                emailVerified: false,
                city: '',
                state: 'Tamil Nadu',
                country: 'India',
                pincode: '',
                address: '',
                visitType: '',
                opNo: '',
                opDate: null,
                ipNo: '',
                ipDate: null,
                admissionDate: null,
                dischargeDate: null,
              });
              setWhyChooseUs({
                selfDecision: false,
                advertisement: false,
                friendsRelatives: false,
                corporate: false,
                employee: false,
                referralDoctor: false,
                others: false,
              });
              setRatings({
                reception: 0,
                admission: 0,
                billing: 0,
                doctor: 0,
                nursing: 0,
                pharmacy: 0,
                lab: 0,
                insurance: 0,
                food: 0,
                physiotherapy: 0,
                bloodBank: 0,
                cleanliness: 0,
                overall: 0,
              });
              const resetYesNo: Record<string, { answer: boolean | null, remarks: string }> = {};
              fetchedYesNoQuestions.forEach(yq => { resetYesNo[yq.id] = { answer: null, remarks: '' }; });
              setDynamicYesNo(resetYesNo);
              setSuggestions('');
              setAppreciations([{ id: 1, name: '', department: '', note: '' }]);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            {language === 'en' ? 'Back to Patient Feedback Form' : 'நோயாளி கருத்து படிவத்திற்கு திரும்பு'}
          </button>
        </div>
      </div>
    );
  }

  const getFontSizeClass = () => {
    switch(fontSize) {
      case 'Small': return 'text-sm';
      case 'Large': return 'text-lg';
      case 'Extra Large': return 'text-xl';
      default: return 'text-base';
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-white ${getFontSizeClass()}`}>
      <style>{`
        :root {
          --primary-color: ${themeColor};
        }
        .bg-teal-600 { background-color: var(--primary-color) !important; }
        .bg-teal-500 { background-color: var(--primary-color) !important; opacity: 0.9; }
        .text-teal-600 { color: var(--primary-color) !important; }
        .text-teal-700 { color: var(--primary-color) !important; filter: brightness(0.9); }
        .border-teal-500, .border-teal-600 { border-color: var(--primary-color) !important; }
        .focus\\:ring-teal-500:focus { --tw-ring-color: var(--primary-color) !important; }
      `}</style>
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                {branding.logo ? (
                  <img src={branding.logo} alt="Hospital Logo" className="w-full h-full object-contain" />
                ) : (
                  <Hospital className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {branding.hospitalName}
                </h1>
                <p className="text-sm text-gray-600">
                  {branding.address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAdminLoggedIn ? (
                <>
                  <button
                    onClick={() => setShowAdminDashboard(true)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                  >
                    Admin Panel
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAdminLoginModal(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Admin
                </button>
              )}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    language === 'en'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('ta')}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    language === 'ta'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Patient Feedback Form' : 'நோயாளி கருத்து படிவம்'}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {language === 'en'
              ? 'Your feedback helps us improve our services'
              : 'உங்கள் கருத்து எங்கள் சேவைகளை மேம்படுத்த உதவுகிறது'}
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps 
          currentStep={currentStep} 
          steps={steps} 
          onStepClick={(index) => setCurrentStep(index)}
        />

        {/* Step 0: Hospital Selection */}
        {currentStep === 0 && (
          <div>
            {showPageTitleLabels && (
              <PageTitle
                title={language === 'en' ? 'Select Hospital' : 'மருத்துவமனையைத் தேர்ந்தெடுக்கவும்'}
                subtitle={language === 'en' ? 'Step 1 of 5' : 'படி 1 / 5'}
              />
            )}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <HospitalSelection
                selectedHospitalId={selectedHospital?.id || null}
                onHospitalSelect={handleHospitalSelect}
                language={language}
              />
            </div>
          </div>
        )}

        {/* Step 1: Welcome Page */}
        {currentStep === 1 && selectedHospital && (
          <WelcomePage
            hospital={selectedHospital}
            language={language}
            onContinue={() => handleNext()}
          />
        )}

        {/* Step 2: Patient Information */}
        {currentStep === 2 && (
          <div>
            {showPageTitleLabels && (
              <PageTitle
                title={language === 'en' ? 'Patient Information' : 'நோயாளி தகவல்'}
                subtitle={language === 'en' ? `Step ${currentStep + 1} of ${steps.length}` : `படி ${currentStep + 1} / ${steps.length}`}
              />
            )}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <UserCircle className="w-8 h-8 text-teal-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {language === 'en' ? 'Patient Information' : 'நோயாளி தகவல்'}
                </h3>
              </div>

            <div className="space-y-6">
              {/* Patient Information Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Row 1: UHID */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'UHID' : 'நோயாளி எண்'}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={patientInfo.uhid}
                    onChange={(e) => setPatientInfo({ ...patientInfo, uhid: e.target.value })}
                    onBlur={handleUhidBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder={language === 'en' ? 'Enter UHID' : 'UHID உள்ளிடவும்'}
                  />
                </div>
                <div className="hidden md:block"></div>

                {/* Row 2: First Name | Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'First Name' : 'முதல் பெயர்'}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={patientInfo.firstName}
                    onChange={(e) => setPatientInfo({ ...patientInfo, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder={language === 'en' ? 'First name' : 'முதல் பெயர்'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Last Name' : 'கடைசி பெயர்'}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={patientInfo.lastName}
                    onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder={language === 'en' ? 'Last name' : 'கடைசி பெயர்'}
                  />
                </div>

                {/* Row 3: Age | Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Age' : 'வயது'}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder={language === 'en' ? 'Enter age' : 'வயதை உள்ளிடவும்'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Gender' : 'பாலினம்'}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">{language === 'en' ? 'Select gender' : 'பாலினம் தேர்வு'}</option>
                    <option value="Male">{language === 'en' ? 'Male' : 'ஆண்'}</option>
                    <option value="Female">{language === 'en' ? 'Female' : 'பெண்'}</option>
                    <option value="Other">{language === 'en' ? 'Other' : 'மற்றவை'}</option>
                  </select>
                </div>
              </div>

              {/* Location Fields - Pincode, City, State, Country Order */}
              <div className="space-y-6">
                {/* Search Location Row */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'en' ? 'Search Location' : 'இடத்தை தேடுங்கள்'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => handleLocationSearch(e.target.value)}
                      onFocus={() => locationSearch && setShowSuggestions(true)}
                      className="w-full pl-11 pr-32 py-3 border-[1.5px] border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                      placeholder={language === 'en' ? 'Type State, District, City or Pincode to auto-fill below fields...' : 'மாநிலம், மாவட்டம், நகரம் அல்லது அஞ்சல் குறியீட்டை தட்டச்சு செய்யுங்கள்...'}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {searchSelected && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-600 border border-teal-200 rounded-full text-xs font-bold">
                        <Sparkles className="w-3 h-3" />
                        Auto Fill
                      </span>
                    </div>
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && getFilteredSuggestions().length > 0 && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                      {getFilteredSuggestions().map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-teal-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-sm text-gray-900">{suggestion.city}</p>
                              <p className="text-xs text-gray-600">{suggestion.state}, {suggestion.country}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{suggestion.pincode}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Filled Badge */}
                  {showFilledBadge && (
                    <div className="absolute -bottom-8 left-0 animate-in fade-in slide-in-from-top-2 duration-200">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-lg text-xs font-bold shadow-sm">
                        <Check className="w-3 h-3" />
                        Filled
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Pincode — col 1 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Pincode' : 'அஞ்சல் குறியீடு'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={patientInfo.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className={`w-full px-4 py-3 pr-10 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-500 ${
                          pincodeValid === false ? 'border-red-500' : flashFields.includes('pincode') ? 'bg-teal-100 border-[2px] border-teal-600' : 'bg-white border border-gray-200'
                        }`}
                        placeholder={language === 'en' ? '600001' : '600001'}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {pincodeLoading ? (
                          <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
                        ) : flashFields.includes('pincode') ? (
                          <Check className="w-5 h-5 text-green-600 animate-in fade-in duration-300" />
                        ) : pincodeValid === true ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : pincodeValid === false ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* City — col 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'City' : 'நகரம்'}
                    </label>
                    <div className="relative">
                      <select
                        value={patientInfo.city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className={`w-full px-4 py-3 pr-10 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-500 ${
                          flashFields.includes('city') ? 'bg-teal-100 border-[2px] border-teal-600' : 'bg-white border border-gray-200'
                        }`}
                      >
                        <option value="">{language === 'en' ? 'Select City' : 'நகரத்தை தேர்ந்தெடுங்கள்'}</option>
                        {(patientInfo.state === 'Tamil Nadu' ? tamilNaduCities : otherCities).map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {flashFields.includes('city') && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Check className="w-5 h-5 text-green-600 animate-in fade-in duration-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* State — col 3 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'State' : 'மாநிலம்'}
                    </label>
                    <div className="relative">
                      <select
                        value={patientInfo.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className={`w-full px-4 py-3 pr-10 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-500 ${
                          flashFields.includes('state') ? 'bg-teal-100 border-[2px] border-teal-600' : 'bg-white border border-gray-200'
                        }`}
                      >
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {flashFields.includes('state') && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Check className="w-5 h-5 text-green-600 animate-in fade-in duration-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Country — col 4 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Country' : 'நாடு'}
                    </label>
                    <div className="relative">
                      <select
                        value={patientInfo.country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className={`w-full px-4 py-3 pr-10 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-500 ${
                          flashFields.includes('country') ? 'bg-teal-100 border-[2px] border-teal-600' : 'bg-white border border-gray-200'
                        }`}
                      >
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      {flashFields.includes('country') && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Check className="w-5 h-5 text-green-600 animate-in fade-in duration-300" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  {language === 'en' ? 'Address' : 'முகவரி'}
                </label>
                <textarea
                  value={patientInfo.address}
                  onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  rows={3}
                  placeholder={language === 'en' ? 'Enter full address' : 'முழு முகவரியை உள்ளிடவும்'}
                />
              </div>

              {/* Contact Verification */}
              <div className="space-y-6">
                {/* Mobile Number Row */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1" />
                        {language === 'en' ? 'Mobile Number' : 'தொலைபேசி எண்'}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={patientInfo.mobile}
                        onChange={(e) => setPatientInfo({ ...patientInfo, mobile: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
                        placeholder="+91 98765 43210"
                        disabled={patientInfo.mobileVerified}
                      />
                    </div>
                    <button
                      onClick={handleSendMobileOtp}
                      disabled={patientInfo.mobileVerified || patientInfo.mobileOtpSent || !patientInfo.mobile}
                      className={`px-8 py-3 rounded-lg font-bold transition-all h-[50px] ${
                        patientInfo.mobileVerified
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-300'
                      }`}
                    >
                      {patientInfo.mobileVerified ? (
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5" />
                          <span>{language === 'en' ? 'Verified' : 'சரிபார்க்கப்பட்டது'}</span>
                        </div>
                      ) : (
                        language === 'en' ? 'Verify' : 'சரிபார்'
                      )}
                    </button>
                  </div>

                  {/* OTP Reveal for Mobile */}
                  {patientInfo.mobileOtpSent && !patientInfo.mobileVerified && (
                    <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-100 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-teal-800 mb-2">
                            {language === 'en' ? 'Enter 6-digit OTP' : '6 இலக்க OTP உள்ளிடவும்'}
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={patientInfo.mobileOtp}
                            onChange={(e) => setPatientInfo({ ...patientInfo, mobileOtp: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-4 py-3 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-center text-lg font-bold tracking-[0.5em] bg-white"
                            placeholder="••••••"
                          />
                        </div>
                        <button
                          onClick={handleVerifyMobile}
                          disabled={patientInfo.mobileOtp.length !== 6}
                          className="px-8 py-3 rounded-lg font-bold bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-300 transition-all h-[50px]"
                        >
                          {language === 'en' ? 'Verify OTP' : 'OTP சரிபார்'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Row */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-1" />
                        {language === 'en' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}
                      </label>
                      <input
                        type="email"
                        value={patientInfo.email}
                        onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
                        placeholder="email@example.com"
                        disabled={patientInfo.emailVerified}
                      />
                    </div>
                    <button
                      onClick={handleSendEmailOtp}
                      disabled={patientInfo.emailVerified || patientInfo.emailOtpSent || !patientInfo.email}
                      className={`px-8 py-3 rounded-lg font-bold transition-all h-[50px] ${
                        patientInfo.emailVerified
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-300'
                      }`}
                    >
                      {patientInfo.emailVerified ? (
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5" />
                          <span>{language === 'en' ? 'Verified' : 'சரிபார்க்கப்பட்டது'}</span>
                        </div>
                      ) : (
                        language === 'en' ? 'Verify' : 'சரிபார்'
                      )}
                    </button>
                  </div>

                  {/* OTP Reveal for Email */}
                  {patientInfo.emailOtpSent && !patientInfo.emailVerified && (
                    <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-100 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-teal-800 mb-2">
                            {language === 'en' ? 'Enter 6-digit OTP' : '6 இலக்க OTP உள்ளிடவும்'}
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={patientInfo.emailOtp}
                            onChange={(e) => setPatientInfo({ ...patientInfo, emailOtp: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-4 py-3 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-center text-lg font-bold tracking-[0.5em] bg-white"
                            placeholder="••••••"
                          />
                        </div>
                        <button
                          onClick={handleVerifyEmail}
                          disabled={patientInfo.emailOtp.length !== 6}
                          className="px-8 py-3 rounded-lg font-bold bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-300 transition-all h-[50px]"
                        >
                          {language === 'en' ? 'Verify OTP' : 'OTP சரிபார்'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Visit Details Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'en' ? 'Visit Details' : 'வருகை விவரங்கள்'}
                </h4>

                {/* Visit Type Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPatientInfo({ ...patientInfo, visitType: 'OP' })}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      patientInfo.visitType === 'OP'
                        ? 'border-teal-600 bg-teal-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-teal-300'
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      patientInfo.visitType === 'OP' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <p className={`font-semibold ${
                      patientInfo.visitType === 'OP' ? 'text-teal-700' : 'text-gray-700'
                    }`}>
                      {language === 'en' ? 'Out Patient (OP)' : 'வெளிநோயாளி (OP)'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPatientInfo({ ...patientInfo, visitType: 'IP' })}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      patientInfo.visitType === 'IP'
                        ? 'border-teal-600 bg-teal-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-teal-300'
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      patientInfo.visitType === 'IP' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <p className={`font-semibold ${
                      patientInfo.visitType === 'IP' ? 'text-teal-700' : 'text-gray-700'
                    }`}>
                      {language === 'en' ? 'In Patient (IP)' : 'உள்நோயாளி (IP)'}
                    </p>
                  </button>
                </div>

                {/* Conditional OP Fields */}
                {patientInfo.visitType === 'OP' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'UHID' : 'நோயாளி எண்'}
                      </label>
                      <input
                        type="text"
                        value={patientInfo.opNo}
                        onChange={(e) => setPatientInfo({ ...patientInfo, opNo: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder={language === 'en' ? 'Enter UHID' : 'UHID உள்ளிடவும்'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        {language === 'en' ? 'OP Date' : 'வெளிநோயாளி தேதி'}
                      </label>
                      <DatePicker
                        selected={patientInfo.opDate}
                        onChange={(date) => setPatientInfo({ ...patientInfo, opDate: date })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        dateFormat="dd/MM/yyyy"
                        placeholderText={language === 'en' ? 'Select date' : 'தேதி தேர்வு'}
                      />
                    </div>
                  </div>
                )}

                {/* Conditional IP Fields */}
                {patientInfo.visitType === 'IP' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'UHID' : 'நோயாளி எண்'}
                        </label>
                        <input
                          type="text"
                          value={patientInfo.ipNo}
                          onChange={(e) => setPatientInfo({ ...patientInfo, ipNo: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                          placeholder={language === 'en' ? 'Enter UHID' : 'UHID உள்ளிடவும்'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="inline w-4 h-4 mr-1" />
                          {language === 'en' ? 'IP Date' : 'உள்நோயாளி தேதி'}
                        </label>
                        <DatePicker
                          selected={patientInfo.ipDate}
                          onChange={(date) => setPatientInfo({ ...patientInfo, ipDate: date })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                          dateFormat="dd/MM/yyyy"
                          placeholderText={language === 'en' ? 'Select date' : 'தேதி தேர்வு'}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="inline w-4 h-4 mr-1" />
                          {language === 'en' ? 'Date of Admission' : 'சேர்க்கை தேதி'}
                        </label>
                        <DatePicker
                          selected={patientInfo.admissionDate}
                          onChange={(date) => setPatientInfo({ ...patientInfo, admissionDate: date })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                          dateFormat="dd/MM/yyyy"
                          placeholderText={language === 'en' ? 'Select date' : 'தேதி தேர்வு'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="inline w-4 h-4 mr-1" />
                          {language === 'en' ? 'Date of Discharge' : 'வெளியேறிய தேதி'}
                        </label>
                        <DatePicker
                          selected={patientInfo.dischargeDate}
                          onChange={(date) => setPatientInfo({ ...patientInfo, dischargeDate: date })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                          dateFormat="dd/MM/yyyy"
                          placeholderText={language === 'en' ? 'Select date' : 'தேதி தேர்வு'}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Step 3: Service Feedback */}
        {currentStep === 3 && (
          <div>
            {showPageTitleLabels && (
              <PageTitle
                title={language === 'en' ? (combinePages ? 'Feedback & Questions' : 'Service Feedback') : (combinePages ? 'கருத்து & கேள்விகள்' : 'சேவை கருத்து')}
                subtitle={language === 'en' ? `Step ${currentStep + 1} of ${steps.length}` : `படி ${currentStep + 1} / ${steps.length}`}
              />
            )}
            <div className="space-y-6">
              <div className={`grid grid-cols-1 ${layoutMode === '2-column' ? 'md:grid-cols-2' : ''} gap-[18px] items-stretch`}>
                {questions.length > 0 ? (
                  questions.map(q => (
                    <FeedbackCard key={q.id} title={language === 'en' ? q.label : q.tamilLabel} tamilTitle="" icon={<Sparkles />} cardColor={q.backgroundColor}>
                      {q.ratingMode === 'star' ? (
                        <StarRating
                          label=""
                          tamilLabel=""
                          value={dynamicRatings[q.id] || 0}
                          onChange={(value) => setDynamicRatings({ ...dynamicRatings, [q.id]: value })}
                        />
                      ) : (
                        <EmojiRating
                          label=""
                          value={dynamicRatings[q.id] || 0}
                          onChange={(value) => setDynamicRatings({ ...dynamicRatings, [q.id]: value })}
                          language={language}
                        />
                      )}
                    </FeedbackCard>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    {language === 'en' ? 'No feedback questions configured.' : 'எந்த கருத்து கேள்விகளும் கட்டமைக்கப்படவில்லை.'}
                  </div>
                )}
            </div>

            {/* Overall Experience - Special Amber Styling */}
            <div className="relative">
              <div className="flex justify-center mb-2">
                <span className="inline-flex items-center gap-1 px-4 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-semibold">
                  ⭐ {language === 'en' ? 'Most Important — Please Rate' : 'மிக முக்கியம் — மதிப்பிடவும்'}
                </span>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-400 rounded-xl shadow-lg p-6 animate-pulse-border">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-xl">⭐</span>
                  <h3 className="text-lg font-bold text-amber-900">
                    {language === 'en' ? 'Overall Experience*' : 'ஒட்டுமொத்த அனுபவம்*'}
                  </h3>
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-3xl">
                    <EmojiRating
                      label=""
                      value={ratings.overall}
                      onChange={(value) => setRatings({ ...ratings, overall: value })}
                      required
                      language={language}
                      emojiSize={90}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>
            
            {combinePages && (
              <div className="mt-8 space-y-6">
                <hr className="border-gray-200" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'en' ? 'Additional Details' : 'கூடுதல் விவரங்கள்'}
                </h3>
                {/* Why Choose Us Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {language === 'en' ? 'What Made You to Choose Apollo Healthcare Center ?' : 'அப்பல்லோ சுகாதார மையத்தை தேர்வு செய்ய உங்களைத் தூண்டியது எது?'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en' ? 'Select ALL that apply' : 'பொருந்தும் அனைத்தையும் தேர்ந்தெடுக்கவும்'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <SelectableCard
                      icon={<Newspaper className="w-6 h-6" />}
                      label={language === 'en' ? 'Advertisement / News / Social Media' : 'விளம்பரம் / செய்தி / சமூக ஊடகம்'}
                      selected={whyChooseUs.advertisement}
                      onToggle={() => setWhyChooseUs({ ...whyChooseUs, advertisement: !whyChooseUs.advertisement })}
                    />
                    <SelectableCard
                      icon={<Briefcase className="w-6 h-6" />}
                      label={language === 'en' ? 'Corporate' : 'கார்ப்பரேட்'}
                      selected={whyChooseUs.corporate}
                      onToggle={() => setWhyChooseUs({ ...whyChooseUs, corporate: !whyChooseUs.corporate })}
                    />
                    <SelectableCard
                      icon={<UserCog className="w-6 h-6" />}
                      label={language === 'en' ? 'Employee' : 'ஊழியர்'}
                      selected={whyChooseUs.employee}
                      onToggle={() => setWhyChooseUs({ ...whyChooseUs, employee: !whyChooseUs.employee })}
                    />
                    <SelectableCard
                      icon={<Stethoscope className="w-6 h-6" />}
                      label={language === 'en' ? 'Referral Doctor' : 'பரிந்துரை மருத்துவர்'}
                      selected={whyChooseUs.referralDoctor}
                      onToggle={() => setWhyChooseUs({ ...whyChooseUs, referralDoctor: !whyChooseUs.referralDoctor })}
                    />
                    <SelectableCard
                      icon={<UsersRound className="w-6 h-6" />}
                      label={language === 'en' ? 'Friends / Relatives' : 'நண்பர்கள் / உறவினர்கள்'}
                      selected={whyChooseUs.friendsRelatives}
                      onToggle={() => setWhyChooseUs({ ...whyChooseUs, friendsRelatives: !whyChooseUs.friendsRelatives })}
                    />
                    <SelectableCard
                      icon={<ThumbsUp className="w-6 h-6" />}
                      label={language === 'en' ? 'Self Decision' : 'சுய முடிவு'}
                      selected={whyChooseUs.selfDecision}
                      onToggle={() => setWhyChooseUs({ ...whyChooseUs, selfDecision: !whyChooseUs.selfDecision })}
                    />
                    <SelectableCard
                      icon={<MoreHorizontal className="w-6 h-6" />}
                      label={language === 'en' ? 'Others' : 'மற்றவை'}
                      selected={whyChooseUs.others}
                      onToggle={() => setWhyChooseUs({ ...whyChooseUs, others: !whyChooseUs.others })}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'en' ? 'Questions' : 'கேள்விகள்'}
                  </h3>

                  <div className="space-y-4">
                    {fetchedYesNoQuestions.length > 0 ? (
                      fetchedYesNoQuestions.map((yq) => (
                        <div key={yq.id} className="mb-6 p-4 rounded-xl border border-gray-100 shadow-sm transition-all" style={{ backgroundColor: yq.backgroundColor || '#ffffff' }}>
                          <ThreeStateToggle
                            label={language === 'en' ? yq.label : yq.tamilLabel}
                            value={dynamicYesNo[yq.id]?.answer ?? null}
                            onValueChange={(value) =>
                              setDynamicYesNo({
                                ...dynamicYesNo,
                                [yq.id]: { ...dynamicYesNo[yq.id], answer: value }
                              })
                            }
                            language={language}
                          />
                          
                          {dynamicYesNo[yq.id]?.answer === false && (
                            <div className="ml-4 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'en' ? 'Please describe the issue' : 'பிரச்சினையை விவரிக்கவும்'}
                              </label>
                              <textarea
                                value={dynamicYesNo[yq.id]?.remarks || ''}
                                onChange={(e) =>
                                  setDynamicYesNo({
                                    ...dynamicYesNo,
                                    [yq.id]: { ...dynamicYesNo[yq.id], remarks: e.target.value }
                                  })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                rows={3}
                                placeholder={language === 'en' ? 'Describe the issue...' : 'பிரச்சினையை விவரிக்கவும்...'}
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic p-4 text-center">
                        {language === 'en' ? 'No additional questions.' : 'கூடுதல் கேள்விகள் இல்லை.'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {language === 'en' ? 'Suggestions' : 'பரிந்துரைகள்'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'en' ? 'If your concern is not covered in any of the above, please provide your suggestions for improvement' : 'மேலே உள்ள எந்த பிரிவிலும் உங்கள் கவலை சேர்க்கப்படவில்லை என்றால், மேம்பாட்டிற்கான உங்கள் பரிந்துரைகளை வழங்கவும்'}
                  </p>
                  <textarea
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    rows={5}
                    placeholder={language === 'en' ? 'Share your suggestions to help us improve our services...' : 'எங்கள் சேவைகளை மேம்படுத்த உங்கள் பரிந்துரைகளைப் பகிரவும்...'}
                  />
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {language === 'en' ? 'Appreciation' : 'பாராட்டு'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {language === 'en' ? 'Would you like to appreciate any staff member?' : 'எந்த பணியாளரையும் பாராட்ட விரும்புகிறீர்களா?'}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {appreciations.map((appreciation) => (
                      <div key={appreciation.id} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
                        {appreciations.length > 1 && (
                          <button
                            onClick={() => removeAppreciation(appreciation.id)}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'en' ? 'Staff Name' : 'பணியாளர் பெயர்'}
                            </label>
                            <input
                              type="text"
                              value={appreciation.name}
                              onChange={(e) => updateAppreciation(appreciation.id, 'name', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                              placeholder={language === 'en' ? 'e.g. Dr. Smith' : 'எ.கா. டாக்டர் ஸ்மித்'}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'en' ? 'Department' : 'துறை'}
                            </label>
                            {departments.length > 0 ? (
                              <select
                                value={appreciation.department}
                                onChange={(e) => updateAppreciation(appreciation.id, 'department', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
                              >
                                <option value="">{language === 'en' ? 'Select Department' : 'துறையைத் தேர்ந்தெடுக்கவும்'}</option>
                                {departments.map((dept, i) => (
                                  <option key={i} value={dept}>{dept}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={appreciation.department}
                                onChange={(e) => updateAppreciation(appreciation.id, 'department', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                placeholder={language === 'en' ? 'e.g. Cardiology' : 'எ.கா. இதயவியல்'}
                              />
                            )}
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'en' ? 'Note of Appreciation' : 'பாராட்டு குறிப்பு'}
                            </label>
                            <textarea
                              value={appreciation.note}
                              onChange={(e) => updateAppreciation(appreciation.id, 'note', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                              rows={3}
                              placeholder={language === 'en' ? 'Write your appreciation...' : 'உங்கள் பாராட்டுதலை எழுதவும்...'}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={addAppreciation}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {language === 'en' ? 'Add More' : 'மேலும் சேர்க்கவும்'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Step 4: Additional Details (Shown only if NOT combined) */}
        {!combinePages && currentStep === 4 && (
          <div>
            {showPageTitleLabels && (
              <PageTitle
                title={language === 'en' ? 'Questionary Page' : 'கேள்வி பக்கம்'}
                subtitle={language === 'en' ? `Step ${currentStep + 1} of ${steps.length}` : `படி ${currentStep + 1} / ${steps.length}`}
              />
            )}
            <div className="space-y-6">
              {/* Why Choose Us Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'en' ? 'What Made You to Choose Apollo Healthcare Center ?' : 'அப்பல்லோ சுகாதார மையத்தை தேர்வு செய்ய உங்களைத் தூண்டியது எது?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' ? 'Select ALL that apply' : 'பொருந்தும் அனைத்தையும் தேர்ந்தெடுக்கவும்'}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <SelectableCard
                  icon={<Newspaper className="w-6 h-6" />}
                  label={language === 'en' ? 'Advertisement / News / Social Media' : 'விளம்பரம் / செய்தி / சமூக ஊடகம்'}
                  selected={whyChooseUs.advertisement}
                  onToggle={() => setWhyChooseUs({ ...whyChooseUs, advertisement: !whyChooseUs.advertisement })}
                />
                <SelectableCard
                  icon={<Briefcase className="w-6 h-6" />}
                  label={language === 'en' ? 'Corporate' : 'கார்ப்பரேட்'}
                  selected={whyChooseUs.corporate}
                  onToggle={() => setWhyChooseUs({ ...whyChooseUs, corporate: !whyChooseUs.corporate })}
                />
                <SelectableCard
                  icon={<UserCog className="w-6 h-6" />}
                  label={language === 'en' ? 'Employee' : 'ஊழியர்'}
                  selected={whyChooseUs.employee}
                  onToggle={() => setWhyChooseUs({ ...whyChooseUs, employee: !whyChooseUs.employee })}
                />
                <SelectableCard
                  icon={<Stethoscope className="w-6 h-6" />}
                  label={language === 'en' ? 'Referral Doctor' : 'பரிந்துரை மருத்துவர்'}
                  selected={whyChooseUs.referralDoctor}
                  onToggle={() => setWhyChooseUs({ ...whyChooseUs, referralDoctor: !whyChooseUs.referralDoctor })}
                />
                <SelectableCard
                  icon={<UsersRound className="w-6 h-6" />}
                  label={language === 'en' ? 'Friends / Relatives' : 'நண்பர்கள் / உறவினர்கள்'}
                  selected={whyChooseUs.friendsRelatives}
                  onToggle={() => setWhyChooseUs({ ...whyChooseUs, friendsRelatives: !whyChooseUs.friendsRelatives })}
                />
                <SelectableCard
                  icon={<ThumbsUp className="w-6 h-6" />}
                  label={language === 'en' ? 'Self Decision' : 'சுய முடிவு'}
                  selected={whyChooseUs.selfDecision}
                  onToggle={() => setWhyChooseUs({ ...whyChooseUs, selfDecision: !whyChooseUs.selfDecision })}
                />
                <SelectableCard
                  icon={<MoreHorizontal className="w-6 h-6" />}
                  label={language === 'en' ? 'Others' : 'மற்றவை'}
                  selected={whyChooseUs.others}
                  onToggle={() => setWhyChooseUs({ ...whyChooseUs, others: !whyChooseUs.others })}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Questions' : 'கேள்விகள்'}
              </h3>

              <div className="space-y-4">
                {fetchedYesNoQuestions.length > 0 ? (
                  fetchedYesNoQuestions.map((yq) => (
                    <div key={yq.id} className="mb-6">
                      <ThreeStateToggle
                        label={language === 'en' ? yq.label : yq.tamilLabel}
                        value={dynamicYesNo[yq.id]?.answer ?? null}
                        onValueChange={(value) =>
                          setDynamicYesNo({
                            ...dynamicYesNo,
                            [yq.id]: { ...dynamicYesNo[yq.id], answer: value }
                          })
                        }
                        language={language}
                      />
                      
                      {dynamicYesNo[yq.id]?.answer === false && (
                        <div className="ml-4 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'en' ? 'Please describe the issue' : 'பிரச்சினையை விவரிக்கவும்'}
                          </label>
                          <textarea
                            value={dynamicYesNo[yq.id]?.remarks || ''}
                            onChange={(e) =>
                              setDynamicYesNo({
                                ...dynamicYesNo,
                                [yq.id]: { ...dynamicYesNo[yq.id], remarks: e.target.value }
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                            rows={3}
                            placeholder={language === 'en' ? 'Describe the issue...' : 'பிரச்சினையை விவரிக்கவும்...'}
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic p-4 text-center">
                    {language === 'en' ? 'No additional questions.' : 'கூடுதல் கேள்விகள் இல்லை.'}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'en' ? 'Suggestions' : 'பரிந்துரைகள்'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'en' ? 'If your concern is not covered in any of the above, please provide your suggestions for improvement' : 'மேலே உள்ள எந்த பிரிவிலும் உங்கள் கவலை சேர்க்கப்படவில்லை என்றால், மேம்பாட்டிற்கான உங்கள் பரிந்துரைகளை வழங்கவும்'}
              </p>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                rows={5}
                placeholder={language === 'en' ? 'Share your suggestions to help us improve our services...' : 'எங்கள் சேவைகளை மேம்படுத்த உங்கள் பரிந்துரைகளைப் பகிரவும்...'}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'en' ? 'Appreciation' : 'பாராட்டு'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'en' ? 'Would you like to appreciate any staff member?' : 'எந்த பணியாளரையும் பாராட்ட விரும்புகிறீர்களா?'}
                </p>
              </div>

              <div className="space-y-6">
                {appreciations.map((appreciation) => (
                  <div key={appreciation.id} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {appreciations.length > 1 && (
                      <button
                        onClick={() => removeAppreciation(appreciation.id)}
                        className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Staff Name' : 'பணியாளர் பெயர்'}
                        </label>
                        <input
                          type="text"
                          value={appreciation.name}
                          onChange={(e) => updateAppreciation(appreciation.id, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                          placeholder={language === 'en' ? 'Enter staff name' : 'பணியாளர் பெயர் உள்ளிடவும்'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Department' : 'துறை'}
                        </label>
                        <select
                          value={appreciation.department}
                          onChange={(e) => updateAppreciation(appreciation.id, 'department', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="">{language === 'en' ? 'Select department' : 'துறை தேர்வு'}</option>
                          <option value="Reception">{language === 'en' ? 'Reception' : 'வரவேற்பு'}</option>
                          <option value="Nursing">{language === 'en' ? 'Nursing' : 'செவிலியர்'}</option>
                          <option value="Doctor">{language === 'en' ? 'Doctor' : 'மருத்துவர்'}</option>
                          <option value="Pharmacy">{language === 'en' ? 'Pharmacy' : 'மருந்தகம்'}</option>
                          <option value="Lab">{language === 'en' ? 'Lab' : 'ஆய்வகம்'}</option>
                          <option value="Housekeeping">{language === 'en' ? 'Housekeeping' : 'பராமரிப்பு'}</option>
                          <option value="Other">{language === 'en' ? 'Other' : 'மற்றவை'}</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Appreciation Note' : 'பாராட்டு குறிப்பு'}
                        </label>
                        <textarea
                          value={appreciation.note}
                          onChange={(e) => updateAppreciation(appreciation.id, 'note', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                          rows={3}
                          placeholder={language === 'en' ? 'Write your appreciation...' : 'உங்கள் பாராட்டுதலை எழுதவும்...'}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={addAppreciation}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'en' ? 'Add More' : 'மேலும் சேர்க்கவும்'}
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === (combinePages ? 4 : 5) && (
          <div>
            {showPageTitleLabels && (
              <PageTitle
                title={language === 'en' ? 'Review & Submit' : 'மதிப்பாய்வு'}
                subtitle={language === 'en' ? `Step ${steps.length} of ${steps.length}` : `படி ${steps.length} / ${steps.length}`}
              />
            )}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-teal-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'en' ? 'Review & Submit' : 'மதிப்பாய்வு & சமர்ப்பிக்கவும்'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' ? 'Please review your feedback before submitting' : 'சமர்ப்பிப்பதற்கு முன் உங்கள் கருத்தை மதிப்பாய்வு செய்யவும்'}
              </p>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Summary' : 'சுருக்கம்'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                {/* Hospital - Navigate to Step 0 */}
                <div className="p-4 bg-white/70 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{language === 'en' ? 'Hospital' : 'மருத்துவமனை'}</p>
                  <p className="font-semibold text-gray-900">
                    {language === 'en' ? 'Hospital Selected' : 'தேர்ந்தெடுக்கப்பட்ட மருத்துவமனை'}
                  </p>
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="mt-2 text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                {/* Patient - Navigate to Step 2 */}
                <div className="p-4 bg-white/70 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{language === 'en' ? 'Patient' : 'நோயாளி'}</p>
                  <p className="font-semibold text-gray-900">
                    {language === 'en' ? 'Patient Details' : 'நோயாளி விவரங்கள்'}
                  </p>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="mt-2 text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                {/* Ratings Provided - Navigate to Step 3 */}
                <div className="p-4 bg-white/70 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{language === 'en' ? 'Ratings Provided' : 'மதிப்பீடுகள்'}</p>
                  <p className="font-semibold text-gray-900">
                    {Object.values(ratings).filter(r => r > 0).length} / 13
                  </p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="mt-2 text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                {/* Questionary Page - Navigate to Step 4 */}
                <div className="p-4 bg-white/70 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{language === 'en' ? 'Questionary Page' : 'கேள்வி பக்கம்'}</p>
                  <p className="font-semibold text-gray-900">
                    {(() => {
                      const answeredCount = Object.values(dynamicYesNo).filter(q => q.answer !== null).length;
                      return `${answeredCount} / ${fetchedYesNoQuestions.length}`;
                    })()}
                  </p>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="mt-2 text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>{language === 'en' ? 'Privacy Notice:' : 'தனியுரிமை அறிவிப்பு:'}</strong> {language === 'en' ? 'Your feedback will be kept confidential and used only for improving our healthcare services.' : 'உங்கள் கருத்து ரகசியமாக வைக்கப்படும் மற்றும் எங்கள் சேவைகளை மேம்படுத்த மட்டுமே பயன்படுத்தப்படும்.'}
              </p>
            </div>

            {/* Greeting Section */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 text-center border border-teal-100 mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <Hospital className="w-8 h-8 text-teal-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'en' ? 'Thank you for choosing Apollo Healthcare Center' : 'அப்பல்லோ சுகாதார மையத்தை தேர்வு செய்ததற்கு நன்றி'}
              </h3>
              <p className="text-gray-700 mb-2 max-w-2xl mx-auto">
                {language === 'en'
                  ? 'We value your feedback and appreciate you taking the time to share your experience with us.'
                  : 'உங்கள் கருத்துக்களை நாங்கள் மதிக்கிறோம் மற்றும் உங்கள் அனுபவத்தைப் பகிர்ந்து கொள்ள நேரம் ஒதுக்கியதற்கு பாராட்டுகிறோம்.'}
              </p>
              <p className="text-sm text-gray-600 max-w-xl mx-auto">
                {language === 'en'
                  ? 'Your feedback helps us improve our services and provide better patient care.'
                  : 'உங்கள் கருத்து எங்கள் சேவைகளை மேம்படுத்தவும் சிறந்த நோயாளி பராமரிப்பை வழங்கவும் உதவுகிறது.'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full px-12 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-100 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <CheckCircle className="w-6 h-6" />
              {language === 'en' ? 'Submit Feedback' : 'கருத்தை சமர்ப்பிக்கவும்'}
            </button>
          </div>
        </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'en' ? 'Previous' : 'முந்தைய'}
          </button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={handleNext}
              className="px-10 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center gap-3 shadow-lg shadow-teal-100 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {language === 'en' ? 'Next' : 'அடுத்தது'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Admin Login</h2>
              </div>
              <button
                onClick={() => { setShowAdminLoginModal(false); setAdminLoginError(''); setAdminUsername(''); setAdminPassword(''); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => { setAdminUsername(e.target.value); setAdminLoginError(''); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => { setAdminPassword(e.target.value); setAdminLoginError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showAdminPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {adminLoginError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{adminLoginError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => { setShowAdminLoginModal(false); setAdminLoginError(''); setAdminUsername(''); setAdminPassword(''); }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
