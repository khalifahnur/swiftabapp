import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { color } from "@/constants/Colors";

export default function Reviews({ reviews }) {
  return (
    <View>
      <Text
        style={{
          color: "#000",
          fontSize: 20,
          fontWeight: "700",
          paddingBottom: 15,
        }}
      >
        Reviews
      </Text>
      {reviews.map((item) =>
        item.review.map((item, index) => (
          <>
            <View
              key={index}
              style={styles.reviewcard}
            >
              {/* User Profile Image */}
              <Image
                source={require("@/assets/images/user.jpeg")}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 15,
                }}
              />

              {/* Review Details */}
              <View style={{ flex: 1 }}>
                {/* Username */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {item.name}
                </Text>

                {/* Rating Stars */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 5,
                  }}
                >
                  {[...Array(5)].map((_, index) => (
                    <Text
                      key={index}
                      style={{
                        fontSize: 18,
                        color: index < item.rating ? "#FFD700" : "#CCC",
                      }}
                    >
                      ★
                    </Text>
                  ))}
                </View>

                {/* Review Text */}
                <Text style={{ fontSize: 14, color: "#666" }}>
                  {item.reviewTxt}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                padding: 15,
                borderWidth:2,
                borderColor: color.navy,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ color: "#1e1e1e", fontSize: 15, textAlign: "center" }}
              >
                See All Reviews
              </Text>
            </TouchableOpacity>
          </>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewcard:{
    backgroundColor: "#fff",
                borderRadius: 10,
                padding: 15,
                marginVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 3,
  }
});
