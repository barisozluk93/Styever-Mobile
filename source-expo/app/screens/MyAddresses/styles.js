import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  content:{
    paddingHorizontal:20,
    paddingTop:30,
    paddingBottom:40,
    flexGrow:1,
  },

  heading:{
    marginBottom:22,
  },

  kickerRow:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:6,
  },

  kickerLine:{
    width:34,
    height:3,
    borderRadius:2,
    marginRight:12,
  },

  kicker:{
    fontSize:10,
    lineHeight:14,
    fontWeight:'800',
    letterSpacing:1.5,
  },

  pageTitle:{
    fontSize:22,
    lineHeight:28,
    fontWeight:'700',
    marginBottom:6,
  },

  description:{
    fontSize:14,
    lineHeight:20,
    fontWeight:'400',
  },

  addButton:{
    height:46,
    borderWidth:1,
    borderRadius:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:16,
  },

  addText:{
    fontSize:13,
    fontWeight:'700',
    marginLeft:8,
  },

  card:{
    marginBottom:12,
  },

  empty:{
    minHeight:180,
    borderWidth:1,
    borderRadius:14,
    padding:22,
    alignItems:'center',
    justifyContent:'center',
  },

  emptyTitle:{
    fontSize:14,
    fontWeight:'700',
    marginTop:12,
    textAlign:'center',
  },

  loading:{
    ...StyleSheet.absoluteFillObject,
    alignItems:'center',
    justifyContent:'center',
  },
});
