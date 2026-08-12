import {ActivityIndicator,Alert,FlatList,TouchableOpacity,View} from 'react-native';import {useTranslation} from 'react-i18next';import {Header, Icon, Image, SafeAreaView, Text} from '@/components';import {BaseStyle,useTheme} from '@/config';import {useCallback,useState} from 'react';import {deleteUserAddressRequest,getUserAddressesRequest} from '@/apis/userApi';import {useSelector} from 'react-redux';import styles from './styles';import AddressList from '@/components/AddressList';import {useFocusEffect} from '@react-navigation/native';import Toast from 'react-native-toast-message';
const MyAddresses=({navigation})=>{const {t}=useTranslation();const {colors}=useTheme();const {user}=useSelector(s=>s.user);const [loading,setLoading]=useState(false);const [data,setData]=useState([]);const fetchData=()=>{setLoading(true);getUserAddressesRequest(user.id).then(r=>{if(r.isSuccess)setData(r.data||[]);}).finally(()=>setLoading(false));};useFocusEffect(useCallback(()=>{fetchData();},[]));

const deleteAddress=(item)=>{
  Alert.alert(
    t('remove'),
    t('delete_address_confirm')||t('are_you_sure'),
    [
      {text:t('cancel'),style:'cancel'},
      {
        text:t('remove'),
        style:'destructive',
        onPress:()=>{
          setLoading(true);
          deleteUserAddressRequest(item.id)
            .then(r=>{
              if(r?.isSuccess){
                setData(prev=>prev.filter(x=>x.id!==item.id));
                Toast.show({type:'success',text1:t('success'),text2:t('address_delete_success')});
              }else{
                Toast.show({type:'error',text1:t('error'),text2:r?.message || t('address_delete_error')});
              }
            })
            .catch(error=>Toast.show({type:'error',text1:t('error'),text2:error?.response?.data?.message || t('address_delete_error')}))
            .finally(()=>setLoading(false));
        },
      },
    ],
  );
};

return <SafeAreaView style={BaseStyle.safeAreaView} edges={['right','top','left']}><Header title="" renderLeft={()=><Icon name="angle-left" size={20} color={colors.primary}/>} onPressLeft={()=>navigation.goBack()}/><FlatList data={data} keyExtractor={(item,i)=>String(item.id||i)} contentContainerStyle={styles.content} ListHeaderComponent={<><View style={styles.heading}>
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

          <Text numberOfLines={0} style={styles.pageTitle}>
            {t('my_addresses')}
          </Text>

          <Text numberOfLines={0} grayColor style={styles.description}>
            {t('my_addresses_description')}
          </Text>
        </View><TouchableOpacity style={[styles.addButton,{backgroundColor:colors.primary}]} onPress={()=>navigation.navigate('Address',{item:{id:0,userId:user.id}})}><Icon name="plus" size={14} color={colors.card}/><Text style={[styles.addText,{color:colors.card}]}>{t('create_address')}</Text></TouchableOpacity></>} renderItem={({item})=>(
  <AddressList
    item={item}
    onSelect={()=>navigation.navigate('Address',{item})}
    onDelete={deleteAddress}
    style={styles.card}
  />
)} ListEmptyComponent={!loading?<View style={[styles.empty,{borderColor:colors.border}]}><Icon name="location-dot" size={30} color={colors.primary}/><Text style={styles.emptyTitle}>{t('no_address')}</Text></View>:null} showsVerticalScrollIndicator={false}/>{loading&&<View style={styles.loading}><ActivityIndicator size="large" color={colors.primary}/></View>}</SafeAreaView>};export default MyAddresses;