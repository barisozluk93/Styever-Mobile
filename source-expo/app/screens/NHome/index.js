import { useEffect, useState } from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import {
  SafeAreaView,
  Text,
  Icon,
} from '@/components';

import {
  BaseColor,
  Images,
  useTheme,
} from '@/config';

import { getMemoryCountRequest } from '@/apis/memoryApi';
import styles from './styles';

const NHome = ({ navigation }) => {

  const { t } = useTranslation();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);

  const { user } = useSelector(state => state.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const createMemory = () => {
    if (user) {
      if (user.isActive) {
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
        });
      }
      else {
        navigation.navigate('NPost');
      }
    }
    else {
      navigation.navigate('Pricing', {
        isStandByPage: false,
        isProfilePage: false,
      });
    }
  };

  const goToMemories = () => {
    navigation.navigate('NPost');
  };

  return (
    <View style={styles.container}>

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={Images.homeBg}
        resizeMode="cover"
        style={styles.image}
      >

        <LinearGradient
          colors={[
            'rgba(5,25,17,0.84)',
            'rgba(5,25,17,0.62)',
            'rgba(5,25,17,0.17)',
            'rgba(5,25,17,0.06)',
          ]}
          locations={[0, 0.36, 0.68, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.overlay}
        />

        <LinearGradient
          colors={[
            'rgba(5,25,17,0.22)',
            'rgba(5,25,17,0)',
          ]}
          locations={[0, 0.45]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.overlay}
        />

        <SafeAreaView
          style={styles.safeArea}
          edges={['top', 'right', 'left']}
        >

          <View style={styles.contentWrapper}>

            <View style={styles.textBox}>

              <View style={styles.eyebrow}>
                <Image
                  source={require('../../assets/images/styever-mark.png')}
                  style={styles.eyebrowLogo}
                  resizeMode="contain"
                />

                <Text style={styles.eyebrowText}>
                  {t('HOME_HERO_EYEBROW')}
                </Text>
              </View>

              <Text style={styles.title}>
                {t('HOME_HERO_TITLE')}
              </Text>

              <Text style={styles.description}>
                {t('home_overlay_text')}
              </Text>

              <View style={styles.buttonRow}>

                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={loading}
                  style={[
                    styles.primaryButton,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={createMemory}
                >

                  <Text style={styles.primaryButtonText}>
                    {t('add_memory')}
                  </Text>

                  <Icon
                    name="arrow-right"
                    size={16}
                    color={BaseColor.whiteColor}
                    enableRTL
                  />

                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.secondaryButton}
                  onPress={goToMemories}
                >

                  <Text
                    style={[
                      styles.secondaryButtonText,
                      {
                        color: colors.primary,
                      },
                    ]}
                  >
                    {t('memories')}
                  </Text>

                </TouchableOpacity>

              </View>

              <View style={styles.note}>

                <View style={styles.noteIcon}>
                  <Icon
                    name="heart"
                    size={16}
                    color={BaseColor.whiteColor}
                  />
                </View>

                <Text style={styles.noteText}>
                  {t('HOME_HERO_NOTE')}
                </Text>

              </View>

            </View>

          </View>

        </SafeAreaView>

      </ImageBackground>

    </View>
  );
};

export default NHome;