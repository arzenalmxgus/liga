import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventDateLocationProps {
  date: Date | undefined;
  location: string;
  onDateSelect: (date: Date | undefined) => void;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventDateLocation = ({ 
  date, 
  location, 
  onDateSelect, 
  onLocationChange 
}: EventDateLocationProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          className="rounded-md border"
          required
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={location}
          onChange={onLocationChange}
          required
        />
      </div>
    </div>
  );
};

export default EventDateLocation;