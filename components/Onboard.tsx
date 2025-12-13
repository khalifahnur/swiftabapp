import { useAuthStore } from '@/lib/authStore';
import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  primaryBg: '#B8D9D6', 
  textDark: '#1A1A1A',
  textLight: '#6D7F7B',
  accentDark: '#111111',
  dotActive: '#1A1A1A',
  dotInactive: '#A8CCCC',
  white: '#FFFFFF',
};

type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  images: { uri: string }[];
};

const data: OnboardingItem[] = [
  {
    id: '1',
    title: 'Find your table for any occasion',
    description: 'An unrivaled selection of restaurants for whatever you want',
    images: [
      require('../assets/images/restaurants/res5.jpeg'),
      require('../assets/images/restaurants/res6.jpeg'),
    ],
  },
  {
    id: '2',
    title: 'Discover new culinary experiences',
    description: 'Explore top-rated local favorites and hidden gems near you.',
    images: [
       require('../assets/images/menu/lunch/fish.png'),
       require('../assets/images/menu/lunch/sushi.png'),
    ],
  },
  {
    id: '3',
    title: 'Book instantly with ease',
    description: 'Secure your reservation in seconds without making a call.',
    images: [
       require('../assets/images/restaurants/res6.jpeg'),
       require('../assets/images/restaurants/res6.jpeg'),
    ],
  },
];

interface Props {
  onFinish?: () => void;
}

const OnboardingScreen: React.FC<Props> = () => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { completeOnboarding } = useAuthStore();

  const handleNextPress = () => {
    if (activeIndex === data.length - 1) {
      completeOnboarding();
    } else {
      carouselRef.current?.next();
    }
  };

  const handleSkipPress = () => {
    completeOnboarding();
  };

  const handleDotPress = (index: number) => {
    carouselRef.current?.scrollTo({ index, animated: true });
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slideContainer}>
        {/* Images Grid Section */}
        <View style={styles.imagesSection}>
          {/* Left Image - Larger, rotated slightly */}
          <View style={styles.imageLeftWrapper}>
            <Image
              source={item.images[0]}
              style={styles.imageLeft}
              resizeMode="cover"
            />
            <View style={styles.imageBorder} />
          </View>

          {/* Right Image - Smaller, stacked */}
          <View style={styles.imageRightWrapper}>
            <Image
              source={item.images[1]}
              style={styles.imageRight}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Text Content Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primaryBg} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            loop={false}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT * 0.65}
            data={data}
            renderItem={renderItem}
            onSnapToItem={(index) => setActiveIndex(index)}
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
          />
        </View>

        {/* Bottom Navigation Area */}
        <View style={styles.bottomNavContainer}>
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {data.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDotPress(index)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === activeIndex ? COLORS.dotActive : COLORS.dotInactive,
                    },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Button Row */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={handleSkipPress}
              style={styles.skipButton}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextPress}
              style={styles.nextButton}
              activeOpacity={0.8}
            >
              <Feather name="chevron-right" size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
  },
  safeArea: {
    flex: 1,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  slideContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  // Images Section Styles
  imagesSection: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  imageLeftWrapper: {
    flex: 0.55,
    height: SCREEN_HEIGHT * 0.35,
    position: 'relative',
  },
  imageLeft: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  imageBorder: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 3,
    borderColor: COLORS.white,
    borderRadius: 20,
    opacity: 0.5,
  },
  imageRightWrapper: {
    flex: 0.45,
    height: SCREEN_HEIGHT * 0.35,
  },
  imageRight: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: COLORS.white,
  },
  // Text Section Styles
  textSection: {
    flex: 0.4,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 12,
    lineHeight: 38,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  description: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  // Bottom Navigation Styles
  bottomNavContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  nextButton: {
    backgroundColor: COLORS.accentDark,
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accentDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default OnboardingScreen;