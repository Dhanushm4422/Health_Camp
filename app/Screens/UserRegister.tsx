import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../constants/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";

const UserRegister = () => {
  const router = useRouter();
  const { campId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "registrations"), {
        campId,
        name,
        email,
        phone,
        address,
        age: age ? parseInt(age) : null,
        createdAt: Timestamp.fromDate(new Date()),
      });
      Alert.alert("Success", "Registration successful");
      router.back();
    } catch (error) {
      console.error("Error registering:", error);
      Alert.alert("Error", "Failed to register");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F5F5F5" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register for Health Camp</Text>
      </View>
      
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.formSubtitle}>Please fill in your details to register</Text>
          
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={styles.inputContainer}>
            <Feather name="user" size={18} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <Text style={styles.inputLabel}>Email Address *</Text>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={18} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <Text style={styles.inputLabel}>Phone Number *</Text>
          <View style={styles.inputContainer}>
            <Feather name="phone" size={18} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          
          <Text style={styles.inputLabel}>Address (Optional)</Text>
          <View style={styles.inputContainer}>
            <Feather name="map-pin" size={18} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              placeholderTextColor="#888"
              value={address}
              onChangeText={setAddress}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          
          <Text style={styles.inputLabel}>Age (Optional)</Text>
          <View style={styles.inputContainer}>
            <Feather name="calendar" size={18} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor="#888"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
          
          <Text style={styles.noteText}>
            Fields marked with * are required
          </Text>
          
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
          >
            <Feather name="check-circle" size={18} color="#FFF" />
            <Text style={styles.registerButtonText}>Complete Registration</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    padding: 16,
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  formSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  noteText: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    marginBottom: 20,
    fontStyle: "italic",
  },
  registerButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  registerButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  cancelButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UserRegister;