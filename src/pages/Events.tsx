import Navigation from "@/components/Navigation";
import EventsGrid from "@/components/EventsGrid";

const Events = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0">
        <header className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-gray-400 mt-1">Browse and register for events</p>
        </header>
        <EventsGrid />
      </main>
    </div>
  );
};

export default Events;