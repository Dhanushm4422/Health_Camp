import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../../constants/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Register() {
  const [role, setRole] = useState<string | null>(null); // Role from previous screen
  const [subRole, setSubRole] = useState("ngo_admin"); // Default sub-role
  const [name, setName] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Fetch role from AsyncStorage when the component loads
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("selectedRole");
        console.log("Fetched Role:", storedRole); // Debugging
        if (storedRole) {
          setRole(storedRole);
        } else {
          console.warn("No role found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchRole();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password || (role === "admin" && !uniqueId)) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userData = {
        uid: user.uid,
        name,
        uniqueId,
        email,
        role: role,
        subRole: role, // This was incorrectly set; now properly using subRole
        createdAt: serverTimestamp(),
      };

      let collectionName = "users"; // Default collection

      if (role === "admin") {
        userData = { ...userData, uniqueId, subRole };
        collectionName = subRole === "ngo_admin" ? "ngos" : "students";
      }

      await setDoc(doc(db, collectionName, user.uid), userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      Alert.alert("Success", "Registration Successful! Please login.");
      router.push("/Screens/auth/AdminLogin");
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Registration</Text>

      {role === "admin" && (
        <>
          <Text style={styles.label}>Select Admin Role</Text>
          <Picker 
            selectedValue={subRole} 
            onValueChange={(itemValue) => setSubRole(itemValue)} 
            style={styles.picker}
          >
            <Picker.Item label="NGO Admin" value="ngo_admin" />
            <Picker.Item label="Health Student" value="health_student" />
          </Picker>
        </>
      )}

      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        value={name} 
        onChangeText={setName} 
      />

      {role === "admin" && (
        <TextInput
          style={styles.input}
          placeholder={subRole === "ngo_admin" ? "NGO Unique ID" : "Student ID"}
          value={uniqueId}
          onChangeText={setUniqueId}
        />
      )}

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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Screens/auth/AdminLogin")}>
        <Text style={styles.toggleText}>Already registered? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleText: {
    marginTop: 15,
    color: "#007BFF",
  },
});