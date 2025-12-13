// import * as Location from "expo-location";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
// import RestaurantsList from "./RestaurantsList";
// import SearchComponent from "./SearchComponent";

// // Define props types
// interface MapContainerProps {
//   restaurantsData: { data: Restaurant[] }[];
//   userLocation: { latitude: number; longitude: number };
//   displayAddress: string;
// }

// // Define restaurant type
// interface Restaurant {
//   _id: string;
//   restaurantName: string;
//   latitude: number | string;
//   longitude: number | string;
//   location: string;
// }

// export default function MapContainer({
//   restaurantsData,
//   userLocation,
//   displayAddress,
// }: MapContainerProps) {
//   const pin = require("../../../assets/images/pin.png");
//   const ref = useRef<any>(null); 
//   const mapRef = useRef<MapView>(null);
//   const [mapReady, setMapReady] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");
//   const CARD_WIDTH = Dimensions.get("window").width * 0.75;

//   // Flatten the restaurants data and store it in state to prevent unnecessary re-renders
//   const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);

//   useEffect(() => {
//     setAllRestaurants(restaurantsData.flatMap((section) => section.data));
//   }, [restaurantsData]);

//   // Set region and request permissions
//   const [region, setRegion] = useState<Region>({
//     latitude: userLocation.latitude,
//     longitude: userLocation.longitude,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           setError("Location permission denied");
//           return;
//         }

//         setRegion((prevRegion) => ({
//           ...prevRegion,
//           latitude: userLocation.latitude,
//           longitude: userLocation.longitude,
//         }));
//       } catch (err: any) {
//         setError(`Permission error: ${err.message}`);
//         console.error("Location Permission Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLocation();
//   }, [userLocation]);


//   useEffect(() => {
//     if (mapReady && mapRef.current && region && !error) {
//       mapRef.current.animateToRegion(region, 1000);
//     }
//   }, [mapReady, error]);

//   // Handle marker press
//   const handleMarkerPress = useCallback(
//     (restaurant: Restaurant) => {
//       const index = allRestaurants.findIndex((item) => item._id === restaurant._id);
//       if (ref.current && index !== -1) {
//         const offset = index * CARD_WIDTH;
//         ref.current.scrollToOffset({ offset, animated: true });
//       }
//     },
//     [allRestaurants, CARD_WIDTH]
//   );

//   return (
//     <View style={styles.container}>
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text>Loading map...</Text>
//         </View>
//       )}
//       {error && (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       )}

//       <View style={styles.search}>
//         <SearchComponent placeholderTxt={displayAddress} />
//       </View>

//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         provider={PROVIDER_GOOGLE}
//         showsUserLocation={true}
//         showsMyLocationButton={true}
//         initialRegion={region}
//         onMapReady={() => {
//           console.log("Map is ready");
//           setMapReady(true);
//         }}
//         //onError={(e) => console.error("Map Error:", e)}
//       >
//         {mapReady &&
//           allRestaurants.map((restaurant) => {
//             const lat = Number(restaurant.latitude);
//             const lon = Number(restaurant.longitude);

//             if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) {
//               console.warn(`Invalid coordinates for ${restaurant.restaurantName}:`, { lat, lon });
//               return null;
//             }
//             return (
//               <Marker
//                 key={restaurant._id}
//                 coordinate={{ latitude: lat, longitude: lon }}
//                 onPress={() => handleMarkerPress(restaurant)}
//               >
//                 <Image source={pin} style={styles.markerImage} />
//                 <Callout>
//                   <View style={styles.callout}>
//                     <Text style={styles.calloutTitle}>{restaurant.restaurantName}</Text>
//                     <Text style={styles.calloutDescription}>{restaurant.location}</Text>
//                   </View>
//                 </Callout>
//               </Marker>
//             );
//           })}
//       </MapView>

//       <View style={styles.res}>
//         <RestaurantsList
//           data={restaurantsData}
//           scrollViewRef={ref}
//           cardWidth={CARD_WIDTH}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: "relative" as const,
//   },
//   map: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },
//   res: {
//     position: "absolute" as const,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: "20%",
//     paddingVertical: 2,
//   },
//   search: {
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     zIndex: 1,
//     backgroundColor: "transparent",
//     position: "absolute" as const,
//     top: 0,
//     left: 0,
//     right: 0,
//   },
//   markerImage: {
//     width: 40,
//     height: 60,
//     resizeMode: "contain" as const,
//   },
//   callout: {
//     width: 200,
//     height:200,
//   },
//   calloutTitle: {
//     fontWeight: "bold" as const,
//     fontSize: 14,
//     marginBottom: 5,
//     color:'#000'
//   },
//   calloutDescription: {
//     fontSize: 12,
//   },
//   loadingContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center" as const,
//     alignItems: "center" as const,
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     zIndex: 2,
//   },
//   errorContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center" as const,
//     alignItems: "center" as const,
//     backgroundColor: "rgba(255, 0, 0, 0.1)",
//     zIndex: 2,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 16,
//     textAlign: "center" as const,
//     padding: 20,
//   },
// });