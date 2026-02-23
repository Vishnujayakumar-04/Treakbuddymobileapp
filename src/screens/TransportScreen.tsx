import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius } from '../theme/spacing';
import { getTransitItems, TransitItem } from '../services/transitService';
import { SectionTitle, Card, Button, Input } from '../components/ui';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface TransportScreenProps {
  navigation?: any;
}

export default function TransportScreen({ navigation }: TransportScreenProps) {
  const [selectedTab, setSelectedTab] = useState('Rentals');

  // Advanced Parity Filters
  const [busSubTab, setBusSubTab] = useState<'local' | 'interstate'>('local');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');

  const [transitData, setTransitData] = useState<TransitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Map app tabs to database categories
  const getCategoryFromTab = (tab: string) => {
    switch (tab) {
      case 'Rentals': return 'rentals';
      case 'Cabs': return 'cabs';
      case 'Bus': return 'bus';
      case 'Train': return 'train';
      default: return 'rentals';
    }
  };

  useEffect(() => {
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    // Fetch Data when tab changes
    const loadData = async () => {
      setLoading(true);
      try {
        const category = getCategoryFromTab(selectedTab);
        const data = await getTransitItems(category);
        setTransitData(data);
      } catch (e) {
        console.error("Failed to load transport data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedTab]);

  const tabs = ['Rentals', 'Cabs', 'Bus', 'Train'];

  // Bus Parity Logic
  const filteredBuses = transitData.filter(bus => {
    // 1. Filter by Sub Tab Type
    if (bus.subCategory !== busSubTab) return false;

    // 2. Filter by Search Query
    const searchFrom = !fromFilter || bus.from?.toLowerCase().includes(fromFilter.toLowerCase()) || bus.via?.some(v => v.toLowerCase().includes(fromFilter.toLowerCase()));
    const searchTo = !toFilter || bus.to?.toLowerCase().includes(toFilter.toLowerCase()) || bus.via?.some(v => v.toLowerCase().includes(toFilter.toLowerCase()));

    return searchFrom && searchTo;
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#2563eb', '#1d4ed8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.headerTitle}>Transport</Text>
            <Text style={styles.headerSubtitle}>Get around Pondicherry</Text>

            <TouchableOpacity
              style={{ marginTop: 16 }}
              onPress={() => navigation?.navigate('RoutePlanner')}
              activeOpacity={0.9}
            >
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, marginRight: 8 }}>🗺️</Text>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Smart Route Planner</Text>
                </View>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>→</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.tabActive
            ]}
            onPress={() => setSelectedTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.tabTextActive
            ]}>
              {tab === 'Rentals' && '🏍️'}
              {tab === 'Cabs' && '🚖'}
              {tab === 'Bus' && '🚌'}
              {tab === 'Train' && '🚆'}
              {' '}{tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {loading ? (
            <View style={{ padding: spacing.xl, alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontWeight: '600' }}>Loading {selectedTab} details...</Text>
            </View>
          ) : (
            <>
              {/* Rentals Tab */}
              {selectedTab === 'Rentals' && (
                <>
                  <SectionTitle title="Vehicle Rentals" subtitle={`${transitData.length} options available`} />

                  {transitData.map((rental, index) => (
                    <Card key={rental.id || index} style={styles.rentalCard}>
                      <View style={styles.rentalIconBg}>
                        <Text style={styles.rentalIcon}>{rental.subCategory === 'Car' ? '🚗' : '🏍️'}</Text>
                      </View>
                      <View style={styles.rentalInfo}>
                        <Text style={styles.rentalName}>{rental.name}</Text>
                        <Text style={styles.rentalDesc}>{rental.subCategory} • {rental.rating} ⭐</Text>
                      </View>
                      <View style={styles.rentalPriceBg}>
                        <Text style={styles.rentalPrice}>{rental.price}</Text>
                        <Text style={styles.rentalPriceLabel}>per day</Text>
                      </View>
                    </Card>
                  ))}

                  {/* Quick Tip */}
                  <View style={styles.tipCard}>
                    <Text style={styles.tipIcon}>💡</Text>
                    <View style={styles.tipContent}>
                      <Text style={styles.tipTitle}>Quick Tip</Text>
                      <Text style={styles.tipText}>
                        Carry a valid driving license and ID proof for all rentals. Helmets are mandatory for two-wheelers.
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {/* Cabs Tab */}
              {selectedTab === 'Cabs' && (
                <>
                  <SectionTitle title="Estimated Fares & Operators" subtitle="Auto & Cab prices" />

                  <View style={styles.faresContainer}>
                    {transitData.filter(d => d.type === 'service').map((fare, index) => (
                      <View key={fare.id || index} style={styles.fareCard}>
                        <LinearGradient
                          colors={['#f59e0b', '#d97706']}
                          style={styles.fareGradient}
                        >
                          <Text style={styles.fareType}>{fare.name}</Text>
                          <Text style={styles.farePrice}>{fare.baseRate} Base</Text>
                        </LinearGradient>
                      </View>
                    ))}
                  </View>

                  {/* Call to Action */}
                  <TouchableOpacity style={styles.ctaCard} activeOpacity={0.9}>
                    <LinearGradient
                      colors={['#0F766E', '#14B8A6']}
                      style={styles.ctaGradient}
                    >
                      <Text style={styles.ctaIcon}>📱</Text>
                      <View style={styles.ctaContent}>
                        <Text style={styles.ctaTitle}>Book a Ride Online</Text>
                        <Text style={styles.ctaText}>Open Rapido or Uber app</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}

              {/* Bus Tab */}
              {selectedTab === 'Bus' && (
                <>
                  <SectionTitle title="Bus Routes & Timetables" subtitle="Town & Inter-city buses" />

                  {/* Sub-Tabs purely for buses just like website */}
                  <View style={{ flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 16 }}>
                    <TouchableOpacity
                      style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: busSubTab === 'local' ? '#FFFFFF' : 'transparent', alignItems: 'center' }}
                      onPress={() => setBusSubTab('local')}
                    >
                      <Text style={{ fontWeight: busSubTab === 'local' ? '700' : '500', color: busSubTab === 'local' ? '#0F766E' : '#64748B' }}>🚌 Town Bus (Local)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: busSubTab === 'interstate' ? '#FFFFFF' : 'transparent', alignItems: 'center' }}
                      onPress={() => setBusSubTab('interstate')}
                    >
                      <Text style={{ fontWeight: busSubTab === 'interstate' ? '700' : '500', color: busSubTab === 'interstate' ? '#0F766E' : '#64748B' }}>🏢 Inter-city</Text>
                    </TouchableOpacity>
                  </View>

                  {/* From & To Filtering like website */}
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="From"
                        placeholder="Origin..."
                        value={fromFilter}
                        onChangeText={setFromFilter}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="To"
                        placeholder="Destination..."
                        value={toFilter}
                        onChangeText={setToFilter}
                      />
                    </View>
                  </View>

                  {filteredBuses.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 16, color: '#94A3B8' }}>No buses found for this route.</Text>
                  )}

                  {filteredBuses.map((bus, index) => (
                    <Card key={bus.id || index} style={styles.busCard}>
                      <View style={styles.busHeader}>
                        <Text style={styles.busIcon}>{bus.type?.includes('Electric') ? '🔋' : '🚌'}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.busTitle}>{bus.name}</Text>
                          <Text style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>{bus.type}</Text>
                        </View>
                        {bus.price && (
                          <View style={{ backgroundColor: '#ccfbf1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                            <Text style={{ color: '#0f766e', fontWeight: '800' }}>{bus.price}</Text>
                          </View>
                        )}
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                        <Text style={{ fontWeight: '600', color: '#1E293B', fontSize: 13 }}>{bus.from}</Text>
                        <Text style={{ color: '#94A3B8', marginHorizontal: 8 }}>➔</Text>
                        <Text style={{ fontWeight: '600', color: '#1E293B', fontSize: 13 }}>{bus.to}</Text>
                      </View>

                      <Text style={styles.busInfo}>⏱️  Freq: {bus.frequency} • {bus.duration}</Text>

                      {bus.via && bus.via.length > 0 && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                          <Text style={{ fontSize: 12, color: '#94A3B8', alignSelf: 'center', marginRight: 4 }}>Via:</Text>
                          {bus.via.map((stop, idx) => (
                            <View key={idx} style={{ backgroundColor: '#f8fafc', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, borderWidth: 1, borderColor: '#e2e8f0' }}>
                              <Text style={{ fontSize: 11, color: '#475569' }}>{stop}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </Card>
                  ))}
                </>
              )}

              {/* Train Tab */}
              {selectedTab === 'Train' && (
                <>
                  <SectionTitle title="Train Services" subtitle="Puducherry Railway Station" />

                  {transitData.filter(d => d.type === 'route').map((train, index) => (
                    <Card key={train.id || index} style={styles.busCard}>
                      <View style={styles.busHeader}>
                        <Text style={styles.busIcon}>🚆</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.busTitle}>{train.name}</Text>
                          <Text style={{ color: '#64748B', fontSize: 12 }}>{train.from} ➔ {train.to}</Text>
                        </View>
                      </View>
                      <Text style={styles.busInfo}>Departs: {train.departure} • Arrives: {train.arrival}</Text>
                      <Text style={styles.busFare}>Fare: {train.price}</Text>
                    </Card>
                  ))}
                </>
              )}
            </>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: STATUSBAR_HEIGHT + spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#06b6d4',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  // Content
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: spacing.lg,
  },
  // Rental Cards
  rentalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rentalIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rentalIcon: {
    fontSize: 30,
  },
  rentalInfo: {
    flex: 1,
  },
  rentalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: spacing.xs,
  },
  rentalDesc: {
    fontSize: 13,
    color: '#64748b',
  },
  rentalPriceBg: {
    alignItems: 'flex-end',
  },
  rentalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#06b6d4',
  },
  rentalPriceLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  // Tip Card
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 2,
    borderColor: '#bfdbfe',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e40af',
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 20,
  },
  // Fares
  faresContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  fareCard: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fareGradient: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  fareType: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  farePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // CTA Card
  ctaCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  ctaIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  ctaText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Bus Cards
  busCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  busIcon: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  busTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  busInfo: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  busFare: {
    fontSize: 14,
    fontWeight: '700',
    color: '#06b6d4',
  },
  // Bus Stand
  standCard: {
    backgroundColor: '#fef3c7',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: '#fde68a',
  },
  standTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400e',
    marginBottom: spacing.sm,
  },
  standAddress: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: spacing.md,
  },
  directionsButton: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  directionsGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  directionsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
