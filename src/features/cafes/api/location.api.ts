import type { LocationSearchResponse } from "../types/location";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error(
        "NEXT_PUBLIC_API_URL environment variable is not configured."
    );
}

interface SearchLocationsParams {
    query: string;
    limit?: number;
    signal?: AbortSignal;
}

export async function searchLocations({
                                          query,
                                          limit = 5,
                                          signal,
                                      }: SearchLocationsParams): Promise<LocationSearchResponse> {
    const searchParams = new URLSearchParams({
        q: query,
        limit: limit.toString(),
    });

    const response = await fetch(
        `${API_URL}/api/locations/search?${searchParams.toString()}`,
        {
            signal,
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to search locations: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}