import {useEffect,useState} from 'react';
import {KeyboardAvoidingView,Platform,ScrollView,TouchableOpacity,View,Linking} from 'react-native';
import {useDispatch,useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {BaseColor,BaseStyle,useTheme} from '@/config';
import {
  Button,
  Header,
  Icon,
  Image,
  SafeAreaView,
Text,
  TextInput,
} from '@/components';
import styles from './styles';
import {getUserByToken,login} from '@/actions/auth';
import {loadToken} from '@/utils/storage';
import Toast from 'react-native-toast-message';
import {isNullOrEmpty} from '@/utils/utility';
import {registerForPushNotificationsAsync} from '@/services/notification.service';
import {registerDevice} from '@/apis/notificationApi';


const SOCIAL_LINKS={
  instagram:'https://www.instagram.com/sty.ever',
  linkedin:'https://www.linkedin.com/company/styever/',
  tiktok:'https://www.tiktok.com/@styever',
};


const SignIn=({navigation})=>{
  const {t}=useTranslation(); const {colors}=useTheme();const openLink=url=>Linking.openURL(url).catch(()=>{}); const dispatch=useDispatch();
  const [id,setId]=useState(''); const [password,setPassword]=useState('');
  const [success,setSuccess]=useState({id:true,password:true}); const [loading,setLoading]=useState(false);
  const {error,token,isPaymentRequired}=useSelector(state=>state.auth);
  useEffect(()=>{if(!loadToken()){dispatch({type:'AUTH_LOGOUT'});dispatch({type:'USER_INIT'});}},[navigation,dispatch]);
  useEffect(()=>{if(!token)return; (async()=>{try{const pushToken=await registerForPushNotificationsAsync();if(pushToken){const payload=JSON.parse(atob(token.split('.')[1]));const userId=Number(payload?.id);if(userId)await registerDevice({pushToken,platform:Platform.OS,userId});}}catch(e){} dispatch(getUserByToken());setLoading(false);navigation.navigate(isPaymentRequired?'Payment':'NHome',isPaymentRequired?{item:{typeId:1}}:undefined);})();},[token,isPaymentRequired,navigation,dispatch]);
  useEffect(()=>{if(error){Toast.show({type:'error',text1:t('error'),text2:error || t('error_login_message')});setLoading(false);}},[error,t]);
  const onLogin=()=>{if(!isNullOrEmpty(id)&&!isNullOrEmpty(password)){setLoading(true);dispatch(login(id,password));}else setSuccess({id:!isNullOrEmpty(id),password:!isNullOrEmpty(password)});};
  return <SafeAreaView style={BaseStyle.safeAreaView} edges={['right','top','left']}>
    <Header title="" renderLeft={()=><Icon name="angle-left" size={20} color={colors.primary} enableRTL/>} onPressLeft={()=>navigation.goBack()}/>
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.flex}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <View style={styles.heading}>
          <View style={styles.kickerRow}>
              <Image
                source={require('../../assets/images/styever-mark.png')}
                style={styles.kickerLogo}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.kicker,
                  {color:colors.primary},
                ]}
              >
                STYEVER
              </Text>
            </View>
          <Text style={styles.pageTitle}>{t('login_account')}</Text>
          <Text grayColor style={styles.description}>{t('login_page_description')}</Text>
        </View>
        <Text style={styles.label}>{t('email')}</Text>
        <TextInput style={styles.input} iconLeft={<Icon name="envelope" size={18} color={BaseColor.grayColor} style={styles.inputIcon}/>} onChangeText={text=>{setId(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,id:true}));}} placeholder={t('email')} keyboardType="email-address" autoCapitalize="none" success={success.id} value={id}/>
        {!success.id&&<Text style={styles.error}>{t('required_field')}</Text>}
        <View style={styles.passwordLabelRow}><Text style={styles.label}>{t('password')}</Text><TouchableOpacity onPress={()=>navigation.navigate('ResetPassword')}><Text style={[styles.forgot,{color:colors.primary}]}>{t('forgot_your_password')}</Text></TouchableOpacity></View>
        <TextInput style={styles.input} iconLeft={<Icon name="lock" size={18} color={BaseColor.grayColor} style={styles.inputIcon}/>} onChangeText={text=>{setPassword(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,password:true}));}} placeholder={t('password')} secureTextEntry success={success.password} value={password}/>
        {!success.password&&<Text style={styles.error}>{t('required_field')}</Text>}
        <Button full loading={loading} style={styles.primaryButton} onPress={onLogin}>{t('sign_in')}  →</Button>
        <View style={styles.dividerRow}><View style={styles.divider}/><Text grayColor style={styles.dividerText}>{t('new_to_styever')}</Text><View style={styles.divider}/></View>
        <Button full style={[styles.signupButton]} onPress={()=>navigation.navigate('Pricing',{isStandByPage:false,isProfilePage:false})}>{t('sign_up')}</Button>
        <Text grayColor style={styles.footerText}>{t('login_footer_text')}</Text>
        
      <View style={styles.socialRow}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.socialButton]} onPress={()=>openLink(SOCIAL_LINKS.instagram)}>
            <Icon name="instagram" size={18} color={BaseColor.darkgreenColor}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={[styles.socialButton]} onPress={()=>openLink(SOCIAL_LINKS.linkedin)}>
            <Icon name="linkedin-in" size={18} color={BaseColor.darkgreenColor}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={[styles.socialButton]} onPress={()=>openLink(SOCIAL_LINKS.tiktok)}>
            <Icon name="tiktok" size={18} color={BaseColor.darkgreenColor}/>
          </TouchableOpacity>
        </View></ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
};
export default SignIn;
