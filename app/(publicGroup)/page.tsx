import Hero from "./_components/Hero";
import StatsSection from "./_components/StatsSection";
import FeaturesSection from "./_components/FeaturesSection";
import FeaturedProperties from "./_components/FeaturedProperties";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <Hero />
      {/* Featured Properties */}
      <FeaturedProperties />
      {/* Features Section */}
      <FeaturesSection />
      {/* Stats Section */}
      <StatsSection />

    </div>
  );
}