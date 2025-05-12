// Eine Liste der Sprachen der Welt
export interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

// Umfangreiche Liste von Weltsprachen
export const languages: Language[] = [
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'sq', name: 'Albanisch', nativeName: 'Albanian' },
  { code: 'ar', name: 'Arabisch', nativeName: 'Arabic' },
  { code: 'hy', name: 'Armenisch', nativeName: 'Armenian' },
  { code: 'az', name: 'Aserbaidschanisch', nativeName: ' Azerbaijani' },
  { code: 'be', name: 'Weissrussisch', nativeName: 'Belarusian' },
  { code: 'bs', name: 'Bosnisch', nativeName: 'Bosnian' },
  { code: 'bg', name: 'Bulgarisch', nativeName: 'Bulgarian' },
  { code: 'ce', name: 'Tschetschenisch', nativeName: 'Tschetschenian' },
  { code: 'zh', name: 'Chinesisch', nativeName: 'Chinese' },
  { code: 'hr', name: 'Kroatisch', nativeName: 'Croatian' },
  { code: 'cs', name: 'Tschechisch', nativeName: 'Czech' },
  { code: 'da', name: 'Dänisch', nativeName: 'Dansk' },
  { code: 'nl', name: 'Niederländisch', nativeName: 'Nederlands' },
  { code: 'en', name: 'Englisch', nativeName: 'English' },
  { code: 'et', name: 'Estnisch', nativeName: 'Eesti' },
  { code: 'fo', name: 'Färöisch', nativeName: 'Faroese' },
  { code: 'fj', name: 'Fidschi', nativeName: 'Fijian' },
  { code: 'fi', name: 'Finnisch', nativeName: 'Finnish' },
  { code: 'fr', name: 'Französisch', nativeName: 'Französisch' },
  { code: 'ka', name: 'Georgisch', nativeName: 'Georgian' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch' },
  { code: 'el', name: 'Griechisch', nativeName: 'Greek' },
  { code: 'ht', name: 'Haitianisch', nativeName: 'Haitian' },
  { code: 'he', name: 'Hebräisch', nativeName: 'Hebrew' },
  { code: 'hu', name: 'Ungarisch', nativeName: 'Magyar' },
  { code: 'id', name: 'Indonesisch', nativeName: 'Bahasa Indonesia' },
  { code: 'ga', name: 'Irisch', nativeName: 'Gaeilge' },
  { code: 'is', name: 'Islandisch', nativeName: 'Icelandic' },
  { code: 'it', name: 'Italienisch', nativeName: 'Italiano' },
  { code: 'ja', name: 'Japanisch', nativeName: 'Japanese' },
  { code: 'kn', name: 'Kannada', nativeName: 'Kannada' },
  { code: 'ks', name: 'Kaschmiri', nativeName: 'Kaschmiri' },
  { code: 'kk', name: 'Kasachisch', nativeName: 'Kasach' },
  { code: 'kg', name: 'Kongo', nativeName: 'KiKongo' },
  { code: 'ko', name: 'Koreanisch', nativeName: 'Korean' },
  { code: 'ku', name: 'Kurdisch', nativeName: 'Kurdish' },
  { code: 'lb', name: 'Luxemburgisch', nativeName: 'Luxembourgish' },
  { code: 'lo', name: 'Laotisch', nativeName: 'Lao' },
  { code: 'lt', name: 'Litauisch', nativeName: 'Lithuanian' },
  { code: 'lv', name: 'Lettisch', nativeName: 'Latvian' },
  { code: 'mk', name: 'Mazedonisch', nativeName: 'Macedonian' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy' },
  { code: 'ml', name: 'Malayalam', nativeName: 'Malayalam' },
  { code: 'mt', name: 'Maltesisch', nativeName: 'Malti' },
  { code: 'mn', name: 'Mongolisch', nativeName: 'Mongolian' },
  { code: 'nb', name: 'Norwegisch', nativeName: 'Norwegisch' },
  { code: 'ne', name: 'Nepali', nativeName: 'Nepali' },
  { code: 'fa', name: 'Persisch', nativeName: 'Persian' },
  { code: 'pl', name: 'Polnisch', nativeName: 'Polish' },
  { code: 'pt', name: 'Portugiesisch', nativeName: 'Portuguese' },
  { code: 'rm', name: 'Rumänisch', nativeName: 'Rumanian' },
  { code: 'ru', name: 'Russisch', nativeName: 'Russian' },
  { code: 'sr', name: 'Serbisch', nativeName: 'Serbian' },
  { code: 'gd', name: 'Schottisches', nativeName: 'GaeSchottisch' },
  { code: 'sk', name: 'Slowakisch', nativeName: 'Slovak' },
  { code: 'sl', name: 'Slowenisch', nativeName: 'Slovenian' },
  { code: 'so', name: 'Somali', nativeName: 'Somali' },
  { code: 'es', name: 'Spanisch', nativeName: 'Spanish' },
  { code: 'sv', name: 'Schwedisch', nativeName: 'Swedish' },
  { code: 'ta', name: 'Tamil', nativeName: 'Tamil' },
  { code: 'tg', name: 'Tadschikisch', nativeName: 'Tajik' },
  { code: 'th', name: 'Thailändisch', nativeName: 'Thai' },
  { code: 'bo', name: 'Tibetisch', nativeName: 'Tibetan' },
  { code: 'tk', name: 'Turkmenisch', nativeName: 'Turkmen' },
  { code: 'to', name: 'Tongaisch', nativeName: 'Tongan' },
  { code: 'tr', name: 'Türkisch', nativeName: 'Turkish' },
  { code: 'ty', name: 'Tahitianisch', nativeName: 'Tahitian' },
  { code: 'ug', name: 'Uigurisch', nativeName: 'Uyghur' },
  { code: 'uk', name: 'Ukrainisch', nativeName: 'Ukrainian' },
  { code: 'uz', name: 'Usbekisch', nativeName: 'Uzbek' },
  { code: 'vi', name: 'Vietnamesisch', nativeName: 'Vietnamese' },
  { code: 'cy', name: 'Walisisch', nativeName: 'Cymreig' }
];

// Format: Sprachkenntnisse
export interface LanguageProficiency {
  id: string;
  name: string;
  stars: number;
}

export const proficiencyLevels: LanguageProficiency[] = [
  { id: 'beginner', name: 'Grundkenntnisse', stars: 1 },
  { id: 'elementary', name: 'Elementare Kenntnisse', stars: 2 },
  { id: 'intermediate', name: 'Mittlere Kenntnisse', stars: 3 },
  { id: 'advanced', name: 'Fortgeschrittene Kenntnisse', stars: 4 },
  { id: 'proficient', name: 'Fließend', stars: 5 }
];
