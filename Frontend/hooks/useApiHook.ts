// useApiHooks.ts
import http from "@/http/http";
import {
  AllowlistEntry,
  CreateAllowlistEntryParams,
  CreateAllowlistEntryResponse,
  CreateProjectParams,
  CreateTokenParams,
  DeleteAllowlistEntryResponse,
  DeleteTokenResponse,
  Project,
  Token,
  UpdateProjectParams,
  UpdateTokenParams,
} from "@/model/ApiModel";
import { useMutation, useQuery } from "@tanstack/react-query";

// Token Hooks
export const useGetTokens = () => {
  return useQuery<Token[], Error>({
    queryKey: ["tokens"],
    queryFn: async () => {
      const response = await http.get<Token[]>("/api/token");
      return response.data;
    },
  });
};

export const useGetTokenById = (id: string) => {
  return useQuery<Token, Error>({
    queryKey: ["token", id],
    queryFn: async () => {
      const response = await http.get<Token>(`/api/token/${id}`);
      return response.data;
    },
  });
};

export const useCreateToken = () => {
  return useMutation<Token, Error, CreateTokenParams>({
    mutationFn: async (params) => {
      const response = await http.post<Token>("/api/token", {
        ...params,
      });
      return response.data;
    },
  });
};

export const useUpdateToken = () => {
  return useMutation<Token, Error, UpdateTokenParams>({
    mutationFn: async (params) => {
      const { id } = params;
      const response = await http.put<Token>(`/api/token/${id}`, {
        ...params,
      });
      return response.data;
    },
  });
};

export const useDeleteToken = () => {
  return useMutation<DeleteTokenResponse, Error, string>({
    mutationFn: async (id) => {
      const response = await http.delete<DeleteTokenResponse>(
        `/api/token/${id}`
      );
      return response.data;
    },
  });
};

// Project Hooks
export const useGetProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await http.get<Project[]>("/api/project");
      return response.data;
    },
  });
};

export const useGetProjectById = (id: string) => {
  return useQuery<Project, Error>({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await http.get<Project>(`/api/project/${id}`);
      return response.data;
    },
  });
};

export const useGetProjectByAddress = (address: string) => {
  return useQuery<Project, Error>({
    queryKey: ["project", address],
    queryFn: async () => {
      const response = await http.get<Project>(
        `/api/project/address/${address}`
      );
      return response.data;
    },
  });
};

export const useCreateProject = () => {
  return useMutation<Project, Error, CreateProjectParams>({
    mutationFn: async (params) => {
      const response = await http.post<Project>("/api/project", {
        ...params,
      });
      return response.data;
    },
  });
};

export const useUpdateProject = () => {
  return useMutation<Project, Error, UpdateProjectParams>({
    mutationFn: async (params) => {
      const { id } = params;
      const response = await http.put<Project>(`/api/project/${id}`, {
        ...params,
      });
      return response.data;
    },
  });
};

export const useDeleteProject = () => {
  return useMutation<Project, Error, string>({
    mutationFn: async (id) => {
      const response = await http.delete<Project>(`/api/project/${id}`);
      return response.data;
    },
  });
};

// Allowlist Hooks
export const useGetAllowlistEntries = () => {
  return useQuery<AllowlistEntry[], Error>({
    queryKey: ["allowlist"],
    queryFn: async () => {
      const response = await http.get<AllowlistEntry[]>("/api/allowlist");
      return response.data;
    },
  });
};

export const useGetAllowlistEntryById = (id: string) => {
  return useQuery<AllowlistEntry, Error>({
    queryKey: ["allowlist", id],
    queryFn: async () => {
      const response = await http.get<AllowlistEntry>(`/api/allowlist/${id}`);
      return response.data;
    },
  });
};

export const useCreateAllowlistEntry = () => {
  return useMutation<
    CreateAllowlistEntryResponse,
    Error,
    CreateAllowlistEntryParams
  >({
    mutationFn: async (params) => {
      const { poolAddress, userAddresses, status } = params;
      const response = await http.post<CreateAllowlistEntryResponse>(
        "/api/allowlist/bulk",
        { poolAddress, userAddresses, status }
      );
      return response.data;
    },
  });
};

export const useDeleteAllowlistEntry = () => {
  return useMutation<DeleteAllowlistEntryResponse, Error, string>({
    mutationFn: async (id) => {
      const response = await http.delete<DeleteAllowlistEntryResponse>(
        `/api/allowlist/${id}`
      );
      return response.data;
    },
  });
};
