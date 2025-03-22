import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { db, auth } from "../../../constants/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface Feedback {
  id: string;
  email: string;
  feedback: string;
  campName?: string; // Changed from healthCampName to match what's in the database
  healthCampName?: string; // Add this as alternative
  timestamp: Timestamp; // Changed from createdAt to timestamp
  rating: number;
}

const ViewFeedbacksScreen: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
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

      // Query feedbacks collection
      const feedbacksQuery = query(collection(db, "feedbacks"));
      const feedbacksSnapshot = await getDocs(feedbacksQuery);
      
      if (feedbacksSnapshot.empty) {
        console.log("No feedbacks found");
        return;
      }

      // Filter feedbacks for the admin's health camps
      const feedbacksData: Feedback[] = [];
      
      feedbacksSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        console.log("Feedback data:", data);
        
        // Check if this feedback is for one of the admin's camps
        // Try both healthCampName and campName fields
        const feedbackCampName = data.healthCampName || data.campName;
        
        if (healthCampNames.includes(feedbackCampName)) {
          feedbacksData.push({
            id: doc.id,
            email: data.email,
            feedback: data.feedback,
            healthCampName: feedbackCampName,
            timestamp: data.timestamp,
            rating: data.rating || 0,
          });
        }
      });
      
      console.log("Filtered feedbacks:", feedbacksData);
      setFeedbacks(feedbacksData);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
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

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Feather
          key={i}
          name="star"
          size={16}
          color={i <= rating ? "#FFD700" : "#CCC"}
        />
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedbacks</Text>
      
      {feedbacks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="message-square" size={60} color="#CCC" />
          <Text style={styles.emptyText}>No feedbacks available</Text>
        </View>
      ) : (
        <FlatList
          data={feedbacks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.campName}>{item.healthCampName}</Text>
              <View style={styles.ratingContainer}>
                {renderRating(item.rating)}
                <Text style={styles.ratingText}>({item.rating.toFixed(1)})</Text>
              </View>
              <Text style={styles.feedbackText}>{item.feedback}</Text>
              <View style={styles.metaContainer}>
                <Text style={styles.metaText}>{item.email}</Text>
                <Text style={styles.metaText}>{formatDate(item.timestamp)}</Text>
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#888",
  },
  feedbackText: {
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

export default ViewFeedbacksScreen;