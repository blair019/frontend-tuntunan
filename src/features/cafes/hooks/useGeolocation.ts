"use client";

import { useCallback, useState } from "react";

import type { Coordinates } from "../types/cafe";

type GeolocationStatus =
    | "idle"
    | "loading"
    | "success"
    | "error";

interface UseGeolocationResult {
    coordinates: Coordinates | null;
    status: GeolocationStatus;
    error: string | null;
    requestLocation: () => Promise<Coordinates>;
}

export function useGeolocation(): UseGeolocationResult {
    const [coordinates, setCoordinates] =
        useState<Coordinates | null>(null);

    const [status, setStatus] =
        useState<GeolocationStatus>("idle");

    const [error, setError] =
        useState<string | null>(null);

    const requestLocation =
        useCallback((): Promise<Coordinates> => {
            setStatus("loading");
            setError(null);

            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    const message =
                        "Geolocation is not supported by this browser.";

                    setStatus("error");
                    setError(message);

                    reject(new Error(message));
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const nextCoordinates: Coordinates = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };

                        setCoordinates(nextCoordinates);
                        setStatus("success");

                        resolve(nextCoordinates);
                    },

                    (geolocationError) => {
                        let message =
                            "Unable to determine your location.";

                        switch (geolocationError.code) {
                            case geolocationError.PERMISSION_DENIED:
                                message =
                                    "Location permission was denied.";
                                break;

                            case geolocationError.POSITION_UNAVAILABLE:
                                message =
                                    "Your location is currently unavailable.";
                                break;

                            case geolocationError.TIMEOUT:
                                message =
                                    "Location request timed out.";
                                break;
                        }

                        setStatus("error");
                        setError(message);

                        reject(new Error(message));
                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 10_000,
                        maximumAge: 0,
                    }
                );
            });
        }, []);

    return {
        coordinates,
        status,
        error,
        requestLocation,
    };
}