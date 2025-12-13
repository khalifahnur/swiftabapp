import { fetchResTable } from "@/api/api";
import { color } from "@/constants/Colors";
import { useFetchActiveTableMutation } from "@/hooks/tablehooks/fetchactivetable";
import useStore from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import moment from "moment";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import DateTab from "./DateTab";
import TableTab from "./TableTab";

export default function Container() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const restaurantInfo = JSON.parse(params.data);
  const restaurantId = restaurantInfo?.restaurantId;

  const fetchActiveTableMutation = useFetchActiveTableMutation();
  const { selectedDate, selectedStartTime, selectedEndTime } = useStore();

  const startDateTime =
    selectedDate && selectedStartTime
      ? moment(`${selectedDate}T${selectedStartTime}`).format()
      : null;

  const endDateTime =
    selectedDate && selectedEndTime
      ? moment(`${selectedDate}T${selectedEndTime}`).format()
      : null;

  const [selectedTab, setSelectedTab] = useState("Date");
  const tabs = ["Date", "Table"];

  const handleNext = () => {
    const currentIndex = tabs.indexOf(selectedTab);

    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];

      if (nextTab === "Table") {
        if (!selectedDate || !selectedStartTime || !selectedEndTime) {
          Toast.show({
            type: "error",
            text2: "All fields are required : Please try again.",
          });
          return;
        }
        handleFetchTables();
      }

      setSelectedTab(nextTab);
    }
  };

  const HandleCancel = () => {
    router.navigate('/(tabs)');
  };

  const { data, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: () => fetchResTable(restaurantId),
    select: (data) =>
      data?.restaurantLayoutData
        ? {
            diningAreas: data.restaurantLayoutData.diningAreas,
            tablePosition: data.restaurantLayoutData.tablePosition,
          }
        : { diningAreas: [], tablePosition: [] },
  });

  const handleFetchTables = () => {
    fetchActiveTableMutation.mutate({
      restaurantId,
      bookingFor: startDateTime,
      endTime: endDateTime,
    });
  };

  if (fetchActiveTableMutation.isPending) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
      </View>
    );
  }

  if (fetchActiveTableMutation.isError) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>Error occurred!</Text>
      </View>
    );
  }

  if (fetchActiveTableMutation.isError) {
    Alert.alert(
      "Error",
      "Failed to fetch available tables. Please try again.",
      [{ text: "OK" }]
    );
  }

  if (isLoading) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
      </View>
    );
  }

  const DisplayComponents = () => {
    switch (selectedTab) {
      case "Date":
        return <DateTab />;
      // case "Time":
      //   return <TimeTab />;
      // case "Guest":
      //   return <GuestTab />;
      case "Table":
        return (
          <TableTab
            availableTables={fetchActiveTableMutation.data}
            diningAreas={data?.diningAreas}
            tablePosition={data?.tablePosition}
          />
        );
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.tabs}>
          {tabs.map((tab, index) => (
            <Pressable
              key={index}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabSelected,
              ]}
            >
              <Text
                style={
                  selectedTab === tab ? styles.tabTextSelected : styles.tabText
                }
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        <DisplayComponents />
      </View>

      {selectedTab === 'Table' ? (
        <View style={styles.tableBtn}>
          
          <TouchableOpacity style={styles.cancelBtn} onPress={()=>setSelectedTab("Date")}>
            <Text style={styles.cancelTxt}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reserveBtn}
            onPress={() =>
              router.replace({
                pathname: "/screens/confirm",
                params: restaurantInfo,
              })
            }
          >
            <Text style={styles.nextButtonText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tableBtn}>
        <TouchableOpacity style={styles.cancelBtn} onPress={HandleCancel}>
            <Text style={styles.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        </View>
        
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabSelected: {
    //backgroundColor: color.green,
    borderColor: color.green,
  },
  tabText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  tabTextSelected: {
    color: color.green,
    fontWeight:'700',
  },
  nextButton: {
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: color.green,
    alignItems: "center",
    width: "40%",
  },
  reserveBtn: {
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: color.green,
    alignItems: "center",
    width: "40%",
  },
  cancelBtn: {
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: color.gray,
    alignItems: "center",
    width: "40%",
  },
  cancelTxt: {
    color: "#000",
    fontSize: 16,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  tableBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor:"transparent"
  },
});
