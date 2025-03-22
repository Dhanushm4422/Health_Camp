import 'react-native-reanimated'; // ✅ Place at the topmost part
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
const Stack = require("expo-router").Stack;

import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="RoleSelection" options={{ headerShown: false }} />
        <Stack.Screen name="NocUpload" options={{ title: "Upload NOC" }} />
        <Stack.Screen name="Home" options={{ title: "Home" }} />
        <Stack.Screen name="CampDetails" options={{ title: "Camp Details" }} />
        <Stack.Screen name="userprofile" options={{ title: "User Profile" }} />
        <Stack.Screen name="Screens/Admin/AdminPanel" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/Admin/AddCamp" options={{ title: "Add Camp" }} />
        <Stack.Screen name="Screens/Admin/ViewCamp" options={{ title: "View Camps" }} />
        <Stack.Screen name="Screens/Admin/EditCamp" options={{ title: "Edit Camp" }} />
        <Stack.Screen name="Screens/Admin/ViewComplaintsScreen" options={{ title: "View Complaints" }} />
        <Stack.Screen name="Screens/Admin/ViewFeedbacksScreen" options={{ title: "View Feedback" }} />
        <Stack.Screen name="Screens/Admin/ViewRegistrationScreen" options={{ title: "View Registrations" }} />
        <Stack.Screen name="Screens/HomeScreen" options={{ title: "Home Screen" }} />
        <Stack.Screen name="Screens/UserRegister" options={{ title: "Register" }} />
        <Stack.Screen name="Screens/auth/LoginScreen" options={{ title: "Login screen" }} />
        <Stack.Screen name="Screens/MedicalReport" option={{title:"Medical Reports"}}/>
        <Stack.Screen name="Screens/Game/GameScreen" option={{title:"Health Games"}}/>
        <Stack.Screen name="govtHomeScreen" options={{ title: "Government Camps" }} />
        <Stack.Screen name="HealthGuidelines" options={{ title: "Guidelines" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}