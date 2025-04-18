import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { SiteData } from "../data/sites";

export default function SiteDetailsSimple({ site }: { site: SiteData }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-teal-400">{site.name}</h2>
        <p className="text-sm text-neutral-400 mt-1">{site.description}</p>
        <p className="text-xs text-neutral-500">Last updated: {site.timestamp}</p>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-secondary-800 p-3 rounded">
          <p className="text-neutral-200 ">Longitude</p>
          <p className="text-teal-400 font-bold text-xl">{site.coordinates[1].toFixed(4)}°</p>
        </div>
        <div className="bg-secondary-800 p-3 rounded">
          <p className="text-neutral-200 ">Latitude</p>
          <p className="text-teal-400 font-bold text-xl">{site.coordinates[0].toFixed(4)}°</p>
        </div>
      </div>

      {/* Parameters */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(site.parameters).map(([key, value]) => (
          <div key={key} className="bg-secondary-800 p-3 rounded">
            <p className="text-neutral-200">{formatLabel(key)}</p>
            <p className="text-teal-400 font-bold text-xl">{value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-6">
        <h3 className="text-sm text-neutral-400 mb-2">Temperature Trend</h3>
        <div className="h-48 bg-secondary-800 p-2 rounded">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={site.timeSeriesData.temperature}>
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°C`} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.9)",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Salinity Chart */}
<div className="mt-6">
  <h3 className="text-sm text-neutral-400 mb-2">Salinity Trend</h3>
  <div className="h-48 bg-secondary-800 p-2 rounded">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={site.timeSeriesData.salinity}>
        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} />
        <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.9)", border: "none", borderRadius: "4px", fontSize: "12px", color: "#fff" }} />
        <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

{/* Turbidity Chart */}
<div className="mt-6">
  <h3 className="text-sm text-neutral-400 mb-2">Turbidity Trend</h3>
  <div className="h-48 bg-secondary-800 p-2 rounded">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={site.timeSeriesData.turbidity}>
        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} />
        <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.9)", border: "none", borderRadius: "4px", fontSize: "12px", color: "#fff" }} />
        <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

{/* pH Chart */}
<div className="mt-6">
  <h3 className="text-sm text-neutral-400 mb-2">pH Trend</h3>
  <div className="h-48 bg-secondary-800 p-2 rounded">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={site.timeSeriesData.pH}>
        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} />
        <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.9)", border: "none", borderRadius: "4px", fontSize: "12px", color: "#fff" }} />
        <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

{/* Dissolved Oxygen Chart */}
<div className="mt-6">
  <h3 className="text-sm text-neutral-400 mb-2">Dissolved Oxygen Trend</h3>
  <div className="h-48 bg-secondary-800 p-2 rounded">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={site.timeSeriesData.dissolvedOxygen}>
        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} />
        <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.9)", border: "none", borderRadius: "4px", fontSize: "12px", color: "#fff" }} />
        <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>
  );
}

function formatLabel(label: string) {
  switch (label) {
    case "pH":
      return "pH";
    case "dissolvedOxygen":
      return "Dissolved Oxygen";
    default:
      return label.charAt(0).toUpperCase() + label.slice(1);
  }
}
