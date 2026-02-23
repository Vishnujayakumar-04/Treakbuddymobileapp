import { collection, getDocs, query, where, QueryConstraint } from 'firebase/firestore';
import { db } from '../firebase/firestore';

export interface TransitItem {
    id: string;
    category: 'rentals' | 'cabs' | 'bus' | 'train';
    subCategory?: string;
    type?: string;
    name: string;
    description?: string;
    price?: string;
    availability?: string;
    image?: string;
    rating?: number;
    contact?: string;
    location?: string;
    from?: string;
    to?: string;
    via?: string[];
    frequency?: string;
    duration?: string;
    stops?: number;
    classes?: string[];
    departure?: string;
    arrival?: string;
    number?: string;
    baseRate?: string;
    perKm?: string;
    bookingMethod?: string;
    bookingUrl?: string;
    bookingUrls?: { name: string; url: string }[];
    tips?: string;
    specialty?: string;
    code?: string;
    address?: string;
    facilities?: string[];
    mapUrl?: string;
    openHours?: string;
}

// Simple in-memory cache to prevent redundant Firestore reads
const CACHE: Record<string, TransitItem[]> = {};

export async function getTransitItems(category: string): Promise<TransitItem[]> {
    // Return cached data immediately if available
    if (CACHE[category]) {
        return CACHE[category];
    }

    try {
        const transitRef = collection(db, 'transit');
        const q = query(transitRef, where('category', '==', category));

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TransitItem));

        // Store in cache
        CACHE[category] = data;
        return data;
    } catch (error) {
        console.error(`Error fetching transit category [${category}]:`, error);
        throw error;
    }
}
