import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  media: {
    width: '100%',
    height: '100%',
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
