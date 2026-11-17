import { Icon } from "@/components/ui/Icon";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { palette } from "@/constants/theme";

import { Txt } from "./ui/Txt";

/** A slim banner while the phone is offline. The app stays usable with what it has cached. */
export default function NetworkStatus() {
  const insets = useSafeAreaInsets();
  const [offline, setOffline] = useState(false);

  useEffect(
    () =>
      NetInfo.addEventListener((state) => {
        setOffline(state.isConnected === false || state.isInternetReachable === false);
      }),
    [],
  );

  if (!offline) return null;
  return (
    <View
      accessibilityRole="alert"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: insets.bottom + 110,
        zIndex: 999,
        backgroundColor: palette.ink,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Icon name="cloud-offline" size={18} color={palette.amber} />
      <Txt w="medium" size={13} color={palette.white} style={{ flex: 1 }}>
        You are offline. Showing what was loaded earlier.
      </Txt>
    </View>
  );
}
