import React from "react";
import { ChevronDown, Waves, Fish, Database } from "lucide-react";
import VideoBackground from "../components/Home/backgroundVid";

const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-background-50 dark:text-background-50 px-4 sm:px-6 lg:px-8 overflow-hidden">
  <VideoBackground />

  <h1 className="text-4xl z-20 md:text-6xl font-bold text-center mb-4 text-black dark:text-white relative text-shadow">
    BIOCAP Knowledge Hub
  </h1>

  <p className="text-xl z-20 md:text-2xl text-center mb-8 max-w-3xl text-black dark:text-white relative">
    Biodiversity Improvement by Optimizing Coastal Adaptation and Performance
  </p>

  <ChevronDown className="animate-bounce w-8 h-8 z-20 relative text-black dark:text-white" />
</div>


      {/* Main Content */}
      <div className="relative bg-background-50 dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Feature
              icon={<Waves className="text-primary-500" />}
              title="Modular Seawall Systems"
              description="Advanced tile designs optimized for different tidal zones, enhancing marine biodiversity through specialized habitats."
            />
            <Feature
              icon={<Fish className="text-primary-500" />}
              title="Species-Specific Design"
              description="Carefully sized grooves and textures tailored for various marine organisms across different tidal zones."
            />
            <Feature
              icon={<Database className="text-primary-500" />}
              title="Smart Monitoring"
              description="Integrated sensors for real-time environmental data collection and ecosystem health monitoring."
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-secondary-500 dark:text-secondary-200">
              Ecoblox Design Innovation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-secondary-600 dark:text-secondary-300">
                  Design Purpose
                </h3>
                <p className="text-text-500 dark:text-background-100">
                  The Ecoblox tiles create modular seawall systems that enhance
                  marine biodiversity by catering to specific species in various
                  tidal zones. Each tile incorporates carefully sized grooves
                  and textures tailored to meet the habitat needs of marine
                  organisms.
                </p>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80"
                  alt="Marine Research"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6 text-secondary-500 dark:text-secondary-200">
                Tidal Zone Adaptations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ZoneCard
                  title="Supratidal Zone"
                  description="Smaller, shallower grooves for limpets and mangrove tree crabs"
                  className="bg-secondary-50 dark:bg-secondary-800"
                />
                <ZoneCard
                  title="Intertidal Zone"
                  description="Moderate-sized grooves for oysters and barnacles attachment"
                  className="bg-secondary-100 dark:bg-secondary-700"
                />
                <ZoneCard
                  title="Subtidal Zone"
                  description="Concave shapes for wave pressure mitigation and sponge habitats"
                  className="bg-secondary-200 dark:bg-secondary-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Define TypeScript interfaces for props
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-secondary-600 dark:text-secondary-200">
        {title}
      </h3>
      <p className="text-text-500 dark:text-background-100">{description}</p>
    </div>
  );
};

interface ZoneCardProps {
  title: string;
  description: string;
  className?: string;
}

const ZoneCard: React.FC<ZoneCardProps> = ({
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${className}`}>
      <h4 className="text-lg font-semibold mb-2 text-secondary-700 dark:text-secondary-100">
        {title}
      </h4>
      <p className="text-text-500 dark:text-background-100">{description}</p>
    </div>
  );
};

export default HomePage;
