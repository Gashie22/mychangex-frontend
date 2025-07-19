import React, { useLayoutEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Easing,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
    const navigation = useNavigation();
    const scaleValue = new Animated.Value(0.95);
    const opacityValue = new Animated.Value(0);
    const buttonScale = new Animated.Value(1);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

        // Animation on mount
        Animated.parallel([
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true
            }),
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true
            })
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.96,
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true
        }).start();
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
                <View style={styles.centeredContainer}>
                    <Animated.View 
                        style={[
                            styles.container,
                            { 
                                opacity: opacityValue,
                                transform: [{ scale: scaleValue }] 
                            }
                        ]}
                    >
                        {/* Logo with animation */}
                        <Animatable.View
                            animation="fadeIn"
                            duration={1000}
                            easing="ease-in-out"
                            style={styles.logoContainer}
                        >
                            <Image 
                                source={require('../assets/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </Animatable.View>

                        {/* Taglines with subtle animation */}
                        <Animatable.View 
                            animation="fadeInUp" 
                            duration={800}
                            delay={200}
                            easing="ease-out"
                            style={styles.taglineContainer}
                        >
                            <Text style={styles.tagline}>Get your change.</Text>
                            <Text style={styles.subTagline}>Every cent, every time.</Text>
                        </Animatable.View>

                        {/* Animated button */}
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Login')}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            activeOpacity={0.9}
                        >   
                            <Animated.View 
                                style={[
                                    styles.button,
                                    { transform: [{ scale: buttonScale }] }
                                ]}
                            >
                                <Text style={styles.buttonText}>Get Started</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                
                {/* Footer text */}
                <Animatable.Text 
                    animation="fadeIn"
                    duration={1000}
                    delay={400}
                    style={styles.footerText}
                >
                    Secure • Reliable • Instant
                </Animatable.Text>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 32,
        marginTop: -40, // This slight adjustment helps perfect centering
    },
    logoContainer: {
        marginBottom: height * 0.06,
        width: width * 0.35,
        height: width * 0.35,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    taglineContainer: {
        marginBottom: height * 0.08,
        alignItems: 'center',
        paddingHorizontal: 20,
        maxWidth: width * 0.9,
    },
    tagline: {
        fontSize: Platform.OS === 'ios' ? 32 : 30,
        fontWeight: '700', // Standard semi-bold weight (600-700)
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        color: '#ffffff',
        marginBottom: 8,
        letterSpacing: 0.4,
        textAlign: 'center',
        lineHeight: 38,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
        includeFontPadding: false,
    },
    subTagline: {
        fontSize: Platform.OS === 'ios' ? 20 : 18, // Slightly smaller on Android for better proportion
        fontWeight: '600', // Standard medium weight
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 28,
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
        includeFontPadding: false,
    },
    button: {
        width: width * 0.85, // Better responsive width
        maxWidth: 340,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        paddingVertical: 16, // Slightly increased for better touch area
        alignItems: 'center',
    },
    buttonText: {
        color: '#0136c0',
        fontSize: 18,
        fontWeight: '600', // Semi-bold for better readability
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    footerText: {
        position: 'absolute',
        bottom: height * 0.05,
        alignSelf: 'center',
        color: 'rgba(255,255,255,0.9)',
        fontSize: Platform.OS === 'ios' ? 15 : 14, // Slightly smaller on Android
        fontWeight: '500', // Medium weight
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: 0.5, height: 0.5},
        textShadowRadius: 1,
        includeFontPadding: false,
    },
});

export default HomeScreen;