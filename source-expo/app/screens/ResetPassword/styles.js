import {StyleSheet} from 'react-native';
import { BaseColor } from '@/config';

export default StyleSheet.create({
  errorField:{color:'#DC3545',fontSize:11.5,lineHeight:16,fontWeight:'500',marginTop:5,marginBottom:4},content:{flexGrow:1,paddingHorizontal:28,paddingTop:48,paddingBottom:40},heading:{marginBottom:28},kickerRow:{flexDirection:'row',alignItems:'center',marginBottom:14},kicker:{fontSize:10,fontWeight:'800',letterSpacing:1.7},pageTitle:{fontSize:34,lineHeight:42,fontWeight:'800',marginBottom:10},description:{fontSize:14,lineHeight:21},label:{fontSize:14,fontWeight:'700',marginBottom:9},input:{height:60,borderRadius:12,borderWidth:1,borderColor:'#D8DFEA',paddingHorizontal:16},inputIcon:{marginRight:12},submit:{height:60,borderRadius:12,marginTop:22},cancel:{height:58,borderRadius:12,marginTop:12, backgroundColor: BaseColor.lightGreenColor,  },
  kickerLogo:{width:28,height:18,marginRight:10},
  socialRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,marginTop:24,marginBottom:18},
  socialButton:{width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center', backgroundColor: BaseColor.lightGreenColor },
});