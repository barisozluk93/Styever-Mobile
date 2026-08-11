import {
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';

const {width,height}=Dimensions.get('window');

const isTablet=width>=768;

export default StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:'#062E25',
  },

  image:{
    flex:1,
    width:'100%',
    minHeight:height,
  },

  overlay:{
    ...StyleSheet.absoluteFillObject,
  },

  safeArea:{
    flex:1,
  },

  contentWrapper:{
    flex:1,
    justifyContent:'center',
    paddingHorizontal:isTablet?48:24,
    paddingTop:30,
    paddingBottom:45,
  },

  textBox:{
    width:'100%',
    maxWidth:isTablet?620:520,
  },

  eyebrow:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:18,
  },

  eyebrowLogo:{
    width:isTablet?34:28,
    height:isTablet?20:17,
    marginRight:10,
  },

  eyebrowText:{
    flexShrink:1,
    color:'#FFFFFF',
    fontSize:isTablet?12:10,
    lineHeight:isTablet?18:15,
    fontWeight:'700',
    letterSpacing:isTablet?2.2:1.6,
    textTransform:'uppercase',
  },

  title:{
    color:'#FFFFFF',
    fontSize:isTablet?58:42,
    lineHeight:isTablet?66:49,
    fontWeight:'800',
    letterSpacing:isTablet?-1.5:-1,
  },

  description:{
    color:'rgba(255,255,255,0.92)',
    fontSize:isTablet?18:15,
    lineHeight:isTablet?29:24,
    marginTop:isTablet?24:18,
    maxWidth:560,
  },

  buttonRow:{
    flexDirection:'row',
    alignItems:'center',
    flexWrap:'wrap',
    marginTop:isTablet?32:26,
  },

  primaryButton:{
    height:56,
    minWidth:isTablet?185:165,
    paddingHorizontal:24,
    borderRadius:9,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',

    ...Platform.select({
      ios:{
        shadowColor:'#000',
        shadowOpacity:0.18,
        shadowRadius:10,
        shadowOffset:{
          width:0,
          height:4,
        },
      },
      android:{
        elevation:4,
      },
    }),
  },

  primaryButtonText:{
    color:'#FFFFFF',
    fontSize:16,
    fontWeight:'700',
    marginRight:12,
  },

  secondaryButton:{
    height:56,
    minWidth:135,
    paddingHorizontal:24,
    marginLeft:12,
    borderRadius:9,
    backgroundColor:'#FFFFFF',
    alignItems:'center',
    justifyContent:'center',

    ...Platform.select({
      ios:{
        shadowColor:'#000',
        shadowOpacity:0.12,
        shadowRadius:8,
        shadowOffset:{
          width:0,
          height:3,
        },
      },
      android:{
        elevation:3,
      },
    }),
  },

  secondaryButtonText:{
    fontSize:16,
    fontWeight:'600',
  },

  note:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:isTablet?30:25,
    maxWidth:550,
  },

  noteIcon:{
    width:42,
    height:42,
    borderRadius:21,
    backgroundColor:'rgba(255,255,255,0.13)',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.18)',
    alignItems:'center',
    justifyContent:'center',
    marginRight:13,
  },

  noteText:{
    flex:1,
    color:'rgba(255,255,255,0.90)',
    fontSize:14,
    lineHeight:20,
  },

});