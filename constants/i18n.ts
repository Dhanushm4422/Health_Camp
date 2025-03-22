import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      select_language: 'Which language do you prefer?',
      select_a_language: 'Select a language',
      selected_language: 'Selected Language',
      selectRole: 'Select your role',
      user: 'User',
      admin: 'Admin',
      ngo: 'NGO',
      health_student: 'Health Student',
      continue: 'Continue',
    },
  },
  fr: {
    translation: {
      select_language: 'Quelle langue préférez-vous ?',
      select_a_language: 'Sélectionnez une langue',
      selected_language: 'Langue sélectionnée',
      selectRole: 'Sélectionnez votre rôle',
      user: 'Utilisateur',
      admin: 'Administrateur',
      ngo: 'ONG',
      health_student: 'Étudiant en santé',
      continue: 'Continuer',
    },
  },
  es: {
    translation: {
      select_language: '¿Qué idioma prefieres?',
      select_a_language: 'Selecciona un idioma',
      selected_language: 'Idioma seleccionado',
      selectRole: 'Selecciona tu rol',
      user: 'Usuario',
      admin: 'Administrador',
      ngo: 'ONG',
      health_student: 'Estudiante de salud',
      continue: 'Continuar',
    },
  },
  ta: {
    translation: {
      select_language: 'நீங்கள் எந்த மொழியை விரும்புகிறீர்கள்?',
      select_a_language: 'மொழியை தேர்ந்தெடுக்கவும்',
      selected_language: 'தேர்ந்தெடுக்கப்பட்ட மொழி',
      selectRole: 'உங்கள் பங்கு தேர்ந்தெடுக்கவும்',
      user: 'பயனர்',
      admin: 'நிர்வாகி',
      ngo: 'சமூக அமைப்பு',
      health_student: 'மருத்துவ மாணவர்',
      continue: 'தொடரவும்',
    },
  },
};

const loadLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem('language');
    return storedLanguage || 'en'; // Default to English if not set
  } catch (error) {
    return 'en';
  }
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Change Language Dynamically
export const changeLanguage = async (lang: string) => {

  await AsyncStorage.setItem('language', lang);
  i18n.changeLanguage(lang);
};

export default i18n;
