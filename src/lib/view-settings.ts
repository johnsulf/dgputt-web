import { useCallback, useMemo, useSyncExternalStore } from "react";

// Viewer preferences for the event pages and TV boards. Kept in this
// browser only. The TV board also reads them from its URL, so a TV opened
// from a link on another device gets the same choice.

export type DistanceUnit = "m" | "ft";
export type TvTheme = "dark" | "light";

export interface ViewSettings {
  units: DistanceUnit;
  tvTheme: TvTheme;
}

const DEFAULTS: ViewSettings = { units: "m", tvTheme: "dark" };
const STORAGE_KEY = "dgputt:view-settings";

const listeners = new Set<() => void>();

function readStored(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab changing the setting (e.g. the event page next to the TV).
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function parse(raw: string): ViewSettings {
  if (!raw) return DEFAULTS;
  try {
    const v = JSON.parse(raw) as Partial<ViewSettings>;
    return {
      units: v.units === "ft" ? "ft" : "m",
      tvTheme: v.tvTheme === "light" ? "light" : "dark",
    };
  } catch {
    return DEFAULTS;
  }
}

/** URL overrides, e.g. `?units=ft&theme=light` on a TV link. */
function readUrl(): string {
  return typeof window === "undefined" ? "" : window.location.search;
}

function withUrl(settings: ViewSettings, search: string): ViewSettings {
  const params = new URLSearchParams(search);
  const units = params.get("units");
  const theme = params.get("theme");
  return {
    units: units === "ft" || units === "m" ? units : settings.units,
    tvTheme: theme === "light" || theme === "dark" ? theme : settings.tvTheme,
  };
}

export function useViewSettings(
  options: { fromUrl?: boolean } = {},
): [ViewSettings, (patch: Partial<ViewSettings>) => void] {
  const raw = useSyncExternalStore(subscribe, readStored, () => "");
  const search = useSyncExternalStore(
    subscribe,
    options.fromUrl ? readUrl : () => "",
    () => "",
  );
  const settings = useMemo(() => withUrl(parse(raw), search), [raw, search]);

  const update = useCallback((patch: Partial<ViewSettings>) => {
    const next = { ...parse(readStored()), ...patch };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage can be blocked; the choice then lasts until reload only.
    }
    listeners.forEach((l) => l());
  }, []);

  return [settings, update];
}

/** Settings the TV board uses: stored ones, overridden by its URL. */
export function useTvSettings(): ViewSettings {
  return useViewSettings({ fromUrl: true })[0];
}

/** Query string that carries the settings to the TV board. */
export function tvSettingsQuery(settings: ViewSettings): string {
  const params = new URLSearchParams();
  if (settings.units !== DEFAULTS.units) params.set("units", settings.units);
  if (settings.tvTheme !== DEFAULTS.tvTheme) {
    params.set("theme", settings.tvTheme);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

const FEET_PER_METRE = 3.28084;

/**
 * A distance label such as "7m" or "23ft" in the chosen unit. Feet round to
 * whole feet, metres to one decimal. Anything unparseable is left as is.
 */
export function convertDistance(label: string, unit: DistanceUnit): string {
  const match = /^\s*(\d+(?:[.,]\d+)?)\s*(m|ft)\s*$/i.exec(label);
  if (!match) return label;
  const value = Number(match[1].replace(",", "."));
  const from = match[2].toLowerCase();
  if (from === unit) return `${formatNumber(value)}${unit}`;
  const converted =
    unit === "ft"
      ? Math.round(value * FEET_PER_METRE)
      : Math.round((value / FEET_PER_METRE) * 10) / 10;
  return `${formatNumber(converted)}${unit}`;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
