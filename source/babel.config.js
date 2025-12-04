module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          app: './app',
          '@/actions': './app/actions',
          '@/assets': './app/assets',
          '@/components': './app/components',
          '@/config': './app/config',
          '@/data': './app/data',
          '@/navigation': './app/navigation',
          '@/screens': './app/screens',
          '@/selectors': './app/selectors',
          '@/store': './app/store',
          '@/utils': './app/utils',
        },
      },
    ],
  ],
};
