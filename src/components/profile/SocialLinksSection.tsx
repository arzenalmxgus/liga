import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [showAddLink, setShowAddLink] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<keyof SocialLinks | ''>('');
  const [editingPlatform, setEditingPlatform] = useState<keyof SocialLinks | null>(null);
  
  const platforms = [
    'Facebook',
    'Instagram',
    'Twitter',
    'YouTube'
  ];
  
  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform.toLowerCase()]: value,
    }));
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform.toLowerCase() as keyof SocialLinks);
  };

  const handleRemoveLink = (platform: keyof SocialLinks) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: '',
    }));
    toast({
      title: "Social Link Removed",
      description: `Your ${platform} link has been removed.`,
    });
  };

  const startEditing = (platform: keyof SocialLinks) => {
    setEditingPlatform(platform);
  };

  const stopEditing = () => {
    setEditingPlatform(null);
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

      {/* Existing Social Links */}
      <div className="space-y-3">
        {Object.entries(socialLinks).map(([platform, link]) => {
          if (!link) return null;
          return (
            <div key={platform} className="flex items-center gap-2">
              <div className="min-w-[100px] text-gray-400 capitalize">
                {platform}:
              </div>
              {editingPlatform === platform ? (
                <Input
                  value={link}
                  onChange={(e) => handleSocialLinkChange(platform as keyof SocialLinks, e.target.value)}
                  onBlur={stopEditing}
                  className="text-white bg-black/20 border-gray-700 flex-1"
                  autoFocus
                />
              ) : (
                <div className="flex-1 text-white">{link}</div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => startEditing(platform as keyof SocialLinks)}
                className="text-gray-400 hover:text-white"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveLink(platform as keyof SocialLinks)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
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
                  value={platform.toLowerCase()} 
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