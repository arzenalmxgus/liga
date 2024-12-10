import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventBasicInfoProps {
  title: string;
  description: string;
  category: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EventBasicInfo = ({ title, description, category, onChange }: EventBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={category}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          className="w-full min-h-[100px] p-2 border rounded-md bg-background"
          required
        />
      </div>
    </div>
  );
};

export default EventBasicInfo;