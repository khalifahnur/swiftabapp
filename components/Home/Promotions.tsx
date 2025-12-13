import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView, Animated } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = WINDOW_WIDTH * 0.9;

export default function Promotions() {
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const carouselItems = [
    {
      id: 1,
      title: 'Special Offer',
      subtitle: 'Save up to',
      highlight: '30%',
      description: 'Limited time deal',
      buttonText: 'Book Now',
      image: require("../../assets/images/restaurants/ad.jpeg"),
      gradient: ['#4CAF50', '#2E7D32'],
    },
    {
      id: 2,
      title: 'Easy Payments',
      subtitle: 'Pay with',
      highlight: 'M-Pesa',
      description: 'Secure transactions',
      buttonText: 'Learn More',
      image: require("../../assets/images/socials/mpesa.jpg"),
      gradient: ['#009688', '#00695C'],
    },
    {
      id: 3,
      title: 'Swiftab App',
      subtitle: 'Quick',
      highlight: 'Reserve',
      description: 'Book in seconds',
      buttonText: 'Download',
      image: require("../../assets/images/adaptive-icon.png"),
      gradient: ['#26A69A', '#00796B'],
    },
  ];

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Auto-scroll
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        const nextIndex = (activeIndex + 1) % carouselItems.length;
        scrollViewRef.current.scrollTo({
          x: nextIndex * (ITEM_WIDTH + 20),
          animated: true,
        });
        setActiveIndex(nextIndex);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, fadeAnim]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / (ITEM_WIDTH + 20));
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const renderItem = ({ item, index }) => (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]} key={index}>
      <LinearGradient
        colors={item.gradient}
        style={styles.card}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.highlight}>{item.highlight}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="cover"
        />
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + 20}
        snapToAlignment="center"
      >
        {carouselItems.map((item, index) => renderItem({ item, index }))}
      </ScrollView>

      <View style={styles.pagination}>
        {carouselItems.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: activeIndex === index ? 24 : 8,
                backgroundColor: activeIndex === index ? carouselItems[index].gradient[0] : '#B0BEC5',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
    backgroundColor:'transparent',
    paddingVertical:4
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    height:Dimensions.get("window").height / 4.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    marginTop: 4,
  },
  highlight: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 25,
    alignSelf: 'flex-start',
    elevation: 2,
  },
  buttonText: {
    color: '#00695C',
    fontWeight: '600',
    fontSize: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginLeft: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    transition: 'all 0.3s ease',
  },
});