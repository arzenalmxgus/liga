import { Link } from "react-router-dom";

interface NavItemProps {
  icon: React.ReactNode;
  to: string;
  label: string;
  isActive: boolean;
}

const NavItem = ({ icon, to, label, isActive }: NavItemProps) => {
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

export default NavItem;