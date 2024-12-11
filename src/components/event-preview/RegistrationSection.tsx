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
    <div className="p-6 h-full overflow-y-auto">
      <EventHeader 
        title={`Register for ${title}`} 
        onClose={onClose} 
      />
      <EventRegistrationForm
        eventId={eventId}
        userId={userId}
        onSuccess={onSuccess}
        onCancel={onClose}
      />
    </div>
  );
};

export default RegistrationSection;