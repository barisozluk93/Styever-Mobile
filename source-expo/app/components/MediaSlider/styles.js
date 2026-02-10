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
  youtubeContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  youtubeImage: {
    width: '100%',
    height: '100%',
  },

  youtubeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  youtubePlay: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
