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
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPin, setShowPin] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

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
            {/* Centered Content */}
            <View style={styles.contentContainer}>
              {/* Logo Section */}
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.welcomeText}>Create Account</Text>
                <Text style={styles.subText}>Join us to get started</Text>
              </View>

              {/* Form Section */}
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
                    placeholder="Phone Number"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
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
                    onChangeText={setPin}
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
                    onChangeText={setConfirmPin}
                    secureTextEntry={!showPin}
                    keyboardType="numeric"
                    maxLength={4}
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="done"
                  />
                </View>

                <TouchableOpacity 
                  style={styles.signupButton}
                  onPress={() => navigation.navigate('Home')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#ffffff', '#f8f9fa']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>Sign Up</Text>
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
    paddingBottom: height * 0.04,
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