// Verschiedene Servicekategorien für Escort-Profile

export interface ServiceOption {
  id: string;
  name: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  services: ServiceOption[];
}

// Standard-Services
export const standardServices: ServiceOption[] = [
  // Romantische & Intime Erfahrungen
  { id: 'girlfriend', name: 'Girlfriend Experience', description: 'Intime und persönliche Begleitung' },
  { id: 'couple', name: 'Paar-Erfahrung', description: 'Begleitung für Paare' },
  { id: 'kissing', name: 'Küssen', description: 'Küssen mit Leidenschaft' },
  { id: 'lingerie', name: 'Dessous', description: 'Besondere Dessous' },
  { id: 'greek', name: 'Griechisch', description: 'Spezielle Intimitäten' },
  { id: 'kisses', name: 'Küssen', description: 'Küssen' },
  { id: 'french-kissing', name: 'Zungenküsse', description: 'Zungenküsse' },
  { id: 'egging', name: 'Eierlecken', description: 'Eierlecken' },
  { id: 'handjob', name: 'Handjob', description: 'Handjob' },
  { id: 'duschservice', name: 'Duschservice', description: 'Duschservice' },
  { id: 'mehrfachspritzer', name: 'Mehrfachspritzer willkommen', description: 'Mehrfachspritzer willkommen' },
  { id: 'masturbieren', name: 'Masturbieren', description: 'Masturbieren' },
  { id: 'handjob', name: 'Handjob', description: 'Handjob' },
  
  
  // Erotische Unterhaltung
  { id: 'striptease', name: 'Striptease', description: 'Private Tanzvorführung' },
  { id: 'lap-dance', name: 'Lap Dance', description: 'Privater Tanz' },
  { id: 'erotic-dancing', name: 'Erotischer Tanz', description: 'Sinnliche Tanzvorführung' },
  { id: 'pole-dance', name: 'Pole Dance', description: 'Akrobatischer Tanz an der Stange' },
  { id: 'toys', name: 'Toys', description: 'Einsatz von Spielzeug' },
  { id: 'role-play', name: 'Rollenspiele', description: 'Gemeinsame Rollenspiele' },
  { id: 'reizwäsche', name: 'Reizwäsche', description: 'Reizwäsche' },
  { id: 'strip-poker', name: 'Strip-Poker', description: 'Erotisches Kartenspiel' },
  
  // Spezielle Vorlieben
  { id: 'anal', name: 'Anal', description: 'Anale Praktiken' },
  { id: 'deep', name: 'Deepthroat', description: 'Intensive orale Techniken' },
  { id: 'cim', name: 'In den Mund Spritzen', description: 'In den Mund Spritzen' },
  { id: 'cob', name: 'Körperbesamung', description: 'Auf den Körper Spritzen' },
  { id: 'cof', name: 'Ins Gesicht Spritzen', description: 'Ins Gesicht Spritzen' },
  { id: 'rimming', name: 'Rimming', description: 'Orale anale Stimulation' },
  { id: 'swallow', name: 'Schlucken', description: 'Orale Aufnahme' },
  { id: 'facesitting', name: 'Facesitting', description: 'Besondere Sitzposition' },
  { id: 'squirting', name: 'Squirting', description: 'Weibliche Ejakulation' },
  { id: 'fingering', name: 'Fingering', description: 'Fingerstreich' },
  { id: 'nylon', name: 'Nylen', description: 'Nylen' },
  { id: 'leather', name: 'Leder', description: 'Leder' },
  { id: 'squirting', name: 'Squirting', description: 'Squirting' },
  { id: 'latex', name: 'Latex', description: 'Latex' },
  { id: 'strapse', name: 'Strapse', description: 'Strapse' },
  { id: 'face-sitting', name: 'Facesitting', description: 'Besondere Sitzposition' },
  { id: 'analmassage-passiv', name: 'Analmassage (passiv)', description: 'Analmassage (passiv)' },
  { id: 'analmassage-aktiv', name: 'Analmassage (aktiv)', description: 'Analmassage (aktiv)' },
  { id: 'spanking', name: 'Spanking', description: 'Spanking' },
  
  // Für Paare & Gruppen
  { id: 'couples', name: 'Paare', description: 'Services für Paare' },
  { id: 'threesome', name: 'Dreier', description: 'Erfahrung zu dritt' },
  { id: 'group', name: 'Gruppenspiele', description: 'Erfahrungen mit mehreren Personen' },
  { id: 'swinger', name: 'Swinger', description: 'Begleitung zu Swinger-Clubs' },
  { id: 'bi-services', name: 'Bi-Services', description: 'Services für alle Geschlechter' },
  { id: 'dp', name: 'DP', description: 'Doppelte Penetration' },
  
  // Gesundheit & Sicherheit
  { id: 'safe', name: 'Safer Sex', description: 'Mit Schutzmitteln' },
  { id: 'regular-test', name: 'Regelmäßige Tests', description: 'Regelmäßige Gesundheitschecks' },
  { id: 'condom', name: 'Kondom-Pflicht', description: 'Strikter Kondomgebrauch' },
  { id: 'hygiene', name: 'Hohe Hygiene', description: 'Besonderer Wert auf Sauberkeit' },
  { id: 'discreet', name: 'Diskretion', description: 'Absolute Diskretion garantiert' }
];

// SM-Services
export const smServices: ServiceOption[] = [
  // Grundlagen & Rollenspiele
  { id: 'soft-sm', name: 'Soft-SM', description: 'Leichte SM-Praktiken' },
  { id: 'domina', name: 'Dominanz', description: 'Dominantes Rollenspiel' },
  { id: 'submission', name: 'Unterwerfung', description: 'Unterwürfiges Rollenspiel' },
  { id: 'role-dom', name: 'Rollenspiel (dominant)', description: 'Dominante Rollenspiele' },
  { id: 'role-sub', name: 'Rollenspiel (submissiv)', description: 'Unterwürfige Rollenspiele' },
  { id: 'switch', name: 'Switch', description: 'Wechselnde Dominanz/Unterwerfung' },
  { id: 'fantasy-play', name: 'Fantasy-Rollenspiele', description: 'Kreative Szenarien' },
  
  // Bondage & Restraint
  { id: 'bondage', name: 'Bondage', description: 'Fesselspiele' },
  { id: 'rope', name: 'Seil-Bondage', description: 'Kunstvolle Fesselung mit Seilen' },
  { id: 'cuffs', name: 'Handschellen', description: 'Fesselung mit Handschellen' },
  { id: 'restraints', name: 'Fesseln & Fixierungen', description: 'Verschiedene Arten von Fixierungen' },
  { id: 'blindfold', name: 'Augenbinde', description: 'Visuelle Deprivation' },
  { id: 'suspension', name: 'Suspension', description: 'Bondage in der Luft' },
  
  // Sensorische Spiele
  { id: 'spanking', name: 'Spanking', description: 'Verschiedene Schlagtechniken' },
  { id: 'wax-play', name: 'Wachsspiele', description: 'Spiele mit heißem Wachs' },
  { id: 'ice-play', name: 'Eisspiele', description: 'Temperaturspiele mit Kälte' },
  { id: 'sensory-dep', name: 'Sensorische Deprivation', description: 'Einschränkung der Sinne' },
  { id: 'sensory-play', name: 'Sensorische Stimulation', description: 'Intensive Sinnesreize' },
  { id: 'electro-play', name: 'Elektrostimulation', description: 'Reizstrom-Anwendungen' },
  
  // Spiele mit Macht
  { id: 'humiliation', name: 'Verbale Erniedrigung', description: 'Kontrollierte Erniedrigung' },
  { id: 'degradation', name: 'Degradierung', description: 'Kontrollierte Herabwürdigung' },
  { id: 'worship', name: 'Verehrung', description: 'Verehrung von Körperteilen' },
  { id: 'pet-play', name: 'Pet-Play', description: 'Rollenspiel als Haustier' },
  { id: 'master-slave', name: 'Master/Slave', description: 'Intensive Machtdynamik' },
  { id: 'discipline', name: 'Disziplinierung', description: 'Regeln und Konsequenzen' },
  
  // Fetische
  { id: 'foot-fetish', name: 'Fuß-Fetisch', description: 'Fußverehrung' },
  { id: 'fetish', name: 'Allgemeine Fetische', description: 'Verschiedene Fetische' },
  { id: 'latex', name: 'Latex/Gummi', description: 'Fetisch für Latexkleidung' },
  { id: 'leather', name: 'Leder', description: 'Fetisch für Lederkleidung' },
  { id: 'uniform', name: 'Uniformen', description: 'Rollenspiele mit Uniformen' },
  { id: 'breathplay', name: 'Atemkontrolle', description: 'Kontrolle der Atmung' },
  { id: 'watersports', name: 'Nass-Spiele', description: 'Spiele mit Flüssigkeiten' },
  
  // Sonstiges
  { id: 'medical', name: 'Medizinische Spiele', description: 'Medizinische Rollenspiele' },
  { id: 'pegging', name: 'Pegging', description: 'Umschnall-Dildo Praktiken' },
  { id: 'chastity', name: 'Keuschheit', description: 'Keuschhaltung/Keuschheitsspiele' },
  { id: 'sissy', name: 'Sissy-Training', description: 'Feminisierungsspiele' },
  { id: 'cbt', name: 'CBT', description: 'Spezielle Stimulationstechniken' }
];

// Digital-Services
export const digitalServices: ServiceOption[] = [
  // Bildmaterial
  { id: 'photos', name: 'Fotoshootings', description: 'Professionelle Fotosessions' },
  { id: 'selfies', name: 'Selfies', description: 'Persönliche Selfies' },
  { id: 'custom-photos', name: 'Custom Fotos', description: 'Maßgeschneiderte Fotografie' },
  { id: 'photo-sets', name: 'Foto-Sets', description: 'Thematische Fotoserien' },
  { id: 'lingerie-pics', name: 'Dessous-Bilder', description: 'Fotos in spezieller Wäsche' },
  { id: 'daily-pics', name: 'Tägliche Bilder', description: 'Regelmäßige Bildaktualisierungen' },
  
  // Video-Content
  { id: 'videos', name: 'Videos', description: 'Personalisierte Videos' },
  { id: 'video-calls', name: 'Video-Anrufe', description: 'Private Videoanrufe' },
  { id: 'custom-videos', name: 'Custom Videos', description: 'Maßgeschneiderte Videoinhalte' },
  { id: 'video-series', name: 'Video-Serien', description: 'Episodenhafte Videoinhalte' },
  { id: 'vlog', name: 'Vlog', description: 'Einblicke in den Alltag' },
  { id: 'behind-scenes', name: 'Behind the Scenes', description: 'Blick hinter die Kulissen' },
  
  // Live-Streaming
  { id: 'cam-shows', name: 'Cam-Shows', description: 'Live-Webcam-Shows' },
  { id: 'private-cam', name: 'Private Cam', description: 'Exklusive 1-zu-1 Cam-Shows' },
  { id: 'group-cam', name: 'Gruppen-Shows', description: 'Cam-Shows für kleine Gruppen' },
  { id: 'stream-games', name: 'Stream-Spiele', description: 'Interaktive Games während des Streams' },
  { id: 'reality-stream', name: 'Reality-Stream', description: 'Live-Übertragungen aus dem Alltag' },
  
  // Audio & Telefon
  { id: 'phone-calls', name: 'Telefonate', description: 'Erotische Gespräche' },
  { id: 'audio', name: 'Audio', description: 'Personalisierte Audioaufnahmen' },
  { id: 'asmr', name: 'ASMR', description: 'Sinnliche Audioerlebnisse' },
  { id: 'voice-notes', name: 'Sprachnachrichten', description: 'Kurzform-Audioinhalte' },
  { id: 'podcasts', name: 'Podcasts', description: 'Regelmäßige Audiosendungen' },
  
  // Messaging & Textinhalte
  { id: 'sexting', name: 'Sexting', description: 'Erotische Textnachrichten' },
  { id: 'chat-subscription', name: 'Chat-Abonnement', description: 'Regelmäßiger privater Austausch' },
  { id: 'story-telling', name: 'Story-Telling', description: 'Erotische Geschichten' },
  { id: 'role-play-chat', name: 'Rollenspiel-Chat', description: 'Textbasierte Rollenspiele' },
  { id: 'daily-updates', name: 'Tägliche Updates', description: 'Regelmäßige Textinhalte' },
  
  // Virtuelle Erfahrungen
  { id: 'online-dom', name: 'Online Dominanz', description: 'Virtuelles dominantes Rollenspiel' },
  { id: 'online-gfe', name: 'Online GFE', description: 'Virtuelle Girlfriend Experience' },
  { id: 'virtual-date', name: 'Virtuelles Date', description: 'Gemeinsame Online-Aktivitäten' },
  { id: 'gaming-together', name: 'Gemeinsames Gaming', description: 'Zusammen Online-Spiele spielen' },
  { id: 'watch-together', name: 'Watch Together', description: 'Gemeinsam Filme/Serien schauen' },
  
  // Fanclub & Premium-Content
  { id: 'fan-club', name: 'Fanclub', description: 'Exklusiver Mitgliederbereich' },
  { id: 'premium-snap', name: 'Premium Snapchat', description: 'Zugang zu privatem Snap-Account' },
  { id: 'content-site', name: 'Content-Plattform', description: 'Abonnement auf Content-Plattformen' },
  { id: 'private-social', name: 'Private Social Media', description: 'Zugang zu privaten Social Media Accounts' }
];

// Begleit-Services
export const escortServices: ServiceOption[] = [
  // Gesellschaftliche Begleitung
  { id: 'dinner', name: 'Dinner-Dates', description: 'Begleitung zum Abendessen' },
  { id: 'events', name: 'Events & Partys', description: 'Begleitung zu Veranstaltungen' },
  { id: 'business', name: 'Business-Events', description: 'Geschäftliche Veranstaltungen' },
  { id: 'meetings', name: 'Geschäftsmeetings', description: 'Begleitung zu Geschäftstreffen' },
  { id: 'conferences', name: 'Konferenzen', description: 'Begleitung zu Fachkonferenzen' },
  { id: 'networking', name: 'Networking-Events', description: 'Begleitung zu Netzwerk-Veranstaltungen' },
  
  // Reisebegleitung
  { id: 'travel', name: 'Reisebegleitung', description: 'Begleitung auf Reisen' },
  { id: 'weekend', name: 'Wochenendbegleitung', description: 'Begleitung übers Wochenende' },
  { id: 'vacation', name: 'Urlaubsbegleitung', description: 'Begleitung im Urlaub' },
  { id: 'cruises', name: 'Kreuzfahrtbegleitung', description: 'Begleitung auf Kreuzfahrten' },
  { id: 'city-trips', name: 'Städtereisen', description: 'Begleitung auf Städtereisen' },
  { id: 'international', name: 'Internationale Reisen', description: 'Begleitung auf internationalen Reisen' },
  
  // Freizeit & Kultur
  { id: 'shopping', name: 'Shopping', description: 'Gemeinsames Einkaufen' },
  { id: 'wellness', name: 'Wellness & Spa', description: 'Begleitung zu Wellness-Anwendungen' },
  { id: 'cultural', name: 'Kulturelle Events', description: 'Museum, Theater, Konzerte' },
  { id: 'sports', name: 'Sportevents', description: 'Sportveranstaltungen' },
  { id: 'nightlife', name: 'Nachtleben', description: 'Begleitung in Clubs und Bars' },
  { id: 'casino', name: 'Casino', description: 'Begleitung ins Casino' },
  { id: 'wine-tasting', name: 'Weinverkostung', description: 'Begleitung zu Weinproben' },
  { id: 'culinary', name: 'Kulinarische Events', description: 'Feinschmeckerveranstaltungen' },
  
  // Private Events
  { id: 'wedding-guest', name: 'Hochzeitsbegleitung', description: 'Begleitung als Hochzeitsgast' },
  { id: 'family-events', name: 'Familienveranstaltungen', description: 'Begleitung zu Familienfeiern' },
  { id: 'private-party', name: 'Private Feiern', description: 'Begleitung zu privaten Feiern' },
  { id: 'birthday', name: 'Geburtstagsbegleitung', description: 'Geburtstagsbegleitung als Geschenk' }
];

// Alle Servicekategorien
export const serviceCategories: ServiceCategory[] = [
  { id: 'standard', name: 'Standard Service', services: standardServices },
  { id: 'sm', name: 'SM Service', services: smServices },
  { id: 'digital', name: 'Digital Service', services: digitalServices },
  { id: 'escort', name: 'Begleit Service', services: escortServices }
];
