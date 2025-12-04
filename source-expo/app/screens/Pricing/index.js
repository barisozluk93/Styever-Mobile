import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CategoryData } from '@/data';
import {
  CategoryBlock,
  CategoryBoxColor,
  CategoryBoxColor2,
  CategoryGrid,
  CategoryIcon,
  CategoryList,
  Header,
  Icon,
  PriceList,
  Project02,
  SafeAreaView,
  Text,
  TextInput,
} from '@/components';
import { BaseColor, BaseStyle, Typography, useTheme } from '@/config';
import * as Utils from '@/utils';

let timeoutChangeMode = null;

const Pricing = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [refreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeView, setModeView] = useState('bars');
  const [category, setCategory] = useState(CategoryData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const data = [
    {
      id: 1,
      name: t('standard'),
      description: t('standardDesc'),
      price: "₺2.250,00",
      properties: [t('standardProperty1'), t('standardProperty2'), t('standardProperty3')]
    },
    {
      id: 2,
      name: t('premium'),
      description: t('premiumDesc'),
      price: "₺3.000,00",
      properties: [t('premiumProperty1'), t('premiumProperty2'), t('premiumProperty3'), t('premiumProperty4'), t('premiumProperty5')]
    },
    {
      id: 3,
      name: t('platinum'),
      description: t('premiumDesc'),
      price: "₺10.000,00",
      properties: [t('platinumProperty1'), t('platinumProperty2'), t('platinumProperty3'), t('platinumProperty4'), t('platinumProperty5'), t('platinumProperty6')]
    }
  ];

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
            horizontal
            data={data}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item }) => (
              <PriceList
                item={item}
                style={{
                  margin: 10,
                }}
              />
            )}
          />
        </View>
      </SafeAreaView>
    );
  };

  return renderContent();
};

export default Pricing;
