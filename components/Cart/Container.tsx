import { color } from "@/constants/Colors";
import { useCartStore } from "@/store/useOrderStore";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const cartItems = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  
  const [modalVisible, setModalVisible] = useState(false);

  const subTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  }, [cartItems]);

  const qrPayload = useMemo(() => {
    const simplifiedCart = cartItems.map((item) => ({
      id: item._id,
      n: item.name,     
      q: item.quantity,  
      c: item.cost      
    }));
    
    return JSON.stringify({
      order: simplifiedCart,
      total: subTotal
    });
  }, [cartItems, subTotal]);

  const HandleCheckOut = () => {
    if (cartItems.length > 0) {
      setModalVisible(true);
    }
  };

  const ProceedToPayment = () => {
    setModalVisible(false);
    router.navigate({
      pathname: "/screens/paymentscreen",
      params: { subTotal: subTotal.toString() } 
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.navigate('/(tabs)')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
        </View>
        <View style={styles.centerEmpty}>
          <LottieView
            source={require("@/assets/images/lottie/emptycart.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.emptyText}>Your Cart is Empty</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cartItems.map((item) => (
          <View key={item._id} style={styles.cartCard}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>Ksh. {item.cost}</Text>
                <Text style={styles.qtyText}>x {item.quantity}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => removeFromCart(item._id)}
              style={styles.deleteBtn}
            >
              <AntDesign name="delete" size={18} color="#FF6B6B" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>
            Ksh. {subTotal.toLocaleString()}
          </Text>
        </View>
        
        <Pressable onPress={HandleCheckOut}>
            <LinearGradient
                colors={[color.green, color.black]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.checkoutBtn}
            >
                <Text style={styles.checkoutText}>Generate Order QR</Text>
                <AntDesign name="qrcode" size={20} color="white" />
            </LinearGradient>
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan Order</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#888" />
              </Pressable>
            </View>

            <View style={styles.qrWrapper}>
              <QRCode 
                value={qrPayload} 
                size={220} 
                logoBackgroundColor="transparent"
              />
            </View>
            
            <Text style={styles.modalInstruction}>
              Show this to the waiter.{"\n"}Once scanned, proceed to payment.
            </Text>
            
            <Pressable style={styles.paymentBtn} onPress={ProceedToPayment}>
              <LinearGradient
                colors={[color.green, color.black]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.btnText}>Proceed to Payment</Text>
                <Ionicons name="arrow-back" size={20} color="white" />
              </LinearGradient>
            </Pressable>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 20,
    color: "#333",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150, 
  },
  cartCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    flex: 0.2,
    marginRight: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  detailsContainer: {
    flex: 0.65,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E3192",
    marginRight: 10,
  },
  qtyText: {
    fontSize: 14,
    color: "#888",
  },
  deleteBtn: {
    flex: 0.15,
    backgroundColor: "#FFF0F0",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  subtotalLabel: {
    fontSize: 16,
    color: "#888",
  },
  subtotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  checkoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  modalInstruction: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 25,
    lineHeight: 20,
  },
  paymentBtn: {
    width: '100%',
  },
  gradientBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
  }
});