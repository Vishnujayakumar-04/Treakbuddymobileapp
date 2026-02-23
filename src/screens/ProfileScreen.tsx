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
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
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
import { EditProfileModal } from '../components/profile/EditProfileModal';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface ProfileScreenProps {
  navigation?: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, userProfile, signOut, refreshUserProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [trips, setTrips] = useState<StoredTrip[]>([]);
  const [favorites, setFavorites] = useState<StoredFavorite[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubTrips = subscribeToUserTrips(user.uid, setTrips);
    const unsubFavs = subscribeToFavorites(user.uid, setFavorites);
    const unsubHistory = subscribeToHistory(user.uid, setHistory);
    return () => { unsubTrips(); unsubFavs(); unsubHistory(); };
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

  // Not signed in
  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Ionicons name="person-circle-outline" size={80} color="#0891b2" />
        <Text style={styles.guestTitle}>You're not signed in</Text>
        <Text style={styles.guestSub}>Sign in to view your profile, saved places and trips.</Text>
        <TouchableOpacity style={styles.signInBtn} onPress={() => navigation?.navigate('Login')}>
          <Text style={styles.signInBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading profile
  if (!userProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  const displayName = userProfile.name || user.email?.split('@')[0] || 'Traveler';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Gradient Header */}
      <LinearGradient
        colors={['#0c4a6e', '#0891b2', '#06b6d4']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{ paddingTop: STATUSBAR_HEIGHT + 12 }}>
          {/* Avatar */}
          <View style={styles.avatarRow}>
            <TouchableOpacity
              onPress={() => setEditModalVisible(true)}
              style={styles.avatarContainer}
            >
              {userProfile.profilePhotoUrl ? (
                <Image
                  source={{ uri: userProfile.profilePhotoUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarLetter}>{avatarLetter}</Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Feather name="edit-2" size={10} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trips.length}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Visited</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0891b2" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Saved Places */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Saved Places</Text>
          {favorites.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 8 }}>
              {favorites.map((fav) => (
                <TouchableOpacity
                  key={fav.placeId}
                  style={styles.favCard}
                  onPress={() => navigation?.navigate('PlaceDetails', { id: fav.placeId })}
                >
                  {fav.place?.image ? (
                    <Image source={{ uri: fav.place.image }} style={styles.favImage} />
                  ) : (
                    <View style={[styles.favImage, { backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' }]}>
                      <Ionicons name="image-outline" size={24} color="#0891b2" />
                    </View>
                  )}
                  <Text style={styles.favName} numberOfLines={1}>{fav.place?.name || 'Place'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyBox}>
              <Ionicons name="heart-outline" size={32} color="#cbd5e1" />
              <Text style={styles.emptyText}>No saved places yet.{'\n'}Tap ♥ on any place to save it.</Text>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuRow} onPress={() => setEditModalVisible(true)}>
              <View style={styles.menuIcon}><Ionicons name="person-outline" size={20} color="#0891b2" /></View>
              <Text style={styles.menuText}>Edit Profile</Text>
              <Feather name="chevron-right" size={18} color="#94a3b8" />
            </TouchableOpacity>
            <View style={[styles.menuRow, { borderBottomWidth: 0 }]}>
              <View style={styles.menuIcon}><Ionicons name="moon-outline" size={20} color="#0891b2" /></View>
              <Text style={styles.menuText}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#e2e8f0', true: '#0891b2' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0369a1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  favCard: {
    width: 96,
    alignItems: 'center',
  },
  favImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 6,
  },
  favName: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
    width: 88,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  menuList: {
    gap: 0,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },
  // Guest state
  guestTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  guestSub: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
    marginBottom: 24,
  },
  signInBtn: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  signInBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
