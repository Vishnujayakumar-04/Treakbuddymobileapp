import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowBackIcon, LocationPinIcon, StarIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FAMOUS_PLACES = {
    historical: [
        { name: 'French War Memorial', location: 'Goubert Avenue', image: 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=800' },
        { name: 'Aayi Mandapam', location: 'White Town', image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800' },
        { name: 'Bharathi Park', location: 'White Town', image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=800' },
        { name: 'Arikamedu Archaeological Site', location: 'Arikamedu', image: 'https://images.unsplash.com/photo-1518012312832-96aea3c91144?w=800' },
        { name: 'Kargil War Memorial', location: 'Shanmugha Vilasam', image: 'https://images.unsplash.com/photo-1552751072-4ac0c9c2b5c4?w=800' },
        { name: 'Raj Niwas', location: 'White Town', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800' },
    ],
    temples: [
        { name: 'Manakula Vinayagar Temple', location: 'White Town', image: 'https://images.unsplash.com/photo-1582443168850-6e1ea092647b?w=800' },
        { name: 'Varadaraja Perumal Temple', location: 'Near French Consulate', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800' },
        { name: 'Kamakshi Amman Temple', location: 'Near Beach', image: 'https://images.unsplash.com/photo-1609682448995-3e4cb7e5e4f8?w=800' },
        { name: 'Vedapureeswarar Temple', location: 'Near Serenity Beach', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800' },
        { name: 'Arulmigu Kanniga Parameswari Temple', location: 'Kuruchikuppam', image: 'https://images.unsplash.com/photo-1580533319007-5d61615dc6f7?w=800' },
    ],
    nature: [
        { name: 'Paradise Beach', location: 'Chunnambar', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
        { name: 'Auroville Beach', location: 'Auroville', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
        { name: 'Serenity Beach', location: 'Auroville Road', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800' },
        { name: 'Ousteri Lake & Wildlife Sanctuary', location: 'Ossudu', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800' },
        { name: 'Botanical Garden', location: 'Near Railway Station', image: 'https://images.unsplash.com/photo-1585581505402-85f3eebbddf8?w=800' },
        { name: 'Pichavaram Mangrove Forest', location: 'Near Chidambaram', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800' },
    ],
    churches: [
        { name: 'Basilica of the Sacred Heart of Jesus', location: 'Subbaiah Salai', image: 'https://images.unsplash.com/photo-1548625149-720367fa4c1c?w=800' },
        { name: 'The Sacred Heart Church', location: 'Near Beach', image: 'https://images.unsplash.com/photo-1478731674354-0c4464769e76?w=800' },
        { name: 'Immaculate Conception Cathedral', location: 'Mission Street', image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=800' },
        { name: 'Eglise de Notre Dame des Anges', location: 'Rue Dumas', image: 'https://images.unsplash.com/photo-1578659568744-67b0b3759729?w=800' },
    ],
    popular: [
        { name: 'Promenade Beach', location: 'Beach Road', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
        { name: 'Rock Beach', location: 'Goubert Avenue', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
        { name: 'Aurobindo Ashram', location: 'Rue de la Marine', image: 'https://images.unsplash.com/photo-1603794067602-9feaa4f70e0c?w=800' },
        { name: 'Auroville Matrimandir', location: 'Auroville', image: 'https://images.unsplash.com/photo-1548625149-720367fa4c1c?w=800' },
        { name: 'Pondicherry Lighthouse', location: 'Promenade', image: 'https://images.unsplash.com/photo-1589829145333-6f6b7d4c1e81?w=800' },
        { name: 'Pondicherry Museum', location: 'Bharathi Park', image: 'https://images.unsplash.com/photo-1566127444510-a8dc77cda928?w=800' },
        { name: 'Chunnambar Boat House', location: 'Chunnambar', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
    ],
    food: [
        { name: 'Ratatouille', type: 'Vegetarian', restaurant: 'Various French Cafés', image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=800' },
        { name: 'Crepes', type: 'Vegetarian', restaurant: 'Café des Arts', image: 'https://images.unsplash.com/photo-1519671282429-b4b6600f4a93?w=800' },
        { name: 'Masala Dosa', type: 'Vegetarian', restaurant: 'Surguru', image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=800' },
        { name: 'Kadugu Yerra', type: 'Vegetarian', restaurant: 'Local Eateries', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800' },
        { name: 'Idiyappam with Coconut Milk', type: 'Vegetarian', restaurant: 'Traditional Restaurants', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800' },
        { name: 'Prawn Risotto', type: 'Non-Vegetarian', restaurant: 'Villa Shanti', image: 'https://images.unsplash.com/photo-1626785501863-1456bfbc50d2?w=800' },
        { name: 'Fish Vindaloo', type: 'Non-Vegetarian', restaurant: 'Coromandel Café', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800' },
        { name: 'Chicken Chettinad', type: 'Non-Vegetarian', restaurant: 'Le Dupleix', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800' },
    ],
};

const CATEGORIES = [
    { id: 'popular', label: 'Top Hits', emoji: '🌟', count: FAMOUS_PLACES.popular.length },
    { id: 'historical', label: 'History', emoji: '🏛️', count: FAMOUS_PLACES.historical.length },
    { id: 'temples', label: 'Temples', emoji: '🛕', count: FAMOUS_PLACES.temples.length },
    { id: 'nature', label: 'Nature', emoji: '🌿', count: FAMOUS_PLACES.nature.length },
    { id: 'churches', label: 'Churches', emoji: '⛪', count: FAMOUS_PLACES.churches.length },
    { id: 'food', label: 'Cuisine', emoji: '🍽️', count: FAMOUS_PLACES.food.length },
];

export default function FamousPlacesScreen({ navigation }: { navigation?: any }) {
    const [activeCategory, setActiveCategory] = useState<string>('popular');

    const activeData = FAMOUS_PLACES[activeCategory as keyof typeof FAMOUS_PLACES];
    const isFoodCategory = activeCategory === 'food';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Premium Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
                    <ArrowBackIcon size={20} color="#0F172A" />
                </TouchableOpacity>
                <View style={styles.headerTextGroup}>
                    <View style={styles.badgeWrap}>
                        <StarIcon size={12} color="#4F46E5" />
                        <Text style={styles.badgeText}>TOURIST GUIDE</Text>
                    </View>
                    <Text style={styles.title}>Famous in <Text style={styles.titleHighlight}>Pondy</Text></Text>
                </View>
            </View>

            {/* Sticky Tab Filters */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {CATEGORIES.map(cat => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setActiveCategory(cat.id)}
                                activeOpacity={0.8}
                                style={[styles.tab, isActive && styles.tabActive]}
                            >
                                <Text style={styles.tabEmoji}>{cat.emoji}</Text>
                                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{cat.label}</Text>
                                <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
                                    <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>{cat.count}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Main Content Grid */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
                <View style={styles.grid}>
                    {activeData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.9}
                            style={[
                                styles.card,
                                isFoodCategory ? styles.foodCard : styles.placeCard
                            ]}
                            onPress={() => {
                                if (!isFoodCategory) {
                                    // Navigate to generic detail or web link if required, otherwise just interactive view
                                    navigation?.navigate('PlaceDetails', { placeId: item.name });
                                }
                            }}
                        >
                            <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800' }} style={styles.cardImage} />

                            <LinearGradient
                                colors={['transparent', 'rgba(15,23,42,0.6)', 'rgba(15,23,42,0.95)']}
                                style={styles.cardGradient}
                            >
                                {isFoodCategory ? (
                                    <View style={styles.cardContent}>
                                        <View style={styles.foodTypeBadge}>
                                            <Text style={styles.foodTypeText}>{(item as any).type}</Text>
                                        </View>
                                        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                                        <View style={styles.cardSubtitleWrap}>
                                            <LocationPinIcon size={12} color="#38BDF8" />
                                            <Text style={styles.cardSubtitle} numberOfLines={1}>{(item as any).restaurant}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                                        <View style={styles.cardSubtitleWrap}>
                                            <LocationPinIcon size={12} color="#CBD5E1" />
                                            <Text style={styles.cardSubtitle} numberOfLines={1}>{(item as any).location}</Text>
                                        </View>
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingTop: STATUSBAR_HEIGHT,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: '#F8FAFC',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        marginBottom: spacing.sm,
    },
    headerTextGroup: {
        gap: 4,
    },
    badgeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
        color: '#4F46E5',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
    },
    titleHighlight: {
        color: '#4F46E5', // Indigo
    },
    tabsContainer: {
        marginBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    tabsScroll: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        gap: 8,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
    },
    tabActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        shadowOpacity: 0.1,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    tabEmoji: {
        fontSize: 14,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    tabCount: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    tabCountActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    tabCountText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
    },
    tabCountTextActive: {
        color: '#FFFFFF',
    },
    gridContainer: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        marginBottom: spacing.md,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    placeCard: {
        width: '48%',
        height: 220,
    },
    foodCard: {
        width: '100%',
        height: 200,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    cardGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: spacing.md,
    },
    cardContent: {
        gap: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
        lineHeight: 20,
    },
    cardSubtitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#CBD5E1',
        flex: 1,
    },
    foodTypeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    foodTypeText: {
        fontSize: 10,
        color: '#FFF',
        fontWeight: '700',
    },
});
