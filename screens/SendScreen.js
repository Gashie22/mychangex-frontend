import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';   
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const SendScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('0.25');

  useLayoutEffect(() => {
    navigation.setOptions({  
      headerShown: false,
    });   
  }, []);

  return (
    <LinearGradient
      colors={['#196edb', '#196edb']}
      style={styles.background}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.time}>9:41</Text>
          <Text style={styles.title}>Send Coupons</Text>
        </View>

        {/* Recipient Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>To</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor="#e2e8f0"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#e2e8f0"
            />
          </View>
        </View>

        {/* Balance Display */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Coupon Balance: $2.40</Text>
        </View>

        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} 
          onPress={() => navigation.navigate('SuccessPay')}>
          <Text style={styles.sendButtonText}>SEND</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#196edb',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  time: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dollarSign: {
    fontSize: 16,
    padding: 15,
    paddingRight: 5,
    color: '#ffffff',
  },
  amountInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
  },
  balanceContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  balanceText: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  sendButton: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  sendButtonText: {
    color: '#196edb',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SendScreen;