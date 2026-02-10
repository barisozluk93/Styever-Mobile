import { StyleSheet } from 'react-native';
import { BaseColor } from '@/config';

export default StyleSheet.create({
  profileImage: {
    position: 'absolute',
    zIndex: 100,
  },
  headerStyle: {
    height: 'auto',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // zIndex: 200
  },
  headerImageStyle: {
    height: 250,
    width: '100%',
    top: 0,
    alignSelf: 'center',
    position: 'absolute',
    // zIndex: 999,
    paddingBottom: 20,
  },
  // imgBanner: {
  //     width: "100%",
  //     height: 250,
  //     position: "absolute"
  // },
  lineSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateLine: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  contentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BaseColor.dividerColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 5,
  },
  tabbar: {
    backgroundColor: 'white',
    height: 40,
  },
  tab: {
    width: 130,
  },
  label: {
    fontWeight: '400',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  contentInforAction: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  lineWorkHours: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: BaseColor.dividerColor,
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginHorizontal: 20,
    // borderBottomWidth: 1,
    borderColor: BaseColor.dividerColor,
    marginBottom: 30,
  },
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8
  },
  commentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderColor: BaseColor.dividerColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stats: {
    flexDirection: "row",
  },
  statItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20
  },
  statText: {
    marginLeft: 6,
    fontSize: 16
  },
  contentDescription: {
    marginHorizontal: 20,
    borderColor: BaseColor.dividerColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  viewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    bottom: 0,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  candleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  candleInfoText: {
    marginLeft: 12,
  },
  candleWrapper: {
    width: 15,
    height: 50,
    position: 'relative',
  },

  wax: {
    width: '100%',
    height: 50,
    backgroundColor: BaseColor.darkgreenColor,
    borderRadius: 6,
  },

  wick: {
    position: 'absolute',
    top: -6,
    left: '50%',
    width: 2,
    height: 6,
    backgroundColor: '#333',
    transform: [{ translateX: -1 }],
  },

  flame: {
    position: 'absolute',
    top: -20,
    left: '50%',
    width: 10,
    height: 20,
    backgroundColor: '#ff8c00',
    borderRadius: 10,
    transform: [{ translateX: -5 }],
    opacity: 0.9,
  },
});
