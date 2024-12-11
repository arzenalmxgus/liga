interface EventDetailsProps {
  date: string;
  location: string;
  participants: number;
  entrance_fee: number | null;
  is_free: boolean;
}

const EventDetails = ({ date, location, participants, entrance_fee, is_free }: EventDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
        <h3 className="font-semibold text-primary mb-1">Date</h3>
        <p className="text-white">{new Date(date).toLocaleDateString()}</p>
      </div>
      <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
        <h3 className="font-semibold text-primary mb-1">Location</h3>
        <p className="text-white">{location}</p>
      </div>
      <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
        <h3 className="font-semibold text-primary mb-1">Participants</h3>
        <p className="text-white">{participants} registered</p>
      </div>
      <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
        <h3 className="font-semibold text-primary mb-1">Entrance Fee</h3>
        <p className="text-white">{is_free ? "Free" : `$${entrance_fee?.toFixed(2)}`}</p>
      </div>
    </div>
  );
};

export default EventDetails;