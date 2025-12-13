import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

// Define consistent props
type CardProps = {
  image: string; // Changed to string to match your data source (URL)
  restaurantName: string;
  rate: number;
  location: string;
  handlePress: () => void;
};

export default function Card({
  image,
  restaurantName,
  rate,
  location,
  handlePress,
}: CardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handlePress} 
      style={styles.cardContainer}
    >
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: image }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#f5f900ff" />
          <Text style={styles.ratingText}>{rate}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {restaurantName}
        </Text>
        
        <View style={styles.row}>
          <Ionicons name="location-sharp" size={14} color="#888" />
          <Text style={styles.location} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: width * 0.7, 
    marginRight: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  infoContainer: {
    padding: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
    flex: 1,
  },
});