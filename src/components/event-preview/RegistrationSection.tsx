import { useState } from "react";
import { Button } from "../ui/button";
import EventRegistrationForm from "../event-registration/EventRegistrationForm";
import EventHeader from "./EventHeader";

interface RegistrationSectionProps {
  eventId: string;
  userId: string;
  title: string;
  onSuccess: () => void;
  onClose: () => void;
}

const RegistrationSection = ({ 
  eventId, 
  userId, 
  title, 
  onSuccess, 
  onClose 
}: RegistrationSectionProps) => {
  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <EventHeader 
        title={`Register for ${title}`} 
        onClose={onClose} 
      />
      <div className="mt-2">
        <EventRegistrationForm
          eventId={eventId}
          userId={userId}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default RegistrationSection;