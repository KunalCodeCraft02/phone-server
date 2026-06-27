import { useEffect, useCallback } from 'react';
import { getSocket, onSocketEvent, offSocketEvent } from '../services/socket';

export default function useSocket(event, callback) {
  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const socket = getSocket();
    if (socket && event) {
      onSocketEvent(event, stableCallback);
      return () => offSocketEvent(event, stableCallback);
    }
  }, [event, stableCallback]);
}
