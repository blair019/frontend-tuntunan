import type {
    Coordinates,
    NearbyCafesResponse,
} from "../types/cafe";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error(
        "NEXT_PUBLIC_API_URL environment variable is not configured."
    );
}

interface GetNearbyCafesParams extends Coordinates {
    radius?: number;
}

export async function getNearbyCafes({
                                         latitude,
                                         longitude,
                                         radius = 3000,
                                     }: GetNearbyCafesParams): Promise<NearbyCafesResponse> {
    const searchParams = new URLSearchParams({
        lat: latitude.toString(),
        lng: longitude.toString(),
        radius: radius.toString(),
    });

    const response = await fetch(
        `${API_URL}/api/cafes/nearby?${searchParams.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch nearby cafes: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}