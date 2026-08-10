import {Platform,StyleSheet} from 'react-native';

export default StyleSheet.create({
  errorField:{color:'#DC3545',fontSize:11.5,lineHeight:16,fontWeight:'500',marginTop:5,marginBottom:4},
  heading:{
    marginBottom:22,
  },

  kickerRow:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:8,
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
    fontSize:30,
    lineHeight:38,
    fontWeight:'800',
  },

  pageDescription:{
    marginTop:7,
    color:'#626A66',
    fontSize:13.5,
    lineHeight:20,
    fontWeight:'500',
  },

  inputIcon:{
    width:20,
    marginRight:12,
  },

  flex:{
    flex:1,
  },

  scrollContent:{
    flexGrow:1,
    paddingBottom:120,
  },

  content:{
    padding:20,
  },

  trialBadge:{
    flexDirection:'row',
    alignItems:'center',
    borderWidth:1,
    borderStyle:'dashed',
    borderRadius:10,
    paddingHorizontal:14,
    paddingVertical:12,
    marginBottom:15,
  },

  trialText:{
    flex:1,
    marginLeft:10,
    fontSize:13,
    lineHeight:19,
    fontWeight:'600',
  },

  card:{
    borderWidth:1,
    borderRadius:16,
    padding:20,
    marginBottom:16,

    ...Platform.select({
      ios:{
        shadowColor:'#000',
        shadowOpacity:0.04,
        shadowRadius:10,
        shadowOffset:{
          width:0,
          height:4,
        },
      },
      android:{
        elevation:1,
      },
    }),
  },

  cardHeader:{
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'space-between',
    marginBottom:20,
  },

  cardTitleWrapper:{
    flex:1,
    paddingRight:15,
  },

  eyebrow:{
    fontSize:10,
    lineHeight:14,
    fontWeight:'800',
    letterSpacing:1.5,
    marginBottom:5,
  },

  packageTitle:{
    fontSize:21,
    lineHeight:27,
    fontWeight:'800',
  },

  paymentIcon:{
    width:48,
    height:48,
    borderRadius:14,
    alignItems:'center',
    justifyContent:'center',
  },

  /*
   * Shopier bilgi alanı
   */

  shopierInfo:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:20,
    paddingVertical:13,
    paddingHorizontal:14,
    backgroundColor:'rgba(0,0,0,0.025)',
    borderRadius:8,
  },

  shopierInfoText:{
    flex:1,
    marginLeft:10,
    color:'#626A66',
    fontSize:12.5,
    lineHeight:18,
  },

  /*
   * Pending Shopier
   */

  pendingBox:{
    padding:15,
    borderWidth:1,
    borderStyle:'dashed',
    borderRadius:10,
    marginTop:15,
  },

  pendingHeader:{
    flexDirection:'row',
    alignItems:'center',
  },

  pendingContent:{
    flex:1,
    marginLeft:12,
  },

  pendingTitle:{
    marginLeft:8,
    fontSize:14,
    lineHeight:20,
    fontWeight:'700',
  },

  pendingDescription:{
    marginTop:7,
    color:'#626A66',
    fontSize:12.5,
    lineHeight:19,
  },

  reference:{
    marginTop:7,
    color:'#7B827E',
    fontSize:11,
    lineHeight:16,
  },

  pendingActions:{
    alignItems:'flex-start',
    marginTop:12,
  },

  checkButton:{
    minWidth:145,
  },

  checkPaymentButton:{
    alignSelf:'flex-start',
    minHeight:38,
    justifyContent:'center',
    paddingHorizontal:14,
    marginTop:12,
    borderWidth:1,
    borderRadius:6,
  },

  input:{
    borderRadius:12,
    borderWidth:1,
    borderColor:'#D8DFEA',
    marginTop:10,
  },

  separator:{
    height:StyleSheet.hairlineWidth,
    backgroundColor:'rgba(0,0,0,0.10)',
    marginVertical:20,
  },

  /*
   * Sözleşme
   */

  consentRow:{
    flexDirection:'row',
    alignItems:'flex-start',
    marginTop:20,
  },

  checkbox:{
    width:22,
    height:22,
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

  consentContent:{
    flex:1,
  },

  inlineText:{
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
  },

  consentText:{
    color:'#626A66',
    fontSize:13,
    lineHeight:21,
    fontWeight:'500',
  },

  legalLink:{
    fontSize:13,
    lineHeight:21,
    fontWeight:'700',
    textDecorationLine:'underline',
  },

  errorText:{
    color:'#DC3545',
    fontSize:11,
    lineHeight:16,
    fontWeight:'600',
    marginTop:5,
  },

  summaryCard:{
    borderWidth:1,
    borderRadius:16,
    padding:20,

    ...Platform.select({
      ios:{
        shadowColor:'#000',
        shadowOpacity:0.04,
        shadowRadius:10,
        shadowOffset:{
          width:0,
          height:4,
        },
      },
      android:{
        elevation:1,
      },
    }),
  },

  summaryHeader:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:22,
  },

  summaryLine:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },

  summaryTotal:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },

  securityRow:{
    flexDirection:'row',
    alignItems:'flex-start',
    marginTop:22,
  },

  securityText:{
    flex:1,
    marginLeft:9,
    lineHeight:18,
  },

  /*
   * Sözleşme modal
   */

  modalBackdrop:{
    flex:1,
    justifyContent:'flex-end',
    backgroundColor:'rgba(0,0,0,0.55)',
  },

  modalContainer:{
    width:'100%',
    height:'90%',
    backgroundColor:'#FFFFFF',
    borderTopLeftRadius:24,
    borderTopRightRadius:24,
    overflow:'hidden',
  },

  modalHeader:{
    minHeight:64,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingHorizontal:20,
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'rgba(0,0,0,0.12)',
  },

  modalTitle:{
    flex:1,
    color:'#17211D',
    fontSize:17,
    lineHeight:23,
    fontWeight:'800',
    paddingRight:15,
  },

  modalCloseButton:{
    width:38,
    height:38,
    borderRadius:19,
    backgroundColor:'#F2F4F3',
    alignItems:'center',
    justifyContent:'center',
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
    paddingBottom:30,
  },

  documentTitle:{
    color:'#17211D',
    fontSize:21,
    lineHeight:28,
    fontWeight:'800',
    marginBottom:22,
  },

  legalSection:{
    marginBottom:24,
  },

  sectionTitle:{
    color:'#17211D',
    fontSize:17,
    lineHeight:23,
    fontWeight:'800',
    marginBottom:12,
  },

  subSectionTitle:{
    color:'#26332D',
    fontSize:14,
    lineHeight:20,
    fontWeight:'700',
    marginTop:10,
    marginBottom:7,
  },

  legalParagraph:{
    color:'#626A66',
    fontSize:13,
    lineHeight:21,
    marginBottom:8,
  },

  legalListRow:{
    flexDirection:'row',
    alignItems:'flex-start',
    marginBottom:6,
    paddingRight:4,
  },

  legalBullet:{
    width:18,
    color:'#626A66',
    fontSize:14,
    lineHeight:21,
  },

  legalListText:{
    flex:1,
    color:'#626A66',
    fontSize:13,
    lineHeight:21,
  },

  modalFooter:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end',
    paddingHorizontal:16,
    paddingVertical:13,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderTopColor:'rgba(0,0,0,0.12)',
    backgroundColor:'#FFFFFF',
  },

  cancelButton:{
    height:44,
    minWidth:90,
    paddingHorizontal:18,
    borderRadius:8,
    backgroundColor:'#F1F3F2',
    alignItems:'center',
    justifyContent:'center',
    marginRight:10,
  },

  cancelText:{
    color:'#4D5752',
    fontSize:14,
    fontWeight:'700',
  },

  acceptButton:{
    height:44,
    minWidth:90,
    paddingHorizontal:18,
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center',
  },

  acceptText:{
    color:'#FFFFFF',
    fontSize:14,
    fontWeight:'700',
  },
});