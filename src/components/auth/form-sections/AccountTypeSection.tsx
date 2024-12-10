import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { UserRole } from "../RegisterForm";

interface AccountTypeSectionProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AccountTypeSection = ({ userRole, setUserRole }: AccountTypeSectionProps) => {
  const handleRoleChange = (value: string) => {
    if (value === "attendee" || value === "host") {
      setUserRole(value as UserRole);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-base">Account Type</Label>
      <RadioGroup 
        defaultValue={userRole}
        onValueChange={handleRoleChange}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="attendee" id="attendee" />
          <Label htmlFor="attendee" className="text-base">Attendee - Join and participate in events</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="host" id="host" />
          <Label htmlFor="host" className="text-base">Host - Create and manage events</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AccountTypeSection;