import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Animated,
  PanResponder,
  Easing,
} from "react-native";

const GameScreen = () => {
  const [age, setAge] = useState<string>("");
  const [gameCategory, setGameCategory] = useState<"6-12" | "13-20" | "20-50" | null>(null);

  const handleAgeSubmit = () => {
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber)) {
      Alert.alert("Invalid Age", "Please enter a valid age.");
      return;
    }

    if (ageNumber >= 6 && ageNumber <= 12) {
      setGameCategory("6-12");
    } else if (ageNumber >= 13 && ageNumber <= 20) {
      setGameCategory("13-20");
    } else if (ageNumber >= 21 && ageNumber <= 50) {
      setGameCategory("20-50");
    } else {
      Alert.alert("Invalid Age", "Age must be between 6 and 50.");
    }
  };

  // Game for 6-12: Drag and Drop (Healthy Food Sorting)
  const DragAndDropGame = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([
      { id: 1, name: "Apple", type: "healthy", position: new Animated.ValueXY() },
      { id: 2, name: "Pizza", type: "unhealthy", position: new Animated.ValueXY() },
      { id: 3, name: "Broccoli", type: "healthy", position: new Animated.ValueXY() },
      { id: 4, name: "Candy", type: "unhealthy", position: new Animated.ValueXY() },
    ]);
    const [activeItem, setActiveItem] = useState<null | number>(null); // Track the currently dragged item
  
    const handleDrop = (item: { id: number; name: string; type: string; position: Animated.ValueXY }, gestureState: any) => {
      const dropZoneHealthy = gestureState.moveY < 300; // Drop zone for healthy food
      const dropZoneUnhealthy = gestureState.moveY >= 300; // Drop zone for unhealthy food
  
      if (
        (item.type === "healthy" && dropZoneHealthy) ||
        (item.type === "unhealthy" && dropZoneUnhealthy)
      ) {
        setScore(score + 1);
        setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
      }
  
      // Reset the item's position after dropping
      Animated.spring(item.position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
  
      // Clear the active item
      setActiveItem(null);
    };
  
    const panResponder = (item: { id: number; name: string; type: string; position: Animated.ValueXY }) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setActiveItem(item.id); // Set the active item when dragging starts
        },
        onPanResponderMove: Animated.event([null, { dx: item.position.x, dy: item.position.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gestureState) => {
          handleDrop(item, gestureState);
        },
      });
  
    const nextLevel = () => {
      if (level < 3) {
        setLevel(level + 1);
        setItems([
          { id: 1, name: "Carrot", type: "healthy", position: new Animated.ValueXY() },
          { id: 2, name: "Soda", type: "unhealthy", position: new Animated.ValueXY() },
          { id: 3, name: "Salad", type: "healthy", position: new Animated.ValueXY() },
          { id: 4, name: "Burger", type: "unhealthy", position: new Animated.ValueXY() },
        ]);
      } else {
        Alert.alert("Congratulations!", "You completed all levels!");
      }
    };
  
    return (
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>Healthy Food Sorting - Level {level}</Text>
        <Text>Score: {score}</Text>
  
        {/* Drop Zones */}
        <View style={styles.dropZoneHealthy}>
          <Text>Healthy Food</Text>
        </View>
        <View style={styles.dropZoneUnhealthy}>
          <Text>Unhealthy Food</Text>
        </View>
  
        {/* Draggable Items */}
        {items.map((item) => {
          const panResponderInstance = panResponder(item);
          return (
            <Animated.View
              key={item.id}
              style={{
                transform: [{ translateX: item.position.x }, { translateY: item.position.y }],
                position: "absolute",
                zIndex: activeItem === item.id ? 1 : 0, // Bring the active item to the front
              }}
              {...panResponderInstance.panHandlers}
            >
              <View style={styles.draggableBox}>
                <Text>{item.name}</Text>
              </View>
            </Animated.View>
          );
        })}
  
        {/* Next Level Button */}
        {items.length === 0 && (
          <TouchableOpacity style={styles.button} onPress={nextLevel}>
            <Text style={styles.buttonText}>Next Level</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Game for 13-20: Quiz Game (Health and Nutrition)
  const QuizGame = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const questionsByLevel = [
      [
        {
          question: "Which food is rich in Vitamin C?",
          options: ["Banana", "Orange", "Cheese", "Bread"],
          answer: "Orange",
        },
        {
          question: "How much water should you drink daily?",
          options: ["1 liter", "2 liters", "3 liters", "4 liters"],
          answer: "2 liters",
        },
      ],
      [
        {
          question: "What is the main benefit of exercise?",
          options: ["Weight gain", "Improved mood", "Less sleep", "More stress"],
          answer: "Improved mood",
        },
        {
          question: "Which nutrient is essential for muscle repair?",
          options: ["Carbohydrates", "Fats", "Proteins", "Sugars"],
          answer: "Proteins",
        },
      ],
    ];

    const handleAnswer = (answer: string) => {
      if (answer === questionsByLevel[level - 1][currentQuestion].answer) {
        setScore(score + 1);
      }
      if (currentQuestion < questionsByLevel[level - 1].length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    };

    const nextLevel = () => {
      if (level < 2) {
        setLevel(level + 1);
        setCurrentQuestion(0);
        setShowResult(false);
      } else {
        Alert.alert("Congratulations!", "You completed all levels!");
      }
    };

    return (
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>Health Quiz - Level {level}</Text>
        {showResult ? (
          <>
            <Text style={styles.resultText}>Your score: {score}/{questionsByLevel[level - 1].length}</Text>
            <TouchableOpacity style={styles.button} onPress={nextLevel}>
              <Text style={styles.buttonText}>Next Level</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.questionText}>
              {questionsByLevel[level - 1][currentQuestion].question}
            </Text>
            {questionsByLevel[level - 1][currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    );
  };

  // Game for 20-50: Puzzle Game (Healthy Habits)
  const PuzzleGame = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [currentHabit, setCurrentHabit] = useState<string | null>(null);
    const spinValue = useRef(new Animated.Value(0)).current;
  
    // Healthy habits and their benefits
    const habits = [
      { habit: "Exercise", benefit: "Improves mood and energy" },
      { habit: "Drink Water", benefit: "Keeps you hydrated and healthy" },
      { habit: "Eat Vegetables", benefit: "Provides essential vitamins" },
      { habit: "Sleep Well", benefit: "Boosts immunity and focus" },
    ];
  
    // Spin the wheel
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });
  
    const startSpin = () => {
      // Reset spin value
      spinValue.setValue(0);
  
      // Randomly select a habit
      const randomIndex = Math.floor(Math.random() * habits.length);
      const selectedHabit = habits[randomIndex].habit;
      setCurrentHabit(selectedHabit);
  
      // Animate the spin
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    };
  
    // Handle benefit selection
    const handleBenefitSelection = (selectedBenefit: string) => {
      const correctBenefit = habits.find((h) => h.habit === currentHabit)?.benefit;
      if (selectedBenefit === correctBenefit) {
        setScore(score + 1);
        Alert.alert("Correct!", "You matched the habit to its benefit!");
      } else {
        Alert.alert("Incorrect", "Try again!");
      }
  
      // Move to the next level after 3 correct matches
      if (score + 1 >= 3) {
        if (level < 3) {
          setLevel(level + 1);
          setScore(0);
        } else {
          Alert.alert("Congratulations!", "You completed all levels!");
        }
      }
    };

    return (
        <View style={styles.gameContainer}>
          <Text style={styles.gameTitle}>Healthy Habits Puzzle - Level {level}</Text>
          <Text>Score: {score}</Text>
    
          {/* Spinning Wheel */}
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <View style={styles.spinningWheel}>
              {habits.map((h, index) => (
                <Text key={index} style={styles.wheelText}>
                  {h.habit}
                </Text>
              ))}
            </View>
          </Animated.View>
    
          {/* Spin Button */}
          <TouchableOpacity style={styles.button} onPress={startSpin}>
            <Text style={styles.buttonText}>Spin the Wheel</Text>
          </TouchableOpacity>
    
          {/* Matching Game */}
          {currentHabit && (
            <View style={styles.matchingContainer}>
              <Text style={styles.questionText}>Match the habit: {currentHabit}</Text>
              {habits.map((h, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleBenefitSelection(h.benefit)}
                >
                  <Text style={styles.optionText}>{h.benefit}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      );
    };

  const renderGame = () => {
    switch (gameCategory) {
      case "6-12":
        return <DragAndDropGame />;
      case "13-20":
        return <QuizGame />;
      case "20-50":
        return <PuzzleGame />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {!gameCategory ? (
        <View style={styles.ageInputContainer}>
          <Text style={styles.title}>Enter Your Age</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g., 15"
            value={age}
            onChangeText={setAge}
          />
          <TouchableOpacity style={styles.button} onPress={handleAgeSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderGame()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ageInputContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  gameContainer: {
    width: "100%",
    alignItems: "center",
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dropZoneHealthy: {
    width: "100%",
    height: 100,
    backgroundColor: "lightgreen",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dropZoneUnhealthy: {
    width: "100%",
    height: 100,
    backgroundColor: "lightcoral",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  draggableBox: {
    width: 100,
    height: 100,
    backgroundColor: "orange",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  spinningWheel: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "darkblue",
  },
  wheelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "darkblue",
  },
  matchingContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "80%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  puzzlePiece: {
    width: 100,
    height: 100,
    backgroundColor: "purple",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GameScreen;