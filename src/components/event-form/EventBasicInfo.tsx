import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventBasicInfoProps {
  formData: {
    title: string;
    description: string;
    category: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const EventBasicInfo = ({ formData, handleInputChange, disabled }: EventBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          disabled={disabled}
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
          disabled={disabled}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full min-h-[100px] p-2 border rounded-md bg-background"
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EventBasicInfo;