import {useState} from 'react';
import {ScrollView,View,Linking,TouchableOpacity} from 'react-native';
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
import styles from './styles'; import {isNullOrEmpty} from '@/utils/utility'; import {resetPasswordRequest} from '@/apis/authApi'; import Toast from 'react-native-toast-message';

const SOCIAL_LINKS={
  instagram:'https://www.instagram.com/sty.ever',
  linkedin:'https://www.linkedin.com/company/styever/',
  tiktok:'https://www.tiktok.com/@styever',
};


const ResetPassword=({navigation})=>{const {t}=useTranslation();const {colors}=useTheme();const openLink=url=>Linking.openURL(url).catch(()=>{});const [email,setEmail]=useState('');const [loading,setLoading]=useState(false);const [success,setSuccess]=useState(true);
const onConfirm=()=>{if(isNullOrEmpty(email)){setSuccess(false);return;}setLoading(true);resetPasswordRequest(email).then(r=>{if(r.isSuccess){Toast.show({type:'success',text1:t('success'),text2:t('success_message')});navigation.navigate('SignIn');}else Toast.show({type:'error',text1:t('error'),text2:t('error_file_message')});}).catch(()=>Toast.show({type:'error',text1:t('error'),text2:t('error_file_message')})).finally(()=>setLoading(false));};
return <SafeAreaView style={BaseStyle.safeAreaView} edges={['right','top','left']}><Header title="" renderLeft={()=><Icon name="angle-left" size={20} color={colors.primary}/>} onPressLeft={()=>navigation.goBack()}/><ScrollView contentContainerStyle={styles.content}><View style={styles.heading}><View style={styles.kickerRow}>
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
            </View><Text style={styles.pageTitle}>{t('forgot_password_title')}</Text><Text grayColor style={styles.description}>{t('forgot_password_description')}</Text></View><Text style={styles.label}>{t('email')}</Text><TextInput style={styles.input} iconLeft={<Icon name="envelope" size={18} color={BaseColor.grayColor} style={styles.inputIcon}/>} onChangeText={text=>{setEmail(text);if(!isNullOrEmpty(text))setSuccess(true);}} placeholder={t('email')} keyboardType="email-address" autoCapitalize="none" success={success} value={email}/>{!success&&<Text style={styles.errorField}>{t('required_field')}</Text>}<Button full loading={loading} style={styles.submit} onPress={onConfirm}>{t('submit')}  →</Button><Button full style={styles.cancel} onPress={()=>navigation.goBack()}>←  {t('cancel')}</Button><View style={styles.socialRow}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.socialButton]} onPress={()=>openLink(SOCIAL_LINKS.instagram)}>
            <Icon name="instagram" size={18} color={BaseColor.darkgreenColor}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={[styles.socialButton]} onPress={()=>openLink(SOCIAL_LINKS.linkedin)}>
            <Icon name="linkedin-in" size={18} color={BaseColor.darkgreenColor}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={[styles.socialButton]} onPress={()=>openLink(SOCIAL_LINKS.tiktok)}>
            <Icon name="tiktok" size={18} color={BaseColor.darkgreenColor}/>
          </TouchableOpacity>
        </View></ScrollView></SafeAreaView>};export default ResetPassword;