import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type UserRole = "student" | "coach" | "coordinator" | "official";

interface AccountTypeSectionProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AccountTypeSection = ({ userRole, setUserRole }: AccountTypeSectionProps) => {
  const handleRoleChange = (value: string) => {
    if (value === "student" || value === "coach" || value === "coordinator" || value === "official") {
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
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student" className="text-base">Student - Participate in events</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="coach" id="coach" />
          <Label htmlFor="coach" className="text-base">Coach/Teacher - Manage student participants</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="coordinator" id="coordinator" />
          <Label htmlFor="coordinator" className="text-base">Event Coordinator - Create and manage events</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="official" id="official" />
          <Label htmlFor="official" className="text-base">Event Official - Access participant galleries</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AccountTypeSection;