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
      <div className="flex flex-wrap gap-4">
        {platforms.map((platform) => (
          <Button
            key={platform}
            variant="outline"
            className="bg-black/20 text-white hover:bg-black/40 border-gray-700"
            onClick={() => handleSocialLinkChange(platform as keyof SocialLinks, socialLinks[platform as keyof SocialLinks])}
          >
            {platform}
          </Button>
        ))}
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
    </div>
  );
};

export default SocialLinksSection;