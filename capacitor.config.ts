import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.android.bima.citapps_custody',
  appName: '(CUSTODY) CIT Apps',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    // "url": "http://192.168.1.3:8100",
    cleartext: true;
  },
  plugins: {
    // LiveUpdate: {
    //   appId: "e2725b51-aba2-462c-b6da-c7521e911c8b",
    //   // autoDeleteBundles: undefined,
    //   defaultChannel: 'development',
    //   // httpTimeout: undefined,
    //   // publicKey: '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDodf1SD0OOn6hIlDuKBza0Ed0OqtwyVJwiyjmE9BJaZ7y8ZUfcF+SKmd0l2cDPM45XIg2tAFux5n29uoKyHwSt+6tCi5CJA5Z1/1eZruRRqABLonV77KS3HUtvOgqRLDnKSV89dYZkM++NwmzOPgIF422mvc+VukcVOBfc8/AHQIDAQAB-----END PUBLIC KEY-----',
    //   readyTimeout: 10000,
    //   // serverDomain: undefined,
    // }
  }
};

export default config;
