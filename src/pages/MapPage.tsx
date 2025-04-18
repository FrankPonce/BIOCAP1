import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box, LayoutGrid, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "../hooks/useTheme";
import { sites } from "../data/sites";
import SiteDetails from "../hooks/siteDetails";


// Replace with your actual Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoicmRmbGFiIiwiYSI6ImNreDdxb215eTJlZDQyb3BuaThlbXlxd20ifQ.9zxCK-Q6kNuyWptnuTjgWQ"


// Sample data points for each location
const locationData = {
  Morningside: [
    { coordinates: [-80.185, 25.845], value: 0.6, label: "MS-01" },
    { coordinates: [-80.179, 25.84], value: 1.4, label: "MS-02" },
    { coordinates: [-80.183, 25.835], value: 0.9, label: "MS-03" },
    { coordinates: [-80.175, 25.838], value: 2.0, label: "MS-04" },
    { coordinates: [-80.182, 25.843], value: 1.6, label: "MS-05" },
    { coordinates: [-80.178, 25.847], value: 1.2, label: "MS-06" }
  ],
  KeyBiscayne: [
    { coordinates: [-80.16, 25.69], value: 0.8, label: "KB-01" },
    { coordinates: [-80.155, 25.687], value: 1.2, label: "KB-02" },
    { coordinates: [-80.158, 25.673], value: 0.5, label: "KB-03" },
    { coordinates: [-80.165, 25.682], value: 1.7, label: "KB-04" },
    { coordinates: [-80.149, 25.678], value: 0.9, label: "KB-05" },
    { coordinates: [-80.152, 25.694], value: 1.1, label: "KB-06" }
  ],
  MiamiShores: [
    { coordinates: [-80.18, 25.775], value: 2.1, label: "PM-01" },
    { coordinates: [-80.176, 25.768], value: 1.5, label: "PM-02" },
    { coordinates: [-80.171, 25.773], value: 1.8, label: "PM-03" },
    { coordinates: [-80.165, 25.769], value: 0.7, label: "PM-04" },
    { coordinates: [-80.173, 25.779], value: 2.3, label: "PM-05" },
    { coordinates: [-80.178, 25.771], value: 1.3, label: "PM-06" }
  ]
} as const;

// Function to generate coastline points for visualization
const generateCoastlinePoints = (location: keyof typeof locationData) => {
  let start, end;
  const color = location === "KeyBiscayne" 
    ? "accent-500"  // Using accent color for Key Biscayne
    : location === "MiamiShores" 
      ? "primary-500" // Using primary color for Miami Shores
      : "secondary-500"; // Using secondary color for Morningside

  if (location === "KeyBiscayne") {
    start = [-80.17, 25.71];
    end = [-80.14, 25.67];
  } else if (location === "MiamiShores") {
    start = [-80.19, 25.78];
    end = [-80.16, 25.76];
  } else if (location === "Morningside") {
    start = [-80.19, 25.85];
    end = [-80.17, 25.83];
  } else {
    return null;
  }

  const features = [];
  const steps = 40;
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const jitterX = (Math.random() - 0.5) * 0.01;
    const jitterY = (Math.random() - 0.5) * 0.01;
    
    const lng = start[0] + (end[0] - start[0]) * ratio + jitterX;
    const lat = start[1] + (end[1] - start[1]) * ratio + jitterY;
    
    features.push({
      type: "Feature",
      properties: { 
        location, 
        color,
        size: 3 + Math.random() * 2,
        type: "coastline"
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat]
      }
    });
  }

/*  // Add actual data points
  locationData[location].forEach(point => {
    features.push({
      type: "Feature",
      properties: { 
        location, 
        color: "background-50", // Using white from our theme
        size: 8, // Larger size for data points
        value: point.value,
        label: point.label,
        type: "datapoint"
      },
      geometry: {
        type: "Point",
        coordinates: point.coordinates
      }
    });
  });

  return {
    type: "FeatureCollection",
    features: features
  };
**/
};



const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [view, setView] = useState("2D");
  const [selectedLocation, setSelectedLocation] = useState<keyof typeof locationData>("Morningside");
  const [lng, setLng] = useState(-80.18);
  const [lat, setLat] = useState(25.84);
  const [zoom, setZoom] = useState(13);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {isDark} = useTheme();
  const [isSatellite, setIsSatellite] = useState(false);
  const [showStreets, setShowStreets] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [mapStyle, setMapStyle] = useState(
  isDark ? "mapbox://styles/mapbox/dark-v10" : "mapbox://styles/mapbox/light-v10"
);
const [activeTab, setActiveTab] = useState<"info" | "image-analysis">("info");




const addCustomLayers = (mapInstance: mapboxgl.Map) => {
  if (!mapInstance) return;
  
  // add Streets Layer
  if (!mapInstance.getSource("streets")) {
    mapInstance.addSource("streets", {
      type: "vector",
      url: "mapbox://mapbox.mapbox-streets-v8",
    });

    mapInstance.addLayer({
      id: "streets-layer",
      type: "line",
      source: "streets",
      "source-layer": "road",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#0F766E ", "line-width": 1 },
    });
  }

  // add Buildings Layer
  if (!mapInstance.getLayer("buildings-layer")) {
    mapInstance.addLayer({
      id: "buildings-layer",
      type: "fill-extrusion",
      source: "streets",
      "source-layer": "building",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          18,
          ["get", "height"],
        ],
        "fill-extrusion-base": ["get", "min_height"],
        "fill-extrusion-opacity": 0.6,
      },
    });
  }
};

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: mapStyle,
      center: [lng, lat],
      zoom: zoom,
      pitch: view === "3D" ? 60 : 0,
      bearing: view === "3D" ? 30 : 0
    });
    
    map.current.on("load", () => {
      if (!isSatellite) addCustomLayers(map.current!);
    });
    

    map.current.on("styledata", () => {
      if (!isSatellite) addCustomLayers(map.current!);
    });


    // Add navigation controls but customize position to bottom-right
    const navControl = new mapboxgl.NavigationControl({
      showCompass: true,
      visualizePitch: true
    });
    
    map.current.addControl(navControl, 'bottom-right');

    // Customize control styling to match the app's theme
    setTimeout(() => {
      const controlButtons = document.querySelectorAll('.mapboxgl-ctrl-group button');
      controlButtons.forEach(button => {
        (button as HTMLElement).style.backgroundColor = '#1f2937';
        (button as HTMLElement).style.color = 'white';
        (button as HTMLElement).style.borderColor = '#374151';
      });
      
      const controlGroup = document.querySelector('.mapboxgl-ctrl-group');
      if (controlGroup) {
        (controlGroup as HTMLElement).style.backgroundColor = 'rgba(31, 41, 55, 0.8)';
        (controlGroup as HTMLElement).style.backdropFilter = 'blur(8px)';
        (controlGroup as HTMLElement).style.border = '1px solid rgba(55, 65, 81, 0.5)';
        (controlGroup as HTMLElement).style.borderRadius = '8px';
        (controlGroup as HTMLElement).style.overflow = 'hidden';
      }
    }, 100);

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'custom-popup',
      maxWidth: '300px'
    });

    map.current.on('load', () => {
      map.current!.addSource('mapbox-3d-buildings', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v8'
      });
      
      map.current!.addLayer({
        'id': 'building-3d',
        'source': 'mapbox-3d-buildings',
        'source-layer': 'building',
        'type': 'fill-extrusion',
        'minzoom': 10,
        'layout': {
          'visibility': view === '3D' ? 'visible' : 'none'
        },
        'paint': {
          'fill-extrusion-color': '#4B5563',
          'fill-extrusion-height': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            18, ['get', 'height']
          ],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.7
        }
      });

      const coastlineData = generateCoastlinePoints(selectedLocation);
      
      map.current!.addSource('points-data', {
        type: 'geojson',
        data: coastlineData
      });

      // Enhanced 3D sphere effect for all points
      map.current!.addLayer({
        id: 'points-glow',
        type: 'circle',
        source: 'points-data',
        paint: {
          'circle-radius': ['*', ['get', 'size'], 1.5],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.3,
          'circle-blur': 1,
          'circle-pitch-alignment': 'map'
        }
      });

      map.current!.addLayer({
        id: 'points-shadow',
        type: 'circle',
        source: 'points-data',
        paint: {
          'circle-radius': ['get', 'size'],
          'circle-color': '#000000',
          'circle-opacity': 0.5,
          'circle-blur': 1,
          'circle-translate': [1, 1]
        }
      });

      map.current!.addLayer({
        id: 'coastline-points',
        type: 'circle',
        source: 'points-data',
        filter: ['==', ['get', 'type'], 'coastline'],
        paint: {
          'circle-radius': ['get', 'size'],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.8,
          'circle-pitch-alignment': 'map',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.3
        }
      });

      map.current!.addLayer({
        id: 'data-points',
        type: 'circle',
        source: 'points-data',
        filter: ['==', ['get', 'type'], 'datapoint'],
        paint: {
          'circle-radius': ['get', 'size'],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.9,
          'circle-pitch-alignment': 'map',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.7
        }
      });

      map.current!.addLayer({
        id: 'data-points-highlight',
        type: 'circle',
        source: 'points-data',
        filter: ['==', ['get', 'type'], 'datapoint'],
        paint: {
          'circle-radius': ['*', ['get', 'size'], 0.6],
          'circle-color': '#ffffff',
          'circle-opacity': 0.7,
          'circle-translate': [-2, -2],
          'circle-pitch-alignment': 'map'
        }
      });

      map.current!.addLayer({
        id: 'data-labels',
        type: 'symbol',
        source: 'points-data',
        filter: ['==', ['get', 'type'], 'datapoint'],
        layout: {
          'text-field': ['get', 'label'],
          'text-size': 12,
          'text-offset': [0, -1.8],
          'text-anchor': 'bottom'
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1
        }
      });

      map.current!.on('mouseenter', 'data-points', (e) => {
        if (!map.current) return;
        
        map.current.getCanvas().style.cursor = 'pointer';
        
        const coordinates = e.features![0].geometry.coordinates.slice() as [number, number];
        const properties = e.features![0].properties;
        
        const popupContent = `
          <div class="p-2">
            <div class="font-bold">${properties.label}</div>
            <div>Value: ${properties.value.toFixed(1)} m</div>
          </div>
        `;
        
        popup.setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(map.current);
        
        setHoveredPoint(properties.label);
      });
      
      map.current!.on('mouseleave', 'data-points', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
        popup.remove();
        setHoveredPoint(null);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  const toggleLayer = (layerId: string, isVisible: boolean, setVisibility: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!map.current) return;

    const visibility = isVisible ? "none" : "visible";
    map.current.setLayoutProperty(layerId, "visibility", visibility);
    setVisibility(!isVisible);
  };

  const updateLocationData = (location: keyof typeof locationData) => {
    if (!map.current || !map.current.loaded()) return;

    const pointsData = generateCoastlinePoints(location);
    
    if (!pointsData) return;

    (map.current.getSource('points-data') as mapboxgl.GeoJSONSource).setData(pointsData);
  };

  useEffect(() => {
    if (!map.current) return;

    let newLng, newLat, newZoom;
    
    if (selectedLocation === "KeyBiscayne") {
      newLng = -80.15;
      newLat = 25.69;
      newZoom = 13;
    } else if (selectedLocation === "MiamiShores") {
      newLng = -80.17;
      newLat = 25.87;
      newZoom = 14;
    } else if (selectedLocation === "Morningside") {
      newLng = -80.18;
      newLat = 25.84;
      newZoom = 14;
    }

    map.current.flyTo({
      center: [newLng!, newLat!],
      zoom: newZoom!,
      essential: true
    });

    setLng(newLng!);
    setLat(newLat!);
    setZoom(newZoom!);

    updateLocationData(selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    if (!map.current) return;

    if (map.current.getLayer('building-3d')) {
      map.current.setLayoutProperty(
        'building-3d',
        'visibility',
        view === '3D' ? 'visible' : 'none'
      );
    }

    map.current.flyTo({
      pitch: view === "3D" ? 60 : 0,
      bearing: view === "3D" ? 30 : 0,
      essential: true,
      duration: 1000
    });
  }, [view]);

  const handleViewToggle = (newView: string) => {
    setView(newView);
  };

  const handleLocationSelect = (location: keyof typeof locationData) => {
    setSelectedLocation(location);
  };

  const getLocationName = (code: keyof typeof locationData) => {
    switch (code) {
      case "KeyBiscayne": return "Key Biscayne";
      case "MiamiShores": return "Miami Shores";
      case "Morningside": return "Morningside Park";
    }
  };

  const currentSite = sites.find(site => site.name === getLocationName(selectedLocation));


  return (
    <div className="relative w-full h-screen bg-secondary-900">
                  {/* Sidebar */}
                  <div
        className={`fixed right-0 top-[64px] h-full bg-secondary-800/80 text-white transition-transform duration-300  ${
          isSidebarOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } w-80 shadow-lg p-4 z-50`}
      >
        <button
          className="absolute top-4 right-4 p-2 bg-gray-900"
          onClick={() => setIsSidebarOpen(false)}
        >
          <ChevronRight
  className="absolute top-14 left-[-300px] bg-secondary-800/80 text-white rounded-l-full z-50"
/>
</button>

<div className="flex gap-2 mb-4 border-b border-gray-700">
        <button
      className={`flex-1 py-2 text-sm font-medium ${
        activeTab === "info" ? "text-white border-b-2 border-primary-500" : "text-gray-400"
      }`}
      onClick={() => setActiveTab("info")}
    >
      Parameters     
    </button>

        {/* Location Buttons - Appear When Sidebar Closes 
    <button
      className={`flex-1 py-2 text-sm font-medium ${
        activeTab === "image-analysis" ? "text-white border-b-2 border-primary-500" : "text-gray-400"
      }`}
      onClick={() => setActiveTab("image-analysis")}
    >
      
  
      Real-Time Image
    </button>
    */}
    </div>
    {activeTab === "info" && currentSite && (
    <div className="overflow-y-auto pr-2 max-h-[calc(100vh-100px)]">
    <SiteDetails site={currentSite} />
  </div>
)}



{activeTab === "image-analysis" && (
  <div>

  </div>
)}
      </div>


         {/* Location Buttons - Appear When Sidebar Closes */}
    <div
      className={`fixed left-2 top-[64px] z-[1000] flex flex-col gap-2 transition-opacity duration-300 ${
        isSidebarOpen ? "opacity-100" : "opacity-100"
      }`}
    >
      <div className="bg-secondary-800/80  backdrop-blur-sm rounded-lg shadow-lg p-1 flex flex-row gap-1">
      <button
          onClick={() => handleLocationSelect("Morningside")}
          className={`p-2 rounded flex items-center gap-2 transition-colors ${
            selectedLocation === "Morningside"
              ? "bg-primary-600 text-background-50"
              : "text-neutral-400 hover:text-background-50"
          }`}
          title="Morningside Park"
        > 
          <span className="text-sm">{getLocationName("Morningside")}</span>
        </button>
        <button
          onClick={() => handleLocationSelect("MiamiShores")}
          className={`p-2 rounded flex items-center gap-2 transition-colors ${
            selectedLocation === "MiamiShores"
              ? "bg-primary-600 text-background-50"
              : "text-neutral-400 hover:text-background-50"
          }`}
          title="Miami Shores"
        >
          <span className="text-sm">{getLocationName("MiamiShores")}</span>
        </button>
        <button
          onClick={() => handleLocationSelect("KeyBiscayne")}
          className={`p-2 rounded flex items-center gap-2 transition-colors ${
            selectedLocation === "KeyBiscayne"
              ? "bg-primary-600 text-background-50"
              : "text-neutral-400 hover:text-background-50"
          }`}
          title="Key Biscayne"
        >
          <span className="text-sm">{getLocationName("KeyBiscayne")}</span>
        </button>
      </div>
    </div>

          {/*Layer Menu*/}
  <div 
  className={`fixed left-2 bottom-0 z-[1000] flex flex-col gap-2 transition-opacity duration-300 ${
    isSidebarOpen ? "opacity-100" : "opacity-100"
  }`}
  >
    <div className="bg-secondary-800/80 backdrop-blur-sm shadow-lg p-2 rounded-md flex flex-row gap-2">
      <button
        onClick={() => toggleLayer("streets-layer", showStreets, setShowStreets)}
        className={`p-2 rounded flex items-center gap-2 transition-colors ${
          showStreets ? "bg-primary-600 text-background-50" : "text-neutral-400 hover:text-background-50"
        }`}
      >
        <span>Streets</span>
      </button>

      <button
        onClick={() => toggleLayer("buildings-layer", showBuildings, setShowBuildings)}
        className={`p-2 rounded flex items-center gap-2 transition-colors ${
          showBuildings ? "bg-primary-600 text-background-50" : "text-neutral-400 hover:text-background-50"
        }`}
      >
        <span>Buildings</span>
      </button>
    </div>
  </div>


      {/* Sidebar Toggle Button - Hidden When Sidebar is Open */}
      {!isSidebarOpen && (
  <button
    className="fixed top-[135px] right-0 p-2 bg-secondary-800/80 text-white rounded-l-full z-50"
    onClick={() => setIsSidebarOpen(true)}
  >
    <ChevronLeft className="w-5 h-5" />
  </button>
)}
<div key={isDark ? "dark" : "light"} ref={mapContainer} className="absolute inset-0" />

{/* Map Style Toggle - Bottom Left */}
<div className="fixed bottom-[55px] left-2 z-[1000]">
  <div className="bg-secondary-800/90 backdrop-blur-sm p-2 shadow-md rounded-lg text-sm text-white">
    <button
      className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded transition-colors"
      onClick={() => {
        const newStyle = isSatellite
          ? "mapbox://styles/mapbox/dark-v10"
          : "mapbox://styles/mapbox/satellite-v9";

        map.current?.setStyle(newStyle);
        setIsSatellite(!isSatellite);
      }}
    >
      {isSatellite ? "Switch to Default" : "Switch to Satellite"}
    </button>
  </div>
</div>


      {/* View Toggle Controls */}
      <div
      className={`absolute left-4 bottom-[110px] z-[1000] flex flex-col gap-2 transition-opacity duration-300 ${
        isSidebarOpen ? "opacity-100" : "opacity-100"
      }`}
    >
        <div className="bg-secondary-800/80 backdrop-blur-sm rounded-lg shadow-lg p-1 flex gap-1">
          <button
            onClick={() => handleViewToggle("2D")}
            className={`p-2 rounded transition-colors ${
              view === "2D" 
                ? "bg-primary-600 text-background-50" 
                : "text-neutral-400 hover:text-background-50"
            }`}
            title="2D View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleViewToggle("3D")}
            className={`p-2 rounded transition-colors ${
              view === "3D" 
                ? "bg-primary-600 text-background-50" 
                : "text-neutral-400 hover:text-background-50"
            }`}
            title="3D View"
          >
            <Box className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Custom popup styling */}
      <style jsx global>{`
        .custom-popup {
          background-color: rgba(0, 63, 84, 0.9);
          border-radius: 4px;
          color: #fefefe;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .custom-popup .mapboxgl-popup-content {
          background-color: transparent;
          padding: 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: rgba(0, 63, 84, 0.9);
          border-bottom-color: rgba(0, 63, 84, 0.9);
        }
        
        /* Custom styling for map controls */
        .mapboxgl-ctrl-group {
          margin-bottom: 12px;
          margin-right: 12px;
        }
        
        .mapboxgl-ctrl-group button {
          width: 36px;
          height: 36px;
        }
        
        .mapboxgl-ctrl-group button:hover {
          background-color: #374151 !important;
        }
      `}</style>
    </div>
  );
};

export default MapPage;
