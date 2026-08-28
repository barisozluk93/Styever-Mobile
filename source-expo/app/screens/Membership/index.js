import {ScrollView,TouchableOpacity,View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useEffect,useMemo,useState} from 'react';
import {Button, Header, Icon, Image, SafeAreaView, Text} from '@/components';
import {BaseStyle,useTheme} from '@/config';
import {useSelector} from 'react-redux';
import styles from './styles';
import {getPlansRequest} from '@/apis/planApi';

const Membership=({navigation})=>{
  const {t,i18n}=useTranslation();
  const {colors}=useTheme();
  const {user}=useSelector(state=>state.user);
  const [plans,setPlans]=useState([]);

  const formatDate=value=>{
    if(!value)return '-';

    const date=new Date(value);

    if(Number.isNaN(date.getTime())){
      return '-';
    }

    return date.toLocaleDateString('tr-TR',{
      day:'2-digit',
      month:'2-digit',
      year:'numeric',
      hour:'2-digit',
      minute:'2-digit',
    });
  };

  const parseProperties=value=>{
    if(!value)return [];
    if(Array.isArray(value))return value.filter(Boolean);

    const text=String(value).trim();
    if(!text)return [];

    try{
      const json=JSON.parse(text);
      if(Array.isArray(json)){
        return json.map(x=>String(x).trim()).filter(Boolean);
      }
    }catch(_){}

    return text
      .split(/\r?\n|\|/)
      .map(x=>x.replace(/^[-•✓]+\s*/, '').trim())
      .filter(Boolean);
  };

  const formatDbPrice=plan=>{
    if(!plan)return '-';

    const isEnglish=String(i18n.language||'tr').toLowerCase().startsWith('en');
    const amount=Number(plan?.price||0);
    const currency=String(plan?.currency||'TRY').toUpperCase();
    const period=isEnglish
      ?(plan?.periodEn||plan?.period)
      :(plan?.period||plan?.periodEn);
    const symbol=currency==='TRY'||currency==='TL'?'₺':currency;
    const locale=isEnglish?'en-US':'tr-TR';
    const formatted=amount.toLocaleString(locale,{
      minimumFractionDigits:2,
      maximumFractionDigits:2,
    });

    return `${symbol}${formatted}${period?`/${period}`:''}`;
  };

  useEffect(()=>{
    let mounted=true;

    getPlansRequest()
      .then(response=>{
        if(!mounted)return;

        if(!response?.isSuccess){
          throw new Error(response?.message||t('error'));
        }

        const list=response?.data||response?.Data||[];
        setPlans(
          (Array.isArray(list)?list:[])
            .filter(plan=>!plan?.isDeleted&&[2,3,4].includes(Number(plan?.id)))
            .sort((a,b)=>(a?.sortOrder||0)-(b?.sortOrder||0)),
        );
      })
      .catch(error=>{
        console.log('Membership plan load error:',error);
        if(mounted)setPlans([]);
      });

    return()=>{
      mounted=false;
    };
  },[]);

  const plan=useMemo(()=>{
    const roleIds=(Array.isArray(user?.roles)?user.roles:[])
      .map(role=>Number(typeof role==='object'?(role?.id??role?.roleId):role))
      .filter(Boolean);

    const activePlanId=[4,3,2].find(id=>roleIds.includes(id));
    const dbPlan=plans.find(item=>Number(item?.id)===activePlanId);

    if(!dbPlan)return null;

    const isEnglish=String(i18n.language||'tr').toLowerCase().startsWith('en');

    return{
      id:dbPlan.id,
      name:isEnglish?(dbPlan.nameEn||dbPlan.name):(dbPlan.name||dbPlan.nameEn),
      price:formatDbPrice(dbPlan),
      preferred:!!dbPlan.isPopular,
      properties:parseProperties(
        isEnglish
          ?(dbPlan.propertiesEn||dbPlan.properties)
          :(dbPlan.properties||dbPlan.propertiesEn),
      ),
    };
  },[plans,user?.roles,i18n.language]);

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
        onPressLeft={()=>{
          if(navigation.canGoBack()){
            navigation.goBack();
          }else{
            navigation.reset({
              index:0,
              routes:[{name:'NewsMenu'}],
            });
          }
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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

          <Text
            numberOfLines={0}
            style={styles.pageTitle}
          >
            {t('membership')}
          </Text>

          <Text
            numberOfLines={0}
            grayColor
            style={styles.description}
          >
            {t('membership_page_description')}
          </Text>
        </View>

        {plan&&(<View
          style={[
            styles.planCard,
            {
              backgroundColor:colors.card,
              borderColor:colors.primary,
            },
          ]}
        >
          {plan.preferred&&(
            <View
              style={[
                styles.preferredBadge,
                {backgroundColor:colors.primary},
              ]}
            >
              <Text style={styles.preferredText}>
                {t('most_preferred')}
              </Text>

              <Icon
                name="star"
                size={10}
                color="#FFFFFF"
              />
            </View>
          )}

          <View style={styles.planHeader}>
            <View style={styles.planHeaderText}>
              <Text
                numberOfLines={0}
                style={styles.planTitle}
              >
                {plan.name}
              </Text>

              <Text
                numberOfLines={0}
                style={[
                  styles.price,
                  {color:colors.primary},
                ]}
              >
                {plan.price}
              </Text>
            </View>

            <View
              style={[
                styles.activeIcon,
                {backgroundColor:colors.primary+'12'},
              ]}
            >
              <Icon
                name="check"
                size={16}
                color={colors.primary}
              />
            </View>
          </View>

          <View style={styles.properties}>
            {plan.properties.map((property,index)=>(
              <View
                key={`${plan.id}-${index}`}
                style={styles.propertyRow}
              >
                <View
                  style={[
                    styles.checkIcon,
                    {backgroundColor:colors.primary},
                  ]}
                >
                  <Icon
                    name="check"
                    size={8}
                    color="#FFFFFF"
                  />
                </View>

                <Text
                  numberOfLines={0}
                  style={styles.propertyText}
                >
                  {property}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.divider,
              {backgroundColor:colors.border},
            ]}
          />

          <View style={styles.dateGrid}>
            <View style={styles.dateBox}>
              <View style={styles.dateLabelRow}>
                <Icon
                  name="calendar-alt"
                  size={13}
                  color={colors.primary}
                />

                <Text
                  style={[
                    styles.dateLabel,
                    {color:colors.primary},
                  ]}
                >
                  {t('start_date')}
                </Text>
              </View>

              <Text
                numberOfLines={0}
                style={styles.dateValue}
              >
                {formatDate(user?.createdDate)}
              </Text>
            </View>

            <View style={styles.dateBox}>
              <View style={styles.dateLabelRow}>
                <Icon
                  name="calendar-alt"
                  size={13}
                  color={colors.primary}
                />

                <Text
                  style={[
                    styles.dateLabel,
                    {color:colors.primary},
                  ]}
                >
                  {t('end_date')}
                </Text>
              </View>

              <Text
                numberOfLines={0}
                style={styles.dateValue}
              >
                {formatDate(user?.expirationDate)}
              </Text>
            </View>
          </View>

          {user?.isTrial&&(
            <View
              style={[
                styles.statusBox,
                {backgroundColor:colors.primary+'0D'},
              ]}
            >
              <View style={styles.statusHeader}>
                <Icon
                  name="clock"
                  size={15}
                  color={colors.primary}
                />

                <Text
                  style={[
                    styles.statusTitle,
                    {color:colors.primary},
                  ]}
                >
                  {t('trial')}
                </Text>
              </View>

              <Text style={styles.statusText}>
                {t('trial_end_date')}: {formatDate(user?.trialExpirationDate)}
              </Text>
            </View>
          )}

          {!user?.isTrial&&!user?.isActive&&(
            <View style={styles.expiredBox}>
              <Icon
                name="circle-exclamation"
                size={15}
                color="#B42318"
              />

              <Text style={styles.expiredText}>
                {t('expired')}
              </Text>
            </View>
          )}
        </View>)}

        {!user?.isTrial&&!user?.isActive&&(
          <Button
            full
            style={styles.actionButton}
            onPress={()=>
              navigation.navigate(
                'Pricing',
                {
                  isStandByPage:false,
                  isProfilePage:true,
                },
              )
            }
          >
            {t('buy_new_package')}
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Membership;
