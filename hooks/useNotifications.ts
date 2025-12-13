// import { useEffect, useRef, useState } from 'react';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import { Platform } from 'react-native';
// import messaging from '@react-native-firebase/messaging';

// // Configure foreground notifications
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// export const useNotifications = () => {
//   const [fcmToken, setFcmToken] = useState<string | null>(null);
//   const [notification, setNotification] = useState<Notifications.Notification | null>(null);
//   const notificationListener = useRef<Notifications.Subscription>();
//   const responseListener = useRef<Notifications.Subscription>();


// // Foreground notification listener
// messaging().onMessage(async (remoteMessage) => {
//   console.log("Foreground message:", remoteMessage);

//   if (remoteMessage.notification) {
//     // Display the notification in the status bar
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: remoteMessage.notification.title || "No Title",
//         body: remoteMessage.notification.body || "No Body",
//         data: remoteMessage.data || {},
//       },
//       trigger: null, // Show immediately
//     });
//   }
// });

// useEffect(() => {
//     registerForPushNotifications();
  
//     notificationListener.current = Notifications.addNotificationReceivedListener(
//       (notification) => {
//         setNotification(notification);
//         console.log('Received notification:', notification);
//       }
//     );
  
//     responseListener.current = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         console.log('Notification response:', response);
//       }
//     );
  
//     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
//       console.log('Foreground message:', remoteMessage);
//     });
  
//     return () => {
//       if (notificationListener.current) {
//         Notifications.removeNotificationSubscription(notificationListener.current);
//       }
//       if (responseListener.current) {
//         Notifications.removeNotificationSubscription(responseListener.current);
//       }
//       unsubscribe(); // Ensure foreground message listener is removed
//     };
//   }, []);
  
//   const registerForPushNotifications = async () => {
//     if (!Device.isDevice) {
//       alert('Push Notifications are not available in simulator');
//       return;
//     }

//     try {
//       if (Platform.OS === 'ios') {
//         const authStatus = await messaging().requestPermission();
//         const enabled =
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//         if (!enabled) {
//           alert('Failed to get push token for push notification!');
//           return;
//         }
//       }

//       if (Platform.OS === 'android') {
//         await Notifications.setNotificationChannelAsync('default', {
//           name: 'default',
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: '#FF231F7C',
//         });
//       }      

//       const token = await messaging().getToken();
//       setFcmToken(token);
//       console.log('FCM Token:', token);

//       messaging().onTokenRefresh((token) => {
//         setFcmToken(token);
//         console.log('New FCM Token:', token);
//       });

//     } catch (error) {
//       console.error('Error getting push token:', error);
//     }
//   };

//   return {
//     fcmToken,
//     notification,
//   };
// };