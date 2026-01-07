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
  imageOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  subHeaderText: {
    marginTop: 6,
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});
