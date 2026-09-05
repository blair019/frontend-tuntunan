export interface RegisteredCafe {
    id: string;
    slug: string;
    name: string;
    area: string;
    city: string;
    image: string;
    description: string;

    verified: boolean;

    wifi: boolean;
    outlets: boolean;
    workFriendly: boolean;
    outdoorSeating: boolean;

    openingHours: string;

    instagram?: string;
    website?: string;
}

export const registeredCafes: RegisteredCafe[] = [
    {
        id: "1",
        slug: "yardstick-coffee",
        name: "Yardstick Coffee",
        area: "Legazpi Village",
        city: "Makati",
        image: "/images/yardstick.jpg",
        description:
            "A modern specialty coffee spot with a calm atmosphere for slow mornings, conversations, and focused work.",
        verified: true,
        wifi: true,
        outlets: true,
        workFriendly: true,
        outdoorSeating: false,
        openingHours: "7:00 AM – 8:00 PM",
        instagram: "#",
        website: "#",
    },
    {
        id: "2",
        slug: "habitual-coffee",
        name: "Habitual Coffee",
        area: "Salcedo Village",
        city: "Makati",
        image: "/images/habitual.jpg",
        description:
            "A relaxed neighborhood café with specialty coffee, good natural light, and a comfortable everyday atmosphere.",
        verified: true,
        wifi: true,
        outlets: true,
        workFriendly: true,
        outdoorSeating: true,
        openingHours: "8:00 AM – 9:00 PM",
        instagram: "#",
    },
    {
        id: "3",
        slug: "single-origin",
        name: "Single Origin",
        area: "Bonifacio Global City",
        city: "Taguig",
        image: "/images/single-origin.jpg",
        description:
            "Coffee, brunch, and a warm social atmosphere in one of BGC's busiest lifestyle areas.",
        verified: true,
        wifi: true,
        outlets: false,
        workFriendly: false,
        outdoorSeating: true,
        openingHours: "7:00 AM – 11:00 PM",
        website: "#",
    },
];