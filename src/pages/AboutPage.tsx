import React from "react";
import { Leaf, Waves, Shield } from "lucide-react";
import VideoBackground from "../components/Home/backgroundVid";

const AboutPage: React.FC = () => {
  return (
    <>
      {/* Hero Section with Video */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-black dark:text-black px-4 sm:px-6 lg:px-8 overflow-hidden">
        <VideoBackground />
        <h1 className="text-4xl z-20 md:text-6xl font-bold text-center mb-4 text-black dark:text-white relative text-shadow">
          About BIOCAP
        </h1>
        
      </div>
      <p className="text-md z-10 max-w-4xl mx-auto text-center  bg-background-50 dark:bg-secondary-900">
  The Biodiversity Improvement by Optimizing Coastal Adaptation and Performance (BIOCAP) project is an interdisciplinary research initiative led by Florida International University’s Robotics and Digital Fabrication Lab, with support from the NSF and EPA. BIOCAP responds to the ecological shortcomings of traditional seawalls by introducing a 3D-printed modular tiling system designed to transform flat, hardened shorelines into biodiverse, resilient ecosystems.
</p>
<p className="text-md z-10 mt-4 max-w-4xl mx-auto text-center  bg-background-50 dark:bg-secondary-900">
  Over a two-year period, the BIOCAP system will be deployed and tested at key sites in Biscayne Bay, including Morningside Park and Miami Revere. These installations will evaluate the system’s performance in real-world coastal environments and generate data to support three central project objectives.
</p>

      {/* Main Content */}
      <div className="relative bg-background-50 dark:bg-secondary-900 py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card
              icon={<Leaf className="text-primary-500 w-10 h-10" />}
              title="Improving Marine Biodiversity"
              description="BIOCAP tiles are designed with grooves, crevices, and moisture-retaining features that mimic natural habitats, supporting filter-feeding organisms like oysters, barnacles, sponges, and tunicates. These microhabitats provide shaded, cooler environments that help regulate temperature and create niches for diverse marine life—eventually attracting larger species like fish and crabs and enhancing the coastal food web.
"
            />
            <Card
              icon={<Waves className="text-primary-500 w-10 h-10" />}
              title="Filtering and Improving Water Quality"
              description="The organisms encouraged by the BIOCAP system naturally purify water by filtering pollutants, nutrients, and suspended solids. With each adult oyster capable of filtering up to 50 gallons of water per day, these bioactive surfaces improve water clarity and reduce harmful algal blooms, promoting healthier ecosystems and better conditions for species like seagrasses."
            />
            <Card
              icon={<Shield className="text-primary-500 w-10 h-10" />}
              title="Strengthening Shoreline Defense"
              description="BIOCAP’s form and placement are strategically engineered to dissipate wave energy and reduce erosion. Its concave and convex geometry, installed at varying tidal elevations, helps absorb and redirect wave impact—lessening the force on existing seawalls and decreasing scouring at the base."
            />
          </div>

          {/* Sensor & Data Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h2 className="text-2xl font-bold text-secondary-600 dark:text-secondary-200 mb-4">
                Real-Time Environmental Monitoring
              </h2>
              <p className="text-text-500 dark:text-background-100">
              In addition to physical testing, BIOCAP incorporates real-time environmental sensors to monitor certain data. The collected data will be processed through AI-driven machine learning models to identify ecological patterns and optimize future design iterations. This data-centric approach allows for adaptive, performance-based improvements in coastal protection and restoration.
By combining digital fabrication, ecological science, and artificial intelligence, BIOCAP offers a scalable, sustainable strategy to reimagine shoreline infrastructure—helping communities confront climate change while revitalizing marine ecosystems.

              </p>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-800 p-6 rounded-lg shadow-lg">
              <ul className="space-y-3 text-sm text-neutral-800 dark:text-neutral-300">
                <li>• pH</li>
                <li>• Salinity</li>
                <li>• Temperature</li>
                <li>• Dissolved Oxygen</li>
                <li>• Wave Pressure</li>
              </ul>
            </div>
          </div>

          {/* Acknowledgments */}
          <div className="text-center mt-12">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              Supported by the Environmental Protection Agency (EPA) under Grant No. 03D09124.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ icon, title, description }) => (
  <div className="text-center p-6 rounded-lg shadow-lg bg-secondary-50 dark:bg-secondary-800">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-secondary-700 dark:text-secondary-100 mb-2">
      {title}
    </h3>
    <p className="text-text-500 dark:text-background-100">{description}</p>
  </div>
);

export default AboutPage;
