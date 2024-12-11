import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface EventBasicInfoProps {
  formData: {
    title: string;
    description: string;
    category: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

const EventBasicInfo = ({ formData, handleInputChange, date, setDate, disabled }: EventBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-white">Event Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          disabled={disabled}
          className="bg-white/10 text-white"
        />
      </div>

      <div>
        <Label htmlFor="category" className="text-white">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
          disabled={disabled}
          className="bg-white/10 text-white"
        />
      </div>

      <div>
        <Label className="text-white">Event Date</Label>
        <DatePicker
          selected={date}
          onSelect={setDate}
          placeholder="Select event date"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-white">Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full min-h-[100px] p-2 rounded-md bg-white/10 text-white"
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EventBasicInfo;