import React from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SuccessPay = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // Animation sequence
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <LinearGradient
      colors={['#0136c0', '#0151c0']}
      style={styles.background}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <Animated.View 
            style={[styles.header, { opacity: fadeAnim }]}
            testID="success-header"
          >
            <Text style={styles.title}>Payment Successful</Text>
          </Animated.View>

          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <LinearGradient
                colors={['#ffffff', '#f8f9fa']}
                style={styles.iconCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="check" size={48} color="#0136c0" />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Confirmation Message */}
          <Animated.View 
            style={[styles.messageContainer, { opacity: fadeAnim }]}
            testID="success-message"
          >
            <Text style={styles.amount}>$2.40</Text>
            <Text style={styles.message}>Payment completed successfully!</Text>
            <Text style={styles.details}>Transaction ID: #PAY-789456123</Text>
            <Text style={styles.timestamp}>{new Date().toLocaleString()}</Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View 
            style={[styles.buttonContainer, { opacity: fadeAnim }]}
            testID="action-buttons"
          >
            <Pressable 
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed
              ]}
              onPress={handleBackToHome}
              android_ripple={{ color: 'rgba(1, 54, 192, 0.1)', borderless: false }}
              accessibilityLabel="Return to home screen"
              accessibilityHint="Navigates back to the home screen"
            >
              <LinearGradient
                colors={['#ffffff', '#f8f9fa']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>BACK TO HOME</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable 
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('Receipt')}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.1)', borderless: false }}
              accessibilityLabel="View payment receipt"
              accessibilityHint="Shows detailed receipt for this transaction"
            >
              <Text style={styles.secondaryButtonText}>VIEW RECEIPT</Text>
            </Pressable>
          </Animated.View>
        </View>
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
    paddingTop: Platform.select({ ios: 40, android: 24 }),
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 34,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  messageContainer: {
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 20,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  message: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    lineHeight: 28,
  },
  details: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 40,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    height: 56,
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
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: '#0136c0',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    padding: 16,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    letterSpacing: 0.5,
  },
});

export default SuccessPay;
