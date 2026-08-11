import {useEffect,useState} from 'react';
import {
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
              title:t('TERMS.PAGE_TITLE'),
              version:'2026.08',
              language,
              context:'Registration',
              documentUrl:'/terms-of-use',
            },
            {
              userId:0,
              agreementType:'PrivacyPolicy',
              title:t('PRIVACY_POLICY.PAGE_TITLE'),
              version:'2026.08',
              language,
              context:'Registration',
              documentUrl:'/privacy-policy',
            },
            {
              userId:0,
              agreementType:'KvkkDisclosure',
              title:t('KVKK.PAGE_TITLE'),
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

  const renderTermsSection=({
    title,
    texts=[],
    items=[],
  })=>(
    <View style={styles.modalSection}>
      <Text style={styles.modalSectionTitle}>
        {t(title)}
      </Text>

      {texts.map((key,index)=>(
        <Text
          key={`${key}-${index}`}
          style={styles.modalText}
        >
          {t(key)}
        </Text>
      ))}

      {items.map((key,index)=>(
        <View
          key={`${key}-${index}`}
          style={styles.modalListRow}
        >
          <Text style={styles.modalBullet}>
            •
          </Text>

          <Text style={styles.modalListText}>
            {t(key)}
          </Text>
        </View>
      ))}
    </View>
  );

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
                        {t('TERMS.PAGE_TITLE')}
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
                        {t('PRIVACY_POLICY.PAGE_TITLE')}
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
                        {t('KVKK.PAGE_TITLE')}
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
        onRequestClose={()=>
          setTermsModalVisible(false)
        }
      >
        <View style={styles.modalBackdrop}>

          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>

              <Text style={styles.modalTitle}>
                {t('LEGAL_TERMS_PRIVACY_TITLE')}
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalCloseButton}
                onPress={()=>
                  setTermsModalVisible(false)
                }
              >
                <Text style={styles.modalClose}>
                  ×
                </Text>
              </TouchableOpacity>

            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={
                styles.modalScrollContent
              }
              showsVerticalScrollIndicator={true}
            >

              <Text style={styles.modalDocumentTitle}>
                {t('TERMS.PAGE_TITLE')}
              </Text>

              {renderTermsSection({
                title:'TERMS.SECTION_1_TITLE',
                texts:[
                  'TERMS.SECTION_1_TEXT',
                ],
              })}

              {renderTermsSection({
                title:'TERMS.SECTION_2_TITLE',
                texts:[
                  'TERMS.SECTION_2_TEXT',
                ],
              })}

              {renderTermsSection({
                title:'TERMS.SECTION_3_TITLE',
                texts:[
                  'TERMS.SECTION_3_TEXT',
                ],
              })}

              {renderTermsSection({
                title:'TERMS.SECTION_4_TITLE',
                texts:[
                  'TERMS.SECTION_4_TEXT_1',
                  'TERMS.SECTION_4_TEXT_2',
                  'TERMS.SECTION_4_TEXT_3',
                ],
              })}

              {renderTermsSection({
                title:'TERMS.SECTION_5_TITLE',
                texts:[
                  'TERMS.SECTION_5_TEXT_1',
                  'TERMS.SECTION_5_TEXT_2',
                  'TERMS.SECTION_5_TEXT_3',
                ],
              })}

              {renderTermsSection({
                title:'TERMS.SECTION_6_TITLE',
                texts:[
                  'TERMS.SECTION_6_TEXT_1',
                  'TERMS.SECTION_6_TEXT_2',
                  'TERMS.SECTION_6_TEXT_3',
                ],
              })}

              {renderTermsSection({
                title:'TERMS.SECTION_7_TITLE',
                texts:[
                  'TERMS.SECTION_7_TEXT_1',
                  'TERMS.SECTION_7_TEXT_2',
                ],
              })}

              {renderTermsSection({
                title:'TERMS.SECTION_8_TITLE',
                texts:[
                  'TERMS.SECTION_8_TEXT_1',
                  'TERMS.SECTION_8_TEXT_2',
                  'TERMS.SECTION_8_TEXT_3',
                  'TERMS.SECTION_8_TEXT_4',
                  'TERMS.SECTION_8_TEXT_5',
                  'TERMS.SECTION_8_TEXT_6',
                  'TERMS.SECTION_8_TEXT_7',
                ],
              })}

              {renderTermsSection({
                title:'TERMS.SECTION_9_TITLE',
                texts:[
                  'TERMS.SECTION_9_TEXT',
                ],
              })}

              {renderTermsSection({
                title:'TERMS.SECTION_10_TITLE',
                items:[
                  'TERMS.SECTION_10_ITEM_1',
                  'TERMS.SECTION_10_ITEM_2',
                  'TERMS.SECTION_10_ITEM_3',
                  'TERMS.SECTION_10_ITEM_4',
                  'TERMS.SECTION_10_ITEM_5',
                ],
              })}

              <View style={styles.modalDivider}/>

              <Text style={styles.modalDocumentTitle}>
                {t('PRIVACY_POLICY.PAGE_TITLE')}
              </Text>

              {renderTermsSection({
                title:
                  'PRIVACY_POLICY.SECTION_1_TITLE',
                texts:[
                  'PRIVACY_POLICY.SECTION_1_TEXT',
                ],
              })}

              {renderTermsSection({
                title:
                  'PRIVACY_POLICY.SECTION_2_TITLE',
                texts:[
                  'PRIVACY_POLICY.SECTION_2_TEXT',
                ],
                items:[
                  'PRIVACY_POLICY.DATA_1',
                  'PRIVACY_POLICY.DATA_2',
                  'PRIVACY_POLICY.DATA_3',
                  'PRIVACY_POLICY.DATA_4',
                ],
              })}

              {renderTermsSection({
                title:
                  'PRIVACY_POLICY.SECTION_3_TITLE',
                texts:[
                  'PRIVACY_POLICY.SECTION_3_TEXT',
                ],
                items:[
                  'PRIVACY_POLICY.PURPOSE_1',
                  'PRIVACY_POLICY.PURPOSE_2',
                  'PRIVACY_POLICY.PURPOSE_3',
                ],
              })}

              {renderTermsSection({
                title:
                  'PRIVACY_POLICY.SECTION_4_TITLE',
                texts:[
                  'PRIVACY_POLICY.SECTION_4_TEXT_1',
                  'PRIVACY_POLICY.SECTION_4_TEXT_2',
                  'PRIVACY_POLICY.SECTION_4_TEXT_3',
                ],
              })}

              {renderTermsSection({
                title:
                  'PRIVACY_POLICY.SECTION_5_TITLE',
                texts:[
                  'PRIVACY_POLICY.SECTION_5_TEXT',
                ],
                items:[
                  'PRIVACY_POLICY.SHARING_1',
                  'PRIVACY_POLICY.SHARING_2',
                  'PRIVACY_POLICY.SHARING_3',
                ],
              })}

              {renderTermsSection({
                title:
                  'PRIVACY_POLICY.SECTION_6_TITLE',
                texts:[
                  'PRIVACY_POLICY.SECTION_6_TEXT_1',
                  'PRIVACY_POLICY.SECTION_6_TEXT_2',
                  'PRIVACY_POLICY.SECTION_6_TEXT_3',
                ],
              })}

              {renderTermsSection({
                title:
                  'PRIVACY_POLICY.SECTION_7_TITLE',
                texts:[
                  'PRIVACY_POLICY.SECTION_7_TEXT',
                ],
                items:[
                  'PRIVACY_POLICY.RIGHT_1',
                  'PRIVACY_POLICY.RIGHT_2',
                  'PRIVACY_POLICY.RIGHT_3',
                  'PRIVACY_POLICY.RIGHT_4',
                  'PRIVACY_POLICY.RIGHT_5',
                  'PRIVACY_POLICY.RIGHT_6',
                  'PRIVACY_POLICY.RIGHT_7',
                  'PRIVACY_POLICY.RIGHT_8',
                  'PRIVACY_POLICY.RIGHT_9',
                ],
              })}

              <Text style={styles.modalText}>
                {t(
                  'PRIVACY_POLICY.APPLICATION_TEXT',
                )}
              </Text>

              {renderTermsSection({
                title:
                  'PRIVACY_POLICY.SECTION_8_TITLE',
                texts:[
                  'PRIVACY_POLICY.SECTION_8_TEXT',
                ],
              })}

            </ScrollView>

            <View style={styles.modalFooter}>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalCancel}
                onPress={()=>
                  setTermsModalVisible(false)
                }
              >
                <Text style={styles.modalCancelText}>
                  {t('cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.modalAccept,
                  {
                    backgroundColor:colors.primary,
                  },
                ]}
                onPress={acceptTermsPrivacy}
              >
                <Text style={styles.modalAcceptText}>
                  {t('ok')}
                </Text>
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
        onRequestClose={()=>
          setKvkkModalVisible(false)
        }
      >
        <View style={styles.modalBackdrop}>

          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>

              <Text style={styles.modalTitle}>
                {t('KVKK_MODAL_TITLE')}
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalCloseButton}
                onPress={()=>
                  setKvkkModalVisible(false)
                }
              >
                <Text style={styles.modalClose}>
                  ×
                </Text>
              </TouchableOpacity>

            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={
                styles.modalScrollContent
              }
              showsVerticalScrollIndicator={true}
            >

              <Text style={styles.modalDocumentTitle}>
                {t('KVKK.PAGE_TITLE')}
              </Text>

              {renderTermsSection({
                title:'KVKK.SECTION_1_TITLE',
                texts:[
                  'KVKK.SECTION_1_TEXT',
                ],
              })}

              {renderTermsSection({
                title:'KVKK.SECTION_2_TITLE',
                texts:[
                  'KVKK.SECTION_2_TEXT',
                ],
                items:[
                  'KVKK.PURPOSE_1',
                  'KVKK.PURPOSE_2',
                  'KVKK.PURPOSE_3',
                  'KVKK.PURPOSE_4',
                ],
              })}

              {renderTermsSection({
                title:'KVKK.SECTION_3_TITLE',
                texts:[
                  'KVKK.SECTION_3_TEXT',
                ],
                items:[
                  'KVKK.TRANSFER_1',
                  'KVKK.TRANSFER_2',
                  'KVKK.TRANSFER_3',
                ],
              })}

              <Text style={styles.modalText}>
                {t('KVKK.SECTION_3_NOTE')}
              </Text>

              {renderTermsSection({
                title:'KVKK.SECTION_4_TITLE',
                texts:[
                  'KVKK.SECTION_4_TEXT',
                ],
                items:[
                  'KVKK.LEGAL_BASIS_1',
                  'KVKK.LEGAL_BASIS_2',
                  'KVKK.LEGAL_BASIS_3',
                ],
              })}

              {renderTermsSection({
                title:'KVKK.SECTION_5_TITLE',
                texts:[
                  'KVKK.SECTION_5_TEXT_1',
                  'KVKK.SECTION_5_TEXT_2',
                  'KVKK.SECTION_5_TEXT_3',
                ],
              })}

              {renderTermsSection({
                title:'KVKK.SECTION_6_TITLE',
                texts:[
                  'KVKK.SECTION_6_TEXT',
                ],
                items:[
                  'KVKK.RIGHT_1',
                  'KVKK.RIGHT_2',
                  'KVKK.RIGHT_3',
                  'KVKK.RIGHT_4',
                  'KVKK.RIGHT_5',
                  'KVKK.RIGHT_6',
                  'KVKK.RIGHT_7',
                  'KVKK.RIGHT_8',
                  'KVKK.RIGHT_9',
                ],
              })}

              <Text style={styles.modalText}>
                {t('KVKK.APPLICATION_TEXT')}
              </Text>

            </ScrollView>

            <View style={styles.modalFooter}>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalCancel}
                onPress={()=>
                  setKvkkModalVisible(false)
                }
              >
                <Text style={styles.modalCancelText}>
                  {t('cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.modalAccept,
                  {
                    backgroundColor:colors.primary,
                  },
                ]}
                onPress={acceptKvkk}
              >
                <Text style={styles.modalAcceptText}>
                  {t('ok')}
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default SignUp;