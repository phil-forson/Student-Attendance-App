import { Dimensions, StyleSheet } from "react-native";

export const width= Dimensions.get("screen").width
export const height= Dimensions.get("screen").height

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  light: {
    fontWeight: "500"
  },
  semiBold: {
    fontWeight: "700"
  },
  bold: {
    fontWeight: "bold",
  },
  my: {
    marginVertical: 10,
  },
  fullWidth: {
    width: width
  },
  fullHeight: {
    height: height
  },
  autoHeight: {
    height: 'auto'
  },
  textCenter: {
    textAlign: 'center'
  },
  smy: {
    marginVertical: 5,
  },
  smx: {
    marginHorizontal: 5
  },
  mmy: {
    marginVertical: 10
  },
  mmx: {
    marginHorizontal: 10
  },
  rounded: {
    borderRadius: 10,
  },
  headerView: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flexRow: {
    flexDirection: 'row'
  },
  flexColumn: {
    flexDirection: 'column'
  },
  justifyBetween: {
    justifyContent: 'space-between'
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  itemsCenter: {
    alignItems: 'center'
  },
  justifyAround: {
    justifyContent: 'space-around'
  },
  itemsStart : {
    alignItems: 'flex-start'
  },
  itemsEnd: {
    alignItems: 'flex-end'
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  largeText: {
    fontSize: 25
  },
  autoWidth: {
    width: 'auto'
  },
  transBg: {
    backgroundColor: 'transparent'
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
    position: 'absolute',
    bottom: 15,
    right: 20
  },
  flexOne: {
    flex: 1
  }
});
