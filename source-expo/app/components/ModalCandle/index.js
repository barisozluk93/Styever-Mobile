import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import { Button, Image, NotFound, TextInput } from '@/components';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import styles from './styles';
import Header from '../Header/Header';
import { heightTabView } from '@/utils';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { avatarUploadFolderUrl, isNullOrEmpty } from '@/utils/utility';
import { lightCandleRequest, updateCandleRequest } from '@/apis/memoryApi';

const ModalCandle = (props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const cardColor = colors.card;
  const { navigation, memory, candleId, onBackdropPress, isProccessSuccess, isMulti = false, ...attrs } = props;
  const { user } = useSelector(state => state.user);
  const [donation, setDonation] = useState();
  const [shelter, setShelter] = useState("xxxxxxxxxx xxxxx xxxxxx");
  const [fullname, setFullname] = useState('');
  const { language } = useSelector(state => state.application);

  const onBackdropPressApply = () => {
    onBackdropPress();
  }

  const updateCandle = () => {
    console.log(candleId)
    const data = { id: candleId, userId: user ? user.id : undefined, memoryId: memory.id, nameSurname: fullname, donation: donation, shelter: shelter, isDeleted: false };
    if (donation > 0) {
      navigation.navigate('Payment', { item: { typeId: 2, data: data } })
      onBackdropPress();
    }
    else {
      if(candleId > 0) {
        updateCandleRequest(data).then(response => {
          if (response.isSuccess) {
            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });
            setDonation('')
            isProccessSuccess();
          }
          else {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('candle_update_error_message'),
            });
          }
        }).catch(error => {
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: t('candle_update_error_message')
          });
        });
      }
      else{
        if(!isNullOrEmpty(fullname)) {
          lightCandleRequest(data).then(response => {
            if (response.isSuccess) {
              Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('success_message'),
              });
              setDonation('')
              setFullname('')
              isProccessSuccess();
            }
            else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('candle_update_error_message'),
              });
            }
          }).catch(error => {
            console.log(error)
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('candle_update_error_message')
            });
          });
        }
      }
    }
  }

  return (
    <Modal avoidKeyboard onBackdropPress={() => { onBackdropPressApply() }} style={styles.bottomModal} {...attrs}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.contentFilterBottom, { backgroundColor: cardColor }]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>

          <Header style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}
            title={t('light_candle')} />


          {(!user || (user && user.isActive)) && <View style={{ paddingVertical: 15, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
            <View style={styles.trialBadge}>
              <Text headline style={styles.trialText}>
                {language === 'tr' ? memory?.name + t('candle_message_start') + shelter + t('candle_message_end') :
                  t('candle_message_start') + memory?.name + t('candle_message_mid') + shelter + t('candle_message_end')}
              </Text>
            </View>
            
            {!user &&
            <TextInput
              style={{ borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.primary, marginBottom: 10 }}
              onChangeText={(text) => setFullname(text)}
              autoCorrect={false}
              placeholder={t('fullname')}
              placeholderTextColor={BaseColor.grayColor}
              value={fullname}
            />
          }

            <TextInput style={{ borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.primary }}
              value={donation}
              onChangeText={(val) => setDonation(val)}
              placeholder={t('donation')}
            />

            <Button style={{ height: 45, marginTop: 15 }} onPress={updateCandle}>
              {t('light_candle')}
            </Button>
          </View>}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

ModalCandle.propTypes = {
  memory: PropTypes.object,
  onBackdropPress: PropTypes.func,
  isMulti: PropTypes.bool,
};

export default ModalCandle;
