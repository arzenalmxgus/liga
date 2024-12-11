import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BasicInfoSectionProps {
  displayName: string;
  setDisplayName: (value: string) => void;
  realName: string;
  setRealName: (value: string) => void;
  previewUrl: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingImage: boolean;
}

const BasicInfoSection = ({
  displayName,
  setDisplayName,
  realName,
  setRealName,
  previewUrl,
  handleFileChange,
  uploadingImage,
}: BasicInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
          {uploadingImage && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="photo" className="block text-white mb-2">
            Profile Photo
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploadingImage}
              className="text-white bg-black/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            <p className="text-sm text-gray-400">
              Maximum file size: 2MB. Supported formats: JPG, PNG, GIF
            </p>
          </div>
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