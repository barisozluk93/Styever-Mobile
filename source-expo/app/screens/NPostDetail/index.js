import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, I18nManager, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import {
  CardSlide,
  Header,
  Icon,
  Image,
  NewsList,
  SafeAreaView,
  StarRating,
  Tag,
  Text,
  PlaceholderLine,
  Placeholder,
  TextInput,
  ModalComment,
  ModalLike,
  MediaSlider,
} from '@/components';
import { BaseColor, BaseStyle, useTheme, Images } from '@/config';
import * as Utils from '@/utils';
import styles from './styles';
import { useSelector } from 'react-redux';
import { dislikeRequest, getMemoryRequest, likeRequest } from '@/apis/memoryApi';
import Toast from 'react-native-toast-message';
import { memoryUploadFolderUrl } from '@/utils/utility';

const NPostDetail = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [itemData, setItemData] = useState();
  const [loading, setLoading] = useState(true);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const { user } = useSelector((state) => state.user);
  const login = user ? true : false;
  const [likes, setLikes] = useState([]);
  const [showLikesAction, setShowLikesAction] = useState(false);
  const [showCommentsAction, setShowCommentsAction] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const prepareMediaFiles = async (files) => {
    const prepared = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];

      if (!(f.file.contentType.includes('image'))) {
        prepared.push({
          id: f.id,
          fileId: f.fileId,
          type: 'video',
          uri: memoryUploadFolderUrl + `${f.file.path.split("\\")[f.file.path.split("\\").length-1]}`,
          isPrimary: false
        });
      } else {
        prepared.push({
          id: f.id,
          fileId: f.fileId,
          type: 'image',
          uri: memoryUploadFolderUrl + `${f.file.path.split("\\")[f.file.path.split("\\").length-1]}`,
          isPrimary: f.isPrimary
        });
      }
    }

    if (prepared.length === 0) {
      return prepared;
    }

    const sortedList = [...prepared].sort((a, b) => {
      if (a.type === 'image' && a.isPrimary && !(b.type === 'image' && b.isPrimary)) {
        return -1;
      }
      if (!(a.type === 'image' && a.isPrimary) && b.type === 'image' && b.isPrimary) {
        return 1;
      }

      // Öncelik 2: image olanlar
      if (a.type === 'image' && b.type !== 'image') {
        return -1;
      }
      if (a.type !== 'image' && b.type === 'image') {
        return 1;
      }

      return 0;
    });

    return sortedList;
  };

  useEffect(() => {
    const prepare = async () => {
      if (itemData.files?.length > 0) {
        const result = await prepareMediaFiles(itemData.files);
        setMediaFiles(result);
      }
      else {
        setMediaFiles([]);
      }
    };

    if (itemData && itemData.files) {
      prepare();
    }
    else {
      setMediaFiles([]);
    }
  }, [itemData]);

  useEffect(() => {
    if (route?.params?.item) {
      setItemData(route?.params?.item);
    }
  }, [route?.params?.item])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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

  const openLikedList = () => {
    if (itemData.likesCount > 0) {
      setLikes([]);
      setLikes([...itemData.likes]);
      setShowLikesAction(true);
    }
  };

  const like = () => {
    if (user) {
      if (itemData.likes.filter(f => f.userId === user.id)?.length > 0) {
        dislikeRequest(itemData.id, user.id).then(response => {
          if (response.isSuccess) {
            getMemoryRequest(itemData.id).then(response1 => {
              setItemData(response1.data);

              Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('success_message'),
              });
            })
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
      else {
        likeRequest(0, itemData.id, user.id).then(response => {
          if (response.isSuccess) {
            getMemoryRequest(itemData.id).then(response1 => {
              setItemData(response1.data);

              Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('success_message'),
              });
            })
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
  }

  const openCommentList = () => {
    if (itemData.isOpenToComment && ((!login && itemData.commentCount > 0) || login)) {
      setShowCommentsAction(true);
    }
  };

  const onProccessSuccess = () => {
    getMemoryRequest(itemData.id).then(response => {
      setItemData(response.data);
    })
  }

  //For header background color from transparent to header color
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [BaseColor.whiteColor, colors.primary],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  //For header image opacity
  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, 350 - heightHeader - 20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  //artist profile image position from top
  const heightViewImg = scrollY.interpolate({
    inputRange: [0, 350 - heightHeader],
    outputRange: [350, heightHeader],
    useNativeDriver: true,
  });

  const renderPlaceholder = () => {
    let holders = Array.from(Array(5));

    return (
      <Placeholder>
        <View style={{ padding: 20 }}>
          {holders.map((item, index) => (
            <PlaceholderLine key={index} width={100} />
          ))}
        </View>
      </Placeholder>
    );
  };

  const renderContent = () => {
    return (
      <Fragment>
        <View style={styles.contentDescription}>
          <Text
            body2
            style={{
              lineHeight: 20,
              paddingTop: 10,
            }}
            numberOfLines={100}
          >
            {itemData.text}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.header]}>
            <View></View>
            <View style={styles.stats}>
              <TouchableOpacity style={styles.statItem} onPress={() => openCommentList()}>
                <Icon name="comment" size={20} color={colors.primaryLight} />
                <Text bold style={[styles.statText, { color: colors.text }]} >{itemData.commentsCount}</Text>
              </TouchableOpacity>

              <View style={styles.statItem}>
                <TouchableOpacity onPress={() => like()}>
                  {user && itemData.likesCount > 0 && itemData.likes.filter(f => f.userId === user.id) ? <Icon name="heart" size={20} color={colors.primaryLight} solid /> : <Icon name="heart" size={20} color={colors.primaryLight} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLikedList()}>
                  <Text bold style={[styles.statText, { color: colors.text }]}>{itemData.likesCount}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {showLikesAction && likes && likes.length > 0 && <ModalLike
          options={likes}
          isVisible={showLikesAction}
          onSwipeComplete={() => {
            setShowLikesAction(false);
          }}
          onBackdropPress={() => {
            setShowLikesAction(false)
          }}
        />}

        {showCommentsAction && itemData.isOpenToComment && <ModalComment
          isProccessSuccess={() => onProccessSuccess()}
          memoryId={itemData.id}
          isVisible={showCommentsAction}
          onSwipeComplete={() => {
            setShowCommentsAction(false);
          }}
          onBackdropPress={() => {
            setShowCommentsAction(false)
          }}
        />}
      </Fragment>
    );
  };

  if (itemData) {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={[BaseStyle.safeAreaView]} forceInset={{ top: 'always', bottom: 'always' }}>
          <Header title={itemData.name} />
          <ScrollView
            onContentSizeChange={() => {
              setHeightHeader(Utils.heightHeader());
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
            style={{ zIndex: 10 }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { y: scrollY },
                  },
                },
              ],
              {
                useNativeDriver: false,
              }
            )}
          >
            <View style={{ height: 330 - heightHeader }} />
            <View
              style={{
                marginVertical: 20,
                paddingHorizontal: 20,
              }}
            >

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text bold>
                  </Text>
                  <Text semibold grayColor>
                    {formatDate(new Date(itemData.postDate), true)}
                  </Text>
                </View>

                <View style={{ alignItems: 'center', minWidth: 80, marginRight: 10 }}>
                  <Text bold style={{ color: colors.primaryLight }}>
                    {t('birth_date')}
                  </Text>
                  <Text semibold>
                    {itemData.birthDate
                      ? formatDate(new Date(itemData.birthDate))
                      : '-'}
                  </Text>
                </View>

                <View style={{ alignItems: 'center', minWidth: 80 }}>
                  <Text bold style={{ color: colors.primaryLight }}>
                    {t('death_date')}
                  </Text>
                  <Text semibold>
                    {itemData.deathDate
                      ? formatDate(new Date(itemData.deathDate))
                      : '-'}
                  </Text>
                </View>
              </View>

              <Text title1 semibold style={{ marginVertical: 10 }}>
                {itemData.name}
              </Text>
            </View>

            {loading ? renderPlaceholder() : renderContent()}
          </ScrollView>
        </SafeAreaView>
        <Animated.View
          style={[
            styles.headerImageStyle,
            {
              opacity: headerImageOpacity,
              height: heightViewImg,
            },
          ]}
        >

          {mediaFiles.length > 0 ? (
            <MediaSlider
              media={mediaFiles}
              activeMediaIndex={activeMediaIndex}
            />
          ) : (
            <Image
              source={Images.avata6}
              style={{ height: '100%', width: '100%' }}
            />
          )}
        </Animated.View>
        <Animated.View style={[styles.headerStyle, { position: 'absolute' }]}>
          <SafeAreaView style={{ width: '100%' }} forceInset={{ top: 'always', bottom: 'never' }}>
            <Header
              title=""
              renderLeft={() => {
                return (
                  <Animated.Image
                    resizeMode="contain"
                    style={[
                      styles.icon,
                      {
                        transform: [
                          {
                            scaleX: I18nManager.isRTL ? -1 : 1,
                          },
                        ],
                        tintColor: headerBackgroundColor,
                      },
                    ]}
                    source={Images.angleLeft}
                  />
                );
              }}
              renderRight={() => {
                if (user && user.id === itemData.userId) {
                  return (
                    <Icon
                      size={20}
                      color={colors.card}
                      name="pencil-alt"
                    />
                  );
                }
              }}
              onPressLeft={() => {
                navigation.navigate('NPost');
              }}
              onPressRight={() => {
                if (user && user.id === itemData.userId) {
                  navigation.navigate('NPostEditNew', {
                    item: itemData,
                  })
                }
              }}
            />
          </SafeAreaView>
        </Animated.View>
      </View>
    );
  }
};

export default NPostDetail;
