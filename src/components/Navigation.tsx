import { Home, Calendar, User, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-gray-800 md:top-0 md:h-screen md:w-16 md:border-r md:border-t-0">
      <div className="flex justify-around md:flex-col md:h-full md:justify-start md:pt-8">
        <NavItem icon={<Home />} to="/" label="Home" />
        <NavItem icon={<Calendar />} to="/events" label="Events" />
        <NavItem icon={<Search />} to="/search" label="Search" />
        <NavItem icon={<User />} to="/profile" label="Profile" />
      </div>
    </nav>
  );
};

const NavItem = ({ icon, to, label }: { icon: React.ReactNode; to: string; label: string }) => {
  return (
    <Link
      to={to}
      className="p-4 text-gray-400 hover:text-primary transition-colors duration-200 flex flex-col items-center gap-1"
    >
      {icon}
      <span className="text-xs md:hidden">{label}</span>
    </Link>
  );
};

export default Navigation;