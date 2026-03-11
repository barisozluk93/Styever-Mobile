import { StyleSheet } from 'react-native';
import { BaseColor } from '@/config';

export default StyleSheet.create({
  contain: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    // paddingHorizontal: 20,
  },
  viewStore: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  countryImg: {
    width: 10,
    height: 10,
    marginRight: 2,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600"
  }
});
