import { Calendar, User, LogIn, Bell, Home } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NavItem from "./navigation/NavItem";
import LogoutButton from "./navigation/LogoutButton";

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    },
    enabled: !!user,
  });

  // If not logged in, show only home and login
  if (!user) {
    return (
      <nav className="fixed bottom-0 left-0 w-full bg-black/20 backdrop-blur-sm border-t border-gray-800 md:top-0 md:h-screen md:w-16 md:border-r md:border-t-0">
        <div className="flex justify-around md:flex-col md:h-full md:justify-start md:pt-8">
          <NavItem 
            icon={<Home className="text-white" />} 
            to="/" 
            label="Home" 
            isActive={location.pathname === "/"} 
          />
          <NavItem 
            icon={<LogIn className="text-white" />} 
            to="/auth" 
            label="Login" 
            isActive={location.pathname === "/auth"} 
          />
        </div>
      </nav>
    );
  }

  // Host navigation
  if (profile?.role === 'host') {
    return (
      <nav className="fixed bottom-0 left-0 w-full bg-black/20 backdrop-blur-sm border-t border-gray-800 md:top-0 md:h-screen md:w-16 md:border-r md:border-t-0">
        <div className="flex justify-around md:flex-col md:h-full md:justify-start md:pt-8">
          <NavItem 
            icon={<Home className="text-white" />} 
            to="/" 
            label="Home" 
            isActive={location.pathname === "/"} 
          />
          <NavItem 
            icon={<Calendar className="text-white" />} 
            to="/events" 
            label="Events" 
            isActive={location.pathname === "/events"} 
          />
          <NavItem 
            icon={<Calendar className="text-white" />} 
            to="/my-events" 
            label="My Events" 
            isActive={location.pathname === "/my-events"} 
          />
          <NavItem 
            icon={<User className="text-white" />} 
            to="/profile" 
            label="Profile" 
            isActive={location.pathname === "/profile"} 
          />
          <LogoutButton />
        </div>
      </nav>
    );
  }

  // Coach navigation
  if (profile?.role === 'coach') {
    return (
      <nav className="fixed bottom-0 left-0 w-full bg-black/20 backdrop-blur-sm border-t border-gray-800 md:top-0 md:h-screen md:w-16 md:border-r md:border-t-0">
        <div className="flex justify-around md:flex-col md:h-full md:justify-start md:pt-8">
          <NavItem 
            icon={<Home className="text-white" />} 
            to="/" 
            label="Home" 
            isActive={location.pathname === "/"} 
          />
          <NavItem 
            icon={<Calendar className="text-white" />} 
            to="/events-assigned" 
            label="Assigned" 
            isActive={location.pathname === "/events-assigned"} 
          />
          <NavItem 
            icon={<User className="text-white" />} 
            to="/profile" 
            label="Profile" 
            isActive={location.pathname === "/profile"} 
          />
          <LogoutButton />
        </div>
      </nav>
    );
  }

  // Attendee navigation
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/20 backdrop-blur-sm border-t border-gray-800 md:top-0 md:h-screen md:w-16 md:border-r md:border-t-0">
      <div className="flex justify-around md:flex-col md:h-full md:justify-start md:pt-8">
        <NavItem 
          icon={<Home className="text-white" />} 
          to="/" 
          label="Home" 
          isActive={location.pathname === "/"} 
        />
        <NavItem 
          icon={<Calendar className="text-white" />} 
          to="/events" 
          label="Events" 
          isActive={location.pathname === "/events"} 
        />
        <NavItem 
          icon={<Calendar className="text-white" />} 
          to="/joined-events" 
          label="Joined" 
          isActive={location.pathname === "/joined-events"} 
        />
        <NavItem 
          icon={<Bell className="text-white" />} 
          to="/notifications" 
          label="Notifications" 
          isActive={location.pathname === "/notifications"} 
        />
        <NavItem 
          icon={<User className="text-white" />} 
          to="/profile" 
          label="Profile" 
          isActive={location.pathname === "/profile"} 
        />
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navigation;