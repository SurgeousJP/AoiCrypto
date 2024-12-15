export interface Token {
  id: string;
  address: string;
  name: string;
  symbol: string;
  initialSupply: number;
  maxSupply: number;
}

export interface CreateTokenParams {
  address: string;
  name: string;
  symbol: string;
  initialSupply: number;
  maxSupply: number;
}

export interface UpdateTokenParams {
  id: string;
  address?: string;
  name?: string;
  symbol?: string;
  initialSupply?: number;
  maxSupply?: number;
}

export interface DeleteTokenResponse {}

export interface Project {
  id: string;
  poolAddress: string;
  tokenAddress: string;
  name: string;
  overview: string;
  description: string;
  imageBannerUrl: string;
}

export interface CreateProjectParams {
  poolAddress: string;
  tokenAddress: string;
  name: string;
  overview: string;
  description: string;
  imageBannerUrl: string;
}

export interface UpdateProjectParams {
  id: string;
  poolAddress?: string;
  tokenAddress?: string;
  name?: string;
  overview?: string;
  description?: string;
  imageBannerUrl?: string;
}

export interface AllowlistEntry {
  id: string;
  poolAddress: string;
  userAddress: string;
  status: string;
}

export interface IsAllowedParams {
  poolAddress: string;
  userAddress: string;
}
export interface IsAllowedResponse {
  isAllowed: boolean;
}

export interface CreateAllowlistEntryParams {
  poolAddress: string;
  userAddresses: string[];
  status: string;
}

export interface CreateAllowlistEntryResponse {
  message: boolean;
}

export interface DeleteAllowlistEntryResponse {}

export interface UploadImageParams {
  image: {
    uri: string;
    name: string;
    type: string;
  };
  name?: string;
  expiration?: number;
}

export interface UploadImageResponse {
  data: Data;
  success: boolean;
  status: number;
}

export interface Data {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: number;
  height: number;
  size: number;
  time: number;
  expiration: number;
  image: Image;
  thumb: Thumb;
  medium: Medium;
  delete_url: string;
}

export interface Image {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}

export interface Thumb {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}

export interface Medium {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}
