import { FlatList, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Button,
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

const Membership = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSelector(state => state.user);

  const formatDate = (date, isDateTime) => {
    if (isDateTime) {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  const renderContent = () => {
    return (
      <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
        <Header title={t('membership')}
          renderLeft={() => {
            return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <View style={{ flex: 1 }}>
          <TouchableOpacity style={[styles.card, styles.selected, { backgroundColor: colors.card }]} disabled={true}>
            <Text headline style={[styles.title, { color: colors.primary }]}>{user.roles.includes(1) ? t('standard') : user.roles.includes(2) ? t('premium') : t('ultra')}</Text>

            <View style={styles.divider} />

            <View style={styles.propertiesGrid}>
              <View style={styles.propertyItem}>
                <Icon name="calendar-alt" size={14} color={colors.primary} />
                <Text headline style={[styles.property, styles.title, { marginLeft: 5, color: colors.primary }]}>{t('start_date')}</Text>
              </View>

              <View style={styles.propertyItem}>
                <Icon name="calendar-alt" size={14} color={colors.primary} />
                <Text headline style={[styles.property, styles.title, { marginLeft: 5, color: colors.primary }]}>{t('end_date')}</Text>
              </View>

              <View style={styles.propertyItem}>
                <Text style={styles.property}>{formatDate(new Date(user.createdDate), true)}</Text>
              </View>

              <View style={styles.propertyItem}>
                <Text style={styles.property}>{formatDate(new Date(user.expirationDate), true)}</Text>
              </View>
            </View>


            {user.isTrial && <Text headline style={[styles.title, { color: colors.primary }]}>{t('trial_end_date')}</Text>}
            {user.isTrial && <Text style={[styles.title]}>{formatDate(new Date(user.trialExpirationDate), true)}</Text>}

            {user.isTrial && <View style={styles.trialBadge}>
              <Text style={styles.trialText}>{t('trial')}</Text>
            </View>}
          </TouchableOpacity>
        </View>
        <View style={{ margin: 20 }}>
            {!user.isTrial &&
              <Button full>
                {t('upgrade')}
              </Button>
            }
          </View>
      </SafeAreaView>
    );
  };

  return renderContent();
};

export default Membership;
