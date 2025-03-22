import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await AsyncStorage.getItem('language');
      if (lang) {
        i18n.changeLanguage(lang);
      }
    };
    loadLanguage();
  }, []);

  // ✅ Store role in AsyncStorage when selected
  const handleRoleSelection = async (role: 'user' | 'admin') => {
    try {
      setSelectedRole(role);
      await AsyncStorage.setItem('selectedRole', role); // Save role
      console.log("Saved Role:", role); // Debugging
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleContinue = async () => {
    try {
      const storedRole = await AsyncStorage.getItem('selectedRole');
      console.log("Fetched Role from AsyncStorage:", storedRole); // Debugging

      let path = '';

      if (storedRole === 'user') {
        path = '/Screens/auth/RegisterScreenUser';
      } else if (storedRole === 'admin') {
        path = '/Screens/auth/RegisterAdmin';
      }

      if (path) {
        router.push(path as any);
      }
    } catch (error) {
      console.error("Error retrieving role:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('selectRole')}</Text>

      {/* Role Selection (User / Admin) */}
      <View style={styles.selectionContainer}>
        <TouchableOpacity
          style={[styles.option, selectedRole === 'user' && styles.selectedOption]}
          onPress={() => handleRoleSelection('user')} // ✅ Now saves role
        >
          <Image source={require('../../../assets/images/user.png')} style={styles.image} />
          <Text style={styles.optionText}>{t('user')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, selectedRole === 'admin' && styles.selectedOption]}
          onPress={() => handleRoleSelection('admin')} // ✅ Now saves role
        >
          <Image source={require('../../../assets/images/admin.jpg')} style={styles.image} />
          <Text style={styles.optionText}>{t('admin')}</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedRole && styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <Text style={styles.continueButtonText}>{t('continue')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F9',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2C3E50',
    textAlign: 'center',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 10,
  },
  selectedOption: {
    borderColor: '#007BFF',
    backgroundColor: '#E3F2FD',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: '#28A745',
    paddingVertical: 12,
    width: '80%',
    alignItems: 'center',
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  disabledButton: {
    backgroundColor: '#AAB7C4',
  },
});