import { useEffect, useState } from 'react';

export function useRealtimeStatus(userId: string) {
  const [status, setStatus] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let eventSource: EventSource | null = null;
    let pollingInterval: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource(`/api/events?userId=${userId}`);
        
        eventSource.onopen = () => {
          setIsConnected(true);
          console.log('SSE connected');
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'status') {
              setStatus(data.payload);
            }
          } catch (e) {
            console.error('Failed to parse SSE message:', e);
          }
        };

        eventSource.onerror = () => {
          console.log('SSE error, falling back to polling');
          eventSource?.close();
          setIsConnected(false);
          startPolling();
        };
      } catch (e) {
        console.error('Failed to connect SSE:', e);
        startPolling();
      }
    };

    const startPolling = () => {
      if (pollingInterval) return;
      
      const poll = async () => {
        try {
          const res = await fetch(`/api/status?userId=${userId}`);
          if (res.ok) {
            const data = await res.json();
            setStatus(data);
          }
        } catch (e) {
          console.error('Polling error:', e);
        }
      };

      // Initial fetch
      poll();
      
      pollingInterval = setInterval(poll, 5000); // Poll every 5 seconds
    };

    // Try SSE first, but fall back to polling immediately for reliability
    startPolling();

    return () => {
      eventSource?.close();
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [userId]);

  return { status, isConnected };
}

export function useRealtimeTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (e) {
        console.error('Failed to fetch tasks:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Poll for task updates
    const interval = setInterval(fetchTasks, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const refetch = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
    }
  };

  return { tasks, loading, refetch };
}

export function usePendingSyncs() {
  const [syncs, setSyncs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSyncs = async () => {
      try {
        const res = await fetch('/api/sync');
        if (res.ok) {
          const data = await res.json();
          setSyncs(data);
        }
      } catch (e) {
        console.error('Failed to fetch syncs:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchSyncs();

    // Poll for sync updates
    const interval = setInterval(fetchSyncs, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { syncs, loading };
}
