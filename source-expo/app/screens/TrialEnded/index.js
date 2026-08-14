import {Alert,View} from 'react-native';
import {useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import {BaseColor,BaseStyle,useTheme} from '@/config';
import {Button,Icon,Image,SafeAreaView,Text} from '@/components';
import {getUserByToken,logout} from '@/actions/auth';
import {deleteUserRequest} from '@/apis/userApi';
import {loadToken} from '@/utils/storage';
import styles from './styles';

const TrialEnded=({navigation})=>{
  const {t}=useTranslation();
  const {colors}=useTheme();
  const dispatch=useDispatch();
  const {user}=useSelector(state=>state.user);

  useEffect(()=>{
    if(!user){
      dispatch(getUserByToken());
    }
  },[user,dispatch]);

  const goToHome=()=>{
    // TrialEnded lives in MainStack. NHome is a child tab of NewsMenu,
    // so the MainStack must be reset to NewsMenu rather than NHome.
    navigation.reset({index:0,routes:[{name:'NewsMenu'}]});
  };

  const onLogOut=async()=>{
    try{
      await dispatch(logout());
    }finally{
      dispatch({type:'USER_INIT'});
      dispatch({type:'MEMORY_INIT'});
      dispatch({type:'ARTICLE_INIT'});
      goToHome();
    }
  };

  const clearSession=async()=>{
    try{
      await dispatch(logout());
    }finally{
      dispatch({type:'USER_INIT'});
      dispatch({type:'MEMORY_INIT'});
      dispatch({type:'ARTICLE_INIT'});
      goToHome();
    }
  };

  const getTokenUserId=async()=>{
    const token=await loadToken();
    if(!token)return null;

    try{
      const payloadPart=token.split('.')[1];
      if(!payloadPart)return null;
      const normalized=payloadPart.replace(/-/g,'+').replace(/_/g,'/');
      const padded=normalized+'='.repeat((4-normalized.length%4)%4);
      const payload=JSON.parse(atob(padded));
      const rawId=payload?.id ?? payload?.userId ?? payload?.nameid ?? payload?.sub;
      const parsedId=Number(rawId);
      return Number.isFinite(parsedId) && parsedId>0 ? parsedId : rawId || null;
    }catch(error){
      return null;
    }
  };

  const onDeleteAccount=async()=>{
    const userId=user?.id || await getTokenUserId();

    if(!userId){
      Alert.alert(t('error'),t('delete_account_error'));
      return;
    }

    Alert.alert(
      t('delete_account'),
      t('delete_account_confirmation'),
      [
        {text:t('cancel'),style:'cancel'},
        {
          text:t('delete'),
          style:'destructive',
          onPress:async()=>{
            try{
              const response=await deleteUserRequest(userId);
              if(response?.isSuccess===false){
                Alert.alert(t('error'),response?.message || t('delete_account_error'));
                return;
              }
              Toast.show({
                type:'success',
                text1:t('success'),
                text2:t('delete_account_success'),
              });
              setTimeout(()=>{
                clearSession();
              },1200);
            }catch(error){
              console.log('TrialEnded delete account error',error?.response?.status,error?.response?.data);
              Alert.alert(t('error'),error?.response?.data?.message || t('delete_account_error'));
            }
          },
        },
      ],
    );
  };

  return(
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right','top','left','bottom']}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.kickerRow}>
            <Image
              source={require('../../assets/images/styever-mark.png')}
              style={styles.kickerLogo}
              resizeMode="contain"
            />
            <Text style={[styles.kicker,{color:colors.primary}]}>STYEVER</Text>
          </View>

          <View
            style={[
              styles.iconBox,
              {backgroundColor:colors.primary+'12'},
            ]}
          >
            <Icon name="clock" size={28} color={colors.primary}/>
          </View>

          <Text style={styles.title}>
            {t('trial_ended_title')}
          </Text>

          <Text grayColor style={styles.description}>
            {t('trial_ended_description')}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            full
            onPress={onDeleteAccount}
            style={{backgroundColor:BaseColor.pinkLightColor,marginBottom:10}}
          >
            {t('delete_account')}
          </Button>

          <Button full onPress={onLogOut}>
            {t('sign_out')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TrialEnded;
