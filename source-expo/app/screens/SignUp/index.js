import {useEffect,useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  Button,
  Header,
  Icon,
  Image,
  SafeAreaView,
  Text,
  TextInput,
} from '@/components';
import {
  BaseColor,
  BaseStyle,
  useTheme,
} from '@/config';
import styles from './styles';
import {isNullOrEmpty} from '@/utils/utility';
import Toast from 'react-native-toast-message';
import {getRegistrationLegalContents} from '@/apis/legalContentApi';
import {getLocalizedLegalContent,getLocalizedLegalTitle} from '@/utils/legalContent';

const successInit={
  name:true,
  surname:true,
  email:true,
  phone:true,
  password:true,
  passwordConfirm:true,
  address:true,
  termsAndPrivacyAccepted:true,
  kvkkAccepted:true,
};

const SignUp=(props)=>{
  const {navigation,route}=props;
  const {t,i18n}=useTranslation();
  const {colors}=useTheme();

  const [success,setSuccess]=useState(successInit);
  const [passwordMismatch,setPasswordMismatch]=useState(false);
  const [name,setName]=useState('');
  const [surname,setSurname]=useState('');
  const [email,setEmail]=useState('');
  const [phone,setPhone]=useState('');
  const [password,setPassword]=useState('');
  const [passwordConfirm,setPasswordConfirm]=useState('');
  const [roles,setRoles]=useState([]);
  const [loading,setLoading]=useState(false);
  const [legalDocuments,setLegalDocuments]=useState({});
  const [legalLoading,setLegalLoading]=useState(false);
  const [legalError,setLegalError]=useState('');

  const [
    termsAndPrivacyAccepted,
    setTermsAndPrivacyAccepted,
  ]=useState(false);

  const [
    kvkkAccepted,
    setKvkkAccepted,
  ]=useState(false);

  const [
    commercialPermission,
    setCommercialPermission,
  ]=useState(false);

  const [
    termsModalVisible,
    setTermsModalVisible,
  ]=useState(false);

  const [
    kvkkModalVisible,
    setKvkkModalVisible,
  ]=useState(false);

  const legalLanguage=(i18n.language||'tr').split('-')[0]==='en'?'en':'tr';
  const legalTitle=slug=>getLocalizedLegalTitle(legalDocuments[slug],legalLanguage);
  const legalContent=slug=>getLocalizedLegalContent(legalDocuments[slug],legalLanguage);

  useEffect(()=>{
    let mounted=true;
    setLegalLoading(true);
    setLegalError('');

    getRegistrationLegalContents()
      .then(data=>{
        if(mounted)setLegalDocuments(data);
      })
      .catch(error=>{
        if(mounted){
          setLegalError(error?.response?.data?.message||error?.message||t('legal_content_load_error'));
        }
      })
      .finally(()=>{
        if(mounted)setLegalLoading(false);
      });

    return()=>{mounted=false;};
  },[legalLanguage,t]);

  useEffect(()=>{
    if(route?.params?.selectedPlanId){
      if(route?.params?.selectedPlanId===2){
        setRoles([2]);
      }
      else if(route?.params?.selectedPlanId===3){
        setRoles([3]);
      }
      else if(route?.params?.selectedPlanId===4){
        setRoles([4]);
      }
    }
  },[route?.params]);

  const acceptTermsPrivacy=()=>{
    setTermsAndPrivacyAccepted(true);

    setSuccess(prev=>({
      ...prev,
      termsAndPrivacyAccepted:true,
    }));

    setTermsModalVisible(false);
  };

  const acceptKvkk=()=>{
    setKvkkAccepted(true);

    setSuccess(prev=>({
      ...prev,
      kvkkAccepted:true,
    }));

    setKvkkModalVisible(false);
  };

  const continueRegister=()=>{
    const legalReady=
      legalDocuments['terms-of-use']&&
      legalDocuments['privacy-policy']&&
      legalDocuments.kvkk;

    if(legalLoading||legalError||!legalReady){
      Toast.show({
        type:'error',
        text1:t('error'),
        text2:legalError||t('legal_content_load_error'),
      });
      return;
    }
    if(
      isNullOrEmpty(name)||
      isNullOrEmpty(surname)||
      isNullOrEmpty(email)||
      isNullOrEmpty(password)||
      isNullOrEmpty(passwordConfirm)||
      isNullOrEmpty(phone)||
      !termsAndPrivacyAccepted||
      !kvkkAccepted
    ){
      setSuccess({
        ...success,
        name:!isNullOrEmpty(name),
        surname:!isNullOrEmpty(surname),
        email:!isNullOrEmpty(email),
        password:!isNullOrEmpty(password),
        passwordConfirm:!isNullOrEmpty(passwordConfirm),
        phone:!isNullOrEmpty(phone),
        termsAndPrivacyAccepted:termsAndPrivacyAccepted,
        kvkkAccepted:kvkkAccepted,
      });

      // if(!termsAndPrivacyAccepted){
      //   Toast.show({
      //     type:'error',
      //     text1:t('error'),
      //     text2:t(
      //       'LEGAL_CHECKBOXES.TERMS_AND_PRIVACY_REQUIRED',
      //     ),
      //   });
      // }
      // else if(!kvkkAccepted){
      //   Toast.show({
      //     type:'error',
      //     text1:t('error'),
      //     text2:t('LEGAL_CHECKBOXES.KVKK_REQUIRED'),
      //   });
      // }
    }
    else{
      if(password!==passwordConfirm){
        setSuccess({
          ...success,
          name:!isNullOrEmpty(name),
          surname:!isNullOrEmpty(surname),
          email:!isNullOrEmpty(email),
          password:!isNullOrEmpty(password),
          passwordConfirm:!isNullOrEmpty(passwordConfirm),
          phone:!isNullOrEmpty(phone),
          termsAndPrivacyAccepted:true,
          kvkkAccepted:true,
        });
        setPasswordMismatch(true);
      }
      else{
        setPasswordMismatch(false);
        setLoading(true);

        setTimeout(()=>{
          setLoading(false);

          const language=(i18n.language||'tr')
            .split('-')[0];

          const agreementAcceptances=[
            {
              userId:0,
              agreementType:'MembershipTerms',
              title:legalTitle('terms-of-use'),
              version:'2026.08',
              language,
              context:'Registration',
              documentUrl:'/terms-of-use',
            },
            {
              userId:0,
              agreementType:'PrivacyPolicy',
              title:legalTitle('privacy-policy'),
              version:'2026.08',
              language,
              context:'Registration',
              documentUrl:'/privacy-policy',
            },
            {
              userId:0,
              agreementType:'KvkkDisclosure',
              title:legalTitle('kvkk'),
              version:'2026.08',
              language,
              context:'Registration',
              documentUrl:'/kvkk',
            },
          ];

          if(commercialPermission){
            agreementAcceptances.push({
              userId:0,
              agreementType:'CommercialCommunication',
              title:t(
                'LEGAL_CHECKBOXES.COMMERCIAL_MESSAGE_PERMISSION',
              ),
              version:'2026.08',
              language,
              context:'Registration',
            });
          }

          const user={
            id:0,
            agree:true,
            roles:roles,
            name:name,
            surname:surname,
            email:email,
            username:email,
            password:password,
            phone:phone,
            voucher:route?.params?.voucher,

            termsAndPrivacyAccepted,
            kvkkAccepted,
            commercialPermission,
            agreementAcceptances,
          };

          console.log(user);

          navigation.navigate('Address',{
            user:user,
          });
        },500);
      }
    }
  };

  const offsetKeyboard=Platform.select({
    ios:0,
    android:20,
  });


  return(
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right','top','left']}
    >
      <Header
        title=""
        renderLeft={()=>{
          return(
            <Icon
              name="angle-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={()=>{
          navigation.goBack();
        }}
      />

      <KeyboardAvoidingView
        behavior={
          Platform.OS==='ios'
            ?'padding'
            :'height'
        }
        keyboardVerticalOffset={offsetKeyboard}
        style={{
          flex:1,
        }}
      >

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contain}>
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
              <Text style={styles.pageTitle}>{t('create_account')}</Text>
              <Text grayColor style={styles.description}>{t('signup_page_description')}</Text>
            </View>

            <View
              style={{
                flexDirection:'row',
              }}
            >
              <TextInput
                style={[
                  styles.textInputName,
                  {
                    marginTop:0,
                    marginRight:10,
                  },
                ]}
                iconLeft={<Icon name="user" size={17} color={BaseColor.grayColor} style={{marginRight:12}} />}
            onChangeText={text=>{setName(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,name:true}));}}
                autoCorrect={false}
                placeholder={t('name')}
                placeholderTextColor={
                  success.name
                    ?BaseColor.grayColor
                    :colors.primary
                }
                value={name}
              />

              <TextInput
                iconLeft={
                  <Icon
                    name="user"
                    size={18}
                    color={BaseColor.grayColor}
                  />
                }
                style={[
                  styles.textInputName,
                  {
                    marginTop:0,
                  },
                ]}
                onChangeText={text=>{setSurname(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,surname:true}));}}
                autoCorrect={false}
                placeholder={t('surname')}
                placeholderTextColor={
                  success.surname
                    ?BaseColor.grayColor
                    :colors.primary
                }
                value={surname}
              />
            </View>
            {(!success.name||!success.surname)&&<View style={{flexDirection:'row'}}><View style={{flex:1,marginRight:5}}>{!success.name&&<Text style={styles.errorField}>{t('required_field')}</Text>}</View><View style={{flex:1,marginLeft:5}}>{!success.surname&&<Text style={styles.errorField}>{t('required_field')}</Text>}</View></View>}

            <TextInput
                iconLeft={
                  <Icon
                    name="envelope"
                    size={18}
                    color={BaseColor.grayColor}
                  />
                }
              style={[
                styles.textInput,
                {
                  marginTop:10,
                },
              ]}
              onChangeText={text=>{setEmail(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,email:true}));}}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder={t('email')}
              keyboardType="email-address"
              placeholderTextColor={
                success.email
                  ?BaseColor.grayColor
                  :colors.primary
              }
              value={email}
            />
            {!success.email&&<Text style={styles.errorField}>{t('required_field')}</Text>}

            <TextInput
                iconLeft={
                  <Icon
                    name="mobile-screen-button"
                    size={18}
                    color={BaseColor.grayColor}
                  />
                }
              style={[
                BaseStyle.textInput,
                {
                  marginTop:10,
                },
              ]}
              onChangeText={text=>{setPhone(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,phone:true}));}}
              autoCorrect={false}
              placeholder={t('phone')}
              keyboardType="phone-pad"
              placeholderTextColor={
                success.phone
                  ?BaseColor.grayColor
                  :colors.primary
              }
              value={phone}
            />
            {!success.phone&&<Text style={styles.errorField}>{t('required_field')}</Text>}

            <View
              style={{
                flexDirection:'row',
              }}
            >
              <TextInput
                iconLeft={
                  <Icon
                    name="lock"
                    size={18}
                    color={BaseColor.grayColor}
                  />
                }
                style={[
                  styles.textInputName,
                  {
                    marginTop:10,
                    marginRight:10,
                  },
                ]}
                onChangeText={text=>{setPassword(text);setPasswordMismatch(false);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,password:true}));}}
                autoCorrect={false}
                placeholder={t('password')}
                secureTextEntry={true}
                placeholderTextColor={
                  success.password
                    ?BaseColor.grayColor
                    :colors.primary
                }
                value={password}
              />

              <TextInput
                iconLeft={
                  <Icon
                    name="lock"
                    size={18}
                    color={BaseColor.grayColor}
                  />
                }
                style={[
                  styles.textInputName,
                  {
                    marginTop:10,
                  },
                ]}
                onChangeText={text=>{
                  setPasswordConfirm(text);
                  setPasswordMismatch(false);
                  if(!isNullOrEmpty(text)){
                    setSuccess(prev=>({
                      ...prev,
                      passwordConfirm:true,
                    }));
                  }
                }}
                autoCorrect={false}
                placeholder={t('password_confirm')}
                secureTextEntry={true}
                placeholderTextColor={
                  success.passwordConfirm
                    ?BaseColor.grayColor
                    :colors.primary
                }
                value={passwordConfirm}
              />
            </View>
            {(!success.password||!success.passwordConfirm)&&<View style={{flexDirection:'row'}}><View style={{flex:1,marginRight:5}}>{!success.password&&<Text style={styles.errorField}>{t('required_field')}</Text>}</View><View style={{flex:1,marginLeft:5}}>{!success.passwordConfirm&&<Text style={styles.errorField}>{t('required_field')}</Text>}</View></View>}
            {passwordMismatch&&<Text style={styles.errorField}>{t('pw_didnt_match_message')}</Text>}


            <View style={styles.legalContainer}>

              {/* TERMS + PRIVACY */}

              <View style={styles.legalRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.checkbox,
                    termsAndPrivacyAccepted&&{
                      backgroundColor:colors.primary,
                      borderColor:colors.primary,
                    },
                    !success.termsAndPrivacyAccepted&&
                      styles.checkboxError,
                  ]}
                  onPress={()=>{
                    const value=
                      !termsAndPrivacyAccepted;

                    setTermsAndPrivacyAccepted(value);

                    setSuccess(prev=>({
                      ...prev,
                      termsAndPrivacyAccepted:true,
                    }));
                  }}
                >
                  {termsAndPrivacyAccepted&&(
                    <Text style={styles.checkboxCheck}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={styles.legalTextWrapper}>

                  <View style={styles.legalInline}>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={()=>
                        setTermsModalVisible(true)
                      }
                    >
                      <Text
                        style={[
                          styles.legalLink,
                          {
                            color:colors.primary,
                          },
                        ]}
                      >
                        {legalTitle('terms-of-use')}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.legalText}>
                      {' '}
                      {t('AND')}
                      {' '}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={()=>
                        setTermsModalVisible(true)
                      }
                    >
                      <Text
                        style={[
                          styles.legalLink,
                          {
                            color:colors.primary,
                          },
                        ]}
                      >
                        {legalTitle('privacy-policy')}
                      </Text>
                    </TouchableOpacity>

                  </View>

                  <Text style={styles.legalText}>
                    {t(
                      'LEGAL_CHECKBOXES.TERMS_PRIVACY_ACCEPT_SUFFIX',
                    )}
                  </Text>

                  {!success.termsAndPrivacyAccepted&&(
                    <Text style={styles.legalError}>
                      {t(
                        'LEGAL_CHECKBOXES.TERMS_AND_PRIVACY_REQUIRED',
                      )}
                    </Text>
                  )}

                </View>
              </View>

              {/* KVKK */}

              <View style={styles.legalRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.checkbox,
                    kvkkAccepted&&{
                      backgroundColor:colors.primary,
                      borderColor:colors.primary,
                    },
                    !success.kvkkAccepted&&
                      styles.checkboxError,
                  ]}
                  onPress={()=>{
                    const value=!kvkkAccepted;

                    setKvkkAccepted(value);

                    setSuccess(prev=>({
                      ...prev,
                      kvkkAccepted:true,
                    }));
                  }}
                >
                  {kvkkAccepted&&(
                    <Text style={styles.checkboxCheck}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={styles.legalTextWrapper}>

                  <View style={styles.legalInline}>

                    <Text style={styles.legalText}>
                      {t(
                        'LEGAL_CHECKBOXES.KVKK_PREFIX',
                      )}
                      {' '}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={()=>
                        setKvkkModalVisible(true)
                      }
                    >
                      <Text
                        style={[
                          styles.legalLink,
                          {
                            color:colors.primary,
                          },
                        ]}
                      >
                        {legalTitle('kvkk')}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.legalText}>
                      {' '}
                      {t(
                        'LEGAL_CHECKBOXES.KVKK_SUFFIX',
                      )}
                    </Text>

                  </View>

                  {!success.kvkkAccepted&&(
                    <Text style={styles.legalError}>
                      {t(
                        'LEGAL_CHECKBOXES.KVKK_REQUIRED',
                      )}
                    </Text>
                  )}

                </View>
              </View>

              {/* COMMERCIAL PERMISSION */}

              <View style={styles.legalRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.checkbox,
                    commercialPermission&&{
                      backgroundColor:colors.primary,
                      borderColor:colors.primary,
                    },
                  ]}
                  onPress={()=>
                    setCommercialPermission(
                      !commercialPermission,
                    )
                  }
                >
                  {commercialPermission&&(
                    <Text style={styles.checkboxCheck}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.legalTextWrapper}
                  onPress={()=>
                    setCommercialPermission(
                      !commercialPermission,
                    )
                  }
                >
                  <Text style={styles.legalText}>
                    {t(
                      'LEGAL_CHECKBOXES.COMMERCIAL_MESSAGE_PERMISSION',
                    )}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>

            <View
              style={{
                width:'100%',
              }}
            >
              <Button
                full
                style={{
                  marginTop:20,
                }}
                loading={loading}
                onPress={()=>
                  continueRegister()
                }
              >
                {t('continue')}
              </Button>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* TERMS + PRIVACY MODAL */}

      <Modal
        visible={termsModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={()=>setTermsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {legalTitle('terms-of-use')||legalTitle('privacy-policy')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalCloseButton}
                onPress={()=>setTermsModalVisible(false)}
              >
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
            >
              {legalLoading&&(
                <ActivityIndicator size="large" color={colors.primary}/>
              )}

              {!legalLoading&&!!legalError&&(
                <Text style={styles.modalText}>{legalError}</Text>
              )}

              {!legalLoading&&!legalError&&(
                <>
                  <Text style={styles.modalDocumentTitle}>
                    {legalTitle('terms-of-use')}
                  </Text>
                  <Text numberOfLines={0} style={styles.modalText}>
                    {legalContent('terms-of-use')}
                  </Text>

                  <View style={styles.modalDivider}/>

                  <Text style={styles.modalDocumentTitle}>
                    {legalTitle('privacy-policy')}
                  </Text>
                  <Text numberOfLines={0} style={styles.modalText}>
                    {legalContent('privacy-policy')}
                  </Text>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalCancel}
                onPress={()=>setTermsModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalAccept,{backgroundColor:colors.primary}]}
                onPress={acceptTermsPrivacy}
                disabled={legalLoading||!!legalError}
              >
                <Text style={styles.modalAcceptText}>{t('ok')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* KVKK MODAL */}

      <Modal
        visible={kvkkModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={()=>setKvkkModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{legalTitle('kvkk')}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalCloseButton}
                onPress={()=>setKvkkModalVisible(false)}
              >
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
            >
              {legalLoading&&(
                <ActivityIndicator size="large" color={colors.primary}/>
              )}
              {!legalLoading&&!!legalError&&(
                <Text style={styles.modalText}>{legalError}</Text>
              )}
              {!legalLoading&&!legalError&&(
                <>
                  <Text style={styles.modalDocumentTitle}>{legalTitle('kvkk')}</Text>
                  <Text numberOfLines={0} style={styles.modalText}>{legalContent('kvkk')}</Text>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalCancel}
                onPress={()=>setKvkkModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalAccept,{backgroundColor:colors.primary}]}
                onPress={acceptKvkk}
                disabled={legalLoading||!!legalError}
              >
                <Text style={styles.modalAcceptText}>{t('ok')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default SignUp;