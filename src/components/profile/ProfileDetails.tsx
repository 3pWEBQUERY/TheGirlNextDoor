interface ProfileDetailsProps {
  stats: {
    height: number; // in cm
    weight: number; // in kg
    measurements?: string; // optional
    hair: string;
    eyes: string;
    bodyType?: string;
    hairLength?: string;
    breastSize?: string;
    breastType?: string;
    intimate?: string;
    tattoos?: string;
    piercings?: string;
  };
  services: string[];
  languages: string[];
  rates: {
    hourly?: number;
    twoHours?: number;
    overnight?: number;
    weekend?: number;
  };
  availability: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

const ProfileDetails = ({
  stats,
  services,
  languages,
  rates,
  availability
}: ProfileDetailsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Persönliche Merkmale */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Persönliche Merkmale</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-gray-600">Größe</div>
              <div>{stats.height} cm</div>
              
              <div className="text-gray-600">Gewicht</div>
              <div>{stats.weight} kg</div>
              
              {stats.measurements && (
                <>
                  <div className="text-gray-600">Maße</div>
                  <div>{stats.measurements}</div>
                </>
              )}
              
              <div className="text-gray-600">Haare</div>
              <div>{stats.hair}</div>
              
              <div className="text-gray-600">Augen</div>
              <div>{stats.eyes}</div>
              
              {stats.bodyType && (
                <>
                  <div className="text-gray-600">Körperbau</div>
                  <div>{stats.bodyType}</div>
                </>
              )}
              
              {stats.hairLength && (
                <>
                  <div className="text-gray-600">Haarlänge</div>
                  <div>{stats.hairLength}</div>
                </>
              )}
              
              {stats.breastSize && (
                <>
                  <div className="text-gray-600">Brustgröße</div>
                  <div>{stats.breastSize}</div>
                </>
              )}
              
              {stats.breastType && (
                <>
                  <div className="text-gray-600">Brusttyp</div>
                  <div>{stats.breastType}</div>
                </>
              )}
              
              {stats.intimate && (
                <>
                  <div className="text-gray-600">Intim</div>
                  <div>{stats.intimate}</div>
                </>
              )}
              
              {stats.tattoos && (
                <>
                  <div className="text-gray-600">Tätowierungen</div>
                  <div>{stats.tattoos}</div>
                </>
              )}
              
              {stats.piercings && (
                <>
                  <div className="text-gray-600">Piercings</div>
                  <div>{stats.piercings}</div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Dienstleistungen */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Dienstleistungen</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {services.map((service, index) => (
                <span 
                  key={index} 
                  className="bg-primary-100 text-primary-600 text-xs py-1 px-2 rounded-button"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sprachen */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Sprachen</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col gap-3">
              {languages && languages.map((language, index) => {
                // Sicherer Umgang mit dem Sprachdatenformat
                // Kann entweder ein einfacher String oder ein 'Sprache:Level' Format sein
                let languageName = language;
                let proficiency = 'beginner';
                
                // Nur versuchen zu teilen, wenn es ein String ist und ':' enthält
                if (typeof language === 'string' && language.includes(':')) {
                  const parts = language.split(':');
                  languageName = parts[0]; // Nur der Name der Sprache
                  proficiency = parts[1];
                }
                
                // Standardwerte für die Sternanzeige basierend auf Position oder explizitem Level
                let starsCount = 3; // Standardwert
                
                if (proficiency === 'proficient') {
                  starsCount = 5;
                } else if (proficiency === 'advanced') {
                  starsCount = 4;
                } else if (proficiency === 'intermediate') {
                  starsCount = 3;
                } else if (proficiency === 'basic') {
                  starsCount = 2;
                } else if (proficiency === 'beginner') {
                  starsCount = 1;
                } else if (index === 0) {
                  starsCount = 5; // Erste Sprache: 5 Sterne
                } else if (index === 1) {
                  starsCount = 4; // Zweite Sprache: 4 Sterne
                }
                
                return (
                  <div key={index} className="flex items-center">
                    <span className="text-sm font-medium mr-3 min-w-24">{languageName}</span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <svg 
                          key={starIndex} 
                          className={`w-5 h-5 ${starIndex < starsCount ? 'text-[hsl(345.3,82.7%,40.8%)]' : 'text-gray-300'}`}
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Preise */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Preise</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-gray-600">1 Stunde</div>
              <div className="font-medium">
                {Number(rates.hourly) > 0 ? 
                  `${parseInt(String(rates.hourly), 10)} €` : 
                  '-'}
              </div>
              
              <div className="text-gray-600">2 Stunden</div>
              <div className="font-medium">
                {Number(rates.twoHours) > 0 ? 
                  `${parseInt(String(rates.twoHours), 10)} €` : 
                  '-'}
              </div>
              
              <div className="text-gray-600">Übernachtung</div>
              <div className="font-medium">
                {Number(rates.overnight) > 0 ? 
                  `${parseInt(String(rates.overnight), 10)} €` : 
                  '-'}
              </div>
              
              <div className="text-gray-600">Wochenende</div>
              <div className="font-medium">
                {Number(rates.weekend) > 0 ? 
                  `${parseInt(String(rates.weekend), 10)} €` : 
                  '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Verfügbarkeit */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Verfügbarkeit</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            <div className="flex flex-col items-center">
              <div className="text-gray-600 text-sm mb-1">Mo</div>
              <div className="w-full bg-white p-2 rounded-lg text-center text-sm">{availability.monday}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-600 text-sm mb-1">Di</div>
              <div className="w-full bg-white p-2 rounded-lg text-center text-sm">{availability.tuesday}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-600 text-sm mb-1">Mi</div>
              <div className="w-full bg-white p-2 rounded-lg text-center text-sm">{availability.wednesday}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-600 text-sm mb-1">Do</div>
              <div className="w-full bg-white p-2 rounded-lg text-center text-sm">{availability.thursday}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-600 text-sm mb-1">Fr</div>
              <div className="w-full bg-white p-2 rounded-lg text-center text-sm">{availability.friday}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-600 text-sm mb-1">Sa</div>
              <div className="w-full bg-white p-2 rounded-lg text-center text-sm">{availability.saturday}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-600 text-sm mb-1">So</div>
              <div className="w-full bg-white p-2 rounded-lg text-center text-sm">{availability.sunday}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
