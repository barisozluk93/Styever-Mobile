import { StyleSheet, Platform, Dimensions } from 'react-native';
import * as Utils from '@/utils';
import { BaseColor } from '@/config';

export default StyleSheet.create({
  card: {
    position: 'relative',
    width: Utils.getWidthDevice() - 20,
    height: (Utils.heightTabView() - 60) / 4 + 35,
    borderRadius: 20,
    padding: 10,
  },
  checkbox: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BaseColor.darkgreenColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderWidth: StyleSheet.hairlineWidth + 1,
    borderColor: BaseColor.darkgreenColor,
  },
  title: {
    textAlign: 'center',
  },
  price: {
    textAlign: 'center',
    marginVertical: 5,
    color: BaseColor.darkgreenColor,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BaseColor.darkgreenColor,
    marginVertical: 5,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',        // 👈 satır başına 2 tane
    marginBottom: 5,
  },
  property: {
    marginLeft: 6,
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
