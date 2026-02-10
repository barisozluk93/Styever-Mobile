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
  ModalCandle,
  ModalCandleLighters,
} from '@/components';
import { BaseColor, BaseStyle, useTheme, Images } from '@/config';
import * as Utils from '@/utils';
import styles from './styles';
import { useSelector } from 'react-redux';
import { dislikeRequest, getMemoryRequest, lightCandleRequest, likeRequest } from '@/apis/memoryApi';
import Toast from 'react-native-toast-message';
import { appUrl, memoryUploadFolderUrl } from '@/utils/utility';
import QRCode from 'react-native-qrcode-svg';
import { Linking } from "react-native";

const NPostDetail = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [shareLink, setShareLink] = useState('');
  const [itemData, setItemData] = useState();
  const [loading, setLoading] = useState(true);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const { user } = useSelector((state) => state.user);
  const login = user ? true : false;
  const [likes, setLikes] = useState([]);
  const [showLikesAction, setShowLikesAction] = useState(false);
  const [showCommentsAction, setShowCommentsAction] = useState(false);
  const [showCandlesAction, setShowCandlesAction] = useState(false);
  const [showCandleLightersAction, setShowCandleLightersAction] = useState(false);
  const [candles, setCandles] = useState([]);
  const [candleId, setCandleId] = useState();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const getYoutubeId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const getPriority = (item) => {
    if (item.type === "image" && item.isPrimary) return 1;
    if (item.type === "image") return 2;
    if (item.type === "video") return 3;
    if (item.type === "youtube") return 4;
    return 99;
  };

  const prepareMediaFiles = async (files, youtubeLinks) => {
    const prepared = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!(f.file.contentType.includes('image'))) {
        prepared.push({
          id: f.id,
          fileId: f.fileId,
          type: 'video',
          uri: memoryUploadFolderUrl + `${f.file.path.split("\\")[f.file.path.split("\\").length - 1]}`,
          isPrimary: false
        });
      } else {
        prepared.push({
          id: f.id,
          fileId: f.fileId,
          type: 'image',
          uri: memoryUploadFolderUrl + `${f.file.path.split("\\")[f.file.path.split("\\").length - 1]}`,
          isPrimary: f.isPrimary
        });
      }
    }


    for (let i = 0; i < youtubeLinks.length; i++) {
      const f = youtubeLinks[i];
      prepared.push({
        id: f.id,
        fileId: undefined,
        type: 'youtube',
        uri: getYoutubeId(f.link),
        isPrimary: false
      });
    }

    if (prepared.length === 0) {
      return prepared;
    }

    const sortedList = [...prepared].sort(
      (a, b) => getPriority(a) - getPriority(b)
    );


    return sortedList;
  };

  useEffect(() => {
    const prepare = async () => {
      if (itemData.files?.length > 0 || itemData.youtubeLinks?.length > 0) {
        const result = await prepareMediaFiles(itemData.files, itemData.youtubeLinks);
        setMediaFiles(result);
      }
      else {
        setMediaFiles([]);
      }
    };

    if (itemData && (itemData.files || itemData.youtubeLinks)) {
      prepare();
    }
    else {
      setMediaFiles([]);
    }
  }, [itemData]);

  useEffect(() => {
    if (route?.params?.item) {
      setItemData(route?.params?.item);
      setShareLink(`${appUrl}/#/memories/${route?.params?.item.id}`);
    }
  }, [route?.params?.item])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const openUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Uygulama bulunamadı");
    }
  };

  const shareToLinkedin = () => {
    const url = encodeURIComponent(shareLink);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    openUrl(linkedInUrl);
  }

  const shareToX = () => {
    const text = encodeURIComponent('Anısı bizimle yaşıyor 🐾\n');
    const url = encodeURIComponent(shareLink);

    const xUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    openUrl(xUrl);
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent("https://example.com/post/123");

    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    openUrl(fbUrl);
  };

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

  const openCandleLightersList = () => {
    if (itemData.candlesCount > 0) {
      setCandles([]);
      setCandles([...itemData.candles]);
      setShowCandleLightersAction(true);
    } 
  }

  const openLikedList = () => {
    if (itemData.likesCount > 0) {
      setLikes([]);
      setLikes([...itemData.likes]);
      setShowLikesAction(true);
    }
  };

  const like = () => {
    if (user?.isActive) {
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
    if (itemData.isOpenToComment) {
      setShowCommentsAction(true);
    }
  };

  const onProccessSuccess = () => {
    setShowCommentsAction(false);
    getMemoryRequest(itemData.id).then(response => {
      setItemData(response.data);
    })
  }

  const onCandleProccessSuccess = () => {
    setShowCandlesAction(false);
    getMemoryRequest(itemData.id).then(response => {
      setItemData(response.data);
    })
  }

  const lightCandle = () => {
    lightCandleRequest(0, itemData.id, user.id).then(response => {
      if (response.isSuccess) {
        setCandleId(response.data.id);
        getMemoryRequest(itemData.id).then(response1 => {
          setItemData(response1.data);

          setShowCandlesAction(true);
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
    });
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
            <View style={styles.stats}>
              <TouchableOpacity style={styles.statItemLeft} onPress={() => shareToLinkedin()}>
                <Icon name="linkedin" size={20} color={colors.primaryLight} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.statItemLeft} onPress={() => shareToX()}>
                <Icon name="x-twitter" size={20} color={colors.primaryLight} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.statItemLeft} onPress={() => shareToFacebook()}>
                <Icon name="facebook" size={20} color={colors.primaryLight} />
              </TouchableOpacity>
            </View>
            <View style={styles.stats}>
              {user && user.isActive && <TouchableOpacity style={styles.statItem} onPress={() => lightCandle()}>
                <Icon name="hanukiah" size={20} color={colors.primaryLight} />
              </TouchableOpacity>}

              <TouchableOpacity style={styles.statItem} onPress={() => openCommentList()}>
                <Icon name="comment" size={20} color={colors.primaryLight} />
                <Text bold style={[styles.statText, { color: colors.text }]} >{itemData.userId === user?.id ? itemData.commentsCount : itemData.comments.filter(c => c.isApproved).length}</Text>
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
            
        {showCandleLightersAction && candles && candles.length > 0 && <ModalCandleLighters
          options={candles}
          isVisible={showCandleLightersAction}
          onSwipeComplete={() => {
            setShowCandleLightersAction(false);
          }}
          onBackdropPress={() => {
            setShowCandleLightersAction(false)
          }}
        />}

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

        {showCandlesAction && <ModalCandle
          isProccessSuccess={() => onCandleProccessSuccess()}
          navigation={navigation}
          memory={itemData}
          candleId={candleId}
          isVisible={showCandlesAction}
          onSwipeComplete={() => {
            setShowCandlesAction(false);
          }}
          onBackdropPress={() => {
            setShowCandlesAction(false)
          }}
        />}

        {showCommentsAction && itemData.isOpenToComment && <ModalComment
          isProccessSuccess={() => onProccessSuccess()}
          memory={itemData}
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
              {itemData.candlesCount > 0 && <TouchableOpacity onPress={openCandleLightersList} style={styles.candleInfoRow}>
                <View style={styles.candleWrapper}>
                  <View style={styles.flame} />
                  <View style={styles.wick} />
                  <View style={styles.wax} />
                </View>

                <Text headline style={[styles.candleInfoText, { color: colors.primary }]}>
                  {t('candle_count')}: {itemData.candlesCount}
                </Text>
              </TouchableOpacity>}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >

                <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
                  <QRCode
                    value={`${shareLink}`}
                    size={50}
                    backgroundColor={colors.whiteColor}
                  />
                </View>

                <View style={{ marginRight: 10 }}>
                  <Icon name="ribbon" size={20} color={colors.primaryLight} />
                </View>
              </View>

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
                if (user && user.id === itemData.userId && user.isActive && !itemData.belongingToOldPackage) {
                  return (
                    <Icon
                      size={20}
                      color={colors.card}
                      name="pen"
                    />
                  );
                }
              }}
              onPressLeft={() => {
                navigation.navigate('NPost');
              }}
              onPressRight={() => {
                if (user && user.id === itemData.userId && user.isActive && !itemData.belongingToOldPackage) {
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
