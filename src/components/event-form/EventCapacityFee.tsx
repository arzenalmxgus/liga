import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EventCapacityFeeProps {
  formData: {
    participantsLimit: string;
    entranceFee: string;
    isFree: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const EventCapacityFee = ({
  formData,
  handleInputChange,
  disabled
}: EventCapacityFeeProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="participantsLimit">Number of Participants</Label>
        <Input
          id="participantsLimit"
          name="participantsLimit"
          type="number"
          min="1"
          value={formData.participantsLimit}
          onChange={handleInputChange}
          required
          disabled={disabled}
        />
      </div>

      <div>
        <Label>Entrance Fee</Label>
        <RadioGroup
          value={formData.isFree}
          onValueChange={(value) => {
            const event = {
              target: {
                name: 'isFree',
                value: value
              }
            } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(event);
          }}
          className="flex flex-col space-y-2 mt-2"
          disabled={disabled}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="free" />
            <Label htmlFor="free">Free</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="paid" />
            <Label htmlFor="paid">Paid</Label>
          </div>
        </RadioGroup>
        {formData.isFree === "false" && (
          <Input
            type="number"
            name="entranceFee"
            value={formData.entranceFee}
            onChange={handleInputChange}
            placeholder="Enter fee amount"
            min="0"
            step="0.01"
            className="mt-2"
            required
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

export default EventCapacityFee;