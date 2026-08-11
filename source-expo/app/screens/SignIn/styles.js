import {StyleSheet} from 'react-native';
import { BaseColor } from '@/config';

export default StyleSheet.create({
 flex:{flex:1},scrollContent:{flexGrow:1,paddingHorizontal:28,paddingTop:36,paddingBottom:40},
 heading:{marginBottom:32},kickerRow:{flexDirection:'row',alignItems:'center',marginBottom:14},kicker:{fontSize:10,lineHeight:14,fontWeight:'800',letterSpacing:1.7},pageTitle:{fontSize:34,lineHeight:42,fontWeight:'800',marginBottom:10},description:{fontSize:14,lineHeight:21},
  kickerLogo:{width:28,height:18,marginRight:10},
 label:{fontSize:14,lineHeight:20,fontWeight:'700',marginBottom:8},input:{height:60,borderRadius:12,borderWidth:1,borderColor:'#D8DFEA',paddingHorizontal:16,marginBottom:8},inputIcon:{marginRight:12},passwordLabelRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:16},forgot:{fontSize:12.5,fontWeight:'700',marginBottom:8},error:{color:'#FF1744',fontSize:11.5,marginBottom:5},primaryButton:{marginTop:20,height:60,borderRadius:12},dividerRow:{flexDirection:'row',alignItems:'center',marginVertical:22},divider:{flex:1,height:1,backgroundColor:'#E2E6EC'},dividerText:{fontSize:11.5,marginHorizontal:12},signupButton:{height:58,borderRadius:12, backgroundColor: BaseColor.lightGreenColor, color: BaseColor.darkgreenColor },footerText:{textAlign:'center',fontSize:11.5,lineHeight:17,marginTop:22},
  socialRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,marginTop:24,marginBottom:18},
  socialButton:{width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center', backgroundColor: BaseColor.lightGreenColor },
});