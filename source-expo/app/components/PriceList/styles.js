import { StyleSheet, Platform } from 'react-native';
import * as Utils from '@/utils';

export default StyleSheet.create({
  content: {
    padding: 10,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 3,
        shadowRadius: 3,
      },
    }),
  },
  container: {
  },
  viewProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLeft: { flex: 1, height: '100%' },
  viewRight: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  viewFooter: {
    
  },
  description: {
    marginTop: 30,
  },
  footer: {
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 8,
},
});
