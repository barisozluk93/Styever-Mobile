import { StyleSheet } from 'react-native';
import { BaseColor } from '@/config';
import { getWidthDevice } from '@/utils';

export default StyleSheet.create({
  card: {
    position: 'relative',
    width: getWidthDevice() - 20,
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10
  },
  selected: {
    borderWidth: StyleSheet.hairlineWidth + 1,
    borderColor: BaseColor.darkgreenColor,
  },
  title: {
    textAlign: 'center',
    marginVertical: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BaseColor.darkgreenColor,
    marginVertical: 5,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    textAlign: 'center',
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  propertyItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 10,
  },
  property: {
    // marginLeft: 10,
    flexShrink: 1,
  },
  trialBadge: {
    position: 'absolute',
    bottom: -16,                   
    alignSelf: 'center', 
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: BaseColor.darkgreenColor,
    borderWidth: 1,
    borderColor: BaseColor.darkgreenColor,
    zIndex: 10,
  },
  trialText: {
    color: BaseColor.whiteColor,
    textAlign: 'center',
  },
});
