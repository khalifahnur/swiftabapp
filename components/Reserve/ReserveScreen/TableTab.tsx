import RecFour from "@/components/Reserve/ReserveScreen/RectangleTables/RecFour";
import { color } from "@/constants/Colors";
import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Two from "./Chairs/Two";
import CircFour from "./CircleTables/CircFour";

const COLORS = {
  primary: '#2E8B57', 
  secondary: '#f5f5f5',
  text: '#333333',
  textLight: '#666666',
  white: '#FFFFFF',
  border: '#eaeaea',
  reserved: '#ff4d4d',
  available: '#4cd964',
  selected: '#007aff',
};

export interface TableAvailability {
  availability: {
    isAvailable: boolean;
    tableNumber: string;
  }[];
  tables: string[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TablePosition {
  _id: string;
  chairs: string[];
  floorId: string;
  id: string;
  name: string;
  position: Position;
  rotation: number;
  shape: string;
  size: Size;
  status: string;
}

export interface LayoutData {
  availableTables: TableAvailability;
  diningAreas: string[];
  tablePosition: TablePosition[];
}

export default function TableTab({
  availableTables,
  diningAreas,
  tablePosition,
}: LayoutData) {
  const { selectedFloorTxt, setSelectedFloorTxt } = useStore();

  useEffect(() => {
    if (diningAreas.length > 0 && !selectedFloorTxt) {
      setSelectedFloorTxt(diningAreas[0]);
    }
  }, [diningAreas]);

  const isTableAvailable = (tableName: string) => {
    if (!availableTables || !Array.isArray(availableTables.availability))
      return false;
    return availableTables.availability.some(
      (table) => table.tableNumber === tableName && table.isAvailable
    );
  };

  const TablesArrangement = useMemo(() => {
    if (!tablePosition || !selectedFloorTxt) return null;

    const floorIndex = diningAreas.findIndex(
      (area) => area === selectedFloorTxt
    );
    const selectedFloorId = (floorIndex + 1).toString();

    return tablePosition
      .filter((item) => item.floorId === selectedFloorId)
      .map((item) => {
        const totalChairs = item.chairs.length;
        if (item.shape === "rectangle") {
          switch (totalChairs) {
            case 2:
              return <Two key={item.id} />;
            case 4:
              return (
                <RecFour
                  key={item.id}
                  id={item.name}
                  isAvailable={isTableAvailable(item.name)}
                />
              );
            default:
              return null;
          }
        } else if (item.shape === "round") {
          switch (totalChairs) {
            case 2:
              return <Two key={item.id} />;
            case 4:
              return (
                <CircFour
                  key={item.id}
                  id={item.name}
                  isAvailable={isTableAvailable(item.name)}
                />
              );
            default:
              return null;
          }
        } else {
          return null;
        }
      });
  }, [tablePosition, selectedFloorTxt, availableTables]);

  const handleTabPress = (floor: string) => {
    setSelectedFloorTxt(floor);
  };

  return (
    <View style={styles.container}>
      {/* Tabs Header */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContentContainer}
        >
          {diningAreas.map((area, index) => {
            const isSelected = selectedFloorTxt === area;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.tab, isSelected && styles.selectedTab]}
                onPress={() => handleTabPress(area)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.tabText, isSelected && styles.selectedTabText]}
                >
                  {area}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Info & Legend Bar */}
      <View style={styles.statusContainer}>
        <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.textLight} />
            <Text style={styles.infoText}>Tap to select</Text>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.reservedDot]} />
            <Text style={styles.legendText}>Reserved</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.availableDot]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          {/* <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.selectedDot]} />
            <Text style={styles.legendText}>Your Table</Text>
          </View> */}
        </View>
      </View>
      <ScrollView 
        style={styles.floorPlanScrollView} 
        contentContainerStyle={styles.floorPlanContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.floorPlanSurface}>
          {TablesArrangement}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tabsWrapper: {
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    justifyContent: 'center',
  },
  tabsContentContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: color.green,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  selectedTabText: {
    color: COLORS.white,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  legend: {
    flexDirection: "row",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  reservedDot: { backgroundColor: COLORS.reserved },
  availableDot: { backgroundColor: COLORS.available },
  selectedDot: { backgroundColor: COLORS.selected },
  legendText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  floorPlanScrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  floorPlanContent: {
    padding: 20,
    minHeight: 400,
  },
  floorPlanSurface: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    minHeight: 400,
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});