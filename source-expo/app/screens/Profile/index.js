import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
// Load sample data
import { UserData } from '@/data';
import { Button, Icon, ProfileDetail, ProfilePerformance, SafeAreaView, Tag, Text } from '@/components';
import { AuthActions } from '@/actions';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { logout } from '@/actions/auth';
import { avatarUploadFolderUrl } from '@/utils/utility';
import { deleteUserRequest } from '@/apis/userApi';
import Toast from 'react-native-toast-message';

const { authentication } = AuthActions;

const Profile = (props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigation } = props;
  const dispatch = useDispatch();
  const {loading, user} = useSelector((state) => state.user);

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onLogOut = () => {
    dispatch(logout());
    dispatch({type: "USER_INIT"});
    dispatch({type: "MEMORY_INIT"});
    dispatch({type: "ARTICLE_INIT"});

    navigation.navigate('NHome');
  };

  const onLogIn = () => {
    navigation.navigate('SignIn');
  };

  const clearSession = () => {
    dispatch(logout());
    dispatch({type: "USER_INIT"});
    dispatch({type: "MEMORY_INIT"});
    dispatch({type: "ARTICLE_INIT"});
    navigation.navigate('NHome');
  };

  const onDeleteAccount = () => {
    if (!user?.id) return;

    Alert.alert(
      t('delete_account'),
      t('delete_account_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteUserRequest(user.id);
              if (response?.isSuccess === false) {
                Alert.alert(t('error'), response?.message || t('delete_account_error'));
                return;
              }
              Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('delete_account_success'),
              });
              setTimeout(() => {
                clearSession();
              }, 1200);
            } catch (error) {
              Alert.alert(t('error'), error?.response?.data?.message || t('delete_account_error'));
            }
          },
        },
      ],
    );
  };

  const styleItem = {
    ...styles.profileItem,
    borderBottomColor: colors.border,
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <View style={[BaseStyle.container, { flex: 1 }]}>
        <View style={{ marginBottom: 20 }}>
          <Text header bold>
            {t('setting')}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            {user && (
              <ProfileDetail
                image={user.file ? avatarUploadFolderUrl + user.file.path.split("\\")[user.file.path.split("\\").length-1] + (user.file.extension == ".jpeg" || user.file.extension == ".jpg" ? ".jpg" : user.file.extension == ".png" ? ".png" : "") : Images.avata5}
                isAvatarExist={user.file ? true : false}
                textFirst={user.name + " " + user.surname}
                textSecond={user.username}
                textThird={user.email}
                onPress={() => {}}
              />
            )}
            
            <View style={{ width: '100%' }}>
              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('Setting');
                }}
              >
                <Text body1>{t('system')}</Text>
                <Icon name="angle-right" size={18} color={colors.primary} style={{ marginLeft: 5 }} enableRTL={true} />
              </TouchableOpacity>
              {((user && user.isActive) || !user) && <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('Pricing', { isStandByPage: true });
                }}
              >
                <Text body1>{t('purchase_voucher')}</Text>
                <Icon name="angle-right" size={18} color={colors.primary} style={{ marginLeft: 5 }} enableRTL={true} />
              </TouchableOpacity>}
              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('Faqs');
                }}
              >
                <Text body1>{t('faqs')}</Text>
                <Icon name="angle-right" size={18} color={colors.primary} style={{ marginLeft: 5 }} enableRTL={true} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('ContactUs');
                }}
              >
                <Text body1>{t('contact_us')}</Text>
                <Icon name="angle-right" size={18} color={colors.primary} style={{ marginLeft: 5 }} enableRTL={true} />
              </TouchableOpacity>
              {user && user.isActive && (
                <TouchableOpacity
                  style={styleItem}
                  onPress={() => {
                    navigation.navigate('ProfileEdit');
                  }}
                >
                  <Text body1>{t('edit_profile')}</Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    style={{ marginLeft: 5 }}
                    enableRTL={true}
                  />
                </TouchableOpacity>
              )}
              {user && user.isActive && (
                <TouchableOpacity
                  style={styleItem}
                  onPress={() => {
                    navigation.navigate('MyAddresses');
                  }}
                >
                  <Text body1>{t('my_addresses')}</Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    style={{ marginLeft: 5 }}
                    enableRTL={true}
                  />
                </TouchableOpacity>
              )}
              {(user && user.isActive) && (
                <TouchableOpacity
                  style={styleItem}
                  onPress={() => {
                    navigation.navigate('ChangePassword');
                  }}
                >
                  <Text body1>{t('change_password')}</Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    style={{ marginLeft: 5 }}
                    enableRTL={true}
                  />
                </TouchableOpacity>
              )}
              {user && (
                <TouchableOpacity
                  style={styleItem}
                  onPress={() => {
                    navigation.navigate('MyAgreements');
                  }}
                >
                  <Text body1>{t('my_agreements')}</Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    style={{ marginLeft: 5 }}
                    enableRTL={true}
                  />
                </TouchableOpacity>
              )}
              {user && (
                <TouchableOpacity
                  style={styleItem}
                  onPress={() => {
                    navigation.navigate('Membership');
                  }}
                >
                  <Text body1>{t('membership')}</Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    style={{ marginLeft: 5 }}
                    enableRTL={true}
                  />
                </TouchableOpacity>
              )}
              
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        {user ? (
          <>
            <Button
              full
              onPress={onDeleteAccount}
              style={{ backgroundColor: BaseColor.pinkLightColor, marginBottom: 10 }}
            >
              {t('delete_account')}
            </Button>
            <Button full loading={loading} onPress={() => onLogOut()}>
              {t('sign_out')}
            </Button>
          </>
        ) : (
          <Button full loading={loading} onPress={() => onLogIn()}>
            {t('sign_in')}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Profile;
