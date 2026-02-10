import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseStyle, useTheme } from '@/config';
import { Accordion, Header, Icon, SafeAreaView } from '@/components';
import styles from './styles';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { listFaqRequest } from '@/apis/faqApi';
import { useSelector } from 'react-redux';


const Faqs = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { language } = useSelector(state => state.application);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = () => {
    setLoading(true);
    listFaqRequest().then(response => {
      if (response.isSuccess) {
        setData(response.data);
        setLoading(false);
      }
    })
  }
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('faqs')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.contain}>
          {data.map((item, index) => (
          <Accordion key={index} title={language === 'tr' ? item.header : item.headerEn} description={language === 'tr' ? item.content : item.contentEn} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Faqs;
