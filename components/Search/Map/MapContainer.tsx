// import { Ionicons } from "@expo/vector-icons";
// import * as Location from "expo-location";
// import { router } from "expo-router";
// import React, {
//     useCallback,
//     useEffect,
//     useMemo,
//     useRef,
//     useState,
// } from "react";
// import {
//     ActivityIndicator,
//     Dimensions,
//     FlatList,
//     StyleSheet,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
// import MapViewDirections from "react-native-maps-directions";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import RestaurantsList from "./RestaurantsList";

// const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// export interface Restaurant {
//   _id: string;
//   restaurantName: string;
//   latitude: number | string;
//   longitude: number | string;
//   location: string;
//   image: string;
//   rate: number;
// }

// interface MapContainerProps {
//   restaurantsData: { data: Restaurant[] }[];
//   userLocation: { latitude: number; longitude: number };
//   displayAddress: string;
// }

// // 1. Custom Map Style to match the clean, grayscale look from the screenshot
// const customMapStyle = [
//   { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
//   { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
//   { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
//   { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
//   {
//     featureType: "road",
//     elementType: "geometry",
//     stylers: [{ color: "#ffffff" }],
//   },
//   {
//     featureType: "road.arterial",
//     elementType: "labels.text.fill",
//     stylers: [{ color: "#757575" }],
//   },
//   {
//     featureType: "road.highway",
//     elementType: "geometry",
//     stylers: [{ color: "#dadada" }],
//   },
//   {
//     featureType: "water",
//     elementType: "geometry",
//     stylers: [{ color: "#e9e9e9" }],
//   },
// ];

// export default function MapContainer({
//   restaurantsData,
//   userLocation,
//   displayAddress,
// }: MapContainerProps) {
//   const mapRef = useRef<MapView>(null);
//   const flatListRef = useRef<FlatList>(null);
//   const insets = useSafeAreaInsets();
//   const [mapReady, setMapReady] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");
//   const [selectedRestaurant, setSelectedRestaurant] =
//     useState<Restaurant | null>(null);

//   const { width } = Dimensions.get("window");
//   const CARD_WIDTH = width * 0.75;
//   const bottomPadding = Math.max(insets.bottom, 16);

//   const allRestaurants = useMemo(
//     () => restaurantsData.flatMap((section) => section.data),
//     [restaurantsData],
//   );

//   const [region, setRegion] = useState<Region>({
//     latitude: userLocation.latitude,
//     longitude: userLocation.longitude,
//     latitudeDelta: 0.04,
//     longitudeDelta: 0.04,
//   });

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           setError("Location permission denied");
//           return;
//         }
//         setRegion((prev) => ({
//           ...prev,
//           latitude: userLocation.latitude,
//           longitude: userLocation.longitude,
//         }));
//       } catch (err: any) {
//         setError(`Permission error: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLocation();
//   }, [userLocation]);

//   const handleMarkerPress = useCallback(
//     (restaurant: Restaurant, index: number) => {
//       setSelectedRestaurant(restaurant);
//       mapRef.current?.animateToRegion(
//         {
//           latitude: Number(restaurant.latitude) - 0.005, // Offset slightly so the card doesn't cover the pin
//           longitude: Number(restaurant.longitude),
//           latitudeDelta: 0.02,
//           longitudeDelta: 0.02,
//         },
//         500,
//       );

//       flatListRef.current?.scrollToIndex({ index, animated: true });
//     },
//     [],
//   );

//   const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
//     if (viewableItems.length > 0) {
//       const activeRestaurant = viewableItems[0].item;
//       setSelectedRestaurant(activeRestaurant);

//       mapRef.current?.animateToRegion(
//         {
//           latitude: Number(activeRestaurant.latitude) - 0.005, // Offset for bottom card
//           longitude: Number(activeRestaurant.longitude),
//           latitudeDelta: 0.02,
//           longitudeDelta: 0.02,
//         },
//         500,
//       );
//     }
//   }).current;

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 50,
//   }).current;

//   return (
//     <View
//       className="flex-1 relative bg-[#f5f5f5]"
//       style={{ bottom: bottomPadding, backgroundColor: "transparent" }}
//     >
//       {loading && (
//         <View className="absolute inset-0 z-20 items-center justify-center bg-white/80">
//           <ActivityIndicator size="large" color="#14b8a6" />
//         </View>
//       )}

//       <MapView
//         ref={mapRef}
//         provider={PROVIDER_GOOGLE}
//         style={StyleSheet.absoluteFillObject}
//         customMapStyle={customMapStyle}
//         showsUserLocation={false}
//         showsMyLocationButton={false}
//         showsCompass={false}
//         initialRegion={region}
//         onMapReady={() => setMapReady(true)}
//       >
//         {mapReady && userLocation && (
//           <Marker coordinate={userLocation} zIndex={999}>
//             <View className="items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full">
//               <View className="items-center justify-center w-8 h-8 bg-teal-600 rounded-full border-2 border-white shadow-md">
//                 <Ionicons
//                   name="navigate"
//                   size={14}
//                   color="white"
//                   style={{
//                     transform: [{ rotate: "45deg" }],
//                     marginLeft: -2,
//                     marginTop: 2,
//                   }}
//                 />
//               </View>
//             </View>
//           </Marker>
//         )}
//         {mapReady &&
//           allRestaurants.map((restaurant, index) => {
//             const lat = Number(restaurant.latitude);
//             const lon = Number(restaurant.longitude);
//             if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) return null;

//             const isSelected = selectedRestaurant?._id === restaurant._id;

//             return (
//               <Marker
//                 key={restaurant._id}
//                 coordinate={{ latitude: lat, longitude: lon }}
//                 onPress={() => handleMarkerPress(restaurant, index)}
//                 zIndex={isSelected ? 100 : 1}
//               >
//                 <View className="items-center justify-center">
//                   <View
//                     className={`items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-md z-10
//                     ${isSelected ? "bg-[#e85d04]" : "bg-teal-600"}
//                     ${isSelected ? "scale-110" : "scale-100"}`}
//                   >
//                     <Ionicons name="restaurant" size={18} color="white" />
//                   </View>
//                   <View
//                     className={`w-4 h-4 rotate-45 -mt-2.5 border-r-2 border-b-2 border-white shadow-sm
//                     ${isSelected ? "bg-[#e85d04]" : "bg-teal-600"}`}
//                   />
//                 </View>
//               </Marker>
//             );
//           })}

//         {mapReady && selectedRestaurant && (
//           <MapViewDirections
//             origin={{
//               latitude: userLocation.latitude,
//               longitude: userLocation.longitude,
//             }}
//             destination={{
//               latitude: Number(selectedRestaurant.latitude),
//               longitude: Number(selectedRestaurant.longitude),
//             }}
//             apikey={GOOGLE_MAPS_APIKEY}
//             strokeWidth={4}
//             strokeColor="#14b8a6"
//             lineDashPattern={[10, 10]}
//             optimizeWaypoints={true}
//           />
//         )}
//       </MapView>

//       <TouchableOpacity
//         onPress={() => router.back()}
//         activeOpacity={0.8}
//         className="absolute left-6 z-50 w-12 h-12 bg-black rounded-full items-center justify-center shadow-lg border border-gray-100"
//         style={{ top: insets.top + 80 }}
//       >
//         <Ionicons name="chevron-back" size={24} color="#14b8a6" />
//       </TouchableOpacity>
//       <View className="absolute bottom-6 left-0 right-0 h-44">
//         <RestaurantsList
//           ref={flatListRef}
//           data={allRestaurants}
//           cardWidth={CARD_WIDTH}
//           onViewableItemsChanged={onViewableItemsChanged}
//           viewabilityConfig={viewabilityConfig}
//         />
//       </View>
//     </View>
//   );
// }
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RestaurantsList from "./RestaurantsList";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export interface Restaurant {
  _id: string;
  restaurantName: string;
  latitude: number | string;
  longitude: number | string;
  location: string;
  image: string;
  rate: number;
}

interface MapContainerProps {
  restaurantsData: { data: Restaurant[] }[];
  userLocation: { latitude: number; longitude: number };
  displayAddress: string;
}

const customMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#dadada" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9e9e9" }],
  },
];

export default function MapContainer({
  restaurantsData,
  userLocation,
  displayAddress,
}: MapContainerProps) {
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [routeDestination, setRouteDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.75;
  const bottomPadding = Math.max(insets.bottom, 16);

  const allRestaurants = useMemo(
    () => restaurantsData.flatMap((section) => section.data),
    [restaurantsData],
  );

  const [region, setRegion] = useState<Region>({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          return;
        }
        setRegion((prev) => ({
          ...prev,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        }));
      } catch (err: any) {
        setError(`Permission error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [userLocation]);

  const handleMarkerPress = useCallback(
    (restaurant: Restaurant, index: number) => {
      setSelectedRestaurant(restaurant);
      setRouteDestination({
        latitude: Number(restaurant.latitude),
        longitude: Number(restaurant.longitude),
      });

      mapRef.current?.animateToRegion(
        {
          latitude: Number(restaurant.latitude) - 0.005,
          longitude: Number(restaurant.longitude),
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500,
      );

      flatListRef.current?.scrollToIndex({ index, animated: true });
    },
    [],
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const activeRestaurant = viewableItems[0].item;
      setSelectedRestaurant(activeRestaurant);

      mapRef.current?.animateToRegion(
        {
          latitude: Number(activeRestaurant.latitude) - 0.005,
          longitude: Number(activeRestaurant.longitude),
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500,
      );
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View
      className="flex-1 relative bg-[#f5f5f5]"
      style={{ bottom: bottomPadding, backgroundColor: "transparent" }}
    >
      {loading && (
        <View className="absolute inset-0 z-20 items-center justify-center bg-white/80">
          <ActivityIndicator size="large" color="#14b8a6" />
        </View>
      )}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        customMapStyle={customMapStyle}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        initialRegion={region}
        onMapReady={() => setMapReady(true)}
      >
        {mapReady && userLocation && (
          <Marker coordinate={userLocation} zIndex={999}>
            <View className="items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full">
              <View className="items-center justify-center w-8 h-8 bg-teal-600 rounded-full border-2 border-white shadow-md">
                <Ionicons
                  name="navigate"
                  size={14}
                  color="white"
                  style={{
                    transform: [{ rotate: "45deg" }],
                    marginLeft: -2,
                    marginTop: 2,
                  }}
                />
              </View>
            </View>
          </Marker>
        )}
        {mapReady &&
          allRestaurants.map((restaurant, index) => {
            const lat = Number(restaurant.latitude);
            const lon = Number(restaurant.longitude);
            if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) return null;

            const isSelected = selectedRestaurant?._id === restaurant._id;

            return (
              <Marker
                key={restaurant._id}
                coordinate={{ latitude: lat, longitude: lon }}
                onPress={() => handleMarkerPress(restaurant, index)}
                zIndex={isSelected ? 100 : 1}
              >
                <View className="items-center justify-center">
                  <View
                    className={`items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-md z-10 
                    ${isSelected ? "bg-[#e85d04]" : "bg-teal-600"} 
                    ${isSelected ? "scale-110" : "scale-100"}`}
                  >
                    <Ionicons name="restaurant" size={18} color="white" />
                  </View>
                  <View
                    className={`w-4 h-4 rotate-45 -mt-2.5 border-r-2 border-b-2 border-white shadow-sm
                    ${isSelected ? "bg-[#e85d04]" : "bg-teal-600"}`}
                  />
                </View>
              </Marker>
            );
          })}

        {mapReady && routeDestination && (
          <MapViewDirections
            origin={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            destination={routeDestination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#14b8a6"
            optimizeWaypoints={true}
          />
        )}
      </MapView>

      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.8}
        className="absolute left-6 z-50 w-12 h-12 bg-black rounded-full items-center justify-center shadow-lg border border-gray-100"
        style={{ top: insets.top + 80 }}
      >
        <Ionicons name="chevron-back" size={24} color="#14b8a6" />
      </TouchableOpacity>
      <View className="absolute bottom-6 left-0 right-0 h-44">
        <RestaurantsList
          ref={flatListRef}
          data={allRestaurants}
          cardWidth={CARD_WIDTH}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>
    </View>
  );
}
