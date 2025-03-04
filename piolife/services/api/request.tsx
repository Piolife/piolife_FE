import { apiPatch } from "@/utils/axios/api";

export const submitKyc = async (formData: any, token: string | null) => {
  const response = await apiPatch<{ message: string; token: string | null }>(
    `/profile/kyc`,
    formData,
    token
  );
  return response;
};
