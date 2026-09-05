"use client";

import { useEffect, useState } from "react";

import { searchLocations } from "../api/location.api";
import type { LocationSearchResult } from "../types/location";

const SEARCH_DELAY_MS = 350;
const MIN_QUERY_LENGTH = 2;

interface UseLocationSearchResult {
    results: LocationSearchResult[];
    isLoading: boolean;
    error: string | null;
}

export function useLocationSearch(
    query: string
): UseLocationSearchResult {
    const [results, setResults] = useState<
        LocationSearchResult[]
    >([]);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        const normalizedQuery = query.trim();

        if (
            normalizedQuery.length <
            MIN_QUERY_LENGTH
        ) {
            setResults([]);
            setError(null);
            setIsLoading(false);

            return;
        }

        const controller =
            new AbortController();

        const timeoutId = window.setTimeout(
            async () => {
                setIsLoading(true);
                setError(null);

                try {
                    const response =
                        await searchLocations({
                            query: normalizedQuery,
                            limit: 5,
                            signal: controller.signal,
                        });

                    setResults(response.locations);
                } catch (error) {
                    if (
                        error instanceof DOMException &&
                        error.name === "AbortError"
                    ) {
                        return;
                    }

                    setResults([]);

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Location search failed."
                    );
                } finally {
                    if (!controller.signal.aborted) {
                        setIsLoading(false);
                    }
                }
            },
            SEARCH_DELAY_MS
        );

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [query]);

    return {
        results,
        isLoading,
        error,
    };
}