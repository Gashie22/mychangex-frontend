import React, { useState, useLayoutEffect, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Dimensions, 
  StatusBar,
  SafeAreaView,
  Platform,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase, formatZimbabwePhone } from './supabase';

const { width } = Dimensions.get('window');

// Reusable custom modal for displaying messages (consistent with MyChangeXScreen)
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

const ReceiveScreen = () => {
  const navigation = useNavigation();
  
  // State variables
  const [qrData, setQrData] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phoneNumber: ''
  });
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  // Message modal state (consistent with MyChangeXScreen)
  const [messageModal, setMessageModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserPhone(user.phone || '');
        
        // Fetch user data including name and balance
        const { data, error } = await supabase
          .from('users')
          .select('name, phone, balance')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setBalance(data.balance);
        setUserData({
          name: data.name || '',
          phoneNumber: data.phone || ''
        });
        
        // Generate QR code if user has phone number
        if (data.phone) {
          generateQRCode(data.name, data.phone, data.balance);
        }
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const generateQRCode = (name, phone, currentBalance) => {
    const data = JSON.stringify({
      type: 'coupon',
      name: name,
      phone: phone,
      balance: currentBalance,
      timestamp: new Date().toISOString()
    });
    
    setQrData(data);
  };

  const handleGenerateCode = async () => {
    if (!userData.name.trim() || !userData.phoneNumber.trim()) {
      setMessageModal({
        visible: true,
        title: 'Error',
        message: 'Please enter both name and phone number',
      });
      return;
    }
    
    const formattedPhone = formatZimbabwePhone(userData.phoneNumber);
    
    setLoading(true);
    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          phone: formattedPhone
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Generate QR code
      generateQRCode(userData.name, formattedPhone, balance);
      setShowRegistrationModal(false);
      
      setMessageModal({
        visible: true,
        title: 'Success',
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessageModal({
        visible: true,
        title: 'Error',
        message: 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = () => {
    setShowRegistrationModal(true);
  };

  // Listen for real-time balance updates
  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel('user_balance_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          setBalance(payload.new.balance);
          if (qrData) {
            // Update QR code with new balance
            const dataObj = JSON.parse(qrData);
            dataObj.balance = payload.new.balance;
            setQrData(JSON.stringify(dataObj));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, qrData]);

  return (
    <LinearGradient
      colors={['#0136c0', '#0136c0']}
      style={styles.background}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.title}>Receive Coupons</Text>
          
          {/* QR Code Card */}
          <View style={styles.card}>
            {qrData ? (
              <>
                <Text style={styles.qrInstruction}>SCAN THIS CODE TO RECEIVE COUPONS</Text>
                <View style={styles.qrCodeWrapper}>
                  <QRCode
                    value={qrData}
                    size={width * 0.6}
                    color="#0136c0"
                    backgroundColor="#ffffff"
                  />
                </View>
                <Text style={styles.userInfo}>{userData.name} • {userData.phoneNumber}</Text>
                <Text style={styles.qrHint}>Hold this code to the scanner</Text>
                
                {/* Edit Button */}
                <Pressable 
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.editButtonPressed
                  ]}
                  onPress={handleRegistration}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.noCodeText}>No QR Code Generated</Text>
                <Text style={styles.noCodeSubtext}>Set up your profile to generate a QR code</Text>
                
                {/* Generate Button */}
                <Pressable 
                  style={({ pressed }) => [
                    styles.generateButton,
                    pressed && styles.generateButtonPressed
                  ]}
                  onPress={handleRegistration}
                >
                  <LinearGradient
                    colors={['#ffffff', '#f8f9fa']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.generateButtonText}>SET UP PROFILE</Text>
                  </LinearGradient>
                </Pressable>
              </>
            )}
          </View>

          {/* Balance Display */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>YOUR COUPON BALANCE</Text>
            <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          </View>

          {/* Spend Button - Only show when balance > 0 */}
          {balance > 0 && (
            <Pressable 
              style={({ pressed }) => [
                styles.spendButton,
                pressed && styles.spendButtonPressed
              ]}
              android_ripple={{ color: 'rgba(1, 54, 192, 0.1)' }}
              onPress={() => navigation.navigate('SpendCoupon')}
            >
              <LinearGradient
                colors={['#ffffff', '#f8f9fa']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.spendButtonText}>SPEND COUPONS</Text>
              </LinearGradient>
            </Pressable>
          )}

          {/* Transaction History Button */}
          <Pressable 
            style={({ pressed }) => [
              styles.historyButton,
              pressed && styles.historyButtonPressed
            ]}
            onPress={() => navigation.navigate('TransactionHistory')}
          >
            <Text style={styles.historyButtonText}>VIEW TRANSACTION HISTORY</Text>
          </Pressable>
        </View>

        {/* Registration Modal */}
        <Modal
          visible={showRegistrationModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRegistrationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Your Profile</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={userData.name}
                onChangeText={(text) => setUserData({...userData, name: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                value={userData.phoneNumber}
                onChangeText={(text) => setUserData({...userData, phoneNumber: text})}
                keyboardType="phone-pad"
              />
              
              <View style={styles.modalButtons}>
                <Pressable 
                  style={styles.modalButtonCancel}
                  onPress={() => setShowRegistrationModal(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.modalButtonConfirm, loading && styles.disabledButton]}
                  onPress={handleGenerateCode}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.modalButtonTextConfirm}>Save Profile</Text>
                  )}
                </Pressable>
              </View>
            </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 40,
    letterSpacing: 0.5,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 300,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  qrInstruction: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  qrCodeWrapper: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  qrHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  noCodeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  noCodeSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  editButtonPressed: {
    opacity: 0.8,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonPressed: {
    opacity: 0.9,
  },
  generateButtonText: {
    color: '#0136c0',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  spendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  spendButtonPressed: {
    opacity: 0.9,
  },
  spendButtonText: {
    color: '#0136c0',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  historyButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  historyButtonPressed: {
    opacity: 0.8,
  },
  historyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0136c0',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  modalMessage: {
    fontSize: 16,
    color: '#0136c0',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  modalButton: {
    backgroundColor: '#0136c0',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButtonCancel: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0136c0',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  modalButtonTextCancel: {
    color: '#0136c0',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  modalButtonConfirm: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#0136c0',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  modalButtonTextConfirm: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ReceiveScreen;