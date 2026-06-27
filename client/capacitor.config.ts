import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.personaldevicecloud.app',
  appName: 'Personal Device Cloud',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'http://10.0.2.2:5173',
    cleartext: true,
    allowNavigation: ['*'],
  },
  plugins: {
    Camera: {
      androidPermissions: ['android.permission.CAMERA'],
    },
    Geolocation: {
      androidPermissions: ['android.permission.ACCESS_FINE_LOCATION', 'android.permission.ACCESS_COARSE_LOCATION'],
    },
    Filesystem: {
      androidPermissions: ['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.WRITE_EXTERNAL_STORAGE'],
    },
    Device: {
      androidPermissions: [],
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0f172a',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
};

export default config;
