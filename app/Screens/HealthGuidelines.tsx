import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Animated, Image } from "react-native";

interface Guideline {
  category: string;
  measures: string[];
  image: any;
}

const guidelines: Guideline[] = [
  { 
    category: "Hygiene", 
    measures: [
      "Wash hands regularly with soap and water.",
      "Use hand sanitizer when soap is unavailable.",
      "Cover your mouth and nose while sneezing or coughing.",
      "Disinfect frequently touched surfaces regularly."
    ],
    image: require("../../assets/images/image1.jpg")
  },
  { 
    category: "Nutrition", 
    measures: [
      "Maintain a balanced diet rich in fruits and vegetables.",
      "Drink plenty of water and stay hydrated.",
      "Limit sugar, salt, and processed food intake.",
      "Consume foods rich in vitamins and minerals."
    ],
    image: require("../../assets/images/image2.jpg")
  },
  { 
    category: "Lifestyle", 
    measures: [
      "Exercise regularly to boost immunity.",
      "Get enough sleep (7-9 hours per night).",
      "Avoid smoking, alcohol, and excessive caffeine.",
      "Manage stress through meditation or hobbies."
    ],
    image: require("../../assets/images/image3.jpg")
  },
  { 
    category: "Vaccination & Checkups", 
    measures: [
      "Stay up-to-date with recommended vaccinations.",
      "Schedule regular medical checkups.",
      "Follow prescribed medications properly.",
      "Be aware of common symptoms and seek medical advice when needed."
    ],
    image: require("../../assets/images/path_to_image1.avif")
  }
];

const HealthGuidelines: React.FC = () => {
  const fadeAnimations = useRef(guidelines.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = guidelines.map((_, index) =>
      Animated.timing(fadeAnimations[index], {
        toValue: 1,
        duration: 1000,
        delay: index * 300,
        useNativeDriver: true,
      })
    );

    Animated.stagger(300, animations).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Health Guidelines & Safety Measures</Text>
        {guidelines.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              styles.section,
              { opacity: fadeAnimations[index] },
              index % 2 === 0 ? styles.rowLeft : styles.rowRight
            ]}
          >
            {/* Image */}
            <Image source={item.image} style={styles.image} />

            {/* Text Section */}
            <View style={styles.textContainer}>
              <Text style={styles.category}>{item.category}</Text>
              {item.measures.map((measure, i) => (
                <Text key={i} style={styles.measure}>• {measure}</Text>
              ))}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333"
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  rowLeft: {
    flexDirection: "row",
  },
  rowRight: {
    flexDirection: "row-reverse",
  },
  image: {
    width: 130,
    height: 130,
    marginHorizontal: 10,
    borderRadius: 10
  },
  textContainer: {
    flex: 1
  },
  category: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#007BFF"
  },
  measure: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555"
  }
});

export default HealthGuidelines;