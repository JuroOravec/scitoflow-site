import { formatUrlFromPath } from "./url";

export enum SocialType {
  EMAIL = 'email',
  DEVTO = 'devto',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  // MEDIUM = 'medium',
  RSS = 'rss',
  SOUNDCLOUD = 'soundcloud',
  TWITCH = 'twitch',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
}

interface Social {
  name: string;
  icon: string;
  getLink: (username: string) => string;
}

export const SOCIALS: Record<SocialType, Social> = {
  email: {
    name: 'Email',
    icon: 'mdi-email',
    getLink: (email) => `mailto:${email}`,
  },
  devto: {
    name: 'DEV.to',
    icon: 'mdi-dev-to',
    getLink: (username) => `https://dev.to/${username}`,
  },
  facebook: {
    name: 'Facebook',
    icon: 'mdi-facebook',
    getLink: (username) => `https://www.facebook.com/${username}`,
  },
  github: {
    name: 'GitHub',
    icon: 'mdi-github',
    getLink: (username) => `https://github.com/${username}`,
  },
  instagram: {
    name: 'Instagram',
    icon: 'mdi-instagram',
    getLink: (username) => `https://www.instagram.com/${username}`,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'mdi-linkedin',
    getLink: (username) => `https://www.linkedin.com/in/${username}`,
  },
  // medium: {
  //   icon: 'customMedium',
  //   getLink: (username) => `https://medium.com/${username}`,
  // },
  rss: {
    name: 'RSS',
    icon: 'mdi-rss',
    getLink: (siteUrl) => formatUrlFromPath(siteUrl, '/feed.xml'),
  },
  soundcloud: {
    name: 'SoundCloud',
    icon: 'mdi-soundcloud',
    getLink: (username) => `https://soundcloud.com/${username}`,
  },
  twitch: {
    name: 'Twitch',
    icon: 'mdi-twitch',
    getLink: (username) => `https://www.twitch.tv/${username}`,
  },
  twitter: {
    name: 'Twitter',
    icon: 'mdi-twitter',
    getLink: (username) => `https://www.twitter.com/${username}`,
  },
  youtube: {
    name: 'YouTube',
    icon: 'mdi-youtube',
    getLink: (username) => `https://www.youtube.com/channel/${username}`,
  },
};
