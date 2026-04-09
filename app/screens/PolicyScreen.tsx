import { color } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const policies = {
  privacy: `Swiftab values your privacy and is committed to protecting your personal data.\n\n**1. Information We Collect**\n- Name, email, phone number, and payment details (if applicable).\n- Interaction with the app, device information, and location data (if enabled).\n\n**2. How We Use Your Information**\n- To process and manage reservations.\n- To improve app functionality and user experience.\n- To send notifications and updates.\n- To ensure security and prevent fraud.\n\n**3. Sharing of Information**\n- We do not sell or rent your data but may share it with service providers for payments and support.\n- Law enforcement when required by law.\n\n**4. Data Security**\n- Encryption and secure protocols protect your data.\n\n**5. User Rights**\n- Access, update, or request deletion of your information.\n- Opt out of certain data processing.\n\n**6. Account Deletion**\n- You have the right to permanently delete your Swiftab account and associated personal data at any time.\n- To initiate this process, use the deletion option below. Please note that certain transactional data may be retained temporarily for legal and compliance reasons.\n\n**7. Changes to Privacy Policy**\n- Updates will be communicated via the app.`,

  terms: `By using Swiftab, you agree to the following terms:\n\n**1. Use of Service**\n- Swiftab provides a reservation platform for various services.\n- You must provide accurate booking details.\n\n**2. User Responsibilities**\n- You must be 13+ to use Swiftab.\n- Misuse, fraudulent activities, or violations may result in account suspension.\n\n**3. Payments and Refunds**\n- Payment policies depend on the service provider.\n- Refunds, if applicable, follow the provider's terms.\n\n**4. Limitation of Liability**\n- Swiftab is not responsible for third-party cancellations or errors.\n\n**5. Changes to Terms**\n- Swiftab reserves the right to modify these terms.`,

  about: `Swiftab is a modern reservation platform designed to streamline bookings for various services.\n\nOur mission is to provide users with a seamless experience in scheduling and managing reservations while ensuring reliability and convenience.`,
};

export default function PolicyScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const content = policies[type as keyof typeof policies] || "Policy not found";

  const formattedContent = useMemo(() => {
    const lines = content.split("\n");
    const formatted: JSX.Element[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith("**")) {
        const title = line.replace(/\*\*/g, "");
        formatted.push(
          <Text
            key={`title-${index}`}
            className="text-base font-bold text-gray-800 mb-3 mt-2"
          >
            {title}
          </Text>,
        );
      } else if (line.startsWith("-")) {
        const bulletText = line.substring(2);
        formatted.push(
          <View
            key={`bullet-${index}`}
            className="flex-row items-start mb-2 pl-2"
          >
            <View className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3" />
            <Text className="flex-1 text-[15px] leading-relaxed text-gray-600">
              {bulletText}
            </Text>
          </View>,
        );
      } else if (line.trim() !== "") {
        formatted.push(
          <Text
            key={`para-${index}`}
            className="text-[15px] leading-relaxed text-gray-600 mb-2"
          >
            {line}
          </Text>,
        );
      } else if (line.trim() === "") {
        formatted.push(<View key={`space-${index}`} className="h-3" />);
      }
    });

    return formatted;
  }, [content]);

  const getPageColor = () => {
    const baseColor = color.green || "#2ecc71";
    return [baseColor, `${baseColor}E6`];
  };

  const handleDeleteRequest = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? You will be redirected to our web portal to complete this request.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          style: "destructive",
          onPress: () =>
            Linking.openURL("https://www.swiftab.co.ke/data-deletion"),
        },
      ],
    );
  };

  const primaryColor = getPageColor()[0];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor={primaryColor} />

      <LinearGradient
        colors={getPageColor()}
        className="pt-4 pb-6 px-5 rounded-b-[24px] flex-row items-center justify-between"
      >
        <TouchableOpacity
          className="p-2 rounded-xl bg-white/20"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-white">
            {type === "privacy"
              ? "Privacy Policy"
              : type === "terms"
                ? "Terms & Conditions"
                : "About Swiftab"}
          </Text>
        </View>

        <View className="w-[38px]" />
      </LinearGradient>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl shadow-sm mb-6 elevation-md">
          <View className="flex-row items-center p-5">
            <Text
              className="text-[17px] font-semibold ml-3"
              style={{ color: primaryColor }}
            >
              {type === "privacy"
                ? "Our Commitment to Your Privacy"
                : type === "terms"
                  ? "Terms of Service Agreement"
                  : "About Our Service"}
            </Text>
          </View>

          <View className="h-px bg-gray-100 mx-5" />

          <View className="p-5">{formattedContent}</View>

          <View className="p-4 border-t border-gray-50 items-center">
            <Text className="text-[13px] text-gray-400">
              Last updated: January 25, 2026
            </Text>
          </View>
        </View>

        <View className="items-center mb-10 space-y-4">
          <View className="items-center">
            <Text className="text-base font-semibold text-gray-500 mb-3">
              Have Questions? support@swiftab.co.ke
            </Text>
          </View>
          {type === "privacy" && (
            <View className="items-center w-full mt-6 pt-6 border-t border-gray-200">
              <Text className="text-sm font-semibold text-gray-500 mb-3">
                Data Management
              </Text>
              <TouchableOpacity
                onPress={handleDeleteRequest}
                className="flex-row items-center py-3 px-5 rounded-xl bg-red-50 border border-red-200 w-[80%] justify-center"
              >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
                <Text className="text-red-500 text-sm font-semibold ml-2">
                  Request Account Deletion
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
