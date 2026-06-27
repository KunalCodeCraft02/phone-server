import { Geolocation } from '@capacitor/geolocation';

export const getCurrentPosition = async () => {
  const permission = await Geolocation.checkPermissions();
  if (permission.location !== 'granted') {
    await Geolocation.requestPermissions();
  }
  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 10000,
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    speed: position.coords.speed,
    accuracy: position.coords.accuracy,
    timestamp: new Date().toISOString(),
  };
};

export const watchPosition = (callback) => {
  return Geolocation.watchPosition(
    { enableHighAccuracy: true, timeout: 10000 },
    (position) => {
      if (position) {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        });
      }
    }
  );
};

export const clearWatch = (watchId) => {
  Geolocation.clearWatch({ id: watchId });
};
