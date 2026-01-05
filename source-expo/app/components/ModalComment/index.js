import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Images, useTheme } from '@/config';
import { Image, TextInput } from '@/components';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import styles from './styles';
import Header from '../Header/Header';
import { heightTabView } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentRequest, commentAllRequest, deleteCommentRequest } from '@/apis/memoryApi';
import Toast from 'react-native-toast-message';
import { isNullOrEmpty } from '@/utils/utility';

const ModalComment = (props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const cardColor = colors.card;
  const { memoryId, onBackdropPress, isProccessSuccess, isMulti = false, ...attrs } = props;
  const [optionCustom, setOptionCustom] = useState([]);
  const { user } = useSelector(state => state.user);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if(memoryId) {
      fetchComments();
    }
  }, [memoryId]);

  const fetchComments = () => {
    commentAllRequest(memoryId).then(response => {
        if(response.isSuccess) {
          response.data.forEach(item => {
            item.isMine = user ? (item.userId === user.id ? true : false) : false;
          })

          setOptionCustom(response.data)
        }
      })
  }

  const onBackdropPressApply = () => {
    onBackdropPress();
  }

  const addComment = () => {
    addCommentRequest(0, memoryId, user.id, comment).then(response => {
      if (response.isSuccess) {
        fetchComments();
        setComment('');
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
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('error_file_message'),
      });
    })
  }

  const onCommentDelete = (commentId) => {
    deleteCommentRequest(commentId).then(response => {
      if (response.isSuccess) {
        fetchComments();
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
    }).catch((error) => {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('error_file_message'),
      });
    });
  }

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
    <Modal avoidKeyboard onBackdropPress={() => { onBackdropPressApply() }} style={styles.bottomModal} {...attrs}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.contentFilterBottom, { backgroundColor: cardColor }]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>

          <Header style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}
            title={t('comments')} />

          <ScrollView keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            style={{ height: heightTabView() - 400 }}>

            {optionCustom.map((item, index) => (
              <TouchableOpacity
                style={[
                  styles.contentActionModalBottom,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: index === optionCustom.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  },
                ]}
                key={item.id}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  {item.userAvatar ? (
                    <Image
                      source={{ uri: `data:image/*;base64,${item.userAvatar.fileContents}` }}
                      style={styles.thumb}
                      borderRadius={50}
                    />
                  ) : (
                    <Image
                      source={Images.avata5}
                      style={styles.thumb}
                      borderRadius={50}
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text semibold>
                      {item.userName}
                    </Text>

                    <Text
                      style={{
                        marginTop: 4,
                        color: colors.text,
                        fontSize: 12,
                        opacity: 0.8,
                      }}
                    >
                      {item.comment}
                    </Text>

                    <View
                      style={{
                        marginTop: 6,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 12
                        }}
                      >
                        {formatDate(new Date(item.date))}
                      </Text>
                    </View>
                  </View>

                  {item.isMine && <TouchableOpacity
                    onPress={() => onCommentDelete(item.id, item.memoryId)}
                    style={{
                      paddingLeft: 12,
                      paddingTop: 4,
                    }}
                  >
                    <Icon
                      name="trash"
                      size={16}
                      color={colors.primary}
                      solid
                    />
                  </TouchableOpacity>}
                </View>
              </TouchableOpacity>

            ))}
          </ScrollView>

          {user && <View style={{paddingVertical: 15, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border}}>
          <TextInput style={{ borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.primary }}
            value={comment}
            onChangeText={(val) => setComment(val)}
            placeholder={t('comment')}
            returnKeyType="send"
            icon={
              <TouchableOpacity disabled={isNullOrEmpty(comment)} onPress={addComment}>
                <Icon name="paper-plane" size={16} color={colors.primary} />
              </TouchableOpacity>
            } />
          </View>}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

ModalComment.propTypes = {
  memoryId: PropTypes.array,
  onBackdropPress: PropTypes.func,
  isMulti: PropTypes.bool,
};

export default ModalComment;
