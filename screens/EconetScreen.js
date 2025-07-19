import React, { useState, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  TextInput,
  StatusBar,
  Modal,
  Pressable,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const EconetScreen = () => {
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

  const handleSendPress = () => {
    setModalVisible(true);
  };

  const handleOptionSelect = (option) => {
    setModalVisible(false);
    console.log(`Selected: ${option}`);
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
          >
            <View style={styles.contentContainer}>
              <Text style={styles.header}>Ecocash Payment</Text>
              
              {/* Tab Selector */}
                      <View style={styles.tabContainer}>
                      <TouchableOpacity 
                        style={[styles.tabButton, activeTab === 'qr' && styles.activeTab]}
                        onPress={() => setActiveTab('qr')}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.tabText, activeTab === 'qr' && styles.activeTabText]}>QR Code</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.tabButton, activeTab === 'number' && styles.activeTab]}
                        onPress={() => setActiveTab('number')}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.tabText, activeTab === 'number' && styles.activeTabText]}>Phone Number</Text>
                      </TouchableOpacity>
                      </View>
                      
                      {/* QR Code Section */}
                      {activeTab === 'qr' && (
                      <View style={styles.qrContainer}>
                        <Text style={styles.sectionTitle}>Scan QR Code to Pay</Text>
                        <View style={styles.qrCodeWrapper}>
                        <QRCode
                          value="ecocash:payment?amount=0&reference=MyChangeX"
                          size={width * 0.6}
                          color="#0136c0"
                          backgroundColor="#ffffff"
                          logo={require('../assets/ecocash.png')}
                          logoSize={60}
                          logoBackgroundColor="transparent"
                        />
                        </View>
                        <Text style={styles.qrHint}>Show this at any Ecocash merchant</Text>
                      </View>
                      )}
                      
                      {/* Phone Number Section */}
              {activeTab === 'number' && (
                <View style={styles.formContainer}>
                  <Text style={styles.sectionTitle}>Enter Payment Details</Text>
                  
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="phone" size={24} color="#ffffff" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Ecocash Number"
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
                    <MaterialIcons name="attach-money" size={24} color="#ffffff" style={styles.inputIcon} />
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
                  
                  <TouchableOpacity 
                    style={styles.payButton} 
                    onPress={handleSendPress}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#ffffff', '#f8f9fa']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.payButtonText}>Confirm Payment</Text>
                    </LinearGradient>
                  </TouchableOpacity>
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
              <View style={styles.modalView}>
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
              </View>
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
  payButtonText: {
    color: '#0136c0',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centeredView: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalView: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    color: '#0136c0',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    textAlign: 'center',
  },
  optionButton: {
    width: '100%',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#0136c0',
    borderRadius: 12,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    marginTop: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#0136c0',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
});

export default EconetScreen;