import { Home, Calendar, User, Search, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-gray-800 md:top-0 md:h-screen md:w-16 md:border-r md:border-t-0">
      <div className="flex justify-around md:flex-col md:h-full md:justify-start md:pt-8">
        <NavItem icon={<Home />} to="/" label="Home" isActive={location.pathname === "/"} />
        <NavItem icon={<Calendar />} to="/events" label="Events" isActive={location.pathname === "/events"} />
        <NavItem icon={<Search />} to="/search" label="Search" isActive={location.pathname === "/search"} />
        {isLoggedIn ? (
          <NavItem icon={<User />} to="/profile" label="Profile" isActive={location.pathname === "/profile"} />
        ) : (
          <NavItem icon={<LogIn />} to="/auth" label="Login" isActive={location.pathname === "/auth"} />
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
      <span className="text-xs md:hidden">{label}</span>
    </Link>
  );
};

export default Navigation;