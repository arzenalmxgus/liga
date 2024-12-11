import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface DeleteEventButtonProps {
  onDelete: () => Promise<void>;
}

const DeleteEventButton = ({ onDelete }: DeleteEventButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg transition-all duration-200 ease-in-out"
        >
          <Trash2 className="w-4 h-4" />
          Delete Event
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 text-white border border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to delete this event? This action cannot be undone.
            All participant registrations will also be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEventButton;