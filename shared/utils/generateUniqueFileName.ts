import { v4 as uuidv4 } from "uuid";

export const generateUniqueFileName = (originalName: string): string => {
  const uniqueId = uuidv4();
  const extensionIndex = originalName.lastIndexOf(".");
  const name = extensionIndex !== -1 ? originalName.substring(0, extensionIndex) : originalName;
  const extension = extensionIndex !== -1 ? originalName.substring(extensionIndex) : "";
  return `${name}_${uniqueId}${extension}`;
};
