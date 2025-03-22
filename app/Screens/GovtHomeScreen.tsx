import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Navbar from "../../components/Navbar";
import { db } from "../../constants/firebase";
import { collection, getDocs } from "firebase/firestore";

interface GovtCamp {
  id: string;
  Area_staff_involved: string;
  Camp_Day: string;
  Camp_Site: string;
  Distance_to_be_covered: number;
  Name_of_Villages: string;
  Population_to_be_covered: number;
  Session_Time: string;
  Source_PDF: string;
}

const GovtHomeScreen = () => {
  const router = useRouter();
  const [camps, setCamps] = useState<GovtCamp[]>([]);
  const [filteredCamps, setFilteredCamps] = useState<GovtCamp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSessionTime, setSelectedSessionTime] = useState<string>("");
  const [selectedPopulation, setSelectedPopulation] = useState<number | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  useEffect(() => {
    fetchGovtCamps();
  }, []);

  useEffect(() => {
    filterCamps();
  }, [searchQuery, selectedSessionTime, selectedPopulation, selectedDistance, camps]);

  const fetchGovtCamps = async () => {
    try {
      // List of districts to fetch data from
      const districts = ["erode", "coimbatore", "palani"];
      let allCamps: GovtCamp[] = [];

      // Fetch data from each district's PDFs subcollection
      for (const district of districts) {
        const pdfsRef = collection(db, "govtdata", district, "PDFs");
        const querySnapshot = await getDocs(pdfsRef);
        const campsData: GovtCamp[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            Area_staff_involved: data.Area_staff_involved,
            Camp_Day: data.Camp_Day,
            Camp_Site: data.Camp_Site,
            // Distance_to_be_covered: data.Distance_to_be_covered,
            Name_of_Villages: data.Name_of_Villages,
            Population_to_be_covered: data.Population_to_be_covered,
            Session_Time: data.Session_Time,
            // Source_PDF: data.Source_PDF,
          } as GovtCamp;
        });
        allCamps = [...allCamps, ...campsData];
      }

      setCamps(allCamps);
      setFilteredCamps(allCamps);
      setError(null);
    } catch (error) {
      console.error("Error fetching government camps:", error);
      setError("Failed to fetch government camps. Please try again later.");
      Alert.alert("Error", "Failed to fetch government camps. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterCamps = () => {
    let filtered = camps;

    // Filter by search query (Camp_Site or Name_of_Villages)
    if (searchQuery) {
      filtered = filtered.filter(
        (camp) =>
          camp.Camp_Site.toLowerCase().includes(searchQuery.toLowerCase()) ||
          camp.Name_of_Villages.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Session_Time
    if (selectedSessionTime) {
      filtered = filtered.filter((camp) => camp.Session_Time === selectedSessionTime);
    }

    // Filter by Population_to_be_covered
    if (selectedPopulation) {
      filtered = filtered.filter((camp) => camp.Population_to_be_covered >= selectedPopulation);
    }

    // Filter by Distance_to_be_covered
    if (selectedDistance) {
      filtered = filtered.filter((camp) => camp.Distance_to_be_covered <= selectedDistance);
    }

    setFilteredCamps(filtered);
  };

  const getRandomImageUrl = (seed: string) => {
    return `https://picsum.photos/seed/${seed}/300/200`;
  };

  const handleViewPDF = (link: string) => {
    Linking.openURL(link).catch((err) => console.error("Failed to open PDF:", err));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchGovtCamps} style={styles.retryButton}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />

      {/* Search and Filter UI */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search by camp site or village..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Options */}
      <ScrollView horizontal style={styles.filterContainer} contentContainerStyle={styles.filterContentContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedSessionTime === "9:00 AM - 12:00 PM" && styles.activeFilterButton]}
          onPress={() => setSelectedSessionTime("9:00 AM - 12:00 PM")}
        >
          <Text style={styles.filterButtonText}>Morning Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedSessionTime === "1:00 PM - 9:00 PM" && styles.activeFilterButton]}
          onPress={() => setSelectedSessionTime("1:00 PM - 9:00 PM")}
        >
          <Text style={styles.filterButtonText}>Afternoon Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedPopulation === 1000 && styles.activeFilterButton]}
          onPress={() => setSelectedPopulation(1000)}
        >
          <Text style={styles.filterButtonText}>Population ≥ 1000</Text>
        </TouchableOpacity>
      
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setSelectedSessionTime("");
            setSelectedPopulation(null);
            setSelectedDistance(null);
          }}
        >
          <Text style={styles.filterButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Camp List */}
      <FlatList
        data={filteredCamps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.campItem}>
            <Image
              source={{ uri: getRandomImageUrl(item.Camp_Site) }}
              style={styles.campImage}
            />
            <Text style={styles.campName}>{item.Camp_Site}</Text>
            <Text style={styles.campLocation}>Village: {item.Name_of_Villages}</Text>
            <Text style={styles.campDate}>Camp Day: {item.Camp_Day}</Text>
            <Text style={styles.campTime}>Session Time: {item.Session_Time}</Text>
            <Text style={styles.campDetails}>
              Population to be Covered: {item.Population_to_be_covered}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#FFF",
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterContentContainer: {
    paddingVertical: 0,
  },
  filterButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: "#1B5E20",
  },
  filterButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  campItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  campImage: {
    width: "100%",
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  campName: {
    fontSize: 16,
    color: "#2E7D32",
  },
  campLocation: {
    fontSize: 14,
    color: "#2E7D32",
  },
  campDate: {
    fontSize: 14,
    color: "#2E7D32",
  },
  campTime: {
    fontSize: 14,
    color: "#2E7D32",
  },
  campDetails: {
    fontSize: 14,
    color: "#2E7D32",
    marginTop: 5,
  },
  pdfButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
  },
});

export default GovtHomeScreen;