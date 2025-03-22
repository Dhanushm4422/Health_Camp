import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { db, auth } from "../../../constants/firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import * as FileSystem from "expo-file-system";
import * as Sharing from 'expo-sharing';
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Registration {
  id: string;
  campId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  verified: boolean;
}

interface Camp {
  id: string;
  healthCampName: string;
}

interface CampReport {
  campName: string;
  totalRegistrations: number;
  verifiedRegistrations: number;
}

const ViewRegistrationsScreen = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [campReports, setCampReports] = useState<CampReport[]>([]);
  const [selectedCamp, setSelectedCamp] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    const adminId = auth.currentUser?.uid;
    if (!adminId) return;

    // Fetch health camps created by the admin
    const healthCampsQuery = query(collection(db, "healthCamps"), where("adminId", "==", adminId));
    const healthCampsSnapshot = await getDocs(healthCampsQuery);
    const healthCampIds = healthCampsSnapshot.docs.map((doc) => doc.id);

    // Store camp data for mapping
    const campsData: Camp[] = healthCampsSnapshot.docs.map((doc) => ({
      id: doc.id,
      healthCampName: doc.data().healthCampName,
    }));
    setCamps(campsData);

    // Fetch registrations for these health camps
    const registrationsQuery = query(collection(db, "registrations"), where("campId", "in", healthCampIds));
    const registrationsSnapshot = await getDocs(registrationsQuery);
    const registrationsData: Registration[] = registrationsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        campId: data.campId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        createdAt: data.createdAt.toDate(),
        verified: data.verified || false,
      } as Registration;
    });
    setRegistrations(registrationsData);

    // Calculate camp reports
    const reports: CampReport[] = campsData.map((camp) => {
      const campRegistrations = registrationsData.filter((reg) => reg.campId === camp.id);
      const verifiedRegistrations = campRegistrations.filter((reg) => reg.verified).length;
      return {
        campName: camp.healthCampName,
        totalRegistrations: campRegistrations.length,
        verifiedRegistrations,
      };
    });
    setCampReports(reports);
  };

  const handleVerify = async (registrationId: string, campId: string) => {
    try {
      // Update the registration to mark it as verified
      const registrationRef = doc(db, "registrations", registrationId);
      await updateDoc(registrationRef, { verified: true });

      // Update the local state to reflect the verification
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg.id === registrationId ? { ...reg, verified: true } : reg
        )
      );

      // Recalculate camp reports
      const updatedReports = campReports.map((report) => {
        if (camps.find((camp) => camp.id === campId)?.healthCampName === report.campName) {
          return {
            ...report,
            verifiedRegistrations: report.verifiedRegistrations + 1,
          };
        }
        return report;
      });
      setCampReports(updatedReports);

      Alert.alert("Success", "Registration verified successfully!");
    } catch (error) {
      console.error("Error verifying registration:", error);
      Alert.alert("Error", "Failed to verify registration.");
    }
  };

  const generateCSV = () => {
    let csvContent = "Camp Name,Total Registrations,Verified Registrations\n";
    campReports.forEach((report) => {
      csvContent += `${report.campName},${report.totalRegistrations},${report.verifiedRegistrations}\n`;
    });
    return csvContent;
  };

  const downloadCSV = async () => {
    const csvContent = generateCSV();
    const fileUri = FileSystem.documentDirectory + "camp_reports.csv";

    try {
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Sharing is not available on this device.");
        return;
      }

      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Share Camp Report',
        UTI: 'public.comma-separated-values-text',
      });

      Alert.alert("Success", "CSV file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      Alert.alert("Error", "Failed to download CSV file.");
    }
  };

  const getCampName = (campId: string) => {
    const camp = camps.find((c) => c.id === campId);
    return camp ? camp.healthCampName : "Unknown Camp";
  };

  const filteredRegistrations = selectedCamp
    ? registrations.filter((reg) => {
        const camp = camps.find((c) => c.id === reg.campId);
        return camp && camp.healthCampName === selectedCamp;
      })
    : registrations;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrations</Text>

      {/* Camp Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedCamp === null && styles.activeFilterButton,
          ]}
          onPress={() => setSelectedCamp(null)}
        >
          <Text style={[
            styles.filterButtonText,
            selectedCamp === null && styles.activeFilterText,
          ]}>All Camps</Text>
        </TouchableOpacity>
        
        {campReports.map((report) => (
          <TouchableOpacity
            key={report.campName}
            style={[
              styles.filterButton,
              selectedCamp === report.campName && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedCamp(report.campName)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedCamp === report.campName && styles.activeFilterText,
            ]}>{report.campName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Empty state */}
      {filteredRegistrations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="users" size={60} color="#CCC" />
          <Text style={styles.emptyText}>No registrations available</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRegistrations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.headerRow}>
                <Text style={styles.nameText}>{item.name}</Text>
                <View style={[
                  styles.statusBadge,
                  item.verified ? styles.verifiedBadge : styles.unverifiedBadge
                ]}>
                  <Text style={styles.statusText}>
                    {item.verified ? "Verified" : "Unverified"}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Feather name="mail" size={16} color="#555" />
                  <Text style={styles.infoText}>{item.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Feather name="phone" size={16} color="#555" />
                  <Text style={styles.infoText}>{item.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Feather name="calendar" size={16} color="#555" />
                  <Text style={styles.infoText}>{item.createdAt.toLocaleDateString()}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Feather name="tag" size={16} color="#555" />
                  <Text style={styles.infoText}>{getCampName(item.campId)}</Text>
                </View>
              </View>
              
              {!item.verified && (
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => handleVerify(item.id, item.campId)}
                >
                  <Feather name="check-circle" size={16} color="#FFF" />
                  <Text style={styles.verifyButtonText}>Verify Registration</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      {/* Camp Reports */}
      <View style={styles.reportContainer}>
        <Text style={styles.reportTitle}>Camp Reports</Text>
        {campReports.map((report, index) => (
          <View key={index} style={styles.reportItem}>
            <Text style={styles.reportCampName}>{report.campName}</Text>
            <View style={styles.reportStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{report.totalRegistrations}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Verified</Text>
                <Text style={styles.statValue}>{report.verifiedRegistrations}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Pending</Text>
                <Text style={styles.statValue}>{report.totalRegistrations - report.verifiedRegistrations}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.downloadButton} onPress={downloadCSV}>
          <Feather name="download" size={16} color="#FFF" />
          <Text style={styles.buttonText}>Download CSV</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={16} color="#FFF" />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
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
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterButton: {
    backgroundColor: "#2E7D32",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#555",
  },
  activeFilterText: {
    color: "#FFF",
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: "#E8F5E9",
  },
  unverifiedBadge: {
    backgroundColor: "#FFF3E0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  verifyButton: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  reportContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  reportItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    paddingBottom: 12,
  },
  reportCampName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  reportStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  downloadButton: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 8,
  },
  backButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
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

export default ViewRegistrationsScreen;