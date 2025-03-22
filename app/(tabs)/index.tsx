import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { changeLanguage } from '../../constants/i18n'; // Import language change function
import { useRouter } from 'expo-router'; // ✅ Corrected import

const IndexScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter(); // ✅ Use useRouter() from expo-router
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    const loadStoredLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('language');
      if (storedLang) {
        setSelectedLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      }
    };
    loadStoredLanguage();
  }, []);

  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    await changeLanguage(lang);
    i18n.changeLanguage(lang);
    Alert.alert(t('selected_language'), t('language_changed_to') + ' ' + lang.toUpperCase());

    setTimeout(() => {
      router.push('/Screens/auth/RoleSelection'); // ✅ Use router.push()
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('select_language')}</Text>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={handleLanguageChange}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label={t('select_a_language')} value={null} enabled={false} />
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Français" value="fr" />
          <Picker.Item label="Español" value="es" />
          <Picker.Item label="தமிழ்" value="ta" />
        </Picker>
      </View>

      <Text style={styles.selectedLang}>{t('selected_language')}: {selectedLanguage.toUpperCase()}</Text>

      {/* <Button title="Go to Admin NOC Upload" onPress={() => router.push('/Screens/AdminNocUpload')} color="#007BFF" /> */}
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  dropdownContainer: {
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
  },
  selectedLang: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 10,
  },
});
