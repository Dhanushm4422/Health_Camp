import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../constants/firebase"; // Ensure correct import

// Define UserData Type
interface UserData {
  fullName: string;
  email: string;
  phoneNumber: string | number; // Can be string or number
  gender: string;
  dob: string;
  locality: string;
  uid: string;
  profileImage?: string; // Optional field
}

interface Camp {
  id: string;
  healthCampName: string;
  date: string;
  verified: boolean;
}

// Define prop types for ProfileSection
interface ProfileSectionProps {
  userData: UserData;
  editMode: boolean;
  updatedData: Partial<UserData>;
  setUpdatedData: (data: Partial<UserData>) => void;
  handleUpdate: () => void;
  setEditMode: (mode: boolean) => void;
}

// Define prop types for CampSection
interface CampSectionProps {
  camps: Camp[];
  title: string;
  showStatus?: boolean;
}

// Reusable Components
const ProfileSection = ({
  userData,
  editMode,
  updatedData,
  setUpdatedData,
  handleUpdate,
  setEditMode,
}: ProfileSectionProps) => (
  <View style={styles.profileContainer}>
    <Image
      source={{ uri: userData.profileImage || "https://www.w3schools.com/howto/img_avatar.png" }}
      style={styles.profileImage}
    />
    <Button title={editMode ? "Cancel" : "Edit Details"} onPress={() => setEditMode(!editMode)} />

    {Object.entries(userData).map(([key, value]) => (
      <View key={key} style={styles.row}>
        <Text style={styles.label}>{key.replace(/([A-Z])/g, " $1").trim()}:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={String(updatedData[key as keyof UserData] || "")} // Convert to string
            onChangeText={(text) =>
              setUpdatedData((prev) => ({ ...(prev || {}), [key]: text })) // Fix applied here
            }
          />
        ) : (
          <Text style={styles.userInfo}>{String(value)}</Text>
        )}
      </View>
    ))}

    {editMode && <Button title="Save Changes" onPress={handleUpdate} color="green" />}
  </View>
);

const CampSection = ({ camps, title, showStatus = false }: CampSectionProps) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {camps.length > 0 ? (
      camps.map((camp) => (
        <View key={camp.id} style={styles.campItem}>
          <Text style={styles.campName}>{camp.healthCampName}</Text>
          <Text style={styles.campDate}>Date: {camp.date}</Text>
          {showStatus && (
            <Text style={styles.campStatus}>
              Status: {camp.verified ? "Verified" : "Not Verified"}
            </Text>
          )}
        </View>
      ))
    ) : (
      <Text style={styles.noCampsText}>No camps available.</Text>
    )}
  </View>
);

const UserProfile = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState<Partial<UserData>>({}); // Initialize as empty object
  const [registeredCamps, setRegisteredCamps] = useState<Camp[]>([]); // User's registered camps
  const [verifiedCamps, setVerifiedCamps] = useState<Camp[]>([]); // Verified camps

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            setUpdatedData(data); // Initialize updatedData with user data
          } else {
            setError("User data not found.");
          }

          // Fetch user's registered camps
          const registrationsQuery = query(collection(db, "registrations"), where("email", "==", user.email));
          const registrationsSnapshot = await getDocs(registrationsQuery);
          const campsData: Camp[] = [];

          for (const regDoc of registrationsSnapshot.docs) {
            const campId = regDoc.data().campId;
            const campDoc = await getDoc(doc(db, "healthCamps", campId));
            if (campDoc.exists()) {
              const campData = campDoc.data();
              const campDate = campData.date
                ? campData.date.toDate // Check if date is a Firestore Timestamp
                  ? campData.date.toDate().toLocaleDateString() // Convert to date string
                  : campData.date // Use as-is if it's already a string
                : "No date available"; // Fallback if date is missing

              campsData.push({
                id: campId,
                healthCampName: campData.healthCampName,
                date: campDate,
                verified: regDoc.data().verified || false,
              });
            }
          }

          setRegisteredCamps(campsData);
          setVerifiedCamps(campsData.filter((camp) => camp.verified)); // Filter verified camps
        } else {
          setError("No authenticated user.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle updating user data
  const handleUpdate = async () => {
    if (!auth.currentUser || !updatedData) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, updatedData);
      setUserData(updatedData as UserData);
      setEditMode(false);
      Alert.alert("Success", "User details updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to update user details.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userData && (
        <ProfileSection
          userData={userData}
          editMode={editMode}
          updatedData={updatedData}
          setUpdatedData={setUpdatedData}
          handleUpdate={handleUpdate}
          setEditMode={setEditMode}
        />
      )}

      <CampSection camps={registeredCamps} title="My Registered Camps" showStatus />
      <CampSection camps={verifiedCamps} title="Verified Camps" />
    </ScrollView>
  );
};

export default UserProfile;

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfo: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },
  campItem: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  campName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  campDate: {
    fontSize: 14,
    color: "#333",
  },
  campStatus: {
    fontSize: 14,
    color: "#666",
  },
  noCampsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
});
