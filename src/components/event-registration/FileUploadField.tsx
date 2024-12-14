import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface FileUploadFieldProps {
  label: string;
  id: string;
  accept?: string;
  onChange: (file: File | null) => void;
  isUploading?: boolean;
  progress?: number;
  error?: string;
}

const FileUploadField = ({
  label,
  id,
  accept = "image/*,.pdf,.doc,.docx",
  onChange,
  isUploading = false,
  progress = 0,
  error,
}: FileUploadFieldProps) => {
  const [fileName, setFileName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onChange(null);
        setFileName("");
        return;
      }
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white font-medium mb-2 block">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="bg-white/10 text-white border-white/20 cursor-pointer"
          disabled={isUploading}
        />
        {isUploading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          </div>
        )}
      </div>
      {fileName && (
        <p className="text-sm text-gray-300">Selected: {fileName}</p>
      )}
      {isUploading && (
        <Progress value={progress} className="h-1 bg-white/20" />
      )}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FileUploadField;