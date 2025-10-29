module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@screens': './src/screens',
          '@lessons': './src/screens/lessons',
          '@contexts': './src/contexts',
          '@components': './src/components',
          '@constants': './src/constants',
          '@services': './src/services',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@icons': './src/assets/icons',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
