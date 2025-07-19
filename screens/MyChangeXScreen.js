import React, { useState, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Dimensions,
  StatusBar,
  ScrollView,
  TextInput,
  SafeAreaView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MyChangeXScreen = () => {
  const navigation = useNavigation();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [amount, setAmount] = useState('');

  const wallets = [
    { id: 1, name: 'Primary Wallet', balance: '$273.50', icon: 'account-balance-wallet' },
    { id: 2, name: 'Savings Wallet', balance: '$120.00', icon: 'savings' },
    { id: 3, name: 'Business Wallet', balance: '$540.75', icon: 'business' },
    { id: 4, name: 'Family Wallet', balance: '$85.25', icon: 'family-restroom' },
  ];

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
          <Text style={styles.header}>MyChangeX Wallet</Text>
          <Text style={styles.subHeader}>Select wallet for payment</Text>
          
          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Enter Amount</Text>
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
          
          {/* Wallet Selection */}
          <ScrollView 
            style={styles.walletScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {wallets.map(wallet => (
              <Pressable
                key={wallet.id}
                style={({ pressed }) => [
                  styles.walletCard,
                  selectedWallet?.id === wallet.id && styles.selectedWallet,
                  pressed && styles.pressedWallet
                ]}
                onPress={() => setSelectedWallet(wallet)}
                android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
              >
                <LinearGradient
                  colors={selectedWallet?.id === wallet.id 
                    ? ['#ffffff', '#f8f9fa'] 
                    : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.walletIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialIcons 
                    name={wallet.icon} 
                    size={24} 
                    color={selectedWallet?.id === wallet.id ? '#0136c0' : '#ffffff'} 
                  />
                </LinearGradient>
                <View style={styles.walletInfo}>
                  <Text style={[
                    styles.walletName,
                    selectedWallet?.id === wallet.id && styles.selectedWalletText
                  ]}>
                    {wallet.name}
                  </Text>
                  <Text style={[
                    styles.walletBalance,
                    selectedWallet?.id === wallet.id && styles.selectedWalletText
                  ]}>
                    {wallet.balance}
                  </Text>
                </View>
                {selectedWallet?.id === wallet.id && (
                  <MaterialIcons name="check-circle" size={24} color="#0136c0" />
                )}
              </Pressable>
            ))}
          </ScrollView>
          
          {/* Continue Button */}
          <Pressable 
            style={({ pressed }) => [
              styles.continueButton,
              !selectedWallet && styles.disabledButton,
              pressed && styles.continueButtonPressed
            ]}
            disabled={!selectedWallet}
            android_ripple={{ color: 'rgba(1, 54, 192, 0.1)' }}
          >
            <LinearGradient
              colors={['#ffffff', '#f8f9fa']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueButtonText}>
                {selectedWallet ? `Pay with ${selectedWallet.name}` : 'Select a wallet'}
              </Text>
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    letterSpacing: 0.5,
  },
  subHeader: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  amountContainer: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
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
  walletScroll: {
    flex: 1,
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pressedWallet: {
    opacity: 0.8,
  },
  selectedWallet: {
    backgroundColor: '#ffffff',
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  walletBalance: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  selectedWalletText: {
    color: '#0136c0',
  },
  continueButton: {
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
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonPressed: {
    opacity: 0.9,
  },
  continueButtonText: {
    color: '#0136c0',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
});

export default MyChangeXScreen;