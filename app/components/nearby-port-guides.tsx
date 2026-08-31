"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type NearbyPortItem = {
  slug: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  topPick: string;
};

type NearbyPortGuidesProps = {
  currentSlug: string;
  ports: NearbyPortItem[];
};

type Origin = {
  latitude: number;
  longitude: number;
  slug?: string;
  label: string;
};

const radians = (value: number) => (value * Math.PI) / 180;

function distanceKm(a: Pick<Origin, "latitude" | "longitude">, b: NearbyPortItem) {
  const earthRadiusKm = 6371;
  const latDelta = radians(b.latitude - a.latitude);
  const lonDelta = radians(b.longitude - a.longitude);
  const lat1 = radians(a.latitude);
  const lat2 = radians(b.latitude);
  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonDelta / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
}

export function NearbyPortGuides({ currentSlug, ports }: NearbyPortGuidesProps) {
  const currentPort = ports.find((port) => port.slug === currentSlug) ?? ports[0];
  const [origin, setOrigin] = useState<Origin>(() => ({
    latitude: currentPort.latitude,
    longitude: currentPort.longitude,
    slug: currentPort.slug,
    label: currentPort.name,
  }));
  const [status, setStatus] = useState<"idle" | "locating" | "located" | "error">("idle");

  const nearby = useMemo(
    () =>
      ports
        .filter((port) => port.slug !== origin.slug && port.slug !== currentSlug)
        .map((port) => ({ ...port, distance: distanceKm(origin, port) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3),
    [currentSlug, origin, ports],
  );

  function useMyLocation() {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "your location",
        });
        setStatus("located");
      },
      () => setStatus("error"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }

  function choosePort(slug: string) {
    const selected = ports.find((port) => port.slug === slug);
    if (!selected) return;
    setOrigin({
      latitude: selected.latitude,
      longitude: selected.longitude,
      slug: selected.slug,
      label: selected.name,
    });
    setStatus("idle");
  }

  return (
    <section className="cse-nearby" aria-labelledby="nearby-port-title">
      <div className="cse-nearby-heading">
        <div>
          <p className="cse-eyebrow">Nearby port guides</p>
          <h2 id="nearby-port-title">What else is close to {origin.label}?</h2>
          <p>Distances are approximate and used only to surface nearby cruise-port guides.</p>
        </div>
        <div className="cse-nearby-controls">
          <button type="button" onClick={useMyLocation} disabled={status === "locating"}>
            {status === "locating" ? "Locating…" : "Use my location"}
          </button>
          <label>
            <span>Or choose an area</span>
            <select value={origin.slug ?? ""} onChange={(event) => choosePort(event.target.value)}>
              <option value="" disabled>Select a port</option>
              {ports.map((port) => (
                <option value={port.slug} key={port.slug}>{port.name}, {port.country}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {status === "error" ? (
        <p className="cse-nearby-status">Location access was unavailable. Choose a port manually instead.</p>
      ) : null}

      <div className="cse-nearby-grid">
        {nearby.map((port) => (
          <Link href={`/ports/${port.slug}`} key={port.slug}>
            <span>{Math.round(port.distance)} km away · {port.country}</span>
            <strong>{port.name}</strong>
            <small>Top pick: {port.topPick}</small>
            <b>Open port guide →</b>
          </Link>
        ))}
      </div>
    </section>
  );
}
