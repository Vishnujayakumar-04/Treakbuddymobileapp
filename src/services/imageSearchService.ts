/**
 * imageSearchService.ts — React Native Expo
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides automatic image fetching for tourism places in the TrekBuddy Expo app.
 *
 * Sources (in priority order):
 *   1. Wikimedia Commons  — free, no API key, CORS-open
 *   2. Pexels API         — requires key (set PEXELS_API_KEY in app.config.js)
 *
 * Usage:
 *   import { fetchPlaceImages, initImageSearch } from '../services/imageSearchService';
 *
 *   // In App.tsx / _layout.tsx — call once at app startup:
 *   import AsyncStorage from '@react-native-async-storage/async-storage';
 *   initImageSearch(AsyncStorage);
 *
 *   // In any screen:
 *   const result = await fetchPlaceImages('Promenade Beach');
 *   console.log(result.images); // SharedImageResult[]
 */

import {
    searchImages,
    setAsyncStorageAdapter,
    SharedImageResult,
    SharedSearchResult,
} from '../../website/src/lib/admin/imageSearchShared';
// ↑ Shared module. In production, copy imageSearchShared.ts into this folder
//   (src/services/imageSearchShared.ts) and import from './imageSearchShared'

// ─── Types re-exported for convenience ───────────────────────────────────────
export type { SharedImageResult, SharedSearchResult };

// ─── Config ───────────────────────────────────────────────────────────────────
// Set your Pexels API key here (or load from Expo Constants / env)
// Get a free key at: https://www.pexels.com/api/
const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY || '';
const DEFAULT_LOCATION = 'Puducherry';

// ─── Initialize (call once in App.tsx) ────────────────────────────────────────
/**
 * Registers AsyncStorage for persistent cache across app sessions.
 * Call this once in your root layout / App.tsx before any fetchPlaceImages calls.
 *
 * @example
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * initImageSearch(AsyncStorage);
 */
export function initImageSearch(asyncStorageInstance: any): void {
    setAsyncStorageAdapter(asyncStorageInstance);
    console.log('[ImageSearch] Persistent cache initialized with AsyncStorage.');
}

// ─── Main fetch function ───────────────────────────────────────────────────────
/**
 * Fetches real tourism images for a place.
 * Results are cached in memory (30 min) + AsyncStorage (2 hours).
 *
 * @param placeName  - e.g. "Promenade Beach"
 * @param location   - defaults to "Puducherry"
 * @param limit      - max images to return (default: 10)
 */
export async function fetchPlaceImages(
    placeName: string,
    location: string = DEFAULT_LOCATION,
    limit = 10,
): Promise<SharedSearchResult> {
    return searchImages({
        placeName,
        location,
        limit,
        pexelsApiKey: PEXELS_API_KEY || undefined,
        useServerProxy: false,  // React Native: call APIs directly
    });
}

// ─── Utility: pick best images for a screen ───────────────────────────────────
/**
 * Returns { cover, gallery } from a SharedSearchResult.
 * Automatically picks the first image as cover and rest as gallery.
 */
export function splitCoverAndGallery(result: SharedSearchResult): {
    cover: SharedImageResult | null;
    gallery: SharedImageResult[];
} {
    const [cover = null, ...gallery] = result.images;
    return { cover, gallery: gallery.slice(0, 5) };
}

/**
 * Returns the best thumbnail URL for an image, with lazy/progressive loading support.
 * Prefers thumbSmall for list views, thumb for detail views.
 */
export function getThumbUrl(img: SharedImageResult, size: 'small' | 'large' = 'large'): string {
    return size === 'small' ? (img.thumbSmall ?? img.thumb) : img.thumb;
}

/**
 * Generates attribution text for an image (Wikimedia / Pexels credit).
 */
export function getAttribution(img: SharedImageResult): string {
    if (!img.credit) return '';
    const license = img.license ? ` (${img.license})` : '';
    return `Photo by ${img.credit}${license}`;
}
