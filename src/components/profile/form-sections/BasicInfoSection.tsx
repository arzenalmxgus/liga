import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BasicInfoSectionProps {
  displayName: string;
  setDisplayName: (value: string) => void;
  realName: string;
  setRealName: (value: string) => void;
  previewUrl: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoSection = ({
  displayName,
  setDisplayName,
  realName,
  setRealName,
  previewUrl,
  handleFileChange,
}: BasicInfoSectionProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-white"
          />
          <p className="text-sm text-gray-400 mt-1">
            Recommended: Square image, max 2MB
          </p>
        </div>
      </div>

      <div>
        <Label htmlFor="displayName" className="text-white">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="text-white bg-black/20"
          placeholder="How you want to be known"
        />
      </div>

      <div>
        <Label htmlFor="realName" className="text-white">Real Name</Label>
        <Input
          id="realName"
          value={realName}
          onChange={(e) => setRealName(e.target.value)}
          className="text-white bg-black/20"
          placeholder="Your legal name"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;