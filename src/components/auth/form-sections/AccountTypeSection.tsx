import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserRole } from "../RegisterForm";

interface AccountTypeSectionProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AccountTypeSection = ({ userRole, setUserRole }: AccountTypeSectionProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-base text-white">Account Type</Label>
      <RadioGroup 
        defaultValue={userRole}
        onValueChange={(value: UserRole) => setUserRole(value)}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="attendee" id="attendee" className="border-white" />
          <Label htmlFor="attendee" className="text-base text-white">Attendee - Participate in events</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="host" id="host" className="border-white" />
          <Label htmlFor="host" className="text-base text-white">Host - Create and manage events</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AccountTypeSection;