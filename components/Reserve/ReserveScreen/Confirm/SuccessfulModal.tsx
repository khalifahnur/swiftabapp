import { color } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from "lottie-react-native";
import React from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface SuccessModalProps {
  visible: boolean;
  handleModalVisible: () => void;
  reservationDetails: {
    responseData: {
      reservationId: string;
      name: string;
      date: string;
      time: string;
      duration: string;
      guest: number;
      tableNumber: string;
    }
  } | null;
}

const { width } = Dimensions.get('window');

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible, 
  handleModalVisible, 
  reservationDetails 
}) => {
  const router = useRouter();

  if (!reservationDetails) return null;

  const handleViewTicket = () => {
    router.replace('/(tabs)');
    handleModalVisible();
  }

  const handleViewBookings = () => {
    router.replace('/(tabs)/(toptabs)');
    handleModalVisible();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleModalVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleModalVisible}
          >
            <Ionicons name="close" size={24} color="#2C3E50" />
          </TouchableOpacity>

          {/* Success Animation */}
          <View style={styles.iconContainer}>
            <LottieView
              source={require("@/assets/images/lottie/success.json")}
              autoPlay
              loop={false}
              style={styles.lottieAnimation}
            />
          </View>

          <Text style={styles.title}>Reservation Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your table has been successfully reserved.
          </Text>
          
          {/* Reservation Details */}
          <View style={styles.detailsContainer}>
            {[
              { label: "Reservation ID", value: reservationDetails.responseData.reservationId },
              { label: "Name", value: reservationDetails.responseData.name },
              { label: "Date", value: reservationDetails.responseData.date },
              { label: "Time", value: reservationDetails.responseData.time },
              { label: "Duration", value: `${reservationDetails.responseData.duration} Hrs` },
              { label: "Guests", value: reservationDetails.responseData.guest.toString() },
              { label: "Table Number", value: reservationDetails.responseData.tableNumber },
            ].map((detail, index) => (
              <DetailRow 
                key={index} 
                label={detail.label} 
                value={detail.value} 
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleViewTicket}
            >
              <Text style={styles.buttonText}>Pre-Order Menu</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleViewBookings}
            >
              <Text style={styles.secondaryButtonText}>View Bookings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: width * 0.9,
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  iconContainer: {
    marginBottom: 20,
    width: 150,
    height: 150,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  label: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    color: '#34495E',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: color.green,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: color.green,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: color.green,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessModal;