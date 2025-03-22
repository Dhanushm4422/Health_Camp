import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";

const CampDetails = () => {
  const params = useLocalSearchParams() || {};

  // Debugging - Check received params
  console.log("Received params:", params);

  // Convert medicalFacilities string to an array safely
  let medicalFacilities = [];
  try {
    medicalFacilities = Array.isArray(params.medicalFacilities)
      ? params.medicalFacilities
      : JSON.parse(params.medicalFacilities || "[]");
  } catch (error) {
    console.error("Error parsing medicalFacilities:", error);
  }

  // Function to open Google Maps
  const openMaps = () => {
    if (params.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(params.location)}`;
      Linking.openURL(url).catch((err) => console.error("Failed to open Maps:", err));
    } else {
      console.error("Location is missing");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.innerContainer}>
          <Image 
            source={{ uri: Array.isArray(params.image) ? params.image[0] : params.image || "https://via.placeholder.com/200" }} 
            style={styles.postImage} 
          />
          <Text style={styles.postContainer}>{params.campName || "Camp Name Not Available"}</Text>
          <Text style={styles.postLocation}>📍 {params.location || "Location Not Available"}</Text>
          
          <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
            <Text style={styles.mapButtonText}>View Location on Maps</Text>
          </TouchableOpacity>
  
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍⚕️ Doctor</Text>
            <Text style={styles.detailText}>{params.doctorName || "Doctor Name Not Available"}</Text>
            <Text style={styles.detailText}>{params.doctorDetails || "Doctor Details Not Available"}</Text>
          </View>
  
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏥 Medical Facilities</Text>
            {medicalFacilities.length > 0 ? (
              medicalFacilities.map((facility: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                <Text key={index} style={styles.detailText}>✅ {facility}</Text>
              ))
            ) : (
              <Text style={styles.detailText}>No medical facilities available</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
  
};

export default CampDetails;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1, // Allows the content to grow and align properly
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    width: "100%", 
    padding: 20,
  },
  innerContainer: {
    width: "100%",
    height:"90%", 
    maxWidth: 400, 
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center", // Ensure content inside is centered
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  postContainer: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 5,
  },
  postLocation: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  mapButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginBottom: 12,
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  section: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
    textAlign: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginTop: 4,
  },
});
