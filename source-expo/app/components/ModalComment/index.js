import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import { Image, NotFound, TextInput } from '@/components';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import styles from './styles';
import Header from '../Header/Header';
import { heightTabView } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentRequest, approveCommentRequest, commentAllRequest, deleteCommentRequest } from '@/apis/memoryApi';
import Toast from 'react-native-toast-message';
import { avatarUploadFolderUrl, isNullOrEmpty } from '@/utils/utility';

const ModalComment = (props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const cardColor = colors.card;
  const { memory, onBackdropPress, isProccessSuccess, isMulti = false, ...attrs } = props;
  const [optionCustom, setOptionCustom] = useState([]);
  const { user } = useSelector(state => state.user);
  const [comment, setComment] = useState('');
  const [fullname, setFullname] = useState('');
  const [isMemoryMine, setIsMemoryMine] = useState(false);

  useEffect(() => {
    if (memory && memory.id) {
      setIsMemoryMine(memory.userId === user?.id);

      fetchComments();
    }
  }, [memory]);

  const fetchComments = () => {
    commentAllRequest(memory.id).then(response => {
      if (response.isSuccess) {
        response.data.forEach(item => {
          item.isMine = user ? (item.userId === user.id ? true : false) : false;
        })

        if(memory.userId === user?.id) {
          setOptionCustom(response.data)
        }
        else{
          setOptionCustom(response.data.filter(x => x.isApproved))
        }
      }
    })
  }

  const onBackdropPressApply = () => {
    onBackdropPress();
  }

  const addComment = () => {
    if ((!user && !isNullOrEmpty(fullname)) || !isNullOrEmpty(comment)) {
      addCommentRequest(0, memory.id, (user ? user?.id : undefined), comment, fullname, (user ? user?.id === memory?.userId : false)).then(response => {
        if (response.isSuccess) {
          fetchComments();
          setComment('');
          setFullname('');
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

  const onCommentApprove = (commentId) => {
    approveCommentRequest(commentId).then(response => {
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

            {optionCustom && optionCustom.length === 0 && <NotFound />}

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
                  {item.userAvatar && <Image source={{ uri: avatarUploadFolderUrl + `${item.userAvatar.path.split("\\")[item.userAvatar.path.split("\\").length - 1]}` }} style={styles.thumb} borderRadius={50} />}
                  {!item.userAvatar && <Image source={Images.avata5} style={styles.thumb} borderRadius={50} />}

                  <View style={{ flex: 1 }}>
                    <Text semibold>
                      {item.userName ? item.userName : item.nameSurname}
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
                  
                  {user?.isActive && !item.isMine && isMemoryMine && !item.isApproved && <TouchableOpacity
                    onPress={() => onCommentApprove(item.id)}
                    style={{
                      paddingLeft: 12,
                      paddingTop: 4,
                    }}
                  >
                    <Icon
                      name="check-circle"
                      size={16}
                      color={colors.primary}
                      solid
                    />
                  </TouchableOpacity>}

                  {user?.isActive && (item.isMine || isMemoryMine) && <TouchableOpacity
                    onPress={() => onCommentDelete(item.id, item.memoryId)}
                    style={{
                      paddingLeft: 12,
                      paddingTop: 4,
                    }}
                  >
                    <Icon
                      name="trash"
                      size={16}
                      color={BaseColor.pinkDarkColor}
                      solid
                    />
                  </TouchableOpacity>}
                </View>
              </TouchableOpacity>

            ))}
          </ScrollView>
          
          {(!user || (user && user.isActive)) && <View style={{ paddingVertical: 15, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
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
  memory: PropTypes.object,
  onBackdropPress: PropTypes.func,
  isMulti: PropTypes.bool,
};

export default ModalComment;
