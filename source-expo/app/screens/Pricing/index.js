import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Header,
  Icon,
  PriceList,
  SafeAreaView,
} from '@/components';
import { BaseStyle, useTheme } from '@/config';
import styles from './styles';
import { useState } from 'react';

const Pricing = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selectedPlanId, setSelectedPlanId] = useState(1);
  const [loading, setLoading] = useState(false);

  const data = [
    {
      id: 1,
      name: t('standard'),
      price: "₺359,00/" + t('year'),
      properties: [t('standardProperty1'), t('standardProperty2'), t('standardProperty3'), t('standardProperty4')]
    },
    {
      id: 2,
      name: t('premium'),
      price: "₺559,00/" + t('year'),
      properties: [t('premiumProperty1'), t('premiumProperty2'), t('premiumProperty3'), t('premiumProperty4'), t('premiumProperty5'), t('premiumProperty6'), t('premiumProperty7'), t('premiumProperty8')]
    },
    {
      id: 3,
      name: t('ultra'),
      price: "₺959,00/" + t('year'),
      properties: [t('ultraProperty1'), t('ultraProperty2'), t('ultraProperty3'), t('ultraProperty4'), t('ultraProperty5'), t('ultraProperty6'), t('ultraProperty7'), t('ultraProperty8'), t('ultraProperty9')]
    }
  ];

  const continueRegister = () => {
    setLoading(true);
      setTimeout(() => {
        setLoading(false);
          navigation.navigate('SignUp', { selectedPlanId: selectedPlanId})
        }, 500);
  }

  const renderContent = () => {
    return (
      <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
        <Header title={t('pricing')}
          renderLeft={() => {
            return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <View style={{ flex: 1 }}>
          <FlatList
            horizontal={false}
            data={data}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item }) => (
              <PriceList
                item={item}
                selected={item.id === selectedPlanId}
                onSelect={() => setSelectedPlanId(item.id)}
                style={{
                  margin: 10,
                }}
              />
            )}
          />
          <View style={styles.bottomBar}>
            <Button full loading={loading} onPress={() => continueRegister()}>
              {t('continue')}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  return renderContent();
};

export default Pricing;
