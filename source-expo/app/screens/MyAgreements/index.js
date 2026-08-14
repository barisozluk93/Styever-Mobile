import {useCallback,useState} from 'react';
import {ActivityIndicator,ScrollView,TouchableOpacity,View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {BaseStyle,useTheme} from '@/config';
import {Header, Icon, Image, SafeAreaView, Text} from '@/components';
import {getUserAgreementsRequest} from '@/apis/userApi';
import {getRegistrationLegalContents} from '@/apis/legalContentApi';
import {getLocalizedLegalContent} from '@/utils/legalContent';
import styles from './styles';

const formatDate=value=>{
  if(!value)return '-';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return String(value);
  const pad=n=>String(n).padStart(2,'0');
  return `${pad(date.getDate())}.${pad(date.getMonth()+1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const MyAgreements=({navigation})=>{
  const {t,i18n}=useTranslation();
  const {colors}=useTheme();
  const {user}=useSelector(state=>state.user);
  const [loading,setLoading]=useState(true);
  const [agreements,setAgreements]=useState([]);
  const [expandedId,setExpandedId]=useState(null);
  const [error,setError]=useState('');
  const [legalDocuments,setLegalDocuments]=useState({});

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

  const legalLanguage=(i18n.language||'tr').split('-')[0]==='en'?'en':'tr';

  const legalSlugForAgreement=item=>{
    const type=String(item?.agreementType||'').toLowerCase();
    const url=String(item?.documentUrl||'').toLowerCase();

    if(type==='membershipterms'||type==='termsofuse'||url.includes('terms-of-use')){
      return'terms-of-use';
    }
    if(type==='privacypolicy'||url.includes('privacy-policy')){
      return'privacy-policy';
    }
    if(type==='kvkk'||type==='kvkkdisclosure'||url.includes('/kvkk')){
      return'kvkk';
    }
    return'';
  };

  const getAgreementContent=item=>{
    const slug=legalSlugForAgreement(item);
    if(slug&&legalDocuments[slug]){
      return getLocalizedLegalContent(legalDocuments[slug],legalLanguage);
    }
    return String(item?.contentSnapshot||'').trim();
  };

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
      const [response,legal]=await Promise.all([
        getUserAgreementsRequest(user.id),
        getRegistrationLegalContents(),
      ]);

      setLegalDocuments(legal);

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
  },[user?.id,t,legalLanguage]);

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
