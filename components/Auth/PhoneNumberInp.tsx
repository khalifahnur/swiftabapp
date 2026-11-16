import React, { useState } from "react";
import { View } from "react-native";
import PhoneInput, { ICountry } from "react-native-international-phone-number";

import { fonts, palette } from "@/constants/theme";

/**
 * Phone entry with a country picker. Reports the number in international
 * form ("+254712345678") so the restaurant can call it as written.
 */
export default function PhoneNumberInp({ onPhoneNumberChange }: { onPhoneNumberChange: (phoneNumber: string) => void }) {
  const [country, setCountry] = useState<ICountry | null>(null);
  const [value, setValue] = useState("");

  const report = (local: string, selected: ICountry | null) => {
    const digits = local.replace(/\D/g, "").replace(/^0+/, "");
    // The library splits a dial code into a root and suffixes ("+2" and "54").
    const idd = selected?.idd;
    const code = idd ? `${idd.root}${idd.suffixes?.length === 1 ? idd.suffixes[0] : ""}` : "+254";
    onPhoneNumberChange(digits ? `${code}${digits}` : "");
  };

  return (
    <View style={{ flex: 1 }}>
      <PhoneInput
        value={value}
        onChangePhoneNumber={(next) => {
          setValue(next);
          report(next, country);
        }}
        selectedCountry={country}
        onChangeSelectedCountry={(next) => {
          setCountry(next);
          report(value, next);
        }}
        defaultCountry="KE"
        placeholder="712 345 678"
        phoneInputStyles={{
          container: { borderWidth: 0, backgroundColor: "transparent", height: 50 },
          flagContainer: { backgroundColor: "transparent", justifyContent: "center", paddingLeft: 0 },
          caret: { color: palette.muted, fontSize: 14 },
          divider: { backgroundColor: palette.line },
          callingCode: { fontFamily: fonts.medium, fontSize: 15, color: palette.ink },
          input: { fontFamily: fonts.medium, fontSize: 15, color: palette.ink },
        }}
      />
    </View>
  );
}
