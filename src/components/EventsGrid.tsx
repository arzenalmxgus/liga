import EventCard from "./EventCard";

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Basketball Tournament 2024",
    date: "March 15, 2024",
    location: "Main Sports Complex",
    category: "Sports",
    participants: 120,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
  },
  {
    id: 2,
    title: "Science Fair Exhibition",
    date: "April 2, 2024",
    location: "Science Building",
    category: "Academic",
    participants: 85,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
  },
  {
    id: 3,
    title: "Cultural Dance Festival",
    date: "March 28, 2024",
    location: "Auditorium",
    category: "Cultural",
    participants: 200,
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80",
  },
];

const EventsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {SAMPLE_EVENTS.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  );
};

export default EventsGrid;