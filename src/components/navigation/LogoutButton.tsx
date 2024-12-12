import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="p-4 transition-colors duration-200 flex flex-col items-center gap-1 text-gray-400 hover:text-primary"
    >
      <LogOut className="text-white" />
      <span className="text-xs md:hidden text-white">Logout</span>
    </button>
  );
};

export default LogoutButton;