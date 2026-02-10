import { StyleSheet } from 'react-native';
import { BaseColor } from '@/config';
import { heightTabView } from '@/utils';

export default StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  thumb: {
    width: 50,
    height: 50,
    marginRight: 10
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  contentFilterBottom: {
    paddingVertical: 16,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  contentSwipeDown: {
    paddingTop: 10,
    alignItems: 'center',
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
  },
  contentActionModalBottom: {
    flexDirection: 'column',
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  image: {
    width: 18,
    height: 18,
    marginRight: 8,
    paddingTop: 2,
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
