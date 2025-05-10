import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

interface FetchOptions {
  token?: string;
}

export const useFetchData = <T,>(url: string, options?: FetchOptions) => {
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
        console.log("res", response);
        setData(response.data);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          console.log("Fetch cancelled");
          return;
        }
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
        console.log("error", err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url, options?.token, reloadFlag]);

  return { data, loading, error, refetch };
};

export const usePostData = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const postData = async (payload: any): Promise<T> => {
    setLoading(true);
    try {
      const response = await axios.post<T>(url, payload);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      const errorData = err.response?.data;

      // Throw full error info including token if it exists
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

  const getData = useCallback(async () => {
    if (!url) return;

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
      console.log("response", response.data);
    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log("Fetch cancelled");
        return;
      }
      const msg =
        err.response?.data?.message || err.message || "An error occurred";
      setError(msg);
      console.log("error", msg);
    } finally {
      setLoading(false);
    }
  }, [url, options?.token]);
  console.log("url", url);
  // Cancel ongoing request on unmount
  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  return { data, loading, error, refetch: getData };
};
