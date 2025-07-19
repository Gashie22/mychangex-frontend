import React from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Dimensions, 
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ReceiveScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
            <Text style={styles.qrInstruction}>SCAN THIS CODE TO RECEIVE COUPONS</Text>
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value="https://mycouponapp.com/receive/12345"
                size={width * 0.6}
                color="#0136c0"
                backgroundColor="#ffffff"
              />
            </View>
            <Text style={styles.qrHint}>Hold this code to the scanner</Text>
          </View>

          {/* Balance Display */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>YOUR COUPON BALANCE</Text>
            <Text style={styles.balanceAmount}>$2.40</Text>
          </View>

          {/* Spend Button */}
          <Pressable 
            style={({ pressed }) => [
              styles.spendButton,
              pressed && styles.spendButtonPressed
            ]}
            android_ripple={{ color: 'rgba(1, 54, 192, 0.1)' }}
            onPress={() => navigation.navigate('SuccessPay')}
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
  qrHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
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
  spendButton: {
    borderRadius: 12,
    overflow: 'hidden',
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
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default ReceiveScreen;