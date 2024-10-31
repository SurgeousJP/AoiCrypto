import axios, { AxiosResponse } from "axios";
import {
  FileUploadResponse,
  ProofCalculationRequest,
  ProofCalculationResponse,
  VerifyRequest,
  VerifyResponse,
} from "../models/SalaryAPIModels";

class SalaryAPI {
  private baseURL: string;

  constructor() {
    // this.baseURL = "https://zk-salary-production.up.railway.app";
    this.baseURL = "http://10.0.2.2:3000";
  }

  async uploadFile(file: any): Promise<AxiosResponse<FileUploadResponse>> {
    const formData = new FormData();

    formData.append("file", file);

    return await axios.post<FileUploadResponse>(
      `${this.baseURL}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  async calculateProof(
    requestData: ProofCalculationRequest
  ): Promise<AxiosResponse<ProofCalculationResponse>> {
    return await axios.post<ProofCalculationResponse>(
      `${this.baseURL}/proofCalculate`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async verifyProof(
    requestData: VerifyRequest
  ): Promise<AxiosResponse<VerifyResponse>> {
    return await axios.post<VerifyResponse>(
      `${this.baseURL}/verify`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export default new SalaryAPI();
