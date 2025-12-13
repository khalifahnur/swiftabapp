import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { color } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";

export default function ProfileImage() {
  const [statusMedia, requestPermissionMedia] =
    ImagePicker.useMediaLibraryPermissions();
  const [statusCamera, requestPermissionCamera] =
    ImagePicker.useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    Alert.alert("Select Source", "Choose an option to select the image", [
      { text: "Camera", onPress: () => openCamera() },
      { text: "Gallery", onPress: () => openGallery() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    if (!statusCamera?.granted) {
      const permission = await requestPermissionCamera();
      if (!permission.granted) {
        console.log("Permission to access camera was denied");
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log("Error occurred", e);
    }
  };

  const openGallery = async () => {
    if (!statusMedia?.granted) {
      const permission = await requestPermissionMedia();
      if (!permission.granted) {
        console.log("Permission to access media library was denied");
        return;
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log("Error occurred", e);
    }
  };
  return (
    <View>
      {/* <Image
        source={{
          uri:
             || "https://img.icons8.com/android/80/user.png",
        }}
        style={styles.profileImage}
      /> */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri:image
               || "https://img.icons8.com/android/80/user.png",
          }}
          style={styles.profileImage}
          defaultSource={require("@/assets/images/user.jpeg")}
        />
      </View>
      <TouchableOpacity style={styles.editIconContainer} onPress={pickImage}>
        <Icon name="pencil-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // profileImage: {
  //   width: 60,
  //   height: 60,
  //   borderRadius: 40,
  //   borderColor:color.green,
  //   borderWidth:1,
  //   alignItems:'center'
  // },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: color.navy,
    borderRadius: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E1E5F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E1E5F2",
  },
});
