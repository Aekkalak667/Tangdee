import en from '../../dictionaries/en.json';
import th from '../../dictionaries/th.json';

export type Locale = 'th' | 'en';

const dictionaries = {
  en,
  th,
};

export const getDictionary = (lang: Locale) => dictionaries[lang];

export const t = (key: string, lang: Locale): string => {
  const dictionary = getDictionary(lang);
  const keys = key.split('.');
  
  let value: any = dictionary;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return the key if not found
    }
  }
  
  return typeof value === 'string' ? value : key;
};
