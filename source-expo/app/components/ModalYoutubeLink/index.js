import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '@/config';
import { Button, TextInput } from '@/components';
import Icon from '@/components/Icon';
import styles from './styles';
import Header from '../Header/Header';
import { useSelector } from 'react-redux';
import { addYoutubeLinkRequest } from '@/apis/memoryApi';
import Toast from 'react-native-toast-message';
import { isNullOrEmpty } from '@/utils/utility';

const ModalYoutubeLink = (props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const cardColor = colors.card;
  const { memoryId, onBackdropPress, isProccessSuccess, isMulti = false, ...attrs } = props;
  const { user } = useSelector(state => state.user);
  const [youtubeLink, setYoutubeLink] = useState('');


  const onBackdropPressApply = () => {
    onBackdropPress();
  }

  const addYoutubeLink = () => {
    if (user) {
      if (user.isActive && !isNullOrEmpty(youtubeLink)) {
        addYoutubeLinkRequest(0, memoryId, youtubeLink).then(response => {
          if (response.isSuccess) {

            setYoutubeLink('');
            isProccessSuccess();

            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });
          }
          else {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_file_message'),
            });
          }
        }).catch(error => {
          console.log(error)
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: t('error_file_message'),
          });
        })
      }
    }
    else {

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
            title={t('add_youtubelink')} />

          {!user || (user && user.isActive) && <View style={{ paddingVertical: 15, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
            <TextInput style={{ borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.primary }}
              value={youtubeLink}
              onChangeText={(val) => setYoutubeLink(val)}
              placeholder={t('youtube_link')}
            />

            <Button style={{ height: 45, marginTop: 15 }} onPress={addYoutubeLink}>
              {t('save')}
            </Button>
          </View>}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

ModalYoutubeLink.propTypes = {
  memoryId: PropTypes.array,
  onBackdropPress: PropTypes.func,
  isMulti: PropTypes.bool,
};

export default ModalYoutubeLink;
