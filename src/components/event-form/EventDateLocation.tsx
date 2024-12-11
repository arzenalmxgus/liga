import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventDateLocationProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  formData: {
    location: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const EventDateLocation = ({ 
  date, 
  setDate,
  formData,
  handleInputChange,
  disabled
}: EventDateLocationProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={disabled}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EventDateLocation;