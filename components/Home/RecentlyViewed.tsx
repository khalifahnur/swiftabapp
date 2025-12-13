import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/constants/Colors";
import NewSubHeader from "./NewSubHeader";

const { width } = Dimensions.get('window');

interface RestaurantItem {
  _id: string;
  restaurantName: string;
  image: string;
  location: string;
  rate: number;
}

interface RecentlyViewedProps {
  recentlyViewed: Array<{
    __v: number;
    _id: string;
    data: [RestaurantItem[]];
    title: string;
  }>;
}

const RecentlyViewedRestaurants: React.FC<RecentlyViewedProps> = ({ recentlyViewed }) => {
  const router = useRouter();

  const NavigateHandler = (restaurantData: RestaurantItem) => {
    router.replace({
      pathname: "/screens/restaurantdetails",
      params: { data: JSON.stringify(restaurantData) },
    });
  };

  // Flatten and extract unique restaurants
  const extractRestaurants = () => {
    const restaurants: RestaurantItem[] = [];
  
    recentlyViewed?.forEach(item => {
      if (Array.isArray(item?.data)) {
        item.data.flat().forEach(restaurant => {
          if (restaurant && restaurant._id && !restaurants.some(r => r._id === restaurant._id)) {
            restaurants.push(restaurant);
          }
        });
      }
    });
  
    return restaurants;
  };
  
  const restaurants = extractRestaurants();

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <NewSubHeader 
        headerTitle="Recently Viewed" 
        btnText={`${restaurants.length}`} 
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {restaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant._id}
            style={styles.restaurantCard}
            onPress={() => NavigateHandler(restaurant)}
          >
            <Image 
              source={{ uri: restaurant.image }} 
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="white" />
                <Text style={styles.ratingText}>{restaurant.rate.toFixed(1)}</Text>
              </View>
              <View style={styles.restaurantInfo}>
                <Text 
                  style={styles.restaurantName} 
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {restaurant.restaurantName}
                </Text>
                <Text 
                  style={styles.restaurantLocation} 
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {restaurant.location}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  restaurantCard: {
    width: width * 0.4,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 10,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  image: {
    width: '100%',
    height: 60,
  },
  overlay: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    zIndex: 10,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '600',
  },
  restaurantInfo: {
    // Intentionally left mostly empty as overlay details are now in the overlay view
  },
  restaurantName: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    marginBottom: 0,
  },
  restaurantLocation: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default RecentlyViewedRestaurants;