import React, { useState } from 'react';
import { View } from 'react-native';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';

interface PhoneNumberInpProps {
  onPhoneNumberChange: (phoneNumber: string) => void;
}

export default function PhoneNumberInp({ onPhoneNumberChange }: PhoneNumberInpProps) {
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [inputValue, setInputValue] = useState<string>('');

  function handleInputValue(phoneNumber: string) {
    setInputValue(phoneNumber);
    onPhoneNumberChange(phoneNumber); // Pass the value to the main component
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
        defaultCountry='KE'
        phoneInputStyles={{
          container: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#D1D5DB',
          },
          flagContainer: {
            borderTopLeftRadius: 7,
            borderBottomLeftRadius: 7,
            backgroundColor: '#F8F9FA',
            justifyContent: 'center',
          },
          flag: {},
          caret: {
            color: '#000',
            fontSize: 16,
          },
          divider: {
            backgroundColor: '#D1D5DB',
          }
        }}
      />
    </View>
  );
}
