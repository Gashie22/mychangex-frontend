import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignUpScreen';
import UserTypeScreen from './screens/UserTypeScreen';
import VendorSignup from './screens/VendorSignup';
import CustomerSignup from './screens/CustomerSignup';
import PasswordScreen from './screens/PasswordScreen';
import SendScreen from './screens/SendScreen';
import RecieveScreen from './screens/RecieveScreen';
import SuccessPay from './screens/SuccessPay';  
import EconetScreen from './screens/EconetScreen'; // Assuming you have this screen
import MyChangeXScreen from './screens/MyChangeXScreen'; // Assuming you have this screen
import OmariScreen from './screens/OmariScreen'; // Assuming you have this screen



const Stack = createNativeStackNavigator(); 

export default function App() {
  return (

       <NavigationContainer>
       <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="UserType" component={UserTypeScreen} />
        <Stack.Screen name="VendorSignup"component={VendorSignup}/>
        <Stack.Screen name="CustomerSignup" component={CustomerSignup} />
        <Stack.Screen name="Password" component={PasswordScreen} />
        <Stack.Screen name="Send" component={SendScreen} />  
        <Stack.Screen name="Recieve" component={RecieveScreen} />
        <Stack.Screen name="SuccessPay" component={SuccessPay} />
        <Stack.Screen name="Econet" component={EconetScreen} />
        <Stack.Screen name="MyChangeX" component={MyChangeXScreen} />
        <Stack.Screen name="Omari" component={OmariScreen} />
     
       </Stack.Navigator>
       </NavigationContainer>
     
  );
}

