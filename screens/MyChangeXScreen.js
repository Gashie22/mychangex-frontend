import React, { useState, useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Modal,
  Platform,
  ActivityIndicator,
  // Removed Alert as we are using a custom modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { supabase, formatZimbabwePhone } from './supabase';

// Reusable custom modal for displaying messages
const MessageModal = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <Pressable style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const MyChangeXScreen = () => {
  const navigation = useNavigation();

  // --- State Hooks ---
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [userPhone, setUserPhone] = useState('');

  // Custom modal state
  const [messageModal, setMessageModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  // --- References & Permissions ---
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const isScanning = useRef(false);

  // --- Component Lifecycle & Side Effects ---
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    fetchUserData();
  }, []);

  // --- Data Fetching ---
  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserPhone(user.phone || '');

        const { data, error } = await supabase
          .from('users')
          .select('balance')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessageModal({
        visible: true,
        title: 'Error',
        message: 'Failed to load user data.',
      });
    }
  };

  // --- User Interaction Handlers ---

  // Request camera permission for QR scanning
  const requestCameraAccess = async () => {
    try {
      await requestPermission();
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      setCameraError(`Failed to request camera permissions: ${error.message}`);
    }
  };

  // Handle platform selection from the main UI
  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    setShowPlatformModal(true);
  };

  // Handle QR scan option from the modal
  const handleScanQR = async () => {
    setShowPlatformModal(false);

    if (!permission?.granted) {
      await requestCameraAccess();

      if (!permission?.granted) {
        setMessageModal({
          visible: true,
          title: 'Permission Required',
          message: 'Camera permission is required to scan QR codes. Please enable it in your device settings.',
        });
        return;
      }
    }

    isScanning.current = false;
    setShowCamera(true);
  };

  // Handle phone number option from the modal
  const handlePhoneOption = () => {
    setShowPlatformModal(false);
  };

  // Handle the result of a QR code scan
  const handleBarCodeScanned = useCallback(async ({ type, data }) => {
    if (isScanning.current) return;

    isScanning.current = true;

    try {
      // Try to parse as JSON for a structured QR code
      const parsedData = JSON.parse(data);

      if (parsedData.type === 'coupon' && parsedData.phone) {
        const scannedPhone = parsedData.phone;
        const formattedPhone = formatZimbabwePhone(scannedPhone);

        // Check for self-transfer
        if (formattedPhone === userPhone) {
          setMessageModal({
            visible: true,
            title: 'Error',
            message: 'You cannot send money to yourself.',
          });
          setShowCamera(false);
          isScanning.current = false;
          return;
        }

        // Verify recipient exists
        const { data: recipientData, error } = await supabase
          .from('users')
          .select('id, name')
          .eq('phone', formattedPhone)
          .single();

        if (error) {
          setMessageModal({
            visible: true,
            title: 'Error',
            message: 'Recipient not found in the system.',
          });
          setShowCamera(false);
          isScanning.current = false;
          return;
        }

        // Set phone number and recipient name from the QR code
        setPhoneNumber(scannedPhone);
        setRecipientName(recipientData.name || 'User');
        setShowCamera(false);

        setMessageModal({
          visible: true,
          title: 'QR Scanned',
          message: `Coupon scanned for ${recipientData.name || 'User'} (${scannedPhone}).`,
        });

      } else {
        // Handle invalid or unexpected QR format
        setShowCamera(false);
        setMessageModal({
          visible: true,
          title: 'Invalid QR Code',
          message: 'This is not a valid coupon QR code. Please try again or enter the number manually.',
        });
      }
    } catch (error) {
      // Handle cases where data is not JSON (e.g., a simple phone number string)
      const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/;
      const phoneMatch = data.match(phoneRegex);

      if (phoneMatch) {
        const formattedPhone = formatZimbabwePhone(phoneMatch[0]);

        if (formattedPhone === userPhone) {
          setMessageModal({
            visible: true,
            title: 'Error',
            message: 'You cannot send money to yourself.',
          });
          setShowCamera(false);
          isScanning.current = false;
          return;
        }

        setPhoneNumber(phoneMatch[0]);
        setShowCamera(false);
        setMessageModal({
          visible: true,
          title: 'QR Scanned',
          message: `Detected phone number: ${phoneMatch[0]}.`,
        });
      } else {
        setShowCamera(false);
        setMessageModal({
          visible: true,
          title: 'Invalid QR Code',
          message: 'The scanned code is not a valid phone number or coupon.',
        });
      }
    } finally {
      isScanning.current = false;
    }
  }, [userPhone]);

  // Handle the "Send Coupon" button press
  const handleSend = async () => {
    // --- Input Validation ---
    if (!selectedPlatform) {
      setMessageModal({ visible: true, title: 'Error', message: 'Please select a platform.' });
      return;
    }
    if (!phoneNumber) {
      setMessageModal({ visible: true, title: 'Error', message: 'Please enter or scan a recipient phone number.' });
      return;
    }
    const sendAmount = parseFloat(amount);
    if (!amount || sendAmount <= 0) {
      setMessageModal({ visible: true, title: 'Error', message: 'Please enter a valid amount.' });
      return;
    }
    if (sendAmount > userBalance) {
      setMessageModal({ visible: true, title: 'Error', message: 'Insufficient balance.' });
      return;
    }

    const formattedRecipientPhone = formatZimbabwePhone(phoneNumber);
    if (formattedRecipientPhone === userPhone) {
      setMessageModal({ visible: true, title: 'Error', message: 'You cannot send money to yourself.' });
      return;
    }

    setLoading(true);

    try {
      // Verify recipient exists before initiating transaction
      const { data: recipientData, error: recipientError } = await supabase
        .from('users')
        .select('id, name')
        .eq('phone', formattedRecipientPhone)
        .single();

      if (recipientError) {
        throw new Error('Recipient not found in the system.');
      }

      // Use a Supabase RPC function for a secure, atomic transaction
      const { data: transactionData, error: transactionError } = await supabase.rpc(
        'transfer_funds',
        {
          sender_id: userId,
          receiver_phone: formattedRecipientPhone,
          transfer_amount: sendAmount,
          platform: selectedPlatform
        }
      );

      if (transactionError) throw transactionError;

      // Show success message and navigate
      setMessageModal({
        visible: true,
        title: 'Success!',
        message: `Sent $${sendAmount} via ${selectedPlatform} to ${recipientData.name || phoneNumber}.`,
      });

      // Refresh user balance after successful transaction
      await fetchUserData();

      // Reset form fields
      setAmount('');
      setPhoneNumber('');
      setRecipientName('');

      // Navigate to confirmation screen
      navigation.navigate('SendCoupon', {
        recipient: phoneNumber,
        recipientName: recipientData.name,
        amount: sendAmount,
        platform: selectedPlatform,
        transactionId: transactionData.transaction_id,
      });

    } catch (error) {
      console.error('Transaction error:', error);
      setMessageModal({
        visible: true,
        title: 'Transaction Failed',
        message: error.message || 'Failed to complete transaction.',
      });
    } finally {
      setLoading(false);
    }
  };

  const platforms = ['Ecocash', 'Omari', 'MyChange'];

  return (
    <LinearGradient
      colors={['#0136c0', '#0136c0']}
      style={styles.background}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.header}>Send Digital Coupon</Text>

          {/* Balance Display */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <Text style={styles.balanceAmount}>${userBalance.toFixed(2)}</Text>
          </View>

          {/* Platform Selection */}
          <View style={styles.platformContainer}>
            <Text style={styles.label}>Select Platform</Text>
            <View style={styles.platformButtons}>
              {platforms.map((platform) => (
                <Pressable
                  key={platform}
                  style={[
                    styles.platformButton,
                    selectedPlatform === platform && styles.selectedPlatformButton,
                  ]}
                  onPress={() => handlePlatformSelect(platform)}
                  android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                >
                  <Text style={styles.platformButtonText}>{platform}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Phone Number Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Recipient Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              selectionColor="#ffffff"
              returnKeyType="done"
            />
          </View>

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Enter Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                selectionColor="#ffffff"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Send Button */}
          <Pressable
            style={({ pressed }) => [
              styles.scanButton,
              pressed && styles.scanButtonPressed,
              loading && styles.disabledButton,
            ]}
            onPress={handleSend}
            disabled={loading}
            android_ripple={{ color: 'rgba(1, 54, 192, 0.1)' }}
          >
            <LinearGradient
              colors={['#ffffff', '#f8f9fa']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#0136c0" />
              ) : (
                <Text style={styles.scanButtonText}>Send Coupon</Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        {/* Modal for Platform Options */}
        <Modal
          visible={showPlatformModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPlatformModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>How to add recipient for {selectedPlatform}?</Text>
              <Pressable style={styles.modalButton} onPress={handleScanQR}>
                <Text style={styles.modalButtonText}>Scan QR Code</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handlePhoneOption}>
                <Text style={styles.modalButtonText}>Enter Phone Number</Text>
              </Pressable>
              <Pressable onPress={() => setShowPlatformModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Camera Modal for QR Scanning */}
        <Modal visible={showCamera} animationType="slide">
          <View style={styles.cameraContainer}>
            {permission?.granted ? (
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                onBarcodeScanned={isScanning.current ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                onError={(error) => {
                  console.error('Camera error:', error);
                  setCameraError(`Camera error: ${error.message}`);
                }}
              />
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {cameraError || 'Camera permission required. Please allow camera access.'}
                </Text>
                <Pressable
                  style={styles.permissionButton}
                  onPress={requestCameraAccess}
                >
                  <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </Pressable>
              </View>
            )}
            <Pressable
              style={styles.closeCameraButton}
              onPress={() => {
                setShowCamera(false);
                isScanning.current = false;
              }}
            >
              <Text style={styles.closeCameraText}>Close</Text>
            </Pressable>
          </View>
        </Modal>

        {/* Custom Message Modal */}
        <MessageModal
          visible={messageModal.visible}
          title={messageModal.title}
          message={messageModal.message}
          onClose={() => setMessageModal({ ...messageModal, visible: false })}
        />

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    letterSpacing: 0.5,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  platformContainer: {
    marginBottom: 24,
  },
  platformButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  platformButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedPlatformButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: '#ffffff',
  },
  platformButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  amountContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.5)',
    paddingBottom: 12,
  },
  currencySymbol: {
    fontSize: 28,
    color: '#ffffff',
    marginRight: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    color: '#ffffff',
    paddingVertical: 0,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    includeFontPadding: false,
  },
  scanButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scanButtonPressed: {
    opacity: 0.9,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#0136c0',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0136c0',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#0136c0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 10,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  closeCameraButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
  },
  closeCameraText: {
    color: '#0136c0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#0136c0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyChangeXScreen;
