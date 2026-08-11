import {Platform,StyleSheet} from 'react-native';

export default StyleSheet.create({
  kickerRow:{flexDirection:'row',alignItems:'center',marginBottom:6},
  kickerLogo:{width:28,height:18,marginRight:10},
  scrollContent:{
    flexGrow:1,
    paddingHorizontal:20,
    paddingTop:30,
    paddingBottom:36,
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

  content:{},

  loading:{
    minHeight:220,
    alignItems:'center',
    justifyContent:'center',
  },

  loadingText:{
    marginTop:12,
  },

  card:{
    borderWidth:1,
    borderRadius:16,
    marginBottom:12,
    overflow:'hidden',
    ...Platform.select({
      ios:{
        shadowColor:'#000',
        shadowOpacity:0.025,
        shadowRadius:8,
        shadowOffset:{width:0,height:3},
      },
      android:{
        elevation:1,
      },
    }),
  },

  questionRow:{
    minHeight:78,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:16,
    paddingVertical:15,
  },

  numberBadge:{
    width:38,
    height:38,
    borderRadius:12,
    alignItems:'center',
    justifyContent:'center',
    marginRight:13,
  },

  numberText:{
    fontSize:11,
    lineHeight:15,
    fontWeight:'800',
    letterSpacing:0.5,
  },

  question:{
    flex:1,
    fontSize:15,
    lineHeight:21,
    paddingRight:12,
  },

  toggleButton:{
    width:32,
    height:32,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  },

  answerWrapper:{
    position:'relative',
    flexDirection:'row',
    borderTopWidth:StyleSheet.hairlineWidth,
    paddingHorizontal:18,
    paddingVertical:18,
    paddingLeft:22,
  },

  answerAccent:{
    width:3,
    borderRadius:2,
    marginRight:12,
  },

  answerContent:{
    flex:1,
  },

  answer:{
    color:'#626A66',
    fontSize:13.5,
    lineHeight:21,
  },

  htmlParagraph:{
    marginTop:0,
    marginBottom:10,
    color:'#626A66',
    fontSize:13.5,
    lineHeight:21,
  },

  htmlSpan:{
    color:'#626A66',
    fontSize:13.5,
    lineHeight:21,
  },

  htmlStrong:{
    fontWeight:'700',
  },

  htmlEm:{
    fontStyle:'italic',
  },

  htmlList:{
    marginTop:0,
    marginBottom:10,
    paddingLeft:18,
  },

  htmlListItem:{
    color:'#626A66',
    fontSize:13.5,
    lineHeight:21,
    marginBottom:5,
  },

  htmlLink:{
    fontWeight:'700',
    textDecorationLine:'underline',
  },

  emptyCard:{
    borderWidth:1,
    borderRadius:18,
    padding:26,
    alignItems:'center',
    marginTop:8,
  },

  emptyIcon:{
    width:54,
    height:54,
    borderRadius:18,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:14,
  },

  emptyTitle:{
    textAlign:'center',
    marginBottom:7,
  },

  emptyText:{
    textAlign:'center',
    lineHeight:20,
  },

  footerNote:{
    flexDirection:'row',
    alignItems:'center',
    borderRadius:14,
    paddingHorizontal:15,
    paddingVertical:13,
    marginTop:6,
  },

  footerText:{
    flex:1,
    marginLeft:9,
    fontSize:12.5,
    lineHeight:18,
    fontWeight:'600',
  },
});
