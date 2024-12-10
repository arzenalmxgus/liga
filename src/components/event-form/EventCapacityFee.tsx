import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EventCapacityFeeProps {
  participantsLimit: string;
  entranceFee: string;
  isFree: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFeeTypeChange: (value: string) => void;
}

const EventCapacityFee = ({
  participantsLimit,
  entranceFee,
  isFree,
  onChange,
  onFeeTypeChange,
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
          value={participantsLimit}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label>Entrance Fee</Label>
        <RadioGroup
          value={isFree}
          onValueChange={onFeeTypeChange}
          className="flex flex-col space-y-2 mt-2"
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
        {isFree === "false" && (
          <Input
            type="number"
            name="entranceFee"
            value={entranceFee}
            onChange={onChange}
            placeholder="Enter fee amount"
            min="0"
            step="0.01"
            className="mt-2"
            required
          />
        )}
      </div>
    </div>
  );
};

export default EventCapacityFee;