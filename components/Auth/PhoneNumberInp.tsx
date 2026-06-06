import React, { useState } from "react";
import { View } from "react-native";
import PhoneInput, { ICountry } from "react-native-international-phone-number";

interface PhoneNumberInpProps {
  onPhoneNumberChange: (phoneNumber: string) => void;
}

export default function PhoneNumberInp({
  onPhoneNumberChange,
}: PhoneNumberInpProps) {
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [inputValue, setInputValue] = useState<string>("");

  function handleInputValue(phoneNumber: string) {
    setInputValue(phoneNumber);
    onPhoneNumberChange(phoneNumber);
  }

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  return (
    <View>
      <PhoneInput
        value={inputValue}
        onChangePhoneNumber={handleInputValue}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={handleSelectedCountry}
        defaultCountry="KE"
        phoneInputStyles={{
          container: {
            borderWidth: 0,
            backgroundColor: "transparent", // Ensures it uses the gray background from the parent
            height: 52, // Sized slightly under the parent's 56px (h-14) to prevent overlap
          },
          flagContainer: {
            backgroundColor: "transparent",
            justifyContent: "center",
          },
          caret: {
            color: "#6B7280",
            fontSize: 16,
          },
          divider: {
            backgroundColor: "#D1D5DB", // Slightly darkened to stand out against the gray background
          },
          input: {
            color: "#111827",
            fontSize: 16,
          },
        }}
      />
    </View>
  );
}
