import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchData = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return; // Prevent fetching if URL is empty

    const controller = new AbortController(); // To handle component unmount
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<T>(url, { signal: controller.signal });
        setData(response.data);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          console.log("Fetch cancelled");
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

    return () => controller.abort(); // Cleanup on unmount
  }, [url]);

  return { data, loading, error };
};

export const usePostData = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postData = async (payload: any) => {
    setLoading(true);
    setError(null);
    console.log("payload", payload);
    try {
      const response = await axios.post<T>(url, payload);
      setData(response.data);
      console.log("set", response);
      return response.data; // Return response for further use
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
      console.log("err", err.response?.data?.message);
      console.log("url", url);

      throw err; // Rethrow error if needed
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};
