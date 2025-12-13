import {
    Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

export default function ContactUs() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      name: "Customer Service",
      icon: require('@/assets/images/socials/customer.png'),
      details: "Call our support at +254890756.",
    },
    { name: "WhatsApp", icon: require('@/assets/images/socials/whatsapp.png'), details: "+254890756" },
    { name: "Website", icon: require('@/assets/images/socials/browser.png'), details: "Visit https://example.com" },
    { name: "Facebook", icon: require('@/assets/images/socials/fb.png'), details: "Follow us on Facebook!" },
    { name: "X", icon:require('@/assets/images/socials/x.png'), details: "Check us on X!" },
    {
      name: "Instagram",
      icon: require('@/assets/images/socials/ig.png'),
      details: "Follow us on Instagram!",
    },
  ];

  return (
    <ScrollView>
      {sections.map(({ name, icon, details }) => (
        <TouchableOpacity
          key={name}
          onPress={() => toggleSection(name)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Image source={icon} style={{width:30,height:30}}/>
            <Text style={styles.sectionTitle}>{name}</Text>
            <Feather
              name={activeSection === name ? "chevron-up" : "chevron-down"}
              size={24}
              color="#4B4B4B"
            />
          </View>
          {activeSection === name && (
            <Text style={styles.sectionDetails}>{details}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    
    padding:20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  sectionDetails: {
    marginTop: 8,
    fontSize: 16,
    color: "#4B4B4B",
  },
});
