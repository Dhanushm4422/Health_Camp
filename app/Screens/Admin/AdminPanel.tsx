import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const AdminPanel: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/Screens/Admin/AddCamp")}
        >
          <Feather name="plus-circle" size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add Health Camp</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/Screens/Admin/ViewCamp")}
        >
          <Feather name="list" size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View Health Camps</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/Screens/Admin/ViewComplaintsScreen")}
        >
          <Feather name="alert-circle" size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View Complaints</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/Screens/Admin/ViewFeedbacksScreen")}
        >
          <Feather name="message-square" size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View Feedbacks</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/Screens/Admin/ViewRegistrationScreen")}
        >
          <Feather name="users" size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View Registrations</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 20,
    backgroundColor: "#2E7D32",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  buttonsContainer: {
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AdminPanel;