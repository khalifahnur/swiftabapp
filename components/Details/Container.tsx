import { color } from '@/constants/Colors';
import { addToWishlist, removeToWishlist } from '@/redux/WishlistSlice';
import { RootState } from '@/redux/store/Store';
import { RestaurantParam } from '@/types';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import About from './About';
import Menu from './Menu';
import Reviews from './Reviews';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 140;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const BackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.backButton} onPress={onPress}>
    <Ionicons name="arrow-back-sharp" size={20} color="#fff" />
  </TouchableOpacity>
);

const WishlistButton = ({ isInWishlist, onPress }: { isInWishlist: boolean; onPress: () => void }) => (
  <TouchableOpacity style={styles.wishlistButton} onPress={onPress}>
    <AntDesign name="heart" size={20} color={isInWishlist ? "red" : "white"} />
  </TouchableOpacity>
);

const Container = () => {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  
  const [activeTab, setActiveTab] = useState<'About' | 'Menu' | 'Reviews'>('About');

  const paramData: RestaurantParam = params?.data
    ? JSON.parse(Array.isArray(params.data) ? params.data[0] : params.data)
    : {
        image: "",
        restaurantName: "",
        location: "",
        latitude: 0,
        longitude: 0,
        rate: 0,
        about: [],
        menu: { _id: "", breakfast: [], lunch: [], dinner: [] },
        _id: "",
        review: [],
      };

  const wishlistCart = useSelector((state: RootState) => state.wishlist.wishlist);

  const isInWishlist = wishlistCart.some((item) => item._id === paramData?._id);

  const handleWishlist = () => {
    if (!isInWishlist) {
      dispatch(addToWishlist(paramData));
    } else {
      dispatch(removeToWishlist(paramData._id));
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-HEADER_MAX_HEIGHT, 0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT/2, 0, -HEADER_MIN_HEIGHT - 60],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-HEADER_MAX_HEIGHT, 0, HEADER_SCROLL_DISTANCE],
      [-HEADER_MAX_HEIGHT/2, 0, HEADER_SCROLL_DISTANCE/2],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [-HEADER_MAX_HEIGHT, 0],
      [2, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale }
      ],
    };
  });

  const headerViewAnimatedStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      ["transparent", color.green]
    );
    return { backgroundColor };
  });

  const titleAnimatedStyles = (fadeIn: boolean) =>
    useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollY.value,
        [0, HEADER_SCROLL_DISTANCE/2, HEADER_SCROLL_DISTANCE],
        fadeIn ? [0, 0, 1] : [1, 0.5, 0],
        Extrapolation.CLAMP
      );
      return { opacity };
    });

  const renderContent = () => {
    switch (activeTab) {
      case 'About':
        return <About data={paramData} />;
      case 'Menu':
        return <Menu menu={paramData.menu} restaurantId={paramData.restaurantId} />;
      case 'Reviews':
        return <Reviews reviews={paramData.review} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={color.green} style='auto' />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.tabContainer}>
            {['About', 'Menu', 'Reviews'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                onPress={() => setActiveTab(tab as any)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Conditional Content */}
          <View style={styles.tabContent}>
            {renderContent()}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Sticky Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Image
          source={{ uri: paramData.image }}
          style={[styles.headerBackground, imageStyle]}
        />
        <Animated.View style={[styles.headerContent, headerViewAnimatedStyles]}>
            <Animated.Text style={[styles.title, titleAnimatedStyles(false)]}>
              {paramData.restaurantName}
            </Animated.Text>
            <Animated.Text style={[styles.title2, titleAnimatedStyles(true)]}>
              {paramData.restaurantName}
            </Animated.Text>
          </Animated.View>
      </Animated.View>

      {/* Navigation buttons */}
      <View style={styles.navigationButtons}>
        <BackButton onPress={() => router.replace("/(tabs)")} />
        <WishlistButton isInWishlist={isInWishlist} onPress={handleWishlist} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => router.navigate({
            pathname: "/screens/reserve",
            params: { data: JSON.stringify(paramData) },
          })}
        >
          <Text style={styles.reserveButtonText}>Reserve Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  scrollViewContent: {
    paddingTop: HEADER_MAX_HEIGHT - 40,
    minHeight: '100%',
    backgroundColor: '#fff', 
  },
  content: {
    padding: 20,
    backgroundColor: '#fff', 
    minHeight: 500, 
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT - 40,
    backgroundColor: color.green,
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT - 40,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  navigationButtons: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:"transparent"
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:"transparent"
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
  },
  footer: {
    backgroundColor:'transparent',
    padding: 10,
  },
  reserveButton: {
    padding: 20,
    backgroundColor: color.green,
    borderRadius: 10,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  headerView: {
    width: "100%",
    justifyContent: "center",
    height: 100,
  },
  title: {
    fontSize: 38,
    fontWeight: "600",
    color: "orange",
    marginHorizontal: 20,
    position: "absolute",
    top: 0,
    left: 0,
  },
  title2: {
    fontSize: 18,
    fontWeight: "500",
    color: "orange",
    marginHorizontal: 20,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: color.green,
  },
  tabText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: color.green,
    fontWeight: '700',
  },
  tabContent: {
    minHeight: 200,
  },
});

export default Container;