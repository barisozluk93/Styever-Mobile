import {Platform,StyleSheet} from 'react-native';

export default StyleSheet.create({
  card:{
    position:'relative',
    width:'100%',
    minHeight:240,
    borderWidth:1,
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

  headerRow:{
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'space-between',
    marginBottom:18,
  },

  headerText:{
    flex:1,
    paddingRight:14,
  },

  title:{
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

  selectCircle:{
    width:24,
    height:24,
    borderRadius:12,
    borderWidth:1.5,
    alignItems:'center',
    justifyContent:'center',
  },

  properties:{
    flex:1,
  },

  propertyItem:{
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

  property:{
    flex:1,
    fontSize:13.5,
    lineHeight:20,
    opacity:0.72,
  },

  trialBadge:{
    alignSelf:'flex-start',
    marginTop:5,
    paddingHorizontal:11,
    paddingVertical:5,
    borderRadius:10,
  },

  trialText:{
    color:'#FFFFFF',
    fontSize:10,
    lineHeight:13,
    fontWeight:'700',
  },
});
