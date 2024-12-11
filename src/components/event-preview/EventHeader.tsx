import { X } from "lucide-react";
import { Button } from "../ui/button";
import { DialogHeader, DialogTitle } from "../ui/dialog";

interface EventHeaderProps {
  title: string;
  onClose: () => void;
}

const EventHeader = ({ title, onClose }: EventHeaderProps) => {
  return (
    <DialogHeader className="p-6 pb-0">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-3xl font-bold text-white">{title}</DialogTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </DialogHeader>
  );
};

export default EventHeader;