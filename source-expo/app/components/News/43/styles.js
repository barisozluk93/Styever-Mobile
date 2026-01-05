import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  image: {
    width: 120,
    height: 168,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
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
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  name: {
    fontSize: 16,
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  label: {
    color: "#6B7280",
    fontSize: 12,
  },

  value: {
    fontSize: 12,
    marginLeft: 6,
  },

  iconValue: {
    flexDirection: "row",
    alignItems: "center",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  footerText: {
    marginLeft: 6,
    fontSize: 12,
  },
});

