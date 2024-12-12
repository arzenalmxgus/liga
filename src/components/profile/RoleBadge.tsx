import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: string;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const normalizedRole = role.toLowerCase().trim();
  
  switch (normalizedRole) {
    case 'attendee':
      return (
        <Badge variant="secondary" className="text-sm font-medium bg-secondary text-secondary-foreground">
          Event Attendee
        </Badge>
      );
    case 'host':
      return (
        <Badge variant="default" className="text-sm font-medium bg-primary text-primary-foreground">
          Event Host
        </Badge>
      );
    case 'coach':
      return (
        <Badge variant="outline" className="text-sm font-medium text-white border-white">
          Sports Coach
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-sm font-medium">
          {role}
        </Badge>
      );
  }
};

export default RoleBadge;