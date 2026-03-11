import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Header,
  HeaderLargeTitleBadge,
  Icon,
  ModalComment,
  ModalLike,
  News45,
  NotFound,
  SafeAreaView,
  Tag,
  Text,
} from '@/components';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { listMemory } from '@/actions/memory';
import { dislikeRequest, getMemoryCountRequest, likeRequest } from '@/apis/memoryApi';
import { appUrl, avatarUploadFolderUrl, memoryUploadFolderUrl } from '@/utils/utility';
import { unReadCount } from '@/apis/notificationApi';
import Toast from 'react-native-toast-message';

export const modes = {
  square: 'square',
};

const NPost = ({ mode = modes.square }) => {
  const { user } = useSelector((state) => state.user);
  const login = !!user;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { memories, page, totalPages, searchTerm, categoryId, isMyList } = useSelector(
    (state) => state.memory
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [likes, setLikes] = useState([]);
  const [showLikesAction, setShowLikesAction] = useState(false);
  const [memory, setMemory] = useState();
  const [showCommentsAction, setShowCommentsAction] = useState(false);
  const [refreshing] = useState(false);
  const [modeView, setModeView] = useState(mode);
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [isNewMemoryVisible, setIsNewMemoryVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const goToPage = (pageName) => () => navigation.navigate(pageName);

  const fetchUnreadCount = useCallback(async () => {
    try {
      if (!user?.id) {
        setUnreadCount(0);
        return;
      }

      const response = await unReadCount(user.id);

      let count = 0;

      if (typeof response === 'number') {
        count = response;
      } else if (typeof response?.data === 'number') {
        count = response.data;
      } else if (typeof response?.count === 'number') {
        count = response.count;
      } else if (typeof response?.data?.count === 'number') {
        count = response.data.count;
      }

      setUnreadCount(count);
    } catch (error) {
      console.log('fetchUnreadCount error:', error);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();

      if (login) {
        fetchUnreadCount();
      }

      return () => {
        dispatch({ type: 'MEMORY_INIT' });
      };
    }, [currentPage, searchTerm, categoryId, isMyList, login, fetchUnreadCount])
  );

  useEffect(() => {
    if (!login) return;

    const foregroundListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Foreground notification:', notification);

      setUnreadCount((prev) => prev + 1);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(() => {
      fetchUnreadCount();
    });

    return () => {
      foregroundListener.remove();
      responseListener.remove();
    };
  }, [login, fetchUnreadCount]);

  const fetchData = () => {
    dispatch(listMemory(currentPage, 4, searchTerm, categoryId, isMyList ? user.id : undefined));
  };

  useFocusEffect(
    useCallback(() => {
      if (memories && memories.length > 0) {
        memories.forEach((item) => {
          if (!item.isPrivate || (user && item.userId === user.id)) {
            item.qrData = `${appUrl}/#/memories/${item.id}`;
          } else {
            item.qrData = null;
          }
        });

        setLoading(false);
      } else {
        setLoading(false);
      }
    }, [memories, user])
  );

  const onFilter = () => {
    navigation.navigate('NFilter');
  };

  const getTotalCol = () => {
    switch (modeView) {
      case 'square':
        return 1;
      default:
        return 1;
    }
  };

  const goPostDetail = (item) => () => {
    if (!item.isPrivate || (login && item.userId === user.id)) {
      navigation.navigate('NPostDetail', { item: item });
    }
  };

  const openLikedList = (item) => {
    if (item.likesCount > 0) {
      setLikes([]);
      setLikes([...item.likes]);
      setShowLikesAction(true);
    }
  };

  const like = (item) => {
    if (user?.isActive) {
      if (item.likes.filter((f) => f.userId === user.id)?.length > 0) {
        dislikeRequest(item.id, user.id)
          .then((response) => {
            if (response.isSuccess) {
              fetchData();
              Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('success_message'),
              });
            } else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('error_file_message'),
              });
            }
          })
          .catch(() => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_file_message'),
            });
          });
      } else {
        likeRequest(0, item.id, user.id)
          .then((response) => {
            if (response.isSuccess) {
              fetchData();

              Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('success_message'),
              });
            } else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('error_file_message'),
              });
            }
          })
          .catch(() => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_file_message'),
            });
          });
      }
    }
  };

  const openCommentList = (item) => {
    if (item.isOpenToComment) {
      setMemory();
      setMemory(item);
      setShowCommentsAction(true);
    }
  };

  const onProccessSuccess = () => {
    setShowCommentsAction(false);
    fetchData();
  };

  const controlIsNewMemoryVisible = () => {
    if (!user?.isActive) {
      setIsNewMemoryVisible(false);
    } else {
      getMemoryCountRequest(user.id).then((response) => {
        if (response.isSuccess) {
          if (user.roles.includes(2) || user.roles.includes(3)) {
            if (response.data >= 1) {
              setIsNewMemoryVisible(false);
            } else {
              setIsNewMemoryVisible(true);
            }
          } else if (user.roles.includes(4)) {
            if (response.data >= 4) {
              setIsNewMemoryVisible(false);
            } else {
              setIsNewMemoryVisible(true);
            }
          } else {
            setIsNewMemoryVisible(true);
          }
        } else {
          setIsNewMemoryVisible(true);
        }
      });
    }
  };

  const renderItem = ({ item }) => {
    switch (modeView) {
      case 'square':
        return (
          <News45
            loading={loading}
            style={{ marginVertical: 8 }}
            avatar={
              item.userAvatar
                ? avatarUploadFolderUrl +
                  item.userAvatar.path.split('\\')[item.userAvatar.path.split('\\').length - 1]
                : Images.avata5
            }
            isAvatarExist={!!item.userAvatar}
            image={
              item.files && item.files.length > 0
                ? memoryUploadFolderUrl +
                  item.files
                    .filter((f) => f.isPrimary)[0]
                    ?.file.path.split('\\')[
                    item.files.filter((f) => f.isPrimary)[0]?.file.path.split('\\').length - 1
                  ]
                : Images.avata6
            }
            isImageExist={item.files && item.files.length > 0}
            username={item.userName}
            title={item.name}
            postDate={item.postDate}
            commentCount={
              item.userId === user?.id ? item.commentsCount : item.comments.filter((c) => c.isApproved).length
            }
            likeCount={item.likesCount}
            qrData={item.qrData}
            isLiked={
              login
                ? item.likesCount > 0
                  ? item.likes.filter((f) => f.userId === user.id)?.length > 0
                  : false
                : false
            }
            onPress={goPostDetail(item)}
            onLikePress={() => like(item)}
            onLikeListPress={() => openLikedList(item)}
            onCommentPress={() => openCommentList(item)}
          />
        );

      default:
        return null;
    }
  };

  const renderList = () => {
    return (
      <View style={{ flex: 1 }}>
        {!loading && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingLeft: 8,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Tag
                gray
                style={{
                  borderRadius: 3,
                  backgroundColor: colors.primary,
                  paddingVertical: 3,
                }}
                textStyle={{
                  paddingHorizontal: 4,
                  fontSize: 15,
                  color: BaseColor.whiteColor,
                }}
                icon={<Icon name="filter" color={BaseColor.whiteColor} size={15} />}
                onPress={() => onFilter()}
              >
                {t('filter')}
              </Tag>
            </View>

            {memories && memories.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  disabled={page === 1}
                  onPress={() => setCurrentPage(page - 1)}
                  style={{ marginHorizontal: 6, opacity: page === 1 ? 0.4 : 1 }}
                >
                  <Text
                    style={{
                      paddingVertical: 2.5,
                      borderRadius: 8,
                      height: 25,
                      textAlign: 'center',
                      color: colors.text,
                      fontSize: 16,
                    }}
                  >
                    ‹ {t('prev')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity disabled={true}>
                  <Text
                    style={{
                      paddingVertical: 1.75,
                      borderRadius: 8,
                      width: 30,
                      height: 25,
                      textAlign: 'center',
                      color: BaseColor.whiteColor,
                      backgroundColor: colors.primary,
                      fontSize: 16,
                    }}
                  >
                    {page}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={page === totalPages}
                  onPress={() => setCurrentPage(page + 1)}
                  style={{ marginHorizontal: 6, opacity: page === totalPages ? 0.4 : 1 }}
                >
                  <Text
                    style={{
                      paddingVertical: 2.5,
                      borderRadius: 8,
                      height: 25,
                      textAlign: 'center',
                      color: colors.text,
                      fontSize: 16,
                    }}
                  >
                    {t('next')} ›
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {!loading && memories && memories.length === 0 && <NotFound />}

        {!loading && (
          <Animated.FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrollAnim,
                    },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            data={memories}
            key={getTotalCol()}
            numColumns={getTotalCol()}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
          />
        )}

        {loading ? <ActivityIndicator size="large" style={{ flex: 1 }} /> : null}

        {showLikesAction && likes && likes.length > 0 && (
          <ModalLike
            options={likes}
            isVisible={showLikesAction}
            onSwipeComplete={() => {
              setShowLikesAction(false);
            }}
            onBackdropPress={() => {
              setShowLikesAction(false);
            }}
          />
        )}

        {showCommentsAction && (
          <ModalComment
            isProccessSuccess={() => onProccessSuccess()}
            memory={memory}
            isVisible={showCommentsAction}
            onSwipeComplete={() => {
              setShowCommentsAction(false);
            }}
            onBackdropPress={() => {
              setShowCommentsAction(false);
            }}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('memories')}
        renderLeft={() => {
          if (login) {
            controlIsNewMemoryVisible();
          }

          if (isNewMemoryVisible) {
            return (
              <Text headline primaryColor style={{ width: 100 }}>
                {t('create')}
              </Text>
            );
          }
        }}
        onPressLeft={() => {
          if (!login) {
            navigation.navigate('Pricing', { isStandByPage: false, isProfilePage: false });
          } else {
            navigation.navigate('NPostEditNew');
          }
        }}
        renderRight={() => {
          if (user) {
            return (
              <View style={{ position: 'relative' }}>
                <HeaderLargeTitleBadge
                  onPress={goToPage('MNotification')}
                  count={unreadCount}
                />
              </View>
            );
          }
          return null;
        }}
        onPressRight={() => {}}
      />
      {renderList()}
    </SafeAreaView>
  );
};

export default NPost;