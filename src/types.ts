export type BlockType = 
  | 'paragraph' 
  | 'heading1' 
  | 'heading2' 
  | 'image' 
  | 'quote' 
  | 'callout' 
  | 'bullet_list' 
  | 'divider';

export interface HighlightHabit {
  name: string;
  style: string;
  scene: string;
  badgeColor?: string;
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  caption?: string;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  coverImage: string;
  blocks: ContentBlock[];
  updatedAt: string;
  isTemplate?: boolean;
  description?: string;
  styleConfig?: StyleConfig;
  highlightHabits?: HighlightHabit[];
}

export interface StyleConfig {
  primaryColor: string; // e.g., '#07C160' or '#006d33'
  secondaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  fontFamily: string;
  fontSize: number; // base font size in px, default 16
  lineHeight: number; // e.g. 1.75
  paragraphSpacing: number; // e.g. 16
  headingStyle: 'left-border' | 'solid-bg' | 'badge' | 'bottom-line' | 'custom';
  quoteStyle: 'simple' | 'card' | 'speech' | 'custom';
  h1Prefix?: 'chinese' | 'numeric' | 'none';
  h2Prefix?: 'circles' | 'numeric' | 'none';
  cssVariables?: Record<string, string>;
  customCss?: string;
}

export interface ExtractedTheme {
  id: string;
  name: string;
  description: string;
  sourceUrl?: string;
  createdAt: string;
  styleConfig: StyleConfig;
  customCss: string;
  highlightHabits?: HighlightHabit[];
  previewSample?: {
    title: string;
    h2: string;
    quote: string;
    paragraph: string;
  };
}

export type NavTab = 'projects' | 'templates' | 'editing' | 'extractor';

