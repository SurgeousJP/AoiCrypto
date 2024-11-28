import { defaultWagmiConfig } from "@reown/appkit-wagmi-react-native";
import { sepolia } from "viem/chains";

export const PROJECT_ID = process.env.EXPO_PUBLIC_AOICRYPTO_PROJECT_ID;

const chains = [sepolia] as const;

const metadata = {
  name: "AoiCrypto AppKit WalletConnect",
  description: "AoiCrypto AppKit WalletConnect",
  url: "https://reown.com/appkit",
  icons: [
    "https://i.pinimg.com/736x/cd/0e/0d/cd0e0dbb19f35e33bb6e68b4f47d0db8.jpg",
  ],
  redirect: {
    native: "myapp://",
    universal: "https://myapp.com",
  },
};

export const wagmiConfig = defaultWagmiConfig({ chains, projectId: PROJECT_ID, metadata });