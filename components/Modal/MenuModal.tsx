import { color } from '@/constants/Colors';
import { useCartStore } from '@/store/useOrderStore';
import { MenuItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList, Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const formatCurrency = (amount: number) => 
  `KES ${amount.toLocaleString()}`;


const MenuTabs = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = ['breakfast', 'lunch', 'dinner'];
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


const FoodCard = ({ item }: { item: MenuItem }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCartStore();
  const quantity = getItemQuantity(item._id);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.cardPrice}>{formatCurrency(item.cost)}</Text>
      </View>

      <View style={styles.controls}>
        {quantity > 0 ? (
          <>
            <TouchableOpacity onPress={() => removeFromCart(item._id)} style={styles.btnMinus}>
              <Ionicons name="remove" size={18} color={color.green} />
            </TouchableOpacity>
            
            <Text style={styles.qtyText}>{quantity}</Text>
            
            <TouchableOpacity onPress={() => addToCart(item)} style={styles.btnPlus}>
              <Ionicons name="add" size={18} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => addToCart(item)} style={styles.btnAdd}>
            <Ionicons name="add" size={20} color={color.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


export default function MenuScreen({menuData}) {
  const [activeTab, setActiveTab] = useState('breakfast');
  
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const cartItemCount = useCartStore((state) => state.items.length);

  const currentItems = menuData[activeTab] || [];
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <MenuTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <FlatList
        data={currentItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <FoodCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
      {cartItemCount > 0 && (
        <View style={styles.cartContainer}>
          <View style={styles.cartInfo}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
            <View>
              <Text style={styles.cartLabel}>Total</Text>
              <Text style={styles.cartTotal}>{formatCurrency(totalPrice)}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.checkoutBtn} 
            onPress={() => router.navigate('/cart')}
          >
            <Text style={styles.checkoutText}>View Cart</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
  },
  
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: color.green,
  },
  tabText: {
    color: '#888',
    fontWeight: '600',
  },
  activeTabText: {
    color: color.green,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: color.green,
  },

  controls: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAdd: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: color.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPlus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMinus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  cartContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: color.green,
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    backgroundColor: '#FF4500',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cartBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cartLabel: {
    color: '#aaa',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  cartTotal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 5,
    fontSize: 16,
  },
});