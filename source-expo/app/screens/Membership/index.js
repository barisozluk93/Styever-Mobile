import {ScrollView,TouchableOpacity,View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  Button,
  Header,
  Icon,
  SafeAreaView,
  Text,
} from '@/components';
import {BaseStyle,useTheme} from '@/config';
import {useSelector} from 'react-redux';
import styles from './styles';

const Membership=({navigation})=>{
  const {t}=useTranslation();
  const {colors}=useTheme();
  const {user}=useSelector(state=>state.user);

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

  const getPlan=()=>{
    if(user?.roles?.includes(4)){
      return{
        id:4,
        name:t('ultra'),
        price:`₺1299,00/${t('year')}`,
        properties:[
          t('ultraProperty1'),
          t('ultraProperty2'),
          t('ultraProperty3'),
          t('ultraProperty4'),
          t('ultraProperty5'),
          t('ultraProperty7'),
        ],
      };
    }

    if(user?.roles?.includes(3)){
      return{
        id:3,
        name:t('premium'),
        price:`₺699,00/${t('year')}`,
        preferred:true,
        properties:[
          t('premiumProperty1'),
          t('premiumProperty2'),
          t('premiumProperty3'),
          t('premiumProperty4'),
          t('premiumProperty5'),
          t('premiumProperty7'),
        ],
      };
    }

    return{
      id:2,
      name:t('standard'),
      price:`₺499,00/${t('year')}`,
      properties:[
        t('standardProperty1'),
        t('standardProperty2'),
        t('standardProperty3'),
        t('standardProperty5'),
      ],
    };
  };

  const plan=getPlan();

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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

        <View
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
        </View>

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

        {!user?.isActive&&!user?.isTrial&&(
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.manageHint,
              {backgroundColor:colors.primary+'0D'},
            ]}
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
            <View style={styles.manageHintText}>
              <Text
                numberOfLines={0}
                style={styles.manageTitle}
              >
                {t('membership_manage_title')}
              </Text>

              <Text
                numberOfLines={0}
                grayColor
                style={styles.manageDescription}
              >
                {t('membership_manage_description')}
              </Text>
            </View>

            <Icon
              name="angle-right"
              size={16}
              color={colors.primary}
              enableRTL={true}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Membership;
