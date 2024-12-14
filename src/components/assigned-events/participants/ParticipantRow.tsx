import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ParticipantRowProps {
  participant: {
    id: string;
    displayName: string;
    email: string;
    age: string;
    nationality: string;
    registrationDate: Date;
    status: string;
  };
  onStatusUpdate: (participantId: string, status: 'approved' | 'rejected', message?: string) => Promise<void>;
}

const ParticipantRow = ({ participant, onStatusUpdate }: ParticipantRowProps) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");

  const handleReject = async () => {
    await onStatusUpdate(participant.id, 'rejected', rejectMessage);
    setShowRejectDialog(false);
    setRejectMessage("");
  };

  return (
    <>
      <TableRow>
        <TableCell className="text-white">{participant.displayName}</TableCell>
        <TableCell className="text-white">{participant.email}</TableCell>
        <TableCell className="text-white">{participant.age}</TableCell>
        <TableCell className="text-white">{participant.nationality}</TableCell>
        <TableCell className="text-white">
          {participant.registrationDate instanceof Date 
            ? participant.registrationDate.toLocaleDateString()
            : 'N/A'}
        </TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-sm ${
            participant.status === 'approved' 
              ? 'bg-green-600/20 text-green-400' 
              : participant.status === 'rejected'
              ? 'bg-red-600/20 text-red-400'
              : 'bg-yellow-600/20 text-yellow-400'
          }`}>
            {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
          </span>
        </TableCell>
        <TableCell>
          {participant.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                onClick={() => onStatusUpdate(participant.id, 'approved')}
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => setShowRejectDialog(true)}
                variant="destructive"
                size="sm"
              >
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-gray-900/95">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Reject Participant
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Please provide a reason for rejection..."
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              className="min-h-[100px] bg-gray-800 text-white border-gray-700"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectMessage.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParticipantRow;