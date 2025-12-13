// import React, { useRef, useEffect, useState } from "react";
// import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
// import { View, StyleSheet, Dimensions, Image, Platform } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// const { width: sWidth, height: sHeight } = Dimensions.get("window");

// const Location = ({ data }) => {
//   const pin = require("@/assets/images/pin.png");
//   const mapRef = useRef(null);
//   const [mapReady, setMapReady] = useState(false);
  
//   const region = {
//     latitude: data.latitude,
//     longitude: data.longitude,
//     latitudeDelta: 0.005,
//     longitudeDelta: 0.005,
//   };

//   // Custom map style for a more professional look
//   const customMapStyle = [
//     {
//       "elementType": "geometry",
//       "stylers": [{ "color": "#f5f5f5" }]
//     },
//     {
//       "elementType": "labels.icon",
//       "stylers": [{ "visibility": "off" }]
//     },
//     {
//       "elementType": "labels.text.fill",
//       "stylers": [{ "color": "#616161" }]
//     },
//     {
//       "elementType": "labels.text.stroke",
//       "stylers": [{ "color": "#f5f5f5" }]
//     },
//     {
//       "featureType": "road",
//       "elementType": "geometry",
//       "stylers": [{ "color": "#ffffff" }]
//     },
//     {
//       "featureType": "water",
//       "elementType": "geometry",
//       "stylers": [{ "color": "#e9e9e9" }]
//     },
//     {
//       "featureType": "water",
//       "elementType": "labels.text.fill",
//       "stylers": [{ "color": "#9e9e9e" }]
//     }
//   ];

//   useEffect(() => {
//     if (mapReady && mapRef.current) {
//       mapRef.current.animateToRegion(region, 1000);
//     }
//   }, [mapReady, data.latitude, data.longitude]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.mapContainer}>
//         <MapView
//           ref={mapRef}
//           style={styles.map}
//           provider={PROVIDER_GOOGLE}
//           initialRegion={region}
//           customMapStyle={customMapStyle}
//           onMapReady={() => setMapReady(true)}
//           zoomEnabled={false}
//           rotateEnabled={false}
//           scrollEnabled={false}
//           pitchEnabled={false}
//         >
//           <Marker
//             coordinate={{
//               latitude: data.latitude,
//               longitude: data.longitude,
//             }}
//           >
//             <View style={styles.markerContainer}>
//               <Image source={pin} style={styles.pin} />
//               {/* Shadow effect for the pin */}
//               <View style={styles.markerShadow} />
//             </View>
//           </Marker>
//         </MapView>
        
//         {/* Gradient overlay for a more polished look */}
//         <LinearGradient
//           colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.05)']}
//           style={styles.gradient}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 10,
//   },
//   mapContainer: {
//     width: sWidth - 80,
//     height: 150,
//     borderRadius: 12,
//     overflow: "hidden",
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
//   markerContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   pin: {
//     width: 40,
//     height: 40,
//     resizeMode: "contain",
//   },
//   markerShadow: {
//     position: "absolute",
//     bottom: -3,
//     width: 20,
//     height: 3,
//     backgroundColor: "rgba(0,0,0,0.2)",
//     borderRadius: 10,
//     zIndex: -1,
//   },
//   gradient: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: '50%',
//     borderRadius: 12,
//   }
// });

// export default Location;