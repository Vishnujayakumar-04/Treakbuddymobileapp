import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { spacing, radius } from '../theme/spacing';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation?: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const handleGetStarted = () => {
    navigation?.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Full Screen Background */}
      <ImageBackground
        source={require('../../assets/Famousplacesimg/arulmigu-manakula-vinayar-puducherry-1-attr-hero.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay for Readability */}
        <LinearGradient
          colors={['rgba(15, 23, 42, 0.1)', 'rgba(15, 23, 42, 0.6)', '#0f172a']}
          style={styles.gradientOverlay}
          locations={[0, 0.5, 1]}
        >
          <View style={styles.contentContainer}>

            {/* Top Text Content */}
            <View style={styles.textSection}>
              <Animated.Text
                entering={FadeInUp.delay(200).duration(800)}
                style={styles.subtitle}
              >
                Welcome to
              </Animated.Text>

              <Animated.Text
                entering={FadeInUp.delay(400).duration(800)}
                style={styles.title}
              >
                TrekBuddy
              </Animated.Text>

              <Animated.Text
                entering={FadeInUp.delay(600).duration(800)}
                style={styles.description}
              >
                Discover the hidden gems, heritage, and spirited culture of Puducherry.
              </Animated.Text>
            </View>

            {/* Bottom Button */}
            <Animated.View
              entering={FadeInDown.delay(800).duration(800)}
              style={styles.bottomSection}
            >
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={handleGetStarted}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#06b6d4', '#2563eb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
  },
  textSection: {
    marginTop: spacing.xxl,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#bae6fd',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
    marginBottom: spacing.md,
    lineHeight: 56,
  },
  description: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
    maxWidth: '85%',
  },
  bottomSection: {
    marginBottom: spacing.xl,
    width: '100%',
  },
  buttonWrapper: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
