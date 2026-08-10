import {useCallback,useState} from 'react';
import {ActivityIndicator,ScrollView,TouchableOpacity,View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {BaseStyle,useTheme} from '@/config';
import {Header,Icon,SafeAreaView,Text} from '@/components';
import {getUserAgreementsRequest} from '@/apis/userApi';
import styles from './styles';

const formatDate=value=>{
  if(!value)return '-';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return String(value);
  const pad=n=>String(n).padStart(2,'0');
  return `${pad(date.getDate())}.${pad(date.getMonth()+1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const MyAgreements=({navigation})=>{
  const {t}=useTranslation();
  const {colors}=useTheme();
  const {user}=useSelector(state=>state.user);
  const [loading,setLoading]=useState(true);
  const [agreements,setAgreements]=useState([]);
  const [expandedId,setExpandedId]=useState(null);
  const [error,setError]=useState('');

  const typeKey=type=>{
    const value=String(type||'').toLowerCase();
    if(value==='preinformationform')return'my_agreements_type_pre_information';
    if(value==='distancesalesagreement')return'my_agreements_type_distance_sales';
    if(value==='privacypolicy')return'my_agreements_type_privacy';
    if(value==='kvkk'||value==='kvkkdisclosure')return'my_agreements_type_kvkk';
    if(value==='commercialcommunication')return'my_agreements_type_commercial';
    if(value==='socialresponsibility')return'my_agreements_type_social';
    if(value==='membershipterms'||value==='termsofuse')return'my_agreements_type_membership';
    return'my_agreements_type_membership';
  };

  const contextKey=context=>
    String(context||'').toLowerCase()==='purchase'
      ?'my_agreements_context_purchase'
      :'my_agreements_context_registration';

  const translated=key=>{
    const value=t(key);
    return value&&value!==key?value:'';
  };

  const section=(titleKey,textKeys=[],listKeys=[])=>{
    const parts=[];
    const title=translated(titleKey);
    if(title)parts.push(title);

    textKeys.forEach(key=>{
      const value=translated(key);
      if(value)parts.push(value);
    });

    listKeys.forEach(key=>{
      const value=translated(key);
      if(value)parts.push(`• ${value}`);
    });

    return parts.filter(Boolean).join('\n\n');
  };

  const buildTermsContent=()=>{
    const parts=[
      translated('TERMS.PAGE_TITLE'),
      section('TERMS.SECTION_1_TITLE',['TERMS.SECTION_1_TEXT']),
      section('TERMS.SECTION_2_TITLE',['TERMS.SECTION_2_TEXT']),
      section('TERMS.SECTION_3_TITLE',['TERMS.SECTION_3_TEXT']),
      section('TERMS.SECTION_4_TITLE',[
        'TERMS.SECTION_4_TEXT_1',
        'TERMS.SECTION_4_TEXT_2',
        'TERMS.SECTION_4_TEXT_3',
      ]),
      section('TERMS.SECTION_5_TITLE',[
        'TERMS.SECTION_5_TEXT_1',
        'TERMS.SECTION_5_TEXT_2',
        'TERMS.SECTION_5_TEXT_3',
      ]),
      section('TERMS.SECTION_6_TITLE',[
        'TERMS.SECTION_6_TEXT_1',
        'TERMS.SECTION_6_TEXT_2',
        'TERMS.SECTION_6_TEXT_3',
      ]),
      section('TERMS.SECTION_7_TITLE',[
        'TERMS.SECTION_7_TEXT_1',
        'TERMS.SECTION_7_TEXT_2',
      ]),
      section('TERMS.SECTION_8_TITLE',[
        'TERMS.SECTION_8_TEXT_1',
        'TERMS.SECTION_8_TEXT_2',
        'TERMS.SECTION_8_TEXT_3',
        'TERMS.SECTION_8_TEXT_4',
        'TERMS.SECTION_8_TEXT_5',
        'TERMS.SECTION_8_TEXT_6',
        'TERMS.SECTION_8_TEXT_7',
      ]),
      section('TERMS.SECTION_9_TITLE',['TERMS.SECTION_9_TEXT']),
      section(
        'TERMS.SECTION_10_TITLE',
        [],
        [
          'TERMS.SECTION_10_ITEM_1',
          'TERMS.SECTION_10_ITEM_2',
          'TERMS.SECTION_10_ITEM_3',
          'TERMS.SECTION_10_ITEM_4',
          'TERMS.SECTION_10_ITEM_5',
        ],
      ),
    ];

    return parts.filter(Boolean).join('\n\n');
  };

  const buildPrivacyContent=()=>{
    const parts=[
      translated('PRIVACY_POLICY.PAGE_TITLE'),
      section(
        'PRIVACY_POLICY.SECTION_1_TITLE',
        ['PRIVACY_POLICY.SECTION_1_TEXT'],
      ),
      section(
        'PRIVACY_POLICY.SECTION_2_TITLE',
        ['PRIVACY_POLICY.SECTION_2_TEXT'],
        [
          'PRIVACY_POLICY.DATA_1',
          'PRIVACY_POLICY.DATA_2',
          'PRIVACY_POLICY.DATA_3',
          'PRIVACY_POLICY.DATA_4',
        ],
      ),
      section(
        'PRIVACY_POLICY.SECTION_3_TITLE',
        ['PRIVACY_POLICY.SECTION_3_TEXT'],
        [
          'PRIVACY_POLICY.PURPOSE_1',
          'PRIVACY_POLICY.PURPOSE_2',
          'PRIVACY_POLICY.PURPOSE_3',
        ],
      ),
      section(
        'PRIVACY_POLICY.SECTION_4_TITLE',
        [
          'PRIVACY_POLICY.SECTION_4_TEXT_1',
          'PRIVACY_POLICY.SECTION_4_TEXT_2',
          'PRIVACY_POLICY.SECTION_4_TEXT_3',
        ],
      ),
      section(
        'PRIVACY_POLICY.SECTION_5_TITLE',
        ['PRIVACY_POLICY.SECTION_5_TEXT'],
        [
          'PRIVACY_POLICY.SHARING_1',
          'PRIVACY_POLICY.SHARING_2',
          'PRIVACY_POLICY.SHARING_3',
        ],
      ),
      section(
        'PRIVACY_POLICY.SECTION_6_TITLE',
        [
          'PRIVACY_POLICY.SECTION_6_TEXT_1',
          'PRIVACY_POLICY.SECTION_6_TEXT_2',
          'PRIVACY_POLICY.SECTION_6_TEXT_3',
        ],
      ),
      section(
        'PRIVACY_POLICY.SECTION_7_TITLE',
        ['PRIVACY_POLICY.SECTION_7_TEXT'],
        [
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
      ),
      translated('PRIVACY_POLICY.APPLICATION_TEXT'),
      section(
        'PRIVACY_POLICY.SECTION_8_TITLE',
        ['PRIVACY_POLICY.SECTION_8_TEXT'],
      ),
    ];

    return parts.filter(Boolean).join('\n\n');
  };

  const buildKvkkContent=()=>{
    const parts=[
      translated('KVKK.PAGE_TITLE'),
      section('KVKK.SECTION_1_TITLE',['KVKK.SECTION_1_TEXT']),
      section(
        'KVKK.SECTION_2_TITLE',
        ['KVKK.SECTION_2_TEXT'],
        [
          'KVKK.PURPOSE_1',
          'KVKK.PURPOSE_2',
          'KVKK.PURPOSE_3',
          'KVKK.PURPOSE_4',
        ],
      ),
      section(
        'KVKK.SECTION_3_TITLE',
        ['KVKK.SECTION_3_TEXT'],
        [
          'KVKK.TRANSFER_1',
          'KVKK.TRANSFER_2',
          'KVKK.TRANSFER_3',
        ],
      ),
      translated('KVKK.SECTION_3_NOTE'),
      section(
        'KVKK.SECTION_4_TITLE',
        ['KVKK.SECTION_4_TEXT'],
        [
          'KVKK.LEGAL_BASIS_1',
          'KVKK.LEGAL_BASIS_2',
          'KVKK.LEGAL_BASIS_3',
        ],
      ),
      section(
        'KVKK.SECTION_5_TITLE',
        ['KVKK.SECTION_5_TEXT'],
        [
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
      ),
      translated('KVKK.APPLICATION_TEXT'),
      section('KVKK.SECTION_6_TITLE',['KVKK.SECTION_6_TEXT']),
    ];

    return parts.filter(Boolean).join('\n\n');
  };

  const fallbackContent=item=>{
    const type=String(item?.agreementType||'').toLowerCase();
    const url=String(item?.documentUrl||'').toLowerCase();

    if(
      type==='membershipterms'||
      type==='termsofuse'||
      url.includes('terms-of-use')
    ){
      return buildTermsContent();
    }

    if(
      type==='privacypolicy'||
      url.includes('privacy-policy')
    ){
      return buildPrivacyContent();
    }

    if(
      type==='kvkk'||
      type==='kvkkdisclosure'||
      url.includes('/kvkk')
    ){
      return buildKvkkContent();
    }

    return '';
  };

  const getAgreementContent=item=>
    String(item?.contentSnapshot||'').trim()||
    fallbackContent(item);

  const loadAgreements=useCallback(async()=>{
    if(!user?.id){
      setAgreements([]);
      setError('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try{
      const response=await getUserAgreementsRequest(user.id);

      if(response?.isSuccess){
        setAgreements(Array.isArray(response.data)?response.data:[]);
      }
      else{
        setAgreements([]);
        setError(response?.message||t('my_agreements_load_error'));
      }
    }
    catch(e){
      setAgreements([]);
      setError(
        e?.response?.data?.message||
        e?.message||
        t('my_agreements_load_error'),
      );
    }
    finally{
      setLoading(false);
    }
  },[user?.id,t]);

  useFocusEffect(
    useCallback(()=>{
      loadAgreements();
    },[loadAgreements]),
  );

  const toggleDetails=id=>{
    setExpandedId(current=>current===id?null:id);
  };

  return(
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right','top','left']}
    >
      <Header
        title=""
        renderLeft={()=>(
          <Icon
            name="angle-left"
            size={20}
            color={colors.primary}
            enableRTL={true}
          />
        )}
        onPressLeft={()=>navigation.goBack()}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <View style={styles.kickerRow}>
              <View
                style={[
                  styles.kickerLine,
                  {backgroundColor:colors.primary},
                ]}
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

          <Text numberOfLines={0} style={styles.title}>
            {t('my_agreements')}
          </Text>

          <Text numberOfLines={0} grayColor style={styles.description}>
            {t('my_agreements_description')}
          </Text>
        </View>

        {loading&&(
          <View style={styles.centerState}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />
          </View>
        )}

        {!loading&&!!error&&(
          <View
            style={[
              styles.stateCard,
              {borderColor:colors.border},
            ]}
          >
            <Icon
              name="circle-exclamation"
              size={26}
              color={colors.primary}
            />

            <Text body2 style={styles.stateText}>
              {error}
            </Text>

            <TouchableOpacity
              onPress={loadAgreements}
              style={[
                styles.retryButton,
                {borderColor:colors.primary},
              ]}
            >
              <Text
                body2
                semibold
                style={{color:colors.primary}}
              >
                {t('retry')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading&&!error&&!agreements.length&&(
          <View
            style={[
              styles.stateCard,
              {borderColor:colors.border},
            ]}
          >
            <Icon
              name="file-contract"
              size={30}
              color={colors.primary}
            />

            <Text headline style={styles.emptyTitle}>
              {t('my_agreements_empty')}
            </Text>
          </View>
        )}

        {!loading&&!error&&agreements.map(item=>{
          const expanded=expandedId===item.id;
          const agreementContent=getAgreementContent(item);
          const canView=!!agreementContent;

          return(
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  borderColor:colors.border,
                  backgroundColor:
                    colors.card||
                    colors.background,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardContent}>
                  <Text headline semibold>
                    {item.title||t(typeKey(item.agreementType))}
                  </Text>

                  <View style={styles.badges}>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor:
                            colors.primary+'14',
                        },
                      ]}
                    >
                      <Text
                        caption1
                        semibold
                        style={{color:colors.primary}}
                      >
                        {t(typeKey(item.agreementType))}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.badge,
                        {
                          borderColor:colors.border,
                          borderWidth:1,
                        },
                      ]}
                    >
                      <Text caption1>
                        {t(contextKey(item.context))}
                      </Text>
                    </View>

                    {!!item.version&&(
                      <View
                        style={[
                          styles.badge,
                          {
                            borderColor:colors.border,
                            borderWidth:1,
                          },
                        ]}
                      >
                        <Text caption1>
                          v{item.version}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    caption1
                    grayColor
                    style={styles.date}
                  >
                    {formatDate(item.acceptedDate)}
                  </Text>
                </View>

                {canView&&(
                  <TouchableOpacity
                    style={[
                      styles.viewButton,
                      {
                        backgroundColor:
                          colors.primary+'14',
                      },
                    ]}
                    onPress={()=>
                      toggleDetails(item.id)
                    }
                  >
                    <Text
                      caption1
                      semibold
                      style={{color:colors.primary}}
                    >
                      {t(
                        expanded
                          ?'my_agreements_hide'
                          :'my_agreements_view',
                      )}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {expanded&&canView&&(
                <View
                  style={[
                    styles.details,
                    {
                      borderTopColor:
                        colors.border,
                    },
                  ]}
                >
                  <Text
                    body2
                    semibold
                    style={styles.detailsTitle}
                  >
                    {t(
                      'my_agreements_accepted_content',
                    )}
                  </Text>

                  <Text
                    numberOfLines={0}
                    style={styles.snapshot}
                  >
                    {agreementContent}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAgreements;
