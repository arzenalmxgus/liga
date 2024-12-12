import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AdditionalInfoProps {
  requireAdditionalInfo: boolean;
  setRequireAdditionalInfo: (value: boolean) => void;
  setFormData: (prev: any) => void;
}

const AdditionalInfo = ({ requireAdditionalInfo, setRequireAdditionalInfo, setFormData }: AdditionalInfoProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="requireAdditionalInfo"
        checked={requireAdditionalInfo}
        onCheckedChange={(checked) => {
          setRequireAdditionalInfo(checked as boolean);
          setFormData(prev => ({
            ...prev,
            requiresAdditionalInfo: checked as boolean
          }));
        }}
      />
      <Label htmlFor="requireAdditionalInfo" className="text-white">
        Require additional participant information
      </Label>
    </div>
  );
};

export default AdditionalInfo;