import React, { useLayoutEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
// Make sure this import is present and correct
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { sendOTP, formatZimbabwePhone } from './supabase';

const { width, height } = Dimensions.get('window');

const SignupScreen = () => {
  // Make sure this hook is the first thing called inside the component
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const validatePhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 9 && cleaned.startsWith('7')) {
      return true;
    }
    
    if (cleaned.length === 10 && cleaned.startsWith('07')) {
      return true;
    }
    
    if (cleaned.length === 12 && cleaned.startsWith('2637')) {
      return true;
    }
    
    return false;
  };

  const formatPhoneDisplay = (text) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length === 12 && cleaned.startsWith('263')) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9, 12)}`;
    }
    
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (text) => {
    if (text.length < phoneNumber.length) {
      setPhoneNumber(text);
      return;
    }
    
    const cleaned = text.replace(/\D/g, '');
    const formatted = formatPhoneDisplay(cleaned);
    setPhoneNumber(formatted);
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (fullName.trim().length < 2) {
      Alert.alert('Error', 'Full name must be at least 2 characters');
      return false;
    }

    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    if (!validatePhoneNumber(cleanedPhoneNumber)) {
      Alert.alert('Invalid Phone Number', 
        'Please enter a valid Zimbabwe mobile number (e.g., 0784739341 or 263784739341)'
      );
      return false;
    }

    if (!pin.trim() || pin.length !== 4) {
      Alert.alert('Error', 'Please enter a 4-digit PIN');
      return false;
    }

    if (!confirmPin.trim() || confirmPin.length !== 4) {
      Alert.alert('Error', 'Please confirm your 4-digit PIN');
      return false;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match. Please try again.');
      return false;
    }

    const uniqueDigits = new Set(pin.split(''));
    if (uniqueDigits.size === 1) {
      Alert.alert('Weak PIN', 'Please choose a PIN with different digits for better security');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      
      const result = await sendOTP(cleanedPhoneNumber);
      
      if (result.success) {
        const formattedPhone = formatZimbabwePhone(cleanedPhoneNumber);
        
        navigation.navigate('OTPVerification', { 
          phoneNumber: formattedPhone,
          signupData: {
            fullName: fullName.trim(),
            pin: pin,
            isSignup: true
          }
        });
      } else {
        Alert.alert('Error', result.error || 'Failed to send verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPin(numericText);
  };

  const handleConfirmPinChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setConfirmPin(numericText);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#0136c0', '#0136c0']}
        style={styles.background}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
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
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.welcomeText}>Create Account</Text>
                <Text style={styles.subText}>Join us to get started</Text>
              </View>
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <MaterialIcons 
                    name="person" 
                    size={20} 
                    color="rgba(255,255,255,0.8)" 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    autoCorrect={false}
                    returnKeyType="next"
                    maxLength={50}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons 
                    name="phone" 
                    size={20} 
                    color="rgba(255,255,255,0.8)" 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number (e.g., 078 473 9341)"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    maxLength={16}
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesome 
                    name="lock" 
                    size={20} 
                    color="rgba(255,255,255,0.8)" 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="4-digit PIN"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={pin}
                    onChangeText={handlePinChange}
                    secureTextEntry={!showPin}
                    keyboardType="numeric"
                    maxLength={4}
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="next"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPin(!showPin)}
                    style={styles.visibilityToggle}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  >
                    <MaterialIcons 
                      name={showPin ? 'visibility-off' : 'visibility'} 
                      size={20} 
                      color="rgba(255,255,255,0.8)" 
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesome 
                    name="lock" 
                    size={20} 
                    color="rgba(255,255,255,0.8)" 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm 4-digit PIN"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={confirmPin}
                    onChangeText={handleConfirmPinChange}
                    secureTextEntry={!showPin}
                    keyboardType="numeric"
                    maxLength={4}
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSignup}
                  />
                </View>

                {/* PIN Strength Indicator */}
                {pin.length > 0 && (
                  <View style={styles.pinStrengthContainer}>
                    <MaterialIcons 
                      name={pin.length === 4 && new Set(pin.split('')).size > 1 ? 'check-circle' : 'info'} 
                      size={16} 
                      color={pin.length === 4 && new Set(pin.split('')).size > 1 ? '#4CAF50' : 'rgba(255,255,255,0.6)'} 
                    />
                    <Text style={styles.pinStrengthText}>
                      {pin.length < 4 
                        ? `${4 - pin.length} more digits needed` 
                        : new Set(pin.split('')).size === 1 
                        ? 'Use different digits for better security'
                        : 'Good PIN strength'
                      }
                    </Text>
                  </View>
                )}

                {/* PIN Match Indicator */}
                {confirmPin.length > 0 && (
                  <View style={styles.pinMatchContainer}>
                    <MaterialIcons 
                      name={pin === confirmPin && pin.length === 4 ? 'check-circle' : 'error'} 
                      size={16} 
                      color={pin === confirmPin && pin.length === 4 ? '#4CAF50' : '#F44336'} 
                    />
                    <Text style={[styles.pinMatchText, {
                      color: pin === confirmPin && pin.length === 4 ? '#4CAF50' : '#F44336'
                    }]}>
                      {pin === confirmPin && pin.length === 4 ? 'PINs match' : 'PINs do not match'}
                    </Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.signupButton, loading && styles.buttonDisabled]}
                  onPress={handleSignup}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#ffffff', '#f8f9fa']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#0136c0" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Create Account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.loginLink}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0136c0',
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: height - (StatusBar.currentHeight || 0),
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: height * 0.05,
    paddingBottom: height * 0.03,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    color: '#ffffff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.36,
    includeFontPadding: false,
  },
  subText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    includeFontPadding: false,
  },
  formContainer: {
    paddingHorizontal: width * 0.08,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    letterSpacing: 0.5,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  visibilityToggle: {
    padding: 8,
  },
  pinStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  pinStrengthText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 6,
    fontWeight: '500',
  },
  pinMatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  pinMatchText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  signupButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#0136c0',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    includeFontPadding: false,
  },
  loginLink: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
    textDecorationLine: 'underline',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    includeFontPadding: false,
  },
});

export default SignupScreen;