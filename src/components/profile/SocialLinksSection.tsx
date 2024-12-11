import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SocialLinks {
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
}

interface SocialLinksSectionProps {
  socialLinks: SocialLinks;
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinks>>;
}

const SocialLinksSection = ({ socialLinks, setSocialLinks }: SocialLinksSectionProps) => {
  const [showAddLink, setShowAddLink] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<keyof SocialLinks | ''>('');
  const platforms = [
    'Facebook',
    'Instagram',
    'LINE',
    'Snapchat',
    'Threads',
    'TikTok',
    'Twitch',
    'Twitter',
    'WhatsApp',
    'YouTube'
  ];
  
  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform as keyof SocialLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button
          type="button"
          variant="outline"
          className="bg-black/20 text-white hover:bg-black/40 border-gray-700"
          onClick={() => setShowAddLink(!showAddLink)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a social link
        </Button>
      </div>

      {showAddLink && (
        <div className="space-y-4 animate-fade-in">
          <Select onValueChange={handlePlatformSelect}>
            <SelectTrigger className="bg-black/20 text-white border-gray-700">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border border-gray-700">
              {platforms.map((platform) => (
                <SelectItem 
                  key={platform} 
                  value={platform} 
                  className="capitalize text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white font-['Poppins']"
                >
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedPlatform && (
            <Input
              placeholder={`Enter your ${selectedPlatform} username`}
              value={socialLinks[selectedPlatform]}
              onChange={(e) => handleSocialLinkChange(selectedPlatform, e.target.value)}
              className="text-white bg-black/20 border-gray-700"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SocialLinksSection;