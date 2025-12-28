import { useState, useEffect, useCallback, useRef } from "react";
import axios, { AxiosRequestHeaders } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface FetchOptions {
  token?: string;
}

export const useFetchData = <T,>(
  url: string | null,
  options?: FetchOptions
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState<number>(0); // triggers refetch

  const refetch = () => setReloadFlag((prev) => prev + 1);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = options?.token
          ? { Authorization: `Bearer ${options.token}` }
          : {};

        const response = await axios.get<T>(url, {
          signal: controller.signal,
          headers,
        });

        setData(response.data);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          return;
        }
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url, options?.token, reloadFlag]);

  return { data, loading, error, refetch };
};

export const usePostData = <T,>(url: string, withAuth: boolean = false) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const postData = async (payload: any): Promise<T> => {
    setLoading(true);

    try {
      let headers: any = {};

      if (withAuth) {
        const userString = await AsyncStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const token = user?.token;

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await axios.post<T>(url, payload, { headers });
      console.log(response, "responseuuu");
      setData(response.data);
      return response.data;
    } catch (err: any) {
      const errorData = err.response?.data;
      console.log(err, "err");
      throw {
        message: errorData?.message || "Something went wrong",
        otpToken: errorData?.otpToken,
        statusCode: errorData?.statusCode,
      };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, postData };
};
export const useGetData = <T,>(url: string, options?: FetchOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const getData = useCallback(async (): Promise<T | null> => {
    if (!url) return null;

    controllerRef.current = new AbortController();
    setLoading(true);
    setError(null); // Optional: reset error on each fetch

    try {
      const headers = options?.token
        ? { Authorization: `Bearer ${options.token}` }
        : {};

      const response = await axios.get<T>(url, {
        signal: controllerRef.current.signal,
        headers,
      });

      setData(response.data);

      return response.data;
    } catch (err: any) {
      if (axios.isCancel(err)) {
        return null;
      }
      const msg =
        err.response?.data?.message || err.message || "An error occurred";
      setError(msg);

      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options?.token]);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  return { data, loading, error, refetch: getData };
};
export const usePatchData = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const patchData = async (payload: any): Promise<T> => {
    setLoading(true);
    try {
      // Retrieve token from AsyncStorage
      const user = await AsyncStorage.getItem("user");
      const token = user ? JSON.parse(user).token : null;

      const response = await axios.patch<T>(url, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      setData(response.data);
      return response.data;
    } catch (err: any) {
      console.log("err", err);
      const errorData = err.response?.data;
      throw {
        message: errorData?.message || "Something went wrong",
        statusCode: errorData?.statusCode,
      };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, patchData };
};
