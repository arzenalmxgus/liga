import { Badge } from "@/components/ui/badge";
import { Trophy, Users, User } from "lucide-react";

interface RoleBadgeProps {
  role: string;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  console.log("RoleBadge rendered with role:", role); // Debug log
  
  const normalizedRole = role.toLowerCase().trim();
  
  switch (normalizedRole) {
    case 'attendee':
      return (
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1 bg-secondary/20 text-secondary-foreground px-3 py-1"
        >
          <Users className="w-4 h-4" />
          Event Attendee
        </Badge>
      );
    case 'host':
      return (
        <Badge 
          variant="default" 
          className="flex items-center gap-1 bg-primary/20 text-primary-foreground px-3 py-1"
        >
          <User className="w-4 h-4" />
          Event Host
        </Badge>
      );
    case 'coach':
      return (
        <Badge 
          variant="outline" 
          className="flex items-center gap-1 text-white border-white/20 px-3 py-1"
        >
          <Trophy className="w-4 h-4" />
          Sports Coach
        </Badge>
      );
    default:
      console.log("Unknown role:", role); // Debug log for unknown roles
      return (
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1 bg-secondary/20 text-secondary-foreground px-3 py-1"
        >
          <Users className="w-4 h-4" />
          {role || 'Member'}
        </Badge>
      );
  }
};

export default RoleBadge;