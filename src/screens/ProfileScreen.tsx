import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  Alert,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  subscribeToUserTrips,
  subscribeToFavorites,
  subscribeToHistory,
  HistoryItem
} from '../utils/firestore';
import { StoredTrip, StoredFavorite } from '../utils/storage';
import { spacing, radius } from '../theme/spacing';

import { ProfileHeader } from '../components/profile/ProfileHeader';
import { EditProfileModal } from '../components/profile/EditProfileModal';

interface ProfileScreenProps {
  navigation?: any;
}

// A beautiful tropical island aerial shot matching the reference
const PROFILE_BG_IMAGE = 'https://images.unsplash.com/photo-1548625361-ec853158cabb?w=800&q=80';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, userProfile, signOut, refreshUserProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Real-time Data States
  const [trips, setTrips] = useState<StoredTrip[]>([]);
  const [favorites, setFavorites] = useState<StoredFavorite[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // UI States
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Initialize Animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Handle Real-time Data Listeners
  useEffect(() => {
    if (!user) return;

    const unsubTrips = subscribeToUserTrips(user.uid, setTrips);
    const unsubFavs = subscribeToFavorites(user.uid, setFavorites);
    const unsubHistory = subscribeToHistory(user.uid, setHistory);

    return () => {
      unsubTrips();
      unsubFavs();
      unsubHistory();
    };
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: signOut },
    ]);
  };

  if (!user || !userProfile) {
    return null;
  }

  // Personal Info Menu Items
  const menuItems = [
    { id: '1', icon: 'location-outline', title: 'My Address', onPress: () => { } },
    { id: '2', icon: 'notifications-outline', title: 'Notification', onPress: () => { } },
    { id: '3', icon: 'moon-outline', title: 'Dark Mode', isSwitch: true, switchValue: isDark, onSwitch: toggleTheme },
    { id: '4', icon: 'globe-outline', title: 'Languages', onPress: () => { } },
    { id: '5', icon: 'alert-circle-outline', title: 'Help and Support', onPress: () => { } },
  ];

  return (
    <View style={styles.container}>
      {/* Immersive Background */}
      <View style={StyleSheet.absoluteFill}>
        <Image
          source={{ uri: PROFILE_BG_IMAGE }}
          style={styles.bgImage}
          resizeMode="cover"
        />
        {/* The overlay gradient creates the soft teal/cyan fog over the lower areas */}
        <LinearGradient
          colors={
            isDark
              ? ['rgba(15,23,42,0.3)', 'rgba(15, 23, 42, 0.95)', '#0f172a']
              : ['rgba(189,235,229,0.3)', 'rgba(213,241,219,0.95)', '#e6f7ef']
          }
          style={StyleSheet.absoluteFill}
          locations={[0, 0.4, 0.8]}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#FFF' : '#0a4a4b'}
          />
        }
      >
        <ProfileHeader
          name={userProfile.name || 'User'}
          email={userProfile.email}
          photoUrl={userProfile.profilePhotoUrl || null}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          onEditPress={() => setEditModalVisible(true)}
        />

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Saved Palace Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#0a4a4b' }]}>
              Saved Palace
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.sm }}
            >
              {favorites.length > 0 ? (
                favorites.map((fav) => (
                  <TouchableOpacity
                    key={fav.placeId}
                    style={styles.savedCard}
                    onPress={() => navigation?.navigate('PlaceDetails', { id: fav.placeId, name: fav.place?.name })}
                  >
                    <Image source={{ uri: fav.place?.image || 'https://images.unsplash.com/photo-1548625361-ec853158cabb?q=80' }} style={styles.savedImage} />
                  </TouchableOpacity>
                ))
              ) : (
                [1, 2, 3].map((_, i) => (
                  <View key={i} style={styles.savedPlaceholder}>
                    <Ionicons name="image-outline" size={24} color="#0a4a4b" opacity={0.3} />
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {/* Personal Info Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#0a4a4b' }]}>
              Personal Info
            </Text>

            <View style={styles.menuList}>
              {menuItems.map((item, index) => (
                <View key={item.id} style={[
                  styles.menuItemRow,
                  index < menuItems.length - 1 && styles.menuItemBorder
                ]}>
                  {item.isSwitch ? (
                    <View style={styles.menuItemContent}>
                      <Ionicons name={item.icon as any} size={22} color={isDark ? '#FFF' : '#0a4a4b'} style={styles.menuIcon} />
                      <Text style={[styles.menuTitleText, { color: isDark ? '#cbd5e1' : '#1e293b' }]}>{item.title}</Text>
                      <Switch
                        value={item.switchValue}
                        onValueChange={item.onSwitch}
                        trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                        thumbColor="#ffffff"
                      />
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.menuItemContent} onPress={item.onPress}>
                      <Ionicons name={item.icon as any} size={22} color={isDark ? '#FFF' : '#0a4a4b'} style={styles.menuIcon} />
                      <Text style={[styles.menuTitleText, { color: isDark ? '#cbd5e1' : '#1e293b' }]}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        userId={user.uid}
        currentName={userProfile.name}
        currentEmail={userProfile.email}
        currentPhotoUrl={userProfile.profilePhotoUrl || null}
        isDark={isDark}
        onProfileUpdated={refreshUserProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7ef',
  },
  bgImage: {
    width: '100%',
    height: 400,
    opacity: 0.8,
  },
  sectionContainer: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  savedCard: {
    width: 110,
    height: 110,
    borderRadius: 24,
    marginRight: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  savedImage: {
    width: '100%',
    height: '100%',
  },
  savedPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 24,
    backgroundColor: 'rgba(10, 74, 75, 0.1)',
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    paddingHorizontal: spacing.xl,
  },
  menuItemRow: {
    paddingVertical: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 74, 75, 0.1)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: spacing.md,
    opacity: 0.8,
  },
  menuTitleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: 60,
  },
  logoutText: {
    color: '#e11d48', // Red color for logout
    fontSize: 16,
    fontWeight: '700',
  },
});
