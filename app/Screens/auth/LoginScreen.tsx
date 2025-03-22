import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../constants/firebase";
const useRouter = require("expo-router").useRouter;
import * as Location from "expo-location";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Function to Check Location Permission and GPS Status
  const checkLocationPermission = async () => {
    console.log("🔍 Checking location permissions...");

    // Check if location services (GPS) are enabled
    const isLocationEnabled = await Location.hasServicesEnabledAsync();
    console.log("📍 Is GPS enabled?:", isLocationEnabled);

    if (!isLocationEnabled) {
      Alert.alert(
        "Location Disabled",
        "Please turn on location services in your device settings."
      );
      return false;
    }

    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log("📜 Permission status:", status);

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please enable location to proceed.");
      return false;
    }

    console.log("✅ Location permission granted!");
    return true;
  };

  // 🔹 Handle Login Function
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password!");
      return;
    }

    try {
      console.log("🔑 Attempting login...");
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Login Successful!");
      console.log("✅ Login successful!");

      // 🔹 Check Location Permission Before Proceeding
      const isLocationAvailable = await checkLocationPermission();
      console.log("📍 Can proceed with location?:", isLocationAvailable);

      if (!isLocationAvailable) {
        Alert.alert(
          "Location Required",
          "Please enable location services to continue.",
          [{ text: "OK", onPress: () => console.log("🔔 User prompted to enable location") }]
        );
      } else {
        console.log("🚀 Navigating to Home Screen...");
        router.push("/Screens/HomeScreen");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error.message);
      Alert.alert("Error", "Invalid email or password!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Screens/auth/RegisterScreenUser")}>
        <Text style={styles.toggleText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  toggleText: {
    fontSize: 16,
    color: "#007BFF",
    marginTop: 10,
  },
});