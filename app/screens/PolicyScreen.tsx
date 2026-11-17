import { Icon } from "@/components/ui/Icon";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Linking, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card, ScreenHeader } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Sheet";
import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";

const policies = {
  privacy: `Swiftab values your privacy and is committed to protecting your personal data.\n\n**1. Information We Collect**\n- Name, email, phone number, and payment details (if applicable).\n- Interaction with the app, device information, and location data (if enabled).\n\n**2. How We Use Your Information**\n- To process and manage reservations.\n- To improve app functionality and user experience.\n- To send notifications and updates.\n- To ensure security and prevent fraud.\n\n**3. Sharing of Information**\n- We do not sell or rent your data but may share it with service providers for payments and support.\n- Law enforcement when required by law.\n\n**4. Data Security**\n- Encryption and secure protocols protect your data.\n\n**5. User Rights**\n- Access, update, or request deletion of your information.\n- Opt out of certain data processing.\n\n**6. Account Deletion**\n- You have the right to permanently delete your Swiftab account and associated personal data at any time.\n- To initiate this process, use the deletion option below. Please note that certain transactional data may be retained temporarily for legal and compliance reasons.\n\n**7. Changes to Privacy Policy**\n- Updates will be communicated via the app.`,

  terms: `By using Swiftab, you agree to the following terms:\n\n**1. Use of Service**\n- Swiftab provides a reservation platform for various services.\n- You must provide accurate booking details.\n\n**2. User Responsibilities**\n- You must be 13+ to use Swiftab.\n- Misuse, fraudulent activities, or violations may result in account suspension.\n\n**3. Payments and Refunds**\n- Payment policies depend on the service provider.\n- Refunds, if applicable, follow the provider's terms.\n\n**4. Limitation of Liability**\n- Swiftab is not responsible for third-party cancellations or errors.\n\n**5. Changes to Terms**\n- Swiftab reserves the right to modify these terms.`,

  about: `Swiftab is a modern reservation platform designed to streamline bookings for various services.\n\nOur mission is to provide users with a seamless experience in scheduling and managing reservations while ensuring reliability and convenience.`,
};

const TITLES: Record<string, { title: string; lead: string }> = {
  privacy: { title: "Privacy Policy", lead: "Our commitment to your privacy" },
  terms: { title: "Terms & Conditions", lead: "Terms of service agreement" },
  about: { title: "About Swiftab", lead: "About our service" },
};

/** Renders the simple markup the policies are written in: **headings**, - bullets and paragraphs. */
function PolicyText({ content }: { content: string }) {
  return (
    <View>
      {content.split("\n").map((line, index) => {
        if (line.startsWith("**")) {
          return (
            <Txt key={index} w="bold" size={15} style={{ marginTop: 10, marginBottom: 8 }}>
              {line.replace(/\*\*/g, "")}
            </Txt>
          );
        }
        if (line.startsWith("-")) {
          return (
            <View key={index} style={{ flexDirection: "row", marginBottom: 6, paddingLeft: 4 }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: palette.brand, marginTop: 8, marginRight: 10 }} />
              <Txt size={14} color={palette.body} style={{ flex: 1, lineHeight: 21 }}>
                {line.substring(2)}
              </Txt>
            </View>
          );
        }
        if (line.trim() === "") return <View key={index} style={{ height: 8 }} />;
        return (
          <Txt key={index} size={14} color={palette.body} style={{ lineHeight: 21, marginBottom: 6 }}>
            {line}
          </Txt>
        );
      })}
    </View>
  );
}

export default function PolicyScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const insets = useSafeAreaInsets();
  const [asking, setAsking] = useState(false);
  const key = type && type in policies ? (type as keyof typeof policies) : "about";
  const meta = TITLES[key];

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader title={meta.title} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32, gap: 16 }}>
        <Card>
          <Txt w="bold" size={16} color={palette.brandDark} style={{ marginBottom: 10 }}>
            {meta.lead}
          </Txt>
          <PolicyText content={policies[key]} />
          <Txt size={12} color={palette.muted} style={{ marginTop: 14 }}>
            Last updated: January 25, 2026
          </Txt>
        </Card>

        <Card style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Icon name="mail-outline" size={20} color={palette.brand} />
          <View style={{ flex: 1 }}>
            <Txt w="semibold" size={14}>
              Have questions?
            </Txt>
            <Txt size={13} color={palette.muted}>
              support@swiftab.co.ke
            </Txt>
          </View>
        </Card>

        {key === "privacy" && (
          <Button label="Request account deletion" variant="danger" icon="trash-outline" onPress={() => setAsking(true)} />
        )}
      </ScrollView>

      <ConfirmDialog
        visible={asking}
        title="Delete your account?"
        message="You will be taken to our website to complete this request."
        confirmLabel="Continue"
        cancelLabel="Not now"
        destructive
        onConfirm={() => {
          setAsking(false);
          Linking.openURL("https://www.swiftab.co.ke/data-deletion").catch(() => undefined);
        }}
        onCancel={() => setAsking(false)}
      />
    </View>
  );
}
