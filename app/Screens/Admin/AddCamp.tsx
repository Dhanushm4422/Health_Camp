import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { db, auth } from "../../../constants/firebase";
import { doc, setDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

const districts = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];

export default function AddCamp() {
  const [organizationName, setOrganizationName] = useState("");
  const [healthCampName, setHealthCampName] = useState("");
  const [location, setLocation] = useState(districts[0]); // Default to the first district
  const [date, setDate] = useState(new Date()); // Add this state
  const [showDatePicker, setShowDatePicker] = useState(false); // Add this state
  const [timeFrom, setTimeFrom] = useState(new Date());
  const [timeTo, setTimeTo] = useState(new Date());
  const [description, setDescription] = useState("");
  const [ambulancesAvailable, setAmbulancesAvailable] = useState("");
  const [hospitalNearby, setHospitalNearby] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
  const [showTimeToPicker, setShowTimeToPicker] = useState(false);

  const router = useRouter();

  // Add this function to handle date selection
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddCamp = async () => {
    // Validate all required fields
    if (
      !organizationName ||
      !healthCampName ||
      !location ||
      !description ||
      !ambulancesAvailable ||
      !hospitalNearby ||
      !latitude ||
      !longitude ||
      !registrationUrl
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      // Generate a unique ID for the camp
      const campId = new Date().getTime().toString();

      // Add the camp data to Firestore
      await setDoc(doc(db, "healthCamps", campId), {
        organizationName,
        healthCampName,
        location,
        date: date.toISOString(), // Add the date field
        timeFrom: timeFrom.toISOString(),
        timeTo: timeTo.toISOString(),
        description,
        ambulancesAvailable,
        hospitalNearby,
        latitude,
        longitude,
        registrationUrl,
        adminId: auth.currentUser?.uid,
      });

      // Show success message
      Alert.alert("Success", "Health Camp Added Successfully!");

      // Navigate to the ViewCamp screen
      router.push("/Screens/Admin/ViewCamp");
    } catch (error) {
      console.error("Error adding camp:", error);
      Alert.alert("Error", "Failed to add health camp. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Add Health Camp</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Organization Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Organization Name"
          value={organizationName}
          onChangeText={setOrganizationName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Health Camp Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Health Camp Name"
          value={healthCampName}
          onChangeText={setHealthCampName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location:</Text>
        {districts && districts.length > 0 ? (
          <Picker
            selectedValue={location}
            style={styles.picker}
            onValueChange={(itemValue) => setLocation(itemValue)}
          >
            {districts.map((district) => (
              <Picker.Item key={district} label={district} value={district} />
            ))}
          </Picker>
        ) : (
          <Text>No districts available</Text>
        )}
      </View>

      {/* Add Date Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.timeButtonText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time From:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowTimeFromPicker(true)}
        >
          <Text style={styles.timeButtonText}>{timeFrom.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimeFromPicker && (
          <DateTimePicker
            value={timeFrom}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimeFromPicker(false);
              if (selectedTime) setTimeFrom(selectedTime);
            }}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time To:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowTimeToPicker(true)}
        >
          <Text style={styles.timeButtonText}>{timeTo.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimeToPicker && (
          <DateTimePicker
            value={timeTo}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimeToPicker(false);
              if (selectedTime) setTimeTo(selectedTime);
            }}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ambulances Available:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Number of Ambulances"
          value={ambulancesAvailable}
          onChangeText={setAmbulancesAvailable}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hospital Nearby:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Nearby Hospital"
          value={hospitalNearby}
          onChangeText={setHospitalNearby}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Latitude:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Longitude:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website URL:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Website URL"
          value={registrationUrl}
          onChangeText={setRegistrationUrl}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddCamp}>
        <Text style={styles.buttonText}>Add Camp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#2E7D32",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#2E7D32",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  picker: {
    height: 50,
    borderColor: "#2E7D32",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
  timeButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  timeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});