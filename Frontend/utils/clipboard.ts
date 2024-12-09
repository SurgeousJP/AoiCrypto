import * as Clipboard from "expo-clipboard";
import { showToast } from "@/utils/toast";

export const handleCopyToClipboard = async (value: string) => {
  await Clipboard.setStringAsync(value);
  const clipboard = await Clipboard.getStringAsync();
  showToast("info", "Copied to clipboard", clipboard);
};
