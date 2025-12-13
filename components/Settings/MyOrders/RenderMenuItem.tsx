import { formatCurrency } from "@/lib/helpers";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";

interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  image: string;
  cost: number;
  quantity: number;
}

interface RenderMenuItemProps {
  items: MenuItem[];
}

const RenderMenuItem: React.FC<RenderMenuItemProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      {items.map((menuItem, index) => (
        <View 
          key={menuItem._id || `menu-item-${index}`} 
          style={styles.menuItemWrapper}
        >
          <View style={styles.menuItem}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: menuItem.image }}
                style={styles.menuImage}
                resizeMode="cover"
              />
              {menuItem.quantity > 1 && (
                <View style={styles.quantityOverlay}>
                  <Text style={styles.quantityOverlayText}>
                    {menuItem.quantity}x
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.menuItemInfo}>
              <View style={styles.textContainer}>
                <Text style={styles.menuItemName} numberOfLines={1}>
                  {menuItem.name}
                </Text>
                <Text 
                  style={styles.menuItemDescription}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {menuItem.description}
                </Text>
              </View>
              
              <View style={styles.priceRow}>
                <View style={styles.priceDetailsContainer}>
                  <Text style={styles.priceLabel}>Item Price</Text>
                  <Text style={styles.menuItemPrice}>
                    {formatCurrency(menuItem.cost)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F9FC',
    paddingVertical: 10,
  },
  menuItemWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
    backgroundColor: '#F0F3F4',
  },
  menuImage: {
    width: '100%',
    height: '100%',
  },
  quantityOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityOverlayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  menuItemInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  textContainer: {
    marginBottom: 12,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 6,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent:'flex-end'
    
  },
  priceDetailsContainer: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495E",
  },
  menuItemTotal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2980B9",
  },
});

export default RenderMenuItem;