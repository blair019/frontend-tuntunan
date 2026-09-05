export type CafeSource =
    | "openstreetmap"
    | "registered";

export interface Cafe {
    /*
     * These are kept because the existing CafeGrid,
     * CafeCard, and DiscoveryMap already use them.
     *
     * Registered cafes receive synthetic values.
     */
    osm_id: number;
    osm_type: string;

    name: string;

    latitude: number;
    longitude: number;

    distance_meters: number;
    distance_km: number;
    display_distance: string;

    address: string | null;

    phone: string | null;
    website: string | null;
    facebook: string | null;
    instagram: string | null;

    has_contact_info: boolean;

    opening_hours: string | null;
    cuisine: string | null;

    wifi: boolean | null;
    outdoor_seating: boolean | null;
    wheelchair: string | null;
    takeaway: boolean | null;
    delivery: boolean | null;

    source: CafeSource;

    /*
     * Registered-cafe-only information.
     */
    registered_id?: number;
    slug?: string;

    city?: string | null;
    area?: string | null;

    description?: string | null;

    cover_image_url?: string | null;
    gallery_image_urls?: string[];

    outlets?: boolean;
    work_friendly?: boolean;
    pet_friendly?: boolean;
    wheelchair_accessible?: boolean;
}

export interface NearbyCafesResponse {
    success: boolean;
    count: number;
    cafes: Cafe[];
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}