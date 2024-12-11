import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactInfoSectionProps {
  bio: string;
  setBio: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  email: string;
}

const ContactInfoSection = ({
  bio,
  setBio,
  city,
  setCity,
  contactNumber,
  setContactNumber,
  email,
}: ContactInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="bio" className="text-white">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="text-white bg-black/20 min-h-[100px]"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <Label htmlFor="city" className="text-white">Current City</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="text-white bg-black/20"
          placeholder="Enter your current city"
        />
      </div>

      <div>
        <Label htmlFor="contactNumber" className="text-white">Contact Number</Label>
        <Input
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="text-white bg-black/20"
          placeholder="Enter your contact number"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          value={email}
          disabled
          className="bg-black/20 text-white"
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;