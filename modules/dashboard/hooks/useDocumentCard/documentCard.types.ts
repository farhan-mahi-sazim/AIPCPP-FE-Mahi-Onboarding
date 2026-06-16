import { IDocumentCardProps } from "@/modules/dashboard/dashboard.types";

export interface IUseDocumentCardReturn {
  handleCardClick: () => void;
  handleViewDetails: () => void;
  handleDelete: () => void;
  fileConfig: { bg: string; text: string; icon: React.ElementType };
  filename: string;
  category?: string | null;
  tags?: string[] | null;
  summaryTitle?: string | null;
  summaryText?: string | null;
  relevance?: string;
  matchCount?: number;
  bestHighlight?: string;
  highlightScore?: number;
}

export type TDocumentCardInput = IDocumentCardProps["document"];
