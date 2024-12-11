import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  MessageCircle,
  Camera,
  Twitch,
  Globe,
} from "lucide-react";

interface SocialLinks {
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
}

interface PublicProfileProps {
  displayName: string;
  email: string;
  photoURL: string | null;
  bio: string;
  role: string;
  eventsHosted?: number;
  eventsAttended?: number;
  city?: string;
  contactNumber?: string;
  socialLinks?: SocialLinks;
}

const PublicProfile = ({
  displayName,
  email,
  photoURL,
  bio,
  role,
  eventsHosted = 0,
  eventsAttended = 0,
  city,
  contactNumber,
  socialLinks,
}: PublicProfileProps) => {
  const socialIcons: Record<string, React.ComponentType> = {
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    youtube: Youtube,
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/20 border-gray-800">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-24 h-24">
            {photoURL ? (
              <AvatarImage src={photoURL} alt={displayName} />
            ) : (
              <AvatarFallback className="bg-gray-700">
                <User className="w-12 h-12 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            <div className="flex items-center space-x-2 text-gray-400 mt-1">
              {city && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{city}</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-purple-600 rounded-full">
                {role}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">About</h3>
          <p className="text-gray-300">{bio || "No bio available"}</p>
        </div>

        <div className="mt-6 space-y-2">
          {email && (
            <div className="flex items-center text-gray-300">
              <Mail className="w-4 h-4 mr-2" />
              <span>{email}</span>
            </div>
          )}
          {contactNumber && (
            <div className="flex items-center text-gray-300">
              <Phone className="w-4 h-4 mr-2" />
              <span>{contactNumber}</span>
            </div>
          )}
        </div>

        {socialLinks && Object.entries(socialLinks).some(([_, value]) => value) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Social Links</h3>
            <div className="flex space-x-4">
              {Object.entries(socialLinks).map(([platform, link]) => {
                if (!link) return null;
                const Icon = socialIcons[platform.toLowerCase()];
                if (!Icon) return null;
                return (
                  <a
                    key={platform}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-black/30 rounded-lg">
            <div className="text-2xl font-bold text-white">{eventsHosted}</div>
            <div className="text-sm text-gray-400">Events Hosted</div>
          </div>
          <div className="text-center p-4 bg-black/30 rounded-lg">
            <div className="text-2xl font-bold text-white">{eventsAttended}</div>
            <div className="text-sm text-gray-400">Events Attended</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PublicProfile;