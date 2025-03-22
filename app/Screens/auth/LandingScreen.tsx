import React, { useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from '../../../constants/i18n';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

const LandingScreen = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const setLanguage = async (lang: string) => {
    setSelectedLanguage(lang);
    await AsyncStorage.setItem('language', lang);
    i18next.changeLanguage(lang);
    
    Alert.alert("Language Selected", `You have selected ${lang.toUpperCase()}`);

    setTimeout(() => {
      router.push('/Screens/auth/RoleSelection');  // ✅ Use `router.push()` instead of `navigation.navigate`
    }, 1000);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../../../assets/images/logo.jpg')} style={{ width: 150, height: 150, marginBottom: 20 }} />
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{t('selectLanguage')}</Text>
      
      <Button title="English" onPress={() => setLanguage('en')} />
      <Button title="French" onPress={() => setLanguage('fr')} />

      {selectedLanguage && <Text style={{ marginTop: 20 }}>Selected Language: {selectedLanguage.toUpperCase()}</Text>}
    </View>
  );
};

export default LandingScreen;
