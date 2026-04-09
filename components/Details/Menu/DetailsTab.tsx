import React, { PropsWithChildren } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type TabsNameProps = PropsWithChildren<{
  tabsName: string[];
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
}>;

const DetailsTabs = ({
  children,
  tabsName,
  setSelectedTab,
  selectedTab,
}: TabsNameProps) => {
  return (
    <View>
      <View className="flex-row mb-6 gap-3">
        {tabsName.map((tab, index) => {
          const isActive = selectedTab === tab;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedTab(tab)}
              className={`py-2 px-6 rounded-lg border ${
                isActive
                  ? "bg-teal-600 border-teal-600"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-base ${
                  isActive
                    ? "font-semibold text-white"
                    : "font-medium text-gray-500"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View>{children}</View>
    </View>
  );
};

export default DetailsTabs;
