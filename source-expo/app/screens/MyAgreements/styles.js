import {Platform,StyleSheet} from 'react-native';

export default StyleSheet.create({
  kickerRow:{flexDirection:'row',alignItems:'center',marginBottom:6},
  kickerLine:{width:34,height:3,borderRadius:2,marginRight:12},
  flex:{
    flex:1,
  },

  content:{
    paddingHorizontal:20,
    paddingTop:30,
    paddingBottom:40,
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

  centerState:{
    minHeight:220,
    alignItems:'center',
    justifyContent:'center',
  },

  stateCard:{
    minHeight:180,
    borderWidth:1,
    borderRadius:14,
    padding:22,
    alignItems:'center',
    justifyContent:'center',
  },

  stateText:{
    textAlign:'center',
    marginTop:12,
    lineHeight:20,
  },

  emptyTitle:{
    marginTop:12,
    textAlign:'center',
  },

  retryButton:{
    borderWidth:1,
    borderRadius:8,
    paddingHorizontal:18,
    paddingVertical:9,
    marginTop:16,
  },

  card:{
    borderWidth:1,
    borderRadius:14,
    padding:16,
    marginBottom:12,

    ...Platform.select({
      ios:{
        shadowColor:'#000',
        shadowOpacity:0.03,
        shadowRadius:8,
        shadowOffset:{width:0,height:3},
      },
      android:{
        elevation:1,
      },
    }),
  },

  cardTop:{
    flexDirection:'row',
    alignItems:'flex-start',
  },

  cardContent:{
    flex:1,
    paddingRight:10,
  },

  badges:{
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop:10,
  },

  badge:{
    minHeight:26,
    borderRadius:7,
    justifyContent:'center',
    paddingHorizontal:9,
    paddingVertical:4,
    marginRight:6,
    marginBottom:6,
  },

  date:{
    marginTop:4,
  },

  viewButton:{
    minHeight:34,
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:12,
  },

  details:{
    borderTopWidth:StyleSheet.hairlineWidth,
    marginTop:15,
    paddingTop:15,
  },

  detailsTitle:{
    marginBottom:10,
  },

  snapshot:{
    fontSize:13.5,
    lineHeight:21,
  },
});
