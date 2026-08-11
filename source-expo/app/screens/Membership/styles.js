import {Platform,StyleSheet} from 'react-native';

export default StyleSheet.create({
  kickerRow:{flexDirection:'row',alignItems:'center',marginBottom:6},
  kickerLogo:{width:28,height:18,marginRight:10},
  scrollContent:{
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

  planCard:{
    position:'relative',
    borderWidth:1.5,
    borderRadius:16,
    paddingHorizontal:20,
    paddingTop:22,
    paddingBottom:20,

    ...Platform.select({
      ios:{
        shadowColor:'#000',
        shadowOpacity:0.035,
        shadowRadius:10,
        shadowOffset:{width:0,height:4},
      },
      android:{
        elevation:1,
      },
    }),
  },

  preferredBadge:{
    position:'absolute',
    top:-12,
    alignSelf:'center',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:12,
    paddingVertical:5,
    borderRadius:14,
    zIndex:5,
  },

  preferredText:{
    color:'#FFFFFF',
    fontSize:9,
    lineHeight:12,
    fontWeight:'800',
    letterSpacing:0.4,
    marginRight:5,
  },

  planHeader:{
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'space-between',
    marginBottom:18,
  },

  planHeaderText:{
    flex:1,
    paddingRight:14,
  },

  planTitle:{
    fontSize:20,
    lineHeight:25,
    fontWeight:'800',
    marginBottom:6,
  },

  price:{
    fontSize:18,
    lineHeight:23,
    fontWeight:'800',
  },

  activeIcon:{
    width:38,
    height:38,
    borderRadius:12,
    alignItems:'center',
    justifyContent:'center',
  },

  properties:{
    marginBottom:8,
  },

  propertyRow:{
    flexDirection:'row',
    alignItems:'flex-start',
    marginBottom:11,
  },

  checkIcon:{
    width:16,
    height:16,
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center',
    marginTop:2,
    marginRight:9,
  },

  propertyText:{
    flex:1,
    fontSize:13.5,
    lineHeight:20,
    opacity:0.72,
  },

  divider:{
    height:StyleSheet.hairlineWidth,
    marginVertical:15,
  },

  dateGrid:{
    flexDirection:'row',
    marginHorizontal:-5,
  },

  dateBox:{
    flex:1,
    marginHorizontal:5,
    padding:13,
    borderRadius:12,
    backgroundColor:'rgba(0,0,0,0.025)',
  },

  dateLabelRow:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:7,
  },

  dateLabel:{
    marginLeft:7,
    fontSize:11,
    lineHeight:15,
    fontWeight:'700',
  },

  dateValue:{
    fontSize:12.5,
    lineHeight:18,
    fontWeight:'600',
  },

  statusBox:{
    marginTop:16,
    borderRadius:12,
    padding:14,
  },

  statusHeader:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:6,
  },

  statusTitle:{
    marginLeft:7,
    fontSize:12,
    lineHeight:16,
    fontWeight:'800',
  },

  statusText:{
    fontSize:12.5,
    lineHeight:18,
  },

  expiredBox:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:16,
    padding:13,
    borderRadius:12,
    backgroundColor:'rgba(180,35,24,0.08)',
  },

  expiredText:{
    color:'#B42318',
    marginLeft:8,
    fontSize:12.5,
    lineHeight:18,
    fontWeight:'700',
  },

  actionButton:{
    marginTop:18,
  },

  manageHint:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:16,
    borderRadius:14,
    padding:15,
  },

  manageHintText:{
    flex:1,
    paddingRight:12,
  },

  manageTitle:{
    fontSize:13.5,
    lineHeight:19,
    fontWeight:'700',
    marginBottom:3,
  },

  manageDescription:{
    fontSize:12.5,
    lineHeight:18,
  },
});
