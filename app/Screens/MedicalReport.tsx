import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";

const MedicalReport = () => {
  const [reportName, setReportName] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [reportFile, setReportFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploadedReports, setUploadedReports] = useState<Array<{ name: string; uri: string }>>([]);

  const handleUpload = async () => {
    if (!reportName || !reportCategory || !reportFile) {
      Alert.alert("Error", "Please fill all fields and upload a file.");
      return;
    }

    try {
      // Convert the file URI to a Blob
      const fileInfo = await FileSystem.getInfoAsync(reportFile.uri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist.");
      }

      const fileBlob = await fetch(reportFile.uri).then((response) => response.blob());

      const formData = new FormData();
      formData.append("reportName", reportName);
      formData.append("reportCategory", reportCategory);
      formData.append("file", fileBlob, reportFile.name || "file");

      console.log("Uploading:", formData);

      // Simulate API call (replace with actual fetch/axios request)
      // await fetch("YOUR_API_ENDPOINT", {
      //   method: "POST",
      //   body: formData,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // Save the uploaded report locally for viewing
      setUploadedReports((prevReports) => [
        ...prevReports,
        { name: reportFile.name, uri: reportFile.uri },
      ]);

      // Reset form after upload
      setReportName("");
      setReportCategory("");
      setReportFile(null);
      Alert.alert("Success", "Report uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert("Error", "Failed to upload the file.");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "/", // Allow all file types
      });

      if (!result.canceled && result.assets.length > 0) {
        setReportFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick the document.");
    }
  };

  const handleViewFile = async (uri: string) => {
    try {
      // Open the file using Linking
      await Linking.openURL(uri);
    } catch (error) {
      console.error("Error opening file:", error);
      Alert.alert("Error", "Failed to open the file.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Medical Report</Text>

      {/* Report Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Report Name"
        value={reportName}
        onChangeText={setReportName}
      />

      {/* Report Category Input */}
      <TextInput
        style={styles.input}
        placeholder="Report Category (e.g., Blood Test, X-Ray)"
        value={reportCategory}
        onChangeText={setReportCategory}
      />

      {/* File Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Ionicons name="document-attach" size={24} color="white" />
        <Text style={styles.uploadButtonText}>
          {reportFile ? reportFile.name : "Choose File"}
        </Text>
      </TouchableOpacity>

      {/* Display Uploaded File */}
      {reportFile && (
        <View style={styles.fileContainer}>
          <Text style={styles.fileName}>{reportFile.name}</Text>
          <TouchableOpacity style={styles.viewButton} onPress={() => handleViewFile(reportFile.uri)}>
            <Text style={styles.viewButtonText}>View File</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleUpload}>
        <Text style={styles.submitButtonText}>Upload Report</Text>
      </TouchableOpacity>

      {/* Display Uploaded Reports */}
      {uploadedReports.length > 0 && (
        <View style={styles.uploadedReportsContainer}>
          <Text style={styles.uploadedReportsTitle}>Uploaded Reports:</Text>
          {uploadedReports.map((report, index) => (
            <View key={index} style={styles.uploadedReportItem}>
              <Text style={styles.uploadedReportName}>{report.name}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewFile(report.uri)}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default MedicalReport;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  fileName: {
    fontSize: 16,
    color: "#333",
  },
  viewButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadedReportsContainer: {
    marginTop: 20,
  },
  uploadedReportsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  uploadedReportItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  uploadedReportName: {
    fontSize: 16,
    color: "#333",
  },
});