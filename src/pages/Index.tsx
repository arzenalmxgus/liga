import Navigation from "@/components/Navigation";
import EventsGrid from "@/components/EventsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0">
        <header className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">Upcoming Events</h1>
          <p className="text-gray-400 mt-1">Discover and join exciting events</p>
        </header>
        <EventsGrid />
      </main>
    </div>
  );
};

export default Index;