import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { db, auth } from "../../../constants/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface Complaint {
  id: string;
  email: string;
  complaint: string;
  healthCampName: string;
  createdAt: Timestamp;
}

const ViewComplaintsScreen: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const adminId = auth.currentUser?.uid;
      if (!adminId) return;

      // First, get all health camps managed by this admin
      const healthCampsQuery = query(collection(db, "healthCamps"), where("adminId", "==", adminId));
      const healthCampsSnapshot = await getDocs(healthCampsQuery);
      
      if (healthCampsSnapshot.empty) {
        console.log("No health camps found for this admin");
        return;
      }
      
      const healthCampNames = healthCampsSnapshot.docs.map((doc) => doc.data().healthCampName);
      console.log("Health camp names:", healthCampNames);

      // Query complaints collection
      const complaintsQuery = query(collection(db, "complaints"));
      const complaintsSnapshot = await getDocs(complaintsQuery);
      
      if (complaintsSnapshot.empty) {
        console.log("No complaints found");
        return;
      }

      // Filter complaints for the admin's health camps
      const complaintsData: Complaint[] = [];
      
      complaintsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        console.log("Complaint data:", data);
        
        if (healthCampNames.includes(data.healthCampName)) {
          complaintsData.push({
            id: doc.id,
            email: data.email,
            complaint: data.complaint,
            healthCampName: data.healthCampName,
            createdAt: data.createdAt,
          });
        }
      });
      
      console.log("Filtered complaints:", complaintsData);
      setComplaints(complaintsData);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return "Unknown date";
    }
    
    try {
      return timestamp.toDate().toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaints</Text>
      
      {complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="alert-circle" size={60} color="#CCC" />
          <Text style={styles.emptyText}>No complaints available</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.campName}>{item.healthCampName}</Text>
              <Text style={styles.complaintText}>{item.complaint}</Text>
              <View style={styles.metaContainer}>
                <Text style={styles.metaText}>{item.email}</Text>
                <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
              </View>
            </View>
          )}
        />
      )}
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  campName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  complaintText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    paddingTop: 12,
  },
  metaText: {
    fontSize: 12,
    color: "#888",
  },
  backButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
    marginTop: 16,
  },
});

export default ViewComplaintsScreen;