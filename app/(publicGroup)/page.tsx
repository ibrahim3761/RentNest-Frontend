import Hero from "./_components/Hero";
import StatsSection from "./_components/StatsSection";
import FeaturesSection from "./_components/FeaturesSection";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />

      {/* Featured Properties — will be added later */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Featured Properties
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-8">
          Handpicked rentals just for you.
        </p>
        {/* TODO: <FeaturedProperties /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-border bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>

      <StatsSection />
      <FeaturesSection />
    </div>
  );
}