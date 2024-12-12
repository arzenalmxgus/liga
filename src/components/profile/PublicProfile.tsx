import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { 
  Instagram, Facebook, Twitter, Youtube, User, MapPin, 
  Phone, Mail, Twitch, Linkedin, Github, MessageCircle, 
  MessageSquare, PinIcon, UserRound, Info, LucideIcon 
} from "lucide-react";
import RoleBadge from "./RoleBadge";
import type { SocialLinks } from "@/types/profile";

interface PublicProfileProps {
  displayName: string;
  realName: string;
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
  realName,
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
  const socialIcons: Record<string, LucideIcon> = {
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    youtube: Youtube,
    twitch: Twitch,
    linkedin: Linkedin,
    github: Github,
    discord: MessageCircle,
    tiktok: MessageSquare,
    pinterest: PinIcon,
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/20 border-gray-800">
      <div className="p-6">
        <div className="flex items-start space-x-6">
          <Avatar className="w-32 h-32">
            {photoURL ? (
              <AvatarImage src={photoURL} alt={displayName} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-gray-700">
                <User className="w-16 h-16 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            {realName && (
              <div className="flex items-center text-gray-400 mt-1">
                <UserRound className="w-4 h-4 mr-1" />
                <span>{realName}</span>
              </div>
            )}
            {city && (
              <div className="flex items-center text-gray-400 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{city}</span>
              </div>
            )}
            <div className="mt-2">
              <RoleBadge role={role} />
            </div>
          </div>
        </div>

        {bio && (
          <div className="mt-6">
            <div className="flex items-center text-white mb-2">
              <Info className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">About</h3>
            </div>
            <p className="text-gray-300">{bio}</p>
          </div>
        )}

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
            <div className="flex flex-wrap gap-4">
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
                    title={platform.charAt(0).toUpperCase() + platform.slice(1)}
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
