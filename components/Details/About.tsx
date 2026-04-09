import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
const InfoRow = ({
  icon,
  title,
  content,
}: {
  icon: any;
  title: string;
  content: string;
}) => {
  if (!content) return null;

  return (
    <View className="flex-row items-start mb-6">
      <View className="w-12 h-12 rounded-full bg-teal-50 items-center justify-center mr-4">
        <Ionicons name={icon} size={22} color="#0d9488" />
      </View>
      <View className="flex-1 justify-center pt-1">
        <Text className="text-gray-900 font-bold text-base mb-1">{title}</Text>
        <Text className="text-gray-500 font-regular text-sm leading-5">
          {content}
        </Text>
      </View>
    </View>
  );
};

export default function About({ data }: { data: any }) {
  const aboutInfo = data?.about?.[0] || {};

  return (
    <View className="pt-4">
      <InfoRow
        icon="information-circle"
        title="Description"
        content={aboutInfo.description}
      />
      <InfoRow
        icon="time"
        title="Hours of Operation"
        content={aboutInfo.hrsOfOperation}
      />
      <InfoRow icon="call" title="Phone" content={aboutInfo.phone} />
      <InfoRow icon="mail" title="Email" content={aboutInfo.email} />
      <InfoRow icon="car" title="Parking" content="Available on premises" />

      <View className="flex-row items-start mb-6">
        <View className="w-12 h-12 rounded-full bg-teal-50 items-center justify-center mr-4">
          <Ionicons name="location" size={22} color="#0d9488" />
        </View>
        <View className="flex-1 justify-center pt-1">
          <Text className="text-gray-900 font-bold text-base mb-2">
            Location
          </Text>
          {/* <Location data={data} /> */}
        </View>
      </View>
    </View>
  );
}
