import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    StatusBar,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { spacing, radius } from '../theme/spacing';

interface SignupScreenProps {
    navigation?: any;
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { signUp, signInWithGoogle, loading } = useAuth();

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters');
            return;
        }
        try {
            await signUp(email, password, name);
            // Navigation handled by AuthContext state change
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message || 'An error occurred during sign up');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error: any) {
            Alert.alert('Google Sign-In Failed', error.message || 'An error occurred during sign in');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Top Blue Header Section */}
            <View style={styles.headerSection}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>

                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <Text style={styles.logoText}>TrekBuddy</Text>
                    <Text style={styles.subtitleText}>
                        Join the community and{'\n'}start mapping your journey!
                    </Text>
                </Animated.View>
            </View>

            {/* Main White Sheet */}
            <Animated.View entering={FadeInUp.delay(300).duration(600).springify()} style={styles.sheetContainer}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>

                    <Text style={styles.sheetTitle}>Sign up</Text>

                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor="#94a3b8"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoComplete="name"
                        />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor="#94a3b8"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="Create a password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        <Text style={styles.primaryButtonText}>
                            {loading ? 'Creating Account...' : 'Sign up'}
                        </Text>
                    </TouchableOpacity>

                    {/* Or Sign Up With */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or Sign up with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Row */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
                            <FontAwesome5 name="google" size={20} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <FontAwesome5 name="facebook" size={20} color="#4267B2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <FontAwesome5 name="apple" size={22} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Feather name="smartphone" size={22} color="#065fce" />
                        </TouchableOpacity>
                    </View>

                    {/* Footer Log In */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
                            <Text style={styles.loginText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#065fce', // Primary Blue
    },
    headerSection: {
        paddingTop: 60,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xl,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    logoText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#ffffff',
        fontStyle: 'italic',
        marginBottom: spacing.sm,
    },
    subtitleText: {
        fontSize: 16,
        color: '#e2e8f0',
        lineHeight: 24,
    },
    sheetContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
        overflow: 'hidden',
    },
    sheetContent: {
        paddingTop: spacing.xxl,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxxl,
    },
    sheetTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: spacing.xxl,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: spacing.xs,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e1',
        paddingVertical: spacing.md,
        fontSize: 16,
        color: '#0f172a',
    },
    passwordWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    passwordInput: {
        paddingRight: 40,
    },
    eyeIcon: {
        position: 'absolute',
        right: 0,
        padding: spacing.sm,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#065fce',
        paddingVertical: 18,
        borderRadius: radius.full,
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
        marginTop: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        color: '#94a3b8',
        paddingHorizontal: spacing.md,
        fontSize: 14,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xxl,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#64748b',
        fontSize: 15,
    },
    loginText: {
        color: '#065fce',
        fontSize: 15,
        fontWeight: '700',
    },
});
