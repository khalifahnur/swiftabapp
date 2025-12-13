import moment from "moment";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface prop {
  items: {
    date: string;
    time: number;
    location: string;
    rate: string;
    image: string;
    restaurantName: string;
  };
}

const ReservationCard = ({ items }: prop) => {
  const [isRemind, setIsRemind] = useState(false);

  const formattedTime = moment(items.time).format("MMM - DD, YYYY  HH:mm A");
  const image = items.image;
  const location = items.location;
  const rate = items.rate;
  const restaurantName = items.restaurantName;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.divider} />
      {/* Image and Details */}
      <View style={styles.detailsRow}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{restaurantName}</Text>
            <View style={styles.rating}>
              <Icon name="star" size={16} color="gold" />
              <Text style={styles.ratingText}>{rate}</Text>
            </View>
          </View>
          <View style={styles.iconRow}>
            <Icon name="time-outline" size={16} color="#6F7A8A" />
            <Text style={styles.iconText}>15 min</Text>
            <Icon name="restaurant-outline" size={16} color="#6F7A8A" />
            <Text style={styles.iconText}>Italian</Text>
          </View>
          <View style={styles.iconRow}>
            <Icon name="location-outline" size={16} color="#6F7A8A" />
            <Text style={styles.iconText}>{location}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginVertical: 10,
  },

  detailsRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  name: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#6F7A8A",
    marginLeft: 3,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  iconText: {
    fontSize: 12,
    color: "#6F7A8A",
    marginLeft: 5,
    marginRight: 15,
  },

  divider: {
    width: "100%",
    marginBottom: 3,
    borderWidth: 1,
    borderColor: "#f8f8f8",
  },
});

export default ReservationCard;
