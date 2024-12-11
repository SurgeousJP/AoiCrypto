import http from "@/http/http";
import { UploadImageParams, UploadImageResponse } from "@/model/ApiModel";
import { useMutation } from "@tanstack/react-query";

export const useUploadImage = () => {
  return useMutation<UploadImageResponse, Error, UploadImageParams>({
    mutationFn: async ({
      imageBase64,
      name,
      expiration,
    }: UploadImageParams) => {
      const formData = new FormData();
      formData.append("image", imageBase64);
      if (name) formData.append("name", name);
      if (expiration) formData.append("expiration", expiration.toString());

      const response = await http.post<UploadImageResponse>(
        "/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
  });
};
