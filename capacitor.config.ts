import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aerotoad.thud',
  appName: 'Thud',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      androidScaleType: 'CENTER_CROP',
      backgroundColor: '#475569',
    }
  }
};

export default config;
