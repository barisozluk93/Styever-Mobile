import { FlatList, View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Header,
  Icon,
  NotFound,
  SafeAreaView,
  Text
} from '@/components';
import { BaseStyle, useTheme } from '@/config';
import { useCallback, useState } from 'react';
import { getUserAddressesRequest } from '@/apis/userApi';
import { useSelector } from 'react-redux';
import styles from './styles';
import AddressList from '@/components/AddressList';
import { useFocusEffect } from '@react-navigation/native';

const MyAddresses = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = () => {
    setLoading(true);
    getUserAddressesRequest(user.id).then(response => {
      if (response.isSuccess) {
        setData(response.data);
        setLoading(false);
      }
    })
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();

    }, [])
  );

  const renderContent = () => {
    return (
      <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
        <Header title={t('my_addresses')}
          renderLeft={() => {
            return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          renderRight={() => {
            return <Text headline primaryColor> {t('create_address')}</Text>;
          }}
          onPressRight={() => {
            navigation.navigate('Address', {item: {id: 0, userId: user.id}});
          }}
        />

        <View style={{ flex: 1 }}>

          {!loading && data && data.length === 0 && <NotFound />}

          {!loading && data && data.length > 0 && <FlatList
            horizontal={false}
            data={data}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item }) => (
              <AddressList
                item={item}
                onSelect={() => navigation.navigate("Address", { item: item })}
                style={{
                  margin: 10,
                }}
              />
            )}
          />}

          {loading ? (
            <ActivityIndicator size="large" style={{ flex: 1 }} />
          ) : null
          }
        </View>

      </SafeAreaView>
    );
  };

  return renderContent();
};

export default MyAddresses;
