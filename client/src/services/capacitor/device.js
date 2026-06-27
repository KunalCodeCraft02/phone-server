import { Device } from '@capacitor/device';

export const getDeviceInfo = async () => {
  const info = await Device.getInfo();
  const battery = await Device.getBatteryInfo();
  const language = await Device.getLanguageCode();
  return {
    deviceName: info.name || info.model,
    model: info.model,
    platform: info.platform,
    operatingSystem: info.operatingSystem,
    osVersion: info.osVersion,
    webViewVersion: info.webViewVersion,
    batteryLevel: battery.level,
    isCharging: battery.isCharging,
    languageCode: language.value,
  };
};
