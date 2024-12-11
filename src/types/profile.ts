export interface SocialLinks {
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  twitch: string;
  linkedin: string;
  github: string;
  discord: string;
  tiktok: string;
  pinterest: string;
}

export interface ProfileFormData {
  displayName: string;
  realName: string;
  bio: string;
  role: string;
  city: string;
  contactNumber: string;
  socialLinks: SocialLinks;
  updatedAt: string;
  photoURL?: string;
}

export interface ProfileUpdateData {
  [key: string]: any;
}