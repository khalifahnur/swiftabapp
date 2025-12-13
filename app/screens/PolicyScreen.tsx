import { color } from "@/constants/Colors";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const policies = {
  privacy: `Swiftab values your privacy and is committed to protecting your personal data.\n\n**1. Information We Collect**\n- Name, email, phone number, and payment details (if applicable).\n- Interaction with the app, device information, and location data (if enabled).\n\n**2. How We Use Your Information**\n- To process and manage reservations.\n- To improve app functionality and user experience.\n- To send notifications and updates.\n- To ensure security and prevent fraud.\n\n**3. Sharing of Information**\n- We do not sell or rent your data but may share it with service providers for payments and support.\n- Law enforcement when required by law.\n\n**4. Data Security**\n- Encryption and secure protocols protect your data.\n\n**5. User Rights**\n- Access, update, or request deletion of your information.\n- Opt out of certain data processing.\n\n**6. Changes to Privacy Policy**\n- Updates will be communicated via the app.`,

  terms: `By using Swiftab, you agree to the following terms:\n\n**1. Use of Service**\n- Swiftab provides a reservation platform for various services.\n- You must provide accurate booking details.\n\n**2. User Responsibilities**\n- You must be 18+ to use Swiftab.\n- Misuse, fraudulent activities, or violations may result in account suspension.\n\n**3. Payments and Refunds**\n- Payment policies depend on the service provider.\n- Refunds, if applicable, follow the provider's terms.\n\n**4. Limitation of Liability**\n- Swiftab is not responsible for third-party cancellations or errors.\n\n**5. Changes to Terms**\n- Swiftab reserves the right to modify these terms.`,

  about: `Swiftab is a modern reservation platform designed to streamline bookings for various services.\n\nOur mission is to provide users with a seamless experience in scheduling and managing reservations while ensuring reliability and convenience.`,
};

export default function PolicyScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const content = policies[type as keyof typeof policies] || "Policy not found";
  const [formattedContent, setFormattedContent] = useState([]);
  
  useEffect(() => {
    // Parse the markdown-style content for better display
    const parseContent = () => {
      const lines = content.split('\n');
      const formatted = [];
      
      lines.forEach((line, index) => {
        if (line.startsWith('**')) {
          // Section title
          const title = line.replace(/\*\*/g, '');
          formatted.push(
            <Text key={`title-${index}`} style={styles.sectionTitle}>
              {title}
            </Text>
          );
        } else if (line.startsWith('-')) {
          // Bullet point
          const bulletText = line.substring(2);
          formatted.push(
            <View key={`bullet-${index}`} style={styles.bulletItem}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{bulletText}</Text>
            </View>
          );
        } else if (line.trim() !== '') {
          // Regular paragraph
          formatted.push(
            <Text key={`para-${index}`} style={styles.paragraph}>
              {line}
            </Text>
          );
        } else if (line.trim() === '') {
          // Empty line for spacing
          formatted.push(<View key={`space-${index}`} style={styles.spacer} />);
        }
      });
      
      return formatted;
    };
    
    setFormattedContent(parseContent());
  }, [content]);

  const getPageIcon = () => {
    if (type === "privacy") return "shield-checkmark";
    if (type === "terms") return "document-text";
    return "information-circle";
  };

  const getPageColor = () => {
    if (type === "privacy") return [color.green, color.green];
    if (type === "terms") return [color.green, color.green];
    return [color.green, color.green];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={getPageColor()[0]} />
      
      <LinearGradient colors={getPageColor()} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Ionicons name={getPageIcon()} size={26} color="#fff" style={styles.titleIcon} />
          <Text style={styles.title}>
            {type === "privacy"
              ? "Privacy Policy"
              : type === "terms"
              ? "Terms and Conditions"
              : "About Swiftab"}
          </Text>
        </View>
        
        <View style={styles.placeholder} />
      </LinearGradient>
      
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="filetext1" size={22} color={getPageColor()[0]} />
            <Text style={[styles.cardTitle, { color: getPageColor()[0] }]}>
              {type === "privacy"
                ? "Our Commitment to Your Privacy"
                : type === "terms"
                ? "Terms of Service Agreement"
                : "About Our Service"}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardContent}>
            {formattedContent}
          </View>
          
          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>
              Last updated: January 25, 2025
            </Text>
          </View>
        </View>
        
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Have Questions?</Text>
          <TouchableOpacity style={styles.contactButton}>
            <MaterialIcons name="email" size={18} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  placeholder: {
    width: 38,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 20,
  },
  cardContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    marginTop: 6,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#888",
    marginTop: 8,
    marginRight: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  spacer: {
    height: 12,
  },
  cardFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#888",
  },
  contactSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A55A2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#4A55A2",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});