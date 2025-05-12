import React, { useState, useEffect } from 'react';
import { ProfileData } from '../page';
import { PlusCircle, MinusCircle, Clock, Info } from 'lucide-react';

// Typen für die dynamische Preisgestaltung
interface Rate {
  id: string;
  label: string;
  value: number; // in Minuten
  price: string | number;
}

interface RatesFormProps {
  profileData: ProfileData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Define duration options from 15 minutes to 1 week
const DEFAULT_DURATIONS = [
  { id: '15min', label: '15 Minuten', value: 15 },
  { id: '30min', label: '30 Minuten', value: 30 },
  { id: '1hour', label: '1 Stunde', value: 60 },
  { id: '2hours', label: '2 Stunden', value: 120 },
  { id: '3hours', label: '3 Stunden', value: 180 },
  { id: '4hours', label: '4 Stunden', value: 240 },
  { id: '1day', label: '1 Tag', value: 1440 },
  { id: 'overnight', label: 'Übernachtung', value: 720 },
  { id: 'weekend', label: 'Wochenende (2 Tage)', value: 2880 },
  { id: 'week', label: '1 Woche', value: 10080 },
];

interface Rate {
  id: string;
  label: string;
  value: number;
  price: string | number;
}

const RatesForm: React.FC<RatesFormProps> = ({ profileData, handleInputChange }) => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [customLabel, setCustomLabel] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');

  // Initialize rates from profileData
  useEffect(() => {
    if (profileData.rates) {
      const initialRates: Rate[] = [];
      
      // For compatibility, add existing rates
      if (profileData.rates.hourly) {
        initialRates.push({
          id: '1hour',
          label: '1 Stunde',
          value: 60,
          price: profileData.rates.hourly
        });
      }
      
      if (profileData.rates.twoHours) {
        initialRates.push({
          id: '2hours',
          label: '2 Stunden',
          value: 120,
          price: profileData.rates.twoHours
        });
      }
      
      if (profileData.rates.daily) {
        initialRates.push({
          id: '1day',
          label: '1 Tag',
          value: 1440,
          price: profileData.rates.daily
        });
      }
      
      if (profileData.rates.overnight) {
        initialRates.push({
          id: 'overnight',
          label: 'Übernachtung',
          value: 720,
          price: profileData.rates.overnight
        });
      }
      
      if (profileData.rates.weekend) {
        initialRates.push({
          id: 'weekend',
          label: 'Wochenende',
          value: 2880,
          price: profileData.rates.weekend
        });
      }
      
      // If no rates are set, add default 1 hour rate
      if (initialRates.length === 0) {
        initialRates.push({
          id: '1hour',
          label: '1 Stunde',
          value: 60,
          price: ''
        });
      }
      
      setRates(initialRates);
    } else {
      // Initialize with just a 1 hour rate if no rates exist
      setRates([{
        id: '1hour',
        label: '1 Stunde',
        value: 60,
        price: ''
      }]);
    }
  }, []);

  // Update parent component state when rates change
  useEffect(() => {
    if (rates.length > 0) {
      // Map rates back to the ProfileData structure
      const ratesObject: ProfileData['rates'] = {
        ...profileData.rates,
        // Setze die Standardfelder direkt (falls vorhanden)
        hourly: undefined,
        twoHours: undefined,
        daily: undefined,
        overnight: undefined,
        weekend: undefined
      };
      
      // Gehe durch alle Raten und setze die entsprechenden Felder
      rates.forEach(rate => {
        const price = rate.price === '' ? undefined : Number(rate.price);
        
        switch(rate.id) {
          case '1hour':
            ratesObject.hourly = price as number;
            break;
          case '2hours':
            ratesObject.twoHours = price as number;
            break;
          case '1day':
            ratesObject.daily = price as number;
            break;
          case 'overnight':
            ratesObject.overnight = price as number;
            break;
          case 'weekend':
            ratesObject.weekend = price as number;
            break;
          // Benutzerdefinierte Zeiten werden nicht gespeichert,
          // da sie nicht in der ProfileData-Struktur vorhanden sind
          default:
            break;
        }
      });
      
      // Erstelle ein synthetisches Event für die Aktualisierung
      const syntheticEvent = {
        target: {
          name: 'rates',
          value: ratesObject
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
  }, [rates, profileData.rates]);

  // Handle rate price change
  const handleRateChange = (id: string, price: string) => {
    setRates(prevRates => 
      prevRates.map(rate => 
        rate.id === id ? { ...rate, price } : rate
      )
    );
  };

  // Add a predefined duration
  const addPredefinedDuration = (duration: typeof DEFAULT_DURATIONS[0]) => {
    // Check if this duration already exists
    if (rates.some(rate => rate.id === duration.id)) {
      return;
    }
    
    setRates(prevRates => [
      ...prevRates,
      { ...duration, price: '' }
    ]);
  };

  // Add custom duration
  const addCustomDuration = () => {
    if (!customDuration || !customLabel) return;
    
    const durationValue = parseInt(customDuration);
    if (isNaN(durationValue) || durationValue <= 0) return;
    
    const newId = `custom_${Date.now()}`;
    
    setRates(prevRates => [
      ...prevRates,
      {
        id: newId,
        label: customLabel,
        value: durationValue,
        price: customPrice
      }
    ]);
    
    // Reset custom inputs
    setCustomDuration('');
    setCustomLabel('');
    setCustomPrice('');
  };

  // Remove a duration
  const removeDuration = (id: string) => {
    setRates(prevRates => prevRates.filter(rate => rate.id !== id));
  };

  // Available durations to add (exclude ones already added)
  const availableDurations = DEFAULT_DURATIONS.filter(
    duration => !rates.some(rate => rate.id === duration.id)
  );

  // Zeit-Kategorien für bessere visuelle Gruppierung
  const timeCategories = [
    {
      name: 'Kurze Zeit',
      durations: [
        { id: '15min', label: '15 Minuten', value: 15 },
        { id: '30min', label: '30 Minuten', value: 30 },
        { id: '45min', label: '45 Minuten', value: 45 },
      ]
    },
    {
      name: 'Stunden',
      durations: [
        { id: '1hour', label: '1 Stunde', value: 60 },
        { id: '2hours', label: '2 Stunden', value: 120 },
        { id: '3hours', label: '3 Stunden', value: 180 },
        { id: '4hours', label: '4 Stunden', value: 240 },
      ]
    },
    {
      name: 'Tage & Mehr',
      durations: [
        { id: '1day', label: '1 Tag', value: 1440 },
        { id: 'overnight', label: 'Übernachtung', value: 720 },
        { id: 'weekend', label: 'Wochenende', value: 2880 },
        { id: 'week', label: '1 Woche', value: 10080 },
      ]
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Preise</h2>
      
      {/* Zeitleiste zur Visualisierung */}
      <div className="mb-8 overflow-hidden">
        <div className="relative h-1.5 bg-gray-200 rounded-full mb-6">
          {/* Zeitmarker auf der Leiste */}
          <div className="absolute left-0 bottom-full mb-1 text-xs text-gray-500">15m</div>
          <div className="absolute left-1/4 bottom-full mb-1 text-xs text-gray-500">1h</div>
          <div className="absolute left-1/2 bottom-full mb-1 text-xs text-gray-500">4h</div>
          <div className="absolute left-3/4 bottom-full mb-1 text-xs text-gray-500">1 Tag</div>
          <div className="absolute right-0 bottom-full mb-1 text-xs text-gray-500">1 Woche</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {timeCategories.map((category) => (
            <div key={category.name} className="rounded-md border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                <h3 className="font-medium text-sm text-gray-700">{category.name}</h3>
              </div>
              <div className="p-3 space-y-3">
                {category.durations.map(duration => {
                  const existingRate = rates.find(r => r.id === duration.id);
                  const isAdded = !!existingRate;
                  return (
                    <div key={duration.id} className={`flex items-center justify-between p-2 rounded-md ${isAdded ? 'bg-rose-50 border border-rose-200' : 'bg-gray-50'}`}>
                      <span className="text-sm font-medium">{duration.label}</span>
                      
                      {isAdded ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-24 flex items-center bg-white rounded-md overflow-hidden border border-gray-300 focus-within:ring-1 focus-within:ring-rose-700 focus-within:border-rose-700">
                            <input
                              type="number"
                              value={existingRate.price}
                              onChange={(e) => handleRateChange(duration.id, e.target.value)}
                              className="w-full px-2 py-1 border-none focus:outline-none text-right"
                              min="0"
                              placeholder="0"
                            />
                            <span className="text-xs text-gray-500 px-1">CHF</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeDuration(duration.id)}
                            className="p-1 text-gray-400 hover:text-rose-700 rounded-md"
                            aria-label="Entfernen"
                          >
                            <MinusCircle size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addPredefinedDuration(duration)}
                          className="px-2 py-1 bg-rose-700 hover:bg-rose-700 text-white text-xs rounded-md flex items-center"
                        >
                          <PlusCircle size={12} className="mr-1" />
                          Hinzufügen
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Benutzerdefinierte Zeitdauer */}
      <div className="mb-8">
        <h3 className="text-md font-medium mb-3">Eigene Zeitdauer</h3>
        <div className="p-4 bg-gray-50 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label htmlFor="customDuration" className="block text-sm text-gray-700 mb-1">Dauer (Minuten)</label>
              <input
                type="number"
                id="customDuration"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-700"
                min="1"
                placeholder="z.B. 45"
              />
            </div>
            <div>
              <label htmlFor="customLabel" className="block text-sm text-gray-700 mb-1">Bezeichnung</label>
              <input
                type="text"
                id="customLabel"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-700"
                placeholder="z.B. 45 Minuten"
              />
            </div>
            <div>
              <label htmlFor="customPrice" className="block text-sm text-gray-700 mb-1">Preis (CHF)</label>
              <input
                type="number"
                id="customPrice"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-700"
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={addCustomDuration}
                disabled={!customDuration || !customLabel}
                className="px-3 py-1 bg-rose-700 hover:bg-rose-700 text-white rounded-md text-sm flex items-center"
              >
                <PlusCircle size={14} className="mr-1" />
                Hinzufügen
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 italic">
            <Info size={12} className="inline mr-1" />
            Hier können Sie eine beliebige Zeitdauer definieren, die nicht in den Standardoptionen enthalten ist.
          </p>
        </div>
      </div>
      
      {/* Aktuelle Tarife (zusammenfassende Ansicht) */}
      {rates.length > 0 && (
        <div className="mb-8">
          <h3 className="text-md font-medium mb-3">Meine aktuellen Tarife</h3>
          <div className="bg-white rounded-md border border-gray-200 divide-y divide-gray-200">
            {rates.map((rate) => (
              <div key={rate.id} className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium">{rate.label}</span>
                <span className="text-rose-700 font-medium">{rate.price || 0} CHF</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Zusätzliche Info */}
      <div className="mb-4">
        <label htmlFor="rates.info" className="block text-sm font-medium text-gray-700 mb-1">Zusätzliche Preisinformationen</label>
        <textarea 
          id="rates.info" 
          name="rates.info" 
          value={profileData.rates?.info || ''} 
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-600"
          rows={3}
          placeholder="Hier können Sie weitere Informationen zu Ihren Preisen angeben..."
        />
      </div>
    </div>
  );
};

export default RatesForm;
