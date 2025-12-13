import {Dimensions, Linking, Platform} from 'react-native';

export const getShadowProps = (
  offset: number = 2,
  radius: number = 8,
  opacity: number = 0.2,
) => ({
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: offset,
  },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: radius,
});

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const getWindowWidth = () => Dimensions.get('window').width;
export const getWindowHeight = () => Dimensions.get('window').height;

export const goToSettings = () => {
  if (isIos) {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

export const formatCurrency = (amount) => {
  return `Ksh.${amount?.toFixed(2)}`;
};

export const calculateTotal = (menuItems) => {
  return menuItems?.reduce((total, item) => {
    return (
      total +
      parseInt(item.cost) * parseInt(item.quantity)
    );
  }, 0);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status) => {
    switch (status) {
      case "Served":
        return "#4CAF50"; // Green
      case "Not-served":
        return "#FF9800"; // Orange
      case "Cancelled":
        return "#F44336"; // Red
      default:
        return "#2196F3"; // Blue
    }
  };

  export   const getPaymentColor = (paid) => {
    return paid === "Paid" ? "#2196F3" : "#FF5722";
  };