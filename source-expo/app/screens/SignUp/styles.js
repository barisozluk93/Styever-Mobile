import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  errorField:{color:'#DC3545',fontSize:11.5,lineHeight:16,fontWeight:'500',marginTop:5,marginBottom:4},
  contain:{paddingHorizontal:20,paddingTop:28,paddingBottom:40,width:'100%'},heading:{marginBottom:26},kickerRow:{flexDirection:'row',alignItems:'center',marginBottom:10},kicker:{fontSize:10,fontWeight:'800',letterSpacing:1.6},pageTitle:{fontSize:28,lineHeight:35,fontWeight:'800',marginBottom:7},description:{fontSize:13.5,lineHeight:20},textInput:{height:60,borderRadius:12,borderWidth:1,borderColor:'#D8DFEA',paddingHorizontal:16,width:'100%'},textInputName:{height:60,borderRadius:12,borderWidth:1,borderColor:'#D8DFEA',paddingHorizontal:16,width:'48.5%'},
  kickerLogo:{width:28,height:18,marginRight:10},
  /*
   * LEGAL CHECKBOXES
   */

  legalContainer:{
    marginTop:20,
    paddingTop:18,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderTopColor:'rgba(0,0,0,0.12)',
  },

  legalRow:{
    width:'100%',
    flexDirection:'row',
    alignItems:'flex-start',
    marginBottom:16,
  },

  checkbox:{
    width:22,
    height:22,
    flexShrink:0,
    borderRadius:5,
    borderWidth:1.5,
    borderColor:'#D8DFEA',
    backgroundColor:'#FFFFFF',
    alignItems:'center',
    justifyContent:'center',
    marginTop:1,
    marginRight:11,
  },

  checkboxError:{
    borderColor:'#D8DFEA',
  },

  checkboxCheck:{
    color:'#FFFFFF',
    fontSize:15,
    lineHeight:18,
    fontWeight:'800',
  },

  legalTextWrapper:{
    flex:1,
    paddingRight:2,
  },

  legalInline:{
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
  },

  legalText:{
    color:'#646B67',
    fontSize:12.5,
    lineHeight:19,
    fontWeight:'500',
  },

  legalLink:{
    fontSize:12.5,
    lineHeight:19,
    fontWeight:'700',
    textDecorationLine:'underline',
  },

  legalError:{
    color:'#DC3545',
    fontSize:11,
    lineHeight:16,
    fontWeight:'500',
    marginTop:4,
  },

  /*
   * MODAL
   */

  modalBackdrop:{
    flex:1,
    justifyContent:'flex-end',
    backgroundColor:'rgba(0,0,0,0.55)',
  },

  modalContainer:{
    width:'100%',
    height:'88%',
    backgroundColor:'#FFFFFF',
    borderTopLeftRadius:22,
    borderTopRightRadius:22,
    overflow:'hidden',
  },

  modalHeader:{
    minHeight:62,
    paddingHorizontal:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'rgba(0,0,0,0.12)',
  },

  modalTitle:{
    flex:1,
    color:'#17211D',
    fontSize:17,
    lineHeight:23,
    fontWeight:'700',
    paddingRight:15,
  },

  modalCloseButton:{
    width:38,
    height:38,
    borderRadius:19,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#F3F5F4',
  },

  modalClose:{
    color:'#555D59',
    fontSize:28,
    lineHeight:30,
    fontWeight:'300',
    marginTop:-2,
  },

  modalScroll:{
    flex:1,
  },

  modalScrollContent:{
    paddingHorizontal:20,
    paddingTop:22,
    paddingBottom:28,
  },

  modalDocumentTitle:{
    color:'#17211D',
    fontSize:21,
    lineHeight:28,
    fontWeight:'800',
    marginBottom:20,
  },

  modalSection:{
    marginBottom:22,
  },

  modalSectionTitle:{
    color:'#17211D',
    fontSize:15,
    lineHeight:21,
    fontWeight:'700',
    marginBottom:8,
  },

  modalText:{
    color:'#626A66',
    fontSize:13,
    lineHeight:21,
    marginBottom:7,
  },

  modalListRow:{
    flexDirection:'row',
    alignItems:'flex-start',
    paddingRight:5,
    marginBottom:6,
  },

  modalBullet:{
    width:17,
    color:'#626A66',
    fontSize:14,
    lineHeight:21,
  },

  modalListText:{
    flex:1,
    color:'#626A66',
    fontSize:13,
    lineHeight:21,
  },

  modalDivider:{
    height:1,
    backgroundColor:'rgba(0,0,0,0.10)',
    marginTop:4,
    marginBottom:26,
  },

  modalFooter:{
    minHeight:70,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end',
    paddingHorizontal:16,
    paddingVertical:12,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderTopColor:'rgba(0,0,0,0.12)',
    backgroundColor:'#FFFFFF',
  },

  modalCancel:{
    height:44,
    minWidth:90,
    paddingHorizontal:18,
    borderRadius:7,
    backgroundColor:'#F1F3F2',
    alignItems:'center',
    justifyContent:'center',
    marginRight:10,
  },

  modalCancelText:{
    color:'#4E5853',
    fontSize:14,
    fontWeight:'700',
  },

  modalAccept:{
    height:44,
    minWidth:90,
    paddingHorizontal:18,
    borderRadius:7,
    alignItems:'center',
    justifyContent:'center',
  },

  modalAcceptText:{
    color:'#FFFFFF',
    fontSize:14,
    fontWeight:'700',
  },

});