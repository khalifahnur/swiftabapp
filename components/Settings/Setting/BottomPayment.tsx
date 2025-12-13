import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Image,
} from "react-native";
import React, { useState } from "react";
import BottomSheet, {
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Checkbox from "expo-checkbox";
import { color } from "@/constants/Colors";
import { BlurView } from "expo-blur";

type BottomProps = {
  visibleModal: () => void;
  closeModal: ()=> void;
};

export default function BottomPayment({ visibleModal,closeModal }: BottomProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentOptions = [
    { key: "cash", label: "Cash",icon:'https://img.icons8.com/color/48/cash.png' },
    { key: "mpesa", label: "M-Pesa" , icon:'https://img.icons8.com/color/48/mpesa.png'},
    { key: "airtel", label: "Airtel", icon:'https://www.airtelkenya.com/favicon-16x16.png' },
    { key: "bank_card", label: "Bank Card", icon:'https://img.icons8.com/dusk/64/bank-cards.png' },

  ];

  const handleContinue = () => {
    // if (selectedMethod === "mpesa") {
    //   visibleModal();
    // } else {
    //   alert(`Selected payment method: ${selectedMethod}`);
    // }
    closeModal()
  };

  return (
    <>
      <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />
      <BottomSheet
        snapPoints={[600]}
        handleIndicatorStyle={{ backgroundColor: color.green }}
        onClose={closeModal}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>Choose Payment Method</Text>

          <View style={styles.section}>
            {paymentOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.option,
                  selectedMethod === option.key && styles.selectedOption,
                ]}
                onPress={() => setSelectedMethod(option.key)}
              >
                <View style={{marginRight:'auto',flex:1,flexDirection:'row',}}>
                <Checkbox
                  value={selectedMethod === option.key}
                  onValueChange={() => setSelectedMethod(option.key)}
                  color={selectedMethod === option.key ? "#4CAF50" : undefined}
                />
                <Text style={styles.optionText}>{option.label}</Text>
                </View>
                <Image source={{uri:option.icon}} width={20} height={20}/>
              </TouchableOpacity>
            ))}
          </View>

          <Pressable
            style={[
              styles.continueBtn,
              !selectedMethod && styles.disabledContinueBtn,
            ]}
            onPress={handleContinue}
            disabled={!selectedMethod}
          >
            <Text style={styles.continueText}>Confirm Payment Method</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    color: "#000",
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedOption: {
    borderColor: "#4CAF50",
    backgroundColor: "#e6f5e6",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  continueBtn: {
    padding: 15,
    backgroundColor: color.green,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  disabledContinueBtn: {
    backgroundColor: color.gray,
  },
  continueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
