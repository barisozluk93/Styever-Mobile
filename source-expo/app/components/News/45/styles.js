import { StyleSheet } from 'react-native';
import * as Utils from '@/utils';
import { BaseColor } from '@/config';

export default StyleSheet.create({
  imageBackground: {
    height: ((Utils.getWidthDevice() - 40) * 3) / 4,
    width: '100%',
  },
  viewBackground: {
    flex: 1,
    // alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: 10,
  },
  viewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  styleThumb: {
    borderWidth: 1,
    borderColor: BaseColor.whiteColor,
  },
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  stats: {
    flexDirection: "row",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  statText: {
    marginLeft: 6,
    fontSize: 16
  },
});
