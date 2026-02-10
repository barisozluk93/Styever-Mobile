import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // burayı aç/kıs
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  textBox: {
    maxWidth: 420,
    backgroundColor: 'rgba(0,0,0,0.10)',
    padding: 24,
    borderRadius: 12,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth
  },
});
