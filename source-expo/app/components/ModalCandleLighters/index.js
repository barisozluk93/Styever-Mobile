import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Images, useTheme } from '@/config';
import { Image, TextInput } from '@/components';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import styles from './styles';
import Header from '../Header/Header';
import { heightTabView } from '@/utils';
import { avatarUploadFolderUrl } from '@/utils/utility';

const ModalCandleLighters = (props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const cardColor = colors.card;
  const { options = [], onBackdropPress, isMulti = false, ...attrs } = props;
  const [optionCustom, setOptionCustom] = useState(options);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const optionsSingle = options.map((item) => ({
      ...item,
      checked: false,
    }));
    setOptionCustom(optionsSingle);
  }, []);

  const onBackdropPressApply = () => {
    onBackdropPress();
  }

  useEffect(() => {
    if(search) {
      setOptionCustom(options.filter((item) => item.userName.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR"))));
    }
    else{
      setOptionCustom(options);
    }
  }, [search])

  const formatDate = (date) => {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
  }

  return (
    <Modal avoidKeyboard onBackdropPress={() => { onBackdropPressApply() }}  style={styles.bottomModal} {...attrs}>
      <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.contentFilterBottom, { backgroundColor: cardColor }]}>
        <View style={styles.contentSwipeDown}>
          <View style={styles.lineSwipeDown} />
        </View>

        <Header style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}
          title={t('candle_lighters')} />

        <ScrollView showsVerticalScrollIndicator={false}
          style={{ height: heightTabView() - 350 }}>
          <View style={[styles.wrapContent, { marginTop: 8 }]}>
            <TextInput style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border}}
              value={search}
              onChangeText={(val) => setSearch(val)}
              placeholder={t('search')}
              iconLeft={<Icon name="magnifying-glass" color={colors.border} style={{ marginRight: 8 }} size={18} />}
            />
          </View>

          {optionCustom.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.contentActionModalBottom,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
              key={item.id}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                  {item.userAvatar && <Image source={{ uri: avatarUploadFolderUrl + `${item.userAvatar.path.split("\\")[item.userAvatar.path.split("\\").length-1]}`}} style={styles.thumb} borderRadius={50} />}
                  {!item.userAvatar && <Image source={ Images.avata5 } style={styles.thumb} borderRadius={50} />}
                                  
                <Text semibold>
                  {t(item.userName)}
                </Text>
              </View>
              <View style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Text style={{color: colors.primary, fontSize: 12}}>
                  {formatDate(new Date(item.date))}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

ModalCandleLighters.propTypes = {
  options: PropTypes.array,
  onBackdropPress: PropTypes.func,
  isMulti: PropTypes.bool,
};

export default ModalCandleLighters;
