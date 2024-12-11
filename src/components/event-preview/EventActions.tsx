import { Button } from "../ui/button";
import DeleteEventButton from "./DeleteEventButton";

interface EventActionsProps {
  isHost: boolean;
  isFull: boolean;
  onRegister: () => void;
  onDelete: () => Promise<void>;
}

const EventActions = ({ isHost, isFull, onRegister, onDelete }: EventActionsProps) => {
  return (
    <div className="flex gap-4">
      {!isHost && (
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90 text-white"
          onClick={onRegister}
          disabled={isFull}
        >
          {isFull ? "Event Full" : "Register for Event"}
        </Button>
      )}
      
      {isHost && (
        <DeleteEventButton onDelete={onDelete} />
      )}
    </div>
  );
};

export default EventActions;