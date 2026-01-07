import { StyleSheet, Platform, Dimensions } from 'react-native';
import * as Utils from '@/utils';
import { BaseColor } from '@/config';

export default StyleSheet.create({
  card: {
    position: 'relative',
    width: Utils.getWidthDevice() - 20,
    borderRadius: 20,
    padding: 10,
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
    flexDirection: 'column',
    marginTop: 10,
    padding: 10
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  property: {
    marginLeft: 6,
    // flexShrink: 1,
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
