import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { color } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

interface RatingScreenProps {
  restaurantName: string;
  onSubmitRating: (rating: RestaurantRating) => void;
  onCancel?: () => void;
}

interface RestaurantRating {
  overallRating: number;
  foodQuality: number;
  serviceRating: number;
  ambianceRating: number;
  comments?: string;
}

const RatingScreen: React.FC<RatingScreenProps> = ({
  restaurantName,
  onSubmitRating,
  onCancel,
}) => {
  const [overallRating, setOverallRating] = useState(0);
  const [foodQuality, setFoodQuality] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [ambianceRating, setAmbianceRating] = useState(0);
  const [comments, setComments] = useState("");

  const renderStars = (rating: number, setRating: (value: number) => void) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <Icon
          name={star <= rating ? "star" : "star-outline"}
          size={30}
          color={star <= rating ? "yellow" : color.gray}
        />
      </TouchableOpacity>
    ));
  };

  const handleSubmit = () => {
    // Validate that all ratings are filled
    if (
      overallRating === 0 ||
      foodQuality === 0 ||
      serviceRating === 0 ||
      ambianceRating === 0
    ) {
      Alert.alert(
        "Incomplete Rating",
        "Please provide ratings for all categories before submitting."
      );
      return;
    }

    const ratingData: RestaurantRating = {
      overallRating,
      foodQuality,
      serviceRating,
      ambianceRating,
      comments: comments.trim() || undefined,
    };

    onSubmitRating(ratingData);
  };

  return (
    
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <SafeAreaView>
        <Text style={styles.title}>
          Rate Your Experience at {restaurantName}
        </Text>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Overall Experience</Text>
          <View style={styles.starContainer}>
            {renderStars(overallRating, setOverallRating)}
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Food Quality</Text>
          <View style={styles.starContainer}>
            {renderStars(foodQuality, setFoodQuality)}
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Service</Text>
          <View style={styles.starContainer}>
            {renderStars(serviceRating, setServiceRating)}
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Ambiance</Text>
          <View style={styles.starContainer}>
            {renderStars(ambianceRating, setAmbianceRating)}
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Additional Comments</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Share your detailed experience (optional)"
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
          />
        </View>

        <View style={styles.buttonContainer}>
          {onCancel && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
      </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  ratingSection: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  commentInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: color.green,
  },
  cancelButton: {
    backgroundColor: color.gray,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RatingScreen;
