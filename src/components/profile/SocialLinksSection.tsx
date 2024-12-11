import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

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
  const platforms = ['instagram', 'facebook', 'twitter', 'youtube'];
  
  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <Label className="text-white">Social Links</Label>
      {platforms.map((platform) => (
        <div key={platform} className="space-y-2">
          <Label htmlFor={platform} className="text-white capitalize flex items-center gap-2">
            {platform}
          </Label>
          <Input
            id={platform}
            placeholder={`Enter your ${platform} username`}
            value={socialLinks[platform as keyof SocialLinks]}
            onChange={(e) => handleSocialLinkChange(platform as keyof SocialLinks, e.target.value)}
            className="text-white bg-black/20"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full mt-4 text-white border-gray-700"
        onClick={() => setShowAddLink(!showAddLink)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add a social link
      </Button>
    </div>
  );
};

export default SocialLinksSection;