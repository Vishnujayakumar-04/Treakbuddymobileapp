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
import { PLACES_DATA } from '../data/places';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FAMOUS_PLACE_NAMES = {
    historical: ['French War Memorial', 'Aayi Mandapam', 'Bharathi Park', 'Arikamedu Archaeological Site', 'Kargil War Memorial', 'Raj Niwas'],
    temples: ['Manakula Vinayagar Temple', 'Varadaraja Perumal Temple', 'Kamakshi Amman Temple', 'Vedapureeswarar Temple', 'Arulmigu Kanniga Parameswari Temple'],
    nature: ['Paradise Beach', 'Auroville Beach', 'Serenity Beach', 'Ousteri Lake', 'Botanical Gardens', 'Pichavaram Mangroves'],
    churches: ['Sacred Heart Basilica', 'Immaculate Conception Cathedral', 'Our Lady of Angels Church', "St. Andrew's Church"],
    popular: ['Promenade Beach', 'Sri Aurobindo Ashram', 'Matrimandir', 'Puducherry Museum', 'White Town Walks', 'Chunnambar Backwater', 'Serenity Beach'],
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

const getFamousPlacesWrapper = () => {
    const mapNames = ((names: string[]) => {
        return names.map(n => {
            const place = PLACES_DATA.find(p => p.name.toLowerCase() === n.toLowerCase());
            if (place) return place;
            return {
                id: n,
                name: n,
                location: 'Puducherry',
                image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
                rating: 4.5,
                description: 'Famous tourist spot in Puducherry.'
            };
        });
    });

    return {
        historical: mapNames(FAMOUS_PLACE_NAMES.historical),
        temples: mapNames(FAMOUS_PLACE_NAMES.temples),
        nature: mapNames(FAMOUS_PLACE_NAMES.nature),
        churches: mapNames(FAMOUS_PLACE_NAMES.churches),
        popular: mapNames(FAMOUS_PLACE_NAMES.popular),
        food: FAMOUS_PLACE_NAMES.food
    };
};

const FAMOUS_PLACES = getFamousPlacesWrapper();

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
                                    // Map to a generic Place object, trying to find enriched data first
                                    const realPlace = PLACES_DATA.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                                    const placeData = realPlace || {
                                        id: item.name,
                                        name: item.name,
                                        image: item.image,
                                        address: (item as any).location || 'Puducherry',
                                        rating: '4.5',
                                        description: `One of the most famous tourist spots in Pondicherry.`,
                                        category: activeCategory
                                    };
                                    navigation?.navigate('PlaceDetails', { place: placeData });
                                }
                            }}
                        >
                            <Image
                                source={typeof item.image === 'number' ? item.image : { uri: item.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800' }}
                                style={styles.cardImage}
                            />

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
