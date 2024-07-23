import { useState, useEffect } from 'react'

const useFetchJson = (url: string, options?: RequestInit) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('response error');
        }
        const eventData = await response.json();
        setData(eventData);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  // Only return data if it's not empty
  return { data: data.length > 0 ? data : null, loading, error };
};

const findData = (data: any[], id: string) => {
  return data.find((item) => item.id === id)
}

export { useFetchJson, findData }
