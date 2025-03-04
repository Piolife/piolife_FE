import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiConfig } from "@/services/core/types";

const baseUrl: string = "https://ola-8ps1.onrender.com/api/v1";
const convertCurrencyUrl = "https://v6.exchangerate-api.com/v6";

// Helper function to get the token from AsyncStorage
const getToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem("token");
  return token || "";
};

export const apiGet = async <T = any,>(
  path: string
): Promise<AxiosResponse<T>> => {
  const result = await axios.get<T>(`${convertCurrencyUrl}${path}`);
  return result;
};
export const apiGetRequest = async <T = any,>(
  path: string
): Promise<AxiosResponse<T>> => {
  const token = await getToken();
  const config: any = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.get<T>(`${baseUrl}${path}`, config);
  return result;
};

export const apiPatch = async <T = any,>(
  path: string,
  body: any = {},
  token: string | null
): Promise<AxiosResponse<T>> => {
  const config: ApiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Include common headers here if applicable
    },
  };
  return await axios.patch<T>(`${baseUrl}${path}`, body, config);
};
