import {
  MdPictureAsPdf,
  MdDescription,
  MdTextSnippet,
  MdInsertPhoto,
  MdInsertDriveFile,
} from "react-icons/md";

export const FILE_TYPE_CONFIG: Record<
  string,
  { bg: string; text: string; icon: React.ElementType }
> = {
  PDF: { bg: "bg-red-500/10", text: "text-red-400", icon: MdPictureAsPdf },
  DOCX: { bg: "bg-blue-500/10", text: "text-blue-400", icon: MdDescription },
  DOC: { bg: "bg-blue-500/10", text: "text-blue-400", icon: MdDescription },
  TXT: { bg: "bg-green-500/10", text: "text-green-400", icon: MdTextSnippet },
  JPG: { bg: "bg-purple-500/10", text: "text-purple-400", icon: MdInsertPhoto },
  JPEG: { bg: "bg-purple-500/10", text: "text-purple-400", icon: MdInsertPhoto },
  PNG: { bg: "bg-purple-500/10", text: "text-purple-400", icon: MdInsertPhoto },
  GIF: { bg: "bg-purple-500/10", text: "text-purple-400", icon: MdInsertPhoto },
};

export const DEFAULT_FILE_CONFIG = {
  bg: "bg-surface-container",
  text: "text-outline",
  icon: MdInsertDriveFile,
};
