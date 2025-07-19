import React, { useState, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Dimensions,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Modal
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OmariScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('qr');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handlePayment = () => {
    setModalVisible(true);
  };

  const handleOptionSelect = (option) => {
    // Handle payment option selection
    console.log(`Selected payment option: ${option}`);
    setModalVisible(false);
  };

  return (
    <LinearGradient
      colors={['#0136c0', '#0136c0']}
      style={styles.background}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              <Text style={styles.header}>Omari Payment</Text>
              
              {/* Tab Selector */}
                      <View style={styles.tabContainer}>
                      <Pressable 
                        style={({ pressed }) => [
                        styles.tabButton, 
                        activeTab === 'qr' && styles.activeTab,
                        pressed && styles.pressedTab
                        ]}
                        onPress={() => setActiveTab('qr')}
                      >
                        <Text style={[styles.tabText, activeTab === 'qr' && styles.activeTabText]}>QR Code</Text>
                      </Pressable>
                      
                      <Pressable 
                        style={({ pressed }) => [
                        styles.tabButton, 
                        activeTab === 'number' && styles.activeTab,
                        pressed && styles.pressedTab
                        ]}
                        onPress={() => setActiveTab('number')}
                      >
                        <Text style={[styles.tabText, activeTab === 'number' && styles.activeTabText]}>Phone Number</Text>
                      </Pressable>
                      </View>
                      
                      {/* QR Code Section */}
                      {activeTab === 'qr' && (
                      <View style={styles.qrContainer}>
                        <Text style={styles.sectionTitle}>Scan QR Code to Pay</Text>
                        <View style={styles.qrCodeWrapper}>
                        <QRCode
                          value="omari:payment?amount=0&reference=MyChangeX"
                          size={width * 0.6}
                          color="#0136c0"
                          backgroundColor="#ffffff"
                          logo={require('../assets/omari.png')}
                          logoSize={width * 0.18}
                          logoBackgroundColor="transparent"
                        />
                        </View>
                        <Text style={styles.qrHint}>Show this at any Omari merchant</Text>
                      </View>
                      )}
                      
                      {/* Phone Number Section */}
              {activeTab === 'number' && (
                <View style={styles.formContainer}>
                  <Text style={styles.sectionTitle}>Enter Payment Details</Text>
                  
                  <View style={styles.inputContainer}>
                    <MaterialIcons 
                      name="phone" 
                      size={24} 
                      color="rgba(255,255,255,0.8)" 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Omari Number"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      selectionColor="#ffffff"
                      autoComplete="tel"
                      textContentType="telephoneNumber"
                      returnKeyType="next"
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <MaterialIcons 
                      name="attach-money" 
                      size={24} 
                      color="rgba(255,255,255,0.8)" 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Amount"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                      selectionColor="#ffffff"
                      returnKeyType="done"
                    />
                  </View>
                  
                  <Pressable 
                    style={({ pressed }) => [
                      styles.payButton,
                      pressed && styles.payButtonPressed
                    ]}
                    onPress={handlePayment}
                    android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
                  >
                    <LinearGradient
                      colors={['#ffffff', '#f8f9fa']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.payButtonText}>Confirm Payment</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* Send Options Modal */}
        <Modal
          animationType={Platform.OS === 'ios' ? 'fade' : 'slide'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
                <Text style={styles.modalTitle}>Confirm PIN for the payment</Text>
                {/* PIN Input */}
                <View style={[styles.inputContainer, { marginBottom: 8 }]}>
                  <MaterialIcons name="lock" size={24} color="#0136c0" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: '#0136c0' }]}
                    placeholder="Enter PIN"
                    placeholderTextColor="#b0b0b0"
                    secureTextEntry={true}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                <Pressable
                  style={styles.optionButton}
                  onPress={() => handleOptionSelect('Ecocash')}
                  android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  <Text style={styles.optionText}>Confirm</Text>
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
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
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  pressedTab: {
    opacity: 0.8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  activeTabText: {
    color: '#0136c0',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  qrCodeWrapper: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  qrHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  formContainer: {
    marginTop: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    paddingVertical: 0,
    includeFontPadding: false,
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 24,
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
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonPressed: {
    opacity: 0.9,
  },
  payButtonText: {
    color: '#0136c0',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    width: '80%',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0136c0',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#0136c0',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0136c0',
  },
  cancelText: {
    color: '#0136c0',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OmariScreen;