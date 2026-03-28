import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Check, Loader2, AlertCircle, Package, Truck, X } from 'lucide-react';

interface AddressData {
  fullAddress: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  verified: boolean;
  locationConfirmed: boolean;
}

interface AddressAutocompleteProps {
  value: AddressData;
  onChange: (address: AddressData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

interface PostalData {
  Name: string;
  District: string;
  State: string;
  Country: string;
}

const AddressAutocomplete = ({ value, onChange, onValidationChange }: AddressAutocompleteProps) => {
  // Local state for inputs to prevent re-renders while typing
  const [localFullAddress, setLocalFullAddress] = useState(value.fullAddress);
  const [localLandmark, setLocalLandmark] = useState(value.landmark);
  const [localPincode, setLocalPincode] = useState(value.pincode);
  const [localCity, setLocalCity] = useState(value.city);
  const [localState, setLocalState] = useState(value.state);
  
  const [isVerifyingPincode, setIsVerifyingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [pincodeValid, setPincodeValid] = useState(value.verified);
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(value.locationConfirmed);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with parent value on mount
  useEffect(() => {
    setLocalFullAddress(value.fullAddress);
    setLocalLandmark(value.landmark);
    setLocalPincode(value.pincode);
    setLocalCity(value.city);
    setLocalState(value.state);
    setPincodeValid(value.verified);
    setLocationConfirmed(value.locationConfirmed);
  }, []); // Only on mount

  // Debounced update to parent
  const updateParent = useCallback((updates: Partial<AddressData>) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onChange({
        fullAddress: localFullAddress,
        landmark: localLandmark,
        pincode: localPincode,
        city: localCity,
        state: localState,
        verified: pincodeValid,
        locationConfirmed,
        ...updates,
      });
    }, 300);
  }, [localFullAddress, localLandmark, localPincode, localCity, localState, pincodeValid, locationConfirmed, onChange]);

  // Verify pincode using India Post API
  const verifyPincode = async (pincode: string) => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeError('Enter valid 6-digit pincode');
      setPincodeValid(false);
      onValidationChange?.(false);
      return;
    }

    setIsVerifyingPincode(true);
    setPincodeError(null);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice: PostalData = data[0].PostOffice[0];
        
        setLocalCity(postOffice.District);
        setLocalState(postOffice.State);
        setPincodeValid(true);
        setPincodeError(null);
        setLocationConfirmed(false);
        onValidationChange?.(true);
        
        // Update parent with verified data
        onChange({
          fullAddress: localFullAddress,
          landmark: localLandmark,
          pincode,
          city: postOffice.District,
          state: postOffice.State,
          verified: true,
          locationConfirmed: false,
        });
      } else {
        setPincodeError('Invalid pincode - delivery not available');
        setPincodeValid(false);
        setLocalCity('');
        setLocalState('');
        onValidationChange?.(false);
        
        onChange({
          fullAddress: localFullAddress,
          landmark: localLandmark,
          pincode,
          city: '',
          state: '',
          verified: false,
          locationConfirmed: false,
        });
      }
    } catch (error) {
      console.error('Pincode verification failed:', error);
      setPincodeError('Unable to verify. Enter city/state manually.');
      setPincodeValid(false);
      onValidationChange?.(false);
    } finally {
      setIsVerifyingPincode(false);
    }
  };

  // Load Leaflet for OpenStreetMap
  useEffect(() => {
    if (showMap && !mapLoaded) {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
      } else {
        setMapLoaded(true);
      }
    }
  }, [showMap, mapLoaded]);

  // Initialize map when loaded
  useEffect(() => {
    if (showMap && mapLoaded && mapRef.current && window.L && !mapInstanceRef.current) {
      const getCoordinates = async () => {
        let lat = 20.5937;
        let lng = 78.9629;
        let zoom = 5;

        if (localPincode && localCity) {
          try {
            const query = `${localCity}, ${localState}, India, ${localPincode}`;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
            );
            const data = await response.json();
            
            if (data.length > 0) {
              lat = parseFloat(data[0].lat);
              lng = parseFloat(data[0].lon);
              zoom = 15;
            }
          } catch (error) {
            console.log('Geocoding failed, using default location');
          }
        }

        const map = window.L.map(mapRef.current).setView([lat, lng], zoom);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const marker = window.L.marker([lat, lng], { draggable: true }).addTo(map);

        mapInstanceRef.current = map;
        markerRef.current = marker;
      };

      getCoordinates();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [showMap, mapLoaded, localPincode, localCity, localState]);

  const handleConfirmLocation = () => {
    setLocationConfirmed(true);
    setShowMap(false);
    onChange({
      fullAddress: localFullAddress,
      landmark: localLandmark,
      pincode: localPincode,
      city: localCity,
      state: localState,
      verified: pincodeValid,
      locationConfirmed: true,
    });
  };

  const handleFullAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalFullAddress(val);
    updateParent({ fullAddress: val });
  };

  const handleLandmarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalLandmark(val);
    updateParent({ landmark: val });
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
    setLocalPincode(pincode);
    setPincodeValid(false);
    setPincodeError(null);
    setLocationConfirmed(false);
    
    if (pincode.length === 6) {
      verifyPincode(pincode);
    } else {
      onValidationChange?.(false);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalCity(val);
    updateParent({ city: val });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalState(val);
    updateParent({ state: val });
  };

  // Sync to parent on blur (when user finishes typing)
  const handleBlur = () => {
    onChange({
      fullAddress: localFullAddress,
      landmark: localLandmark,
      pincode: localPincode,
      city: localCity,
      state: localState,
      verified: pincodeValid,
      locationConfirmed,
    });
  };

  return (
    <div className="space-y-3">
      {/* Full Address */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Full Address *</label>
        <textarea
          value={localFullAddress}
          onChange={handleFullAddressChange}
          onBlur={handleBlur}
          placeholder="House/Flat No., Building, Street, Area"
          rows={2}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-elitos-orange focus:border-transparent resize-none"
        />
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Landmark (Optional)</label>
        <input
          type="text"
          value={localLandmark}
          onChange={handleLandmarkChange}
          onBlur={handleBlur}
          placeholder="Near temple, opposite mall, etc."
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
        />
      </div>

      {/* Pincode with verification */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Pincode *</label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={localPincode}
            onChange={handlePincodeChange}
            onBlur={handleBlur}
            placeholder="6-digit pincode"
            maxLength={6}
            className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:ring-2 focus:ring-elitos-orange focus:border-transparent ${
              pincodeError ? 'border-red-300 bg-red-50' : pincodeValid ? 'border-green-300 bg-green-50' : ''
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isVerifyingPincode ? (
              <Loader2 size={16} className="text-gray-400 animate-spin" />
            ) : pincodeValid ? (
              <Check size={16} className="text-green-500" />
            ) : pincodeError ? (
              <AlertCircle size={16} className="text-red-500" />
            ) : null}
          </div>
        </div>
        
        {pincodeError && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {pincodeError}
          </p>
        )}
        {pincodeValid && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <Package size={12} />
            Courier-verified pincode
          </p>
        )}
      </div>

      {/* City & State */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">City *</label>
          <input
            type="text"
            value={localCity}
            onChange={handleCityChange}
            onBlur={handleBlur}
            placeholder="City"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-elitos-orange focus:border-transparent ${pincodeValid ? 'bg-gray-50' : ''}`}
            readOnly={pincodeValid}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">State *</label>
          <input
            type="text"
            value={localState}
            onChange={handleStateChange}
            onBlur={handleBlur}
            placeholder="State"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-elitos-orange focus:border-transparent ${pincodeValid ? 'bg-gray-50' : ''}`}
            readOnly={pincodeValid}
          />
        </div>
      </div>

      {/* Map Confirmation Button */}
      {pincodeValid && !locationConfirmed && (
        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="w-full py-2.5 border-2 border-dashed border-elitos-orange text-elitos-orange rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
        >
          <MapPin size={16} />
          Confirm delivery location on map
        </button>
      )}

      {/* Verification Badges */}
      {pincodeValid && (
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
            <Package size={12} />
            Courier-verified pincode
          </span>
          {locationConfirmed && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              <MapPin size={12} />
              Location confirmed
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
            <Truck size={12} />
            Delivery supported
          </span>
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin size={18} className="text-elitos-orange" />
                Confirm Location
              </h3>
              <button 
                onClick={() => setShowMap(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">
                Drag the pin to your exact delivery location.
              </p>
              
              <div 
                ref={mapRef} 
                className="w-full h-64 rounded-lg bg-gray-100 mb-4"
                style={{ minHeight: '256px' }}
              >
                {!mapLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                  </div>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg mb-4 text-sm">
                <p className="font-medium">{localFullAddress || 'Address not entered'}</p>
                {localLandmark && <p className="text-gray-500">Near: {localLandmark}</p>}
                <p className="text-gray-500">{localCity}, {localState} - {localPincode}</p>
              </div>

              <button
                onClick={handleConfirmLocation}
                className="w-full py-3 bg-elitos-orange text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Confirm This Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

declare global {
  interface Window {
    L: any;
  }
}

export default AddressAutocomplete;
