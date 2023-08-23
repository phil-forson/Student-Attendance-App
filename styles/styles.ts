import { Dimensions, Platform, StyleSheet } from "react-native";

export const width = Dimensions.get("screen").width;
export const height = Dimensions.get("screen").height;

export const styles = StyleSheet.create({
  autocompleteContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  listView: {
    position: "relative",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
    zIndex: 999,
  },
  container: {
    flex: 1,
  },
  light: {
    fontWeight: "500",
  },
  semiBold: {
    fontWeight: "700",
  },
  bold: {
    fontWeight: "bold",
  },
  my: {
    marginVertical: 10,
  },
  pr20: {
    paddingRight: 20,
  },
  fullWidth: {
    width: width,
  },
  fullHeight: {
    height: height,
  },
  autoHeight: {
    height: "auto",
  },
  textCenter: {
    textAlign: "center",
  },
  smy: {
    marginVertical: 5,
  },
  smx: {
    marginHorizontal: 5,
  },
  mmy: {
    marginVertical: 20,
  },
  mmx: {
    marginHorizontal: 10,
  },
  rounded: {
    borderRadius: 10,
  },
  headerView: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Platform.OS === "android" ? 13 : 20,
    paddingVertical: Platform.OS === "android" ? 0 : 10,
  },
  fullImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  itemsCenter: {
    alignItems: "center",
  },
  justifyAround: {
    justifyContent: "space-around",
  },
  itemsStart: {
    alignItems: "flex-start",
  },
  itemsEnd: {
    alignItems: "flex-end",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "android" ? 30 : 20,
  },
  h30: {
    height: 30,
  },
  separator: {
    height: 10,
  },
  largeText: {
    fontSize: 25,
  },
  autoWidth: {
    width: "auto",
  },

  column: {
    flexShrink: 1,
  },
  transBg: {
    backgroundColor: "transparent",
  },
  bigText: {
    fontSize: 20,
  },
  mediumText: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 12,
  },
  content: {
    flex: 6,
  },
  signUp: {
    width: 10,
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  bottom: {
    marginBottom: 0,
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  circle: {
    borderRadius: 50,
    padding: 15,
  },
  shadow: {
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  courseContainer: {
    marginVertical: 20,
  },
  addCourseIcon: {
    position: "absolute",
    bottom: 15,
    right: 20,
  },
  courseDeetsIcon: {
    position: "absolute",
    bottom: 60,
    right: 20,
  },
  flexOne: {
    flex: 1,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerCell: {
    padding: 10,
    borderWidth: 2,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableCell: {
    padding: 10,
    borderWidth: 2,
    flex: 1,
    textAlign: "left",
  },
  sheetShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
