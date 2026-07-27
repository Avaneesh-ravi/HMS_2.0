import React, { useState, useEffect } from 'react';
import { Hospital, MapPin, Phone } from 'lucide-react';

interface Hospital {
  id: number;
  name: string;
  logo: string | null;
  address: string | null;
  contactNumber: string | null;
}

interface HospitalSelectionProps {
  selectedHospitalId: number | null;
  onHospitalSelect: (hospital: Hospital) => void;
  language: 'en' | 'ta';
  loading?: boolean;
}

export function HospitalSelection({ 
  selectedHospitalId, 
  onHospitalSelect, 
  language, 
  loading = false 
}: HospitalSelectionProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoadingHospitals(true);
      setError(null);
      
      const response = await fetch('/api/backend/ajax/get-hospitals.php', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.hospitals)) {
        setHospitals(data.hospitals);
      } else {
        throw new Error(data.message || 'Failed to fetch hospitals');
      }
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
      // Fallback to demo data for testing
      setHospitals([
        {
          id: 1,
          name: 'Apollo Healthcare Center',
          logo: null,
          address: '123 Health Street, Chennai - 600001',
          contactNumber: '+91 44 1234 5678'
        }
      ]);
    } finally {
      setLoadingHospitals(false);
    }
  };

  const handleSelectHospital = (hospital: Hospital) => {
    onHospitalSelect(hospital);
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Hospital className="w-10 h-10 text-teal-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Select Hospital' : 'மருத்துவமனையைத் தேர்ந்தெடுக்கவும்'}
          </h2>
        </div>
        <p className="text-center text-gray-600">
          {language === 'en' 
            ? 'Choose your hospital to begin the feedback process' 
            : 'கருத்து வினாடிவேளைத் தொடங்க உங்கள் மருத்துவமனையைத் தேர்ந்தெடுக்கவும்'}
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {loadingHospitals || loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{language === 'en' ? 'No hospitals found' : 'மருத்துவமனைகள் கிடைக்கவில்லை'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map((hospital) => (
            <button
              key={hospital.id}
              onClick={() => handleSelectHospital(hospital)}
              className={`text-left p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                selectedHospitalId === hospital.id
                  ? 'border-teal-600 bg-teal-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-teal-300 shadow'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-teal-100 rounded-lg">
                  <Hospital className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {hospital.name}
                  </h3>
                  
                  {hospital.address && (
                    <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <p className="line-clamp-2">{hospital.address}</p>
                    </div>
                  )}
                  
                  {hospital.contactNumber && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <p>{hospital.contactNumber}</p>
                    </div>
                  )}
                </div>
                
                {selectedHospitalId === hospital.id && (
                  <div className="flex-shrink-0 p-1 bg-teal-600 rounded-full text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {hospitals.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            {language === 'en' 
              ? selectedHospitalId 
                ? '✓ Hospital selected. Click Next to continue.' 
                : 'Please select a hospital to continue.'
              : selectedHospitalId 
                ? '✓ மருத்துவமனை தேர்ந்தெடுக்கப்பட்டது. அடுத்ததைக் கிளிக் செய்யவும்.'
                : 'தொடர்ந்து செல்ல மருத்துவமனையைத் தேர்ந்தெடுக்கவும்.'}
          </p>
        </div>
      )}
    </div>
  );
}
