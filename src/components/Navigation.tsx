import { Calendar, User, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/20 backdrop-blur-sm border-t border-gray-800 md:top-0 md:h-screen md:w-16 md:border-r md:border-t-0">
      <div className="flex justify-around md:flex-col md:h-full md:justify-start md:pt-8">
        {user ? (
          <>
            {profile?.role === 'coach' ? (
              <>
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
              </>
            ) : (
              <>
                <NavItem icon={<Calendar className="text-white" />} to="/events" label="Events" isActive={location.pathname === "/events"} />
                <NavItem icon={<User className="text-white" />} to="/profile" label="Profile" isActive={location.pathname === "/profile"} />
              </>
            )}
            <button
              onClick={handleLogout}
              className="p-4 transition-colors duration-200 flex flex-col items-center gap-1 text-gray-400 hover:text-primary"
            >
              <LogOut className="text-white" />
              <span className="text-xs md:hidden text-white">Logout</span>
            </button>
          </>
        ) : (
          <NavItem icon={<LogIn className="text-white" />} to="/auth" label="Login" isActive={location.pathname === "/auth"} />
        )}
      </div>
    </nav>
  );
};

const NavItem = ({ icon, to, label, isActive }: { icon: React.ReactNode; to: string; label: string; isActive: boolean }) => {
  return (
    <Link
      to={to}
      className={`p-4 transition-colors duration-200 flex flex-col items-center gap-1 ${
        isActive ? "text-primary" : "text-gray-400 hover:text-primary"
      }`}
    >
      {icon}
      <span className="text-xs md:hidden text-white">{label}</span>
    </Link>
  );
};

export default Navigation;