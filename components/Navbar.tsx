import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.navbarContainer}>
      {/* Navbar Icon */}
      <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

      {/* Navbar Items - Shown on Click */}
      {menuVisible && (
        <View style={styles.navMenu}>
          <TouchableOpacity onPress={() => router.push("../Screens/HomeScreen")}>
            <Text style={styles.navItem}>🏠 Health Camps</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../Screens/Emergency/NearbyEmergency")}>
            <Text style={styles.navItem}>📋 Emergency Service</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../Screens/UserProfile")}>
            <Text style={styles.navItem}>👤 User Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../Screens/MedicalReport")}>
            <Text style={styles.navItem}>📄 Medical Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../Screens/Game/GameScreen")}>
            <Text style={styles.navItem}>🎮 Health Game</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../Screens/GovtHomeScreen")}>
            <Text style={styles.navItem}> Government camps</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../Screens/HealthGuidelines")}>
            <Text style={styles.navItem}> Guidelines</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbarContainer: {
    position: "relative",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000, // Ensure navbar stays on top
  },
  navMenu: {
    position: "absolute",
    top: 50, // Ensures it appears below the icon
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 5, // Adds shadow effect
    zIndex: 999, // Ensures it's above everything
  },
  navItem: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    zIndex: 1000, // Ensure navbar stays on top
  },
});