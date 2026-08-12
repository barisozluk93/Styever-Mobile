import {useState} from 'react';
import {KeyboardAvoidingView,Platform,ScrollView,StyleSheet,View,Linking,TouchableOpacity} from 'react-native';
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
import {isNullOrEmpty} from '@/utils/utility';
import Toast from 'react-native-toast-message';
import {saveRequest} from '@/apis/contactUsApi';


const SOCIAL_LINKS={
  instagram:'https://www.instagram.com/sty.ever',
  linkedin:'https://www.linkedin.com/company/styever/',
  tiktok:'https://www.tiktok.com/@styever',
};


const successInit={fullname:true,email:true,subject:true,message:true};

const ContactUs=({navigation})=>{
  const {t}=useTranslation();
  const {colors}=useTheme();const openLink=url=>Linking.openURL(url).catch(()=>{});
  const [fullname,setFullname]=useState('');
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  const [subject,setSubject]=useState('');
  const [success,setSuccess]=useState(successInit);
  const [loading,setLoading]=useState(false);

  const inputIcon=name=>(
    <Icon name={name} size={17} color={BaseColor.grayColor} style={styles.inputIcon}/>
  );

  const onSubmit=()=>{
    if(isNullOrEmpty(fullname)||isNullOrEmpty(email)||isNullOrEmpty(subject)||isNullOrEmpty(message)){
      setSuccess({
        fullname:!isNullOrEmpty(fullname),
        email:!isNullOrEmpty(email),
        subject:!isNullOrEmpty(subject),
        message:!isNullOrEmpty(message),
      });
      return;
    }

    setLoading(true);
    saveRequest(0,fullname,subject,message,email)
      .then(response=>{
        if(response?.isSuccess){
          setFullname(''); setEmail(''); setSubject(''); setMessage('');
          setSuccess(successInit);
          Toast.show({type:'success',text1:t('success'),text2:t('contact_message_success')});
        }else{
          Toast.show({type:'error',text1:t('error'),text2:response?.message || t('contact_message_error')});
        }
      })
      .catch(error=>Toast.show({type:'error',text1:t('error'),text2:error?.response?.data?.message || t('contact_message_error')}))
      .finally(()=>setLoading(false));
  };

  const infoRows=[
    {icon:'location-dot',label:t('company_center_address'),value:'Çankaya / Ankara'},
    {icon:'building-columns',label:t('tax_office'),value:'Doğanbey Vergi Dairesi'},
    {icon:'file-lines',label:t('tax_number'),value:'0990426667'},
    {icon:'envelope',label:t('email'),value:'info@styever.com'},
  ];

  return(
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right','top','left']}>
      <Header title="" renderLeft={()=><Icon name="angle-left" size={20} color={colors.primary} enableRTL/>} onPressLeft={()=>navigation.goBack()}/>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
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
            <Text numberOfLines={0} style={styles.pageTitle}>{t('contact_us')}</Text>
            <Text numberOfLines={0} grayColor style={styles.description}>{t('contact_us_page_description')}</Text>
          </View>

          <View style={[styles.companyCard,{backgroundColor:colors.card,borderColor:colors.border}]}>
            <View style={styles.companyHeader}>
              <View style={[styles.companyMark,{backgroundColor:colors.primary}]}/>
              <View>
                <Text style={styles.companyTitle}>{t('company_information')}</Text>
                <Text body2 grayColor style={styles.companyName}>Styever</Text>
              </View>
            </View>
            <View style={[styles.companyDivider,{backgroundColor:colors.border}]}/>
            {infoRows.map((item,index)=>(
              <View key={item.label} style={[styles.infoRow,index!==infoRows.length-1&&{borderBottomColor:colors.border,borderBottomWidth:StyleSheet.hairlineWidth}]}>
                <View style={[styles.infoIconBox,{backgroundColor:colors.primary+'10'}]}>
                  <Icon name={item.icon} size={16} color={colors.primary}/>
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel} grayColor>{item.label}</Text>
                  <Text numberOfLines={0} style={styles.infoValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.formCard,{backgroundColor:colors.card,borderColor:colors.border}]}>
            <Text style={[styles.formKicker,{color:colors.primary}]}>{t('contact_us')}</Text>
            <Text numberOfLines={0} grayColor style={[styles.description, {marginTop: 5, marginBottom: 5}]}>{t('contact_us_page_form_description')}</Text>
            <Text style={styles.formTitle}>{t('message')}</Text>
            <TextInput style={styles.input} iconLeft={inputIcon('user')} onChangeText={text=>{setFullname(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,fullname:true}));}} placeholder={t('fullname')} success={success.fullname} value={fullname}/>{!success.fullname&&<Text style={styles.errorField}>{t('required_field')}</Text>}
            <TextInput style={styles.input} iconLeft={inputIcon('envelope')} onChangeText={text=>{setEmail(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,email:true}));}} placeholder={t('email')} keyboardType="email-address" autoCapitalize="none" success={success.email} value={email}/>{!success.email&&<Text style={styles.errorField}>{t('required_field')}</Text>}
            <TextInput style={styles.input} iconLeft={inputIcon('message')} onChangeText={text=>{setSubject(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,subject:true}));}} placeholder={t('subject')} success={success.subject} value={subject}/>{!success.subject&&<Text style={styles.errorField}>{t('required_field')}</Text>}
            <TextInput style={styles.messageInput} inputStyle={styles.messageInputInner} iconLeft={inputIcon('pen-to-square')} onChangeText={text=>{setMessage(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,message:true}));}} textAlignVertical="top" multiline placeholder={t('message')} success={success.message} value={message}/>{!success.message&&<Text style={styles.errorField}>{t('required_field')}</Text>}
            <Button full loading={loading} style={styles.submitButton} onPress={onSubmit}>{t('send')}</Button>
          </View>
          
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
    </SafeAreaView>
  );
};

export default ContactUs;
