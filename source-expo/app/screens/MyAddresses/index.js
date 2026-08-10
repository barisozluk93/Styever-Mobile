import {ActivityIndicator,FlatList,TouchableOpacity,View} from 'react-native';import {useTranslation} from 'react-i18next';import {Header,Icon,SafeAreaView,Text} from '@/components';import {BaseStyle,useTheme} from '@/config';import {useCallback,useState} from 'react';import {getUserAddressesRequest} from '@/apis/userApi';import {useSelector} from 'react-redux';import styles from './styles';import AddressList from '@/components/AddressList';import {useFocusEffect} from '@react-navigation/native';
const MyAddresses=({navigation})=>{const {t}=useTranslation();const {colors}=useTheme();const {user}=useSelector(s=>s.user);const [loading,setLoading]=useState(false);const [data,setData]=useState([]);const fetchData=()=>{setLoading(true);getUserAddressesRequest(user.id).then(r=>{if(r.isSuccess)setData(r.data||[]);}).finally(()=>setLoading(false));};useFocusEffect(useCallback(()=>{fetchData();},[]));return <SafeAreaView style={BaseStyle.safeAreaView} edges={['right','top','left']}><Header title="" renderLeft={()=><Icon name="angle-left" size={20} color={colors.primary}/>} onPressLeft={()=>navigation.goBack()}/><FlatList data={data} keyExtractor={(item,i)=>String(item.id||i)} contentContainerStyle={styles.content} ListHeaderComponent={<><View style={styles.heading}>
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

          <Text numberOfLines={0} style={styles.pageTitle}>
            {t('my_addresses')}
          </Text>

          <Text numberOfLines={0} grayColor style={styles.description}>
            {t('my_addresses_description')}
          </Text>
        </View><TouchableOpacity style={[styles.addButton,{borderColor:colors.primary}]} onPress={()=>navigation.navigate('Address',{item:{id:0,userId:user.id}})}><Icon name="plus" size={14} color={colors.primary}/><Text style={[styles.addText,{color:colors.primary}]}>{t('create_address')}</Text></TouchableOpacity></>} renderItem={({item})=><AddressList item={item} onSelect={()=>navigation.navigate('Address',{item})} style={styles.card}/>} ListEmptyComponent={!loading?<View style={[styles.empty,{borderColor:colors.border}]}><Icon name="location-dot" size={30} color={colors.primary}/><Text style={styles.emptyTitle}>{t('no_address')}</Text></View>:null} showsVerticalScrollIndicator={false}/>{loading&&<View style={styles.loading}><ActivityIndicator size="large" color={colors.primary}/></View>}</SafeAreaView>};export default MyAddresses;