import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  kickerRow:{flexDirection:'row',alignItems:'center',marginBottom:6},
  kickerLine:{width:34,height:3,borderRadius:2,marginRight:12},
  listContent:{
    paddingHorizontal:20,
    paddingTop:30,
    paddingBottom:20,
  },

  heading:{
    marginBottom:22,
  },

  kicker:{
    fontSize:10,
    lineHeight:14,
    fontWeight:'800',
    letterSpacing:1.5,
    marginBottom:0,
  },

  title:{
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

  voucherOption:{
    marginBottom:12,
  },

  voucherGroup:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:14,
  },

  voucherInputWrap:{
    flex:1,
    marginRight:10,
  },

  voucherInput:{
    width:'100%',
  },

  error:{
    color:'#FF1744',
    fontSize:11.5,
    marginTop:5,
  },

  voucherSearchButton:{
    width:56,
    height:56,
    borderRadius:12,
    alignItems:'center',
    justifyContent:'center',
  },

  planCard:{
    marginBottom:14,
  },

  bottomBar:{
    paddingHorizontal:20,
    paddingTop:10,
    paddingBottom:16,
  },
});
