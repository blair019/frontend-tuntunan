export interface LocationSearchResult {
    place_id: number | null;
    osm_id: number | null;
    osm_type: string | null;

    name: string;
    display_name: string;

    latitude: number;
    longitude: number;

    type: string | null;
    category: string | null;

    city: string | null;
    province: string | null;
    country: string | null;

    source: "openstreetmap";
}

export interface LocationSearchResponse {
    success: boolean;
    count: number;
    locations: LocationSearchResult[];
}