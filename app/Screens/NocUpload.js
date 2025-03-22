import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';

const NocUpload = () => {
    const [location, setLocation] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [verified, setVerified] = useState(false);
    const router = useRouter();

    // Function to pick a PDF document
    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

            if (!result.canceled && result.assets.length > 0) {
                setFile(result.assets[0]); // Store the selected file
            } else {
                alert("No file selected. Please select a PDF file.");
            }
        } catch (error) {
            console.error("Error picking document: ", error);
            alert("Failed to pick a document.");
        }
    };

    // Function to simulate document verification
    const verifyDocument = async () => {
        if (!file) {
            alert('Please select a No Objection Certificate');
            return;
        }
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setVerified(true);
            Alert.alert("Verified", "The NOC has been verified successfully.");
        }, 2000); // Simulating a delay for verification
    };

    return (
        <View style={{ padding: 20 }}>
            {/* Location Input */}
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Enter Camp Location:</Text>
            <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Enter location"
                style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
            />

            {/* Button to Select Document */}
            <TouchableOpacity onPress={pickDocument} style={{ backgroundColor: '#007BFF', padding: 10, marginBottom: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Pick NOC File</Text>
            </TouchableOpacity>

            {file && <Text>Selected File: {file.name}</Text>}

            {/* Verify Button */}
            {uploading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                !verified && <Button title="Verify NOC" onPress={verifyDocument} />
            )}

            {/* Continue Button (Visible after verification) */}
            {verified && (
                <Button title="Continue" onPress={() => router.push('../Screens/HomeScreen')} />
            )}
        </View>
    );
};

export default NocUpload;
