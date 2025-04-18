import React, { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle({ map }: { map: mapboxgl.Map | null }) {
  const { isDark, toggle } = useTheme();

  //Change Mapbox style when theme changes
  useEffect(() => {
    if (map) {
      map.setStyle(
        isDark
          ? "mapbox://styles/mapbox/dark-v10" // Dark Mode Map
          : "mapbox://styles/mapbox/light-v10" // Light Mode Map
      );
    }
  }, [isDark, map]); // Runs when `isDark` or `map` changes

  return (
    <button
    
      onClick={toggle}
      className="p-2 rounded-lg bg-background-100 dark:bg-secondary-800 text-secondary-500 dark:text-background-50 hover:bg-background-200 dark:hover:bg-secondary-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
