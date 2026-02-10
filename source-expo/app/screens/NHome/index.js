import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, View, TouchableOpacity } from 'react-native';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import { SafeAreaView, Image, Text, Button, Icon, Placeholder, PlaceholderLine } from '@/components';
import styles from './styles';
import { useSelector } from 'react-redux';
import { getMemoryCountRequest } from '@/apis/memoryApi';

const NHome = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, []);

  const craeteMemory = () => {
    if (user) {
      if(user.isActive) {
        getMemoryCountRequest(user.id).then(response => {
          if (response.isSuccess) {
            if (user.roles.includes(2) || user.roles.includes(3)) {
              if (response.data >= 1) {
                navigation.navigate('NPost');
              }
              else {
                navigation.navigate('NPostEditNew');
              }
            }
            else if (user.roles.includes(4)) {
              if (response.data >= 4) {
                navigation.navigate('NPost');
              }
              else {
                navigation.navigate('NPostEditNew');
              }
            }
            else {
              navigation.navigate('NPostEditNew');
            }
          }
          else {
            navigation.navigate('NPostEditNew');
          }
        })
      }
      else{
        navigation.navigate('NPost');
      }
    }
    else {
      navigation.navigate('Pricing', { isStandByPage: false, isProfilePage: false });
    }
  };


  const renderContent = () => {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={Images.homeBg}
          style={styles.image}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.contentWrapper}>
            <View style={styles.textBox}>
              <Text style={{ color: BaseColor.whiteColor, fontSize: 18 }}>
                <Text bold style={{ color: colors.primaryLight }}>Styever,</Text>{t('home_overlay_text')}
              </Text>

              <View style={[styles.buttonRow, { borderTopColor: BaseColor.whiteColor }]}>
                <Button full style={{ marginTop: 20, backgroundColor: colors.primary }} loading={loading} onPress={() => craeteMemory()}>
                  <Icon name="photo-film" size={20} color={colors.whiteColor} enableRTL={true} />&nbsp;{t('memories')}
                </Button>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default NHome;
