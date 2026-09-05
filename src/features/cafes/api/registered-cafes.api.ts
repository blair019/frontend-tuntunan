const API_URL =
    process.env.NEXT_PUBLIC_API_URL;


if (!API_URL) {
    throw new Error(
        "NEXT_PUBLIC_API_URL environment variable is not configured."
    );
}


export interface RegisteredCafeAmenities {
    wifi: boolean;
    outlets: boolean;

    outdoor_seating: boolean;
    work_friendly: boolean;

    pet_friendly: boolean;

    wheelchair_accessible: boolean;
}


export interface RegisteredCafeDayHours {
    enabled: boolean;

    open: string;
    close: string;

    is_24_hours: boolean;
}


export interface RegisteredCafeOpeningHours {
    monday: RegisteredCafeDayHours;

    tuesday: RegisteredCafeDayHours;

    wednesday: RegisteredCafeDayHours;

    thursday: RegisteredCafeDayHours;

    friday: RegisteredCafeDayHours;

    saturday: RegisteredCafeDayHours;

    sunday: RegisteredCafeDayHours;
}


export interface RegisteredCafeApiResponse {
    id: number;
    slug: string;

    name: string;

    city: string;
    area: string | null;

    address: string;

    latitude: number | null;
    longitude: number | null;

    description: string | null;

    instagram: string | null;
    website: string | null;

    amenities: RegisteredCafeAmenities;

    opening_hours: RegisteredCafeOpeningHours;

    cover_image_url: string | null;

    gallery_image_urls: string[];

    status: string;
}


export interface RegisteredCafeUpdatePayload {
    name: string;

    city: string;
    area: string | null;

    address: string;

    latitude: number | null;
    longitude: number | null;

    description: string | null;

    instagram: string | null;
    website: string | null;

    amenities:
        RegisteredCafeAmenities;

    opening_hours:
        RegisteredCafeOpeningHours;
}


export interface CafeRegistrationPayload {
    cafe_name: string;

    city: string;
    area: string | null;

    address: string;

    latitude: number | null;
    longitude: number | null;

    amenities:
        RegisteredCafeAmenities;

    opening_hours:
        RegisteredCafeOpeningHours;

    instagram: string | null;
    website: string | null;

    description: string | null;

    owner_name: string;
    owner_email: string;

    password: string;
}


interface RegisterCafeParams {
    payload:
        CafeRegistrationPayload;

    coverImage?: File | null;

    galleryImages?: File[];
}


/* =========================================================
   GET ALL
========================================================= */

export async function getRegisteredCafes(): Promise<
    RegisteredCafeApiResponse[]
> {
    const response =
        await fetch(
            `${API_URL}/api/cafes/registered`,
            {
                cache:
                    "no-store",
            }
        );


    if (!response.ok) {
        throw new Error(
            `Failed to fetch registered cafes: ${response.status} ${response.statusText}`
        );
    }


    return response.json();
}


/* =========================================================
   GET ONE
========================================================= */

export async function getRegisteredCafe(
    slug: string
): Promise<RegisteredCafeApiResponse> {
    const response =
        await fetch(
            `${API_URL}/api/cafes/registered/${encodeURIComponent(
                slug
            )}`,
            {
                cache:
                    "no-store",
            }
        );


    if (!response.ok) {
        throw new Error(
            `Failed to fetch registered cafe: ${response.status} ${response.statusText}`
        );
    }


    return response.json();
}


/* =========================================================
   REGISTER
========================================================= */

export async function registerCafe({
                                       payload,
                                       coverImage,
                                       galleryImages = [],
                                   }: RegisterCafeParams): Promise<RegisteredCafeApiResponse> {
    const formData =
        new FormData();


    formData.append(
        "payload",
        JSON.stringify(
            payload
        )
    );


    if (coverImage) {
        formData.append(
            "cover_image",
            coverImage
        );
    }


    galleryImages.forEach(
        (image) => {
            formData.append(
                "gallery_images",
                image
            );
        }
    );


    const response =
        await fetch(
            `${API_URL}/api/cafes/register`,
            {
                method:
                    "POST",

                body:
                formData,
            }
        );


    if (!response.ok) {
        throw await buildApiError(
            response,
            "Registration failed."
        );
    }


    return response.json();
}


/* =========================================================
   UPDATE
========================================================= */

export async function updateRegisteredCafe(
    cafeId: number,
    payload: RegisteredCafeUpdatePayload
): Promise<RegisteredCafeApiResponse> {
    const response =
        await fetch(
            `${API_URL}/api/cafes/registered/${cafeId}`,
            {
                method:
                    "PUT",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body:
                    JSON.stringify(
                        payload
                    ),
            }
        );


    if (!response.ok) {
        throw await buildApiError(
            response,
            "Failed to update café."
        );
    }


    return response.json();
}


/* =========================================================
   ERROR
========================================================= */

async function buildApiError(
    response: Response,
    fallback: string
): Promise<Error> {
    try {
        const data =
            await response.json();


        if (
            typeof data.detail ===
            "string"
        ) {
            return new Error(
                data.detail
            );
        }


        if (
            Array.isArray(
                data.detail
            )
        ) {
            const message =
                data.detail
                    .map(
                        (
                            item: {
                                msg?: string;
                            }
                        ) =>
                            item.msg ||
                            "Validation error"
                    )
                    .join(", ");


            return new Error(
                message
            );
        }

    } catch {
        // fallback
    }


    return new Error(
        fallback
    );
}