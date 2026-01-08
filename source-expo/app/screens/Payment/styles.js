import { StyleSheet } from 'react-native';
import { BaseColor } from '@/config';

export default StyleSheet.create({
  item: {
    paddingVertical: 15,
    borderBottomColor: BaseColor.dividerColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trialBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: BaseColor.darkgreenColor,
    borderWidth: 1,
    borderColor: BaseColor.darkgreenColor,
    marginBottom: 20
  },
  trialText: {
    color: BaseColor.whiteColor,
    textAlign: 'center',
  },
});
