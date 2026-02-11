import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, I18nManager, ScrollView, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
  CheckBox,
  ModalLike,
  MediaSlider,
  PickerSelect,
  Button,
  ModalComment,
} from '@/components';
import { BaseColor, BaseStyle, useTheme, Images } from '@/config';
import * as Utils from '@/utils';
import styles from './styles';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import DatePicker from '../Components/Common/DatePicker';
import { editRequest, getMemoryRequest, memoryFileAddRequest, memoryFileDeleteRequest, saveRequest, setMemoryFileIsPrimaryRequest, youtubelinkDeleteRequest } from '@/apis/memoryApi';
import * as ImagePicker from 'expo-image-picker';
import { deleteFileRequest, uploadRequest } from '@/apis/fileApi';
import { isNullOrEmpty, memoryUploadFolderUrl } from '@/utils/utility';
import ModalYoutubeLink from '@/components/ModalYoutubeLink';

const categories = [
  { key: 1, name: 'bird' },
  { key: 2, name: 'cat' },
  { key: 3, name: 'dog' },
  { key: 4, name: 'fish' },
  { key: 5, name: 'hamster' },
  { key: 6, name: 'horse' },
  { key: 7, name: 'turtle' }
];

const successInit = {
  text: true,
  name: true,
  birthDate: true,
  deathDate: true,
  categoryId: true,
  passwordConfirm: true,
  address: true,
};

const NPostEditNew = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const { user } = useSelector((state) => state.user);

  const [itemData, setItemData] = useState();
  const [text, setText] = useState();
  const [name, setName] = useState();
  const [birthDate, setBirthDate] = useState();
  const [deathDate, setDeathDate] = useState();
  const [postDate, setPostDate] = useState();
  const [categoryId, setCategoryId] = useState();
  const [category, setCategory] = useState();
  const [isPrivate, setIsPrivate] = useState();
  const [isLinkOnly, setIsLinkOnly] = useState();
  const [isOpenToComment, setIsOpenToComment] = useState();

  const [mediaFiles, setMediaFiles] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isImageUploadAllowed, setIsImageUploadAllowed] = useState();
  const [isVideoUploadAllowed, setIsVideoUploadAllowed] = useState();
  const [isYoutubeLinkAllowed, setIsYoutubeLinkAllowed] = useState();
  const [allowedCharacterCount, setAllowedCharacterCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(successInit);
  const [showYoutubeLinkModal, setShowYoutubeLinkModal] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // resim ve video
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      let file = result.assets[0];
      let formData = new FormData();
      formData.append("file", {
        name: file.uri.split('/').pop(),
        size: file.fileSize,
        type: file.mimeType,
        uri: file.uri
      });

      formData.append("type", 2);

      uploadRequest(formData).then(response => {
        if (response.isSuccess) {
          var data = { id: 0, memoryId: itemData.id, fileId: response.data.id, isPrimary: mediaFiles.filter(f => f.type === 'image').length > 0 ? false : true };
          memoryFileAddRequest(data).then(response1 => {
            if (response1.isSuccess) {
              getMemoryRequest(itemData.id).then(response2 => {
                setItemData(response2.data);

                Toast.show({
                  type: 'success',
                  text1: t('success'),
                  text2: t('success_message'),
                });

                setTimeout(() => {
                  setActiveMediaIndex(mediaFiles.filter(f => f.type === "image").length)
                }, 250)
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
  };

  const onProccessSuccess = () => {
    getMemoryRequest(itemData.id).then(response => {
      setShowYoutubeLinkModal(false);
      setItemData(response.data);

      setTimeout(() => {
        setActiveMediaIndex(mediaFiles.length)
      }, 250)
    });
  }

  const openYoutubeLinkModal = async () => {
    setShowYoutubeLinkModal(true);
  }

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, // resim ve video
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (!result.canceled) {
        let file = result.assets[0];
        let formData = new FormData();
        formData.append("file", {
          name: file.uri.split('/').pop(),
          size: file.fileSize,
          type: file.mimeType,
          uri: file.uri
        });

        formData.append("type", 2);

        uploadRequest(formData).then(response => {
          if (response.isSuccess) {
            var data = { id: 0, memoryId: itemData.id, fileId: response.data.id, isPrimary: mediaFiles.filter(f => f.type === 'image').length > 0 ? false : true };
            memoryFileAddRequest(data).then(response1 => {
              if (response1.isSuccess) {
                getMemoryRequest(itemData.id).then(response2 => {
                  setItemData(response2.data);
                  Toast.show({
                    type: 'success',
                    text1: t('success'),
                    text2: t('success_message'),
                  });

                  setTimeout(() => {
                    setActiveMediaIndex(mediaFiles.length)
                  }, 250)
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
  };

  const deleteFile = () => {
    var mediaFile = mediaFiles[activeMediaIndex];

    if (mediaFile.type !== "youtube") {
      deleteFileRequest(mediaFile.fileId).then(response => {
        if (response.isSuccess) {
          memoryFileDeleteRequest(mediaFile.id).then(response1 => {
            if (response1.isSuccess) {
              getMemoryRequest(itemData.id).then(response2 => {
                setItemData(response2.data);

                Toast.show({
                  type: 'success',
                  text1: t('success'),
                  text2: t('success_message'),
                });
              })
            }
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
    else {
      youtubelinkDeleteRequest(mediaFile.id).then(response1 => {
        if (response1.isSuccess) {
          getMemoryRequest(itemData.id).then(response2 => {
            setItemData(response2.data);

            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });
          })
        }
      });
    }
  }

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
    if (itemData && itemData.category) {
      if (itemData.categoryId === 1) {
        itemData.category.name = "bird";
      }
      else if (itemData.categoryId === 2) {
        itemData.category.name = "cat";
      }
      else if (itemData.categoryId === 3) {
        itemData.category.name = "dog";
      }
      else if (itemData.categoryId === 4) {
        itemData.category.name = "fish";
      }
      else if (itemData.categoryId === 5) {
        itemData.category.name = "hamster";
      }
      else if (itemData.categoryId === 6) {
        itemData.category.name = "horse";
      }
      else if (itemData.categoryId === 7) {
        itemData.category.name = "turtle";
      }

      setCategory(itemData.category)
    }

    const prepare = async () => {
      if (itemData.files?.length > 0 || itemData.youtubeLinks?.length > 0) {
        const result = await prepareMediaFiles(itemData.files, itemData.youtubeLinks);
        setMediaFiles(result);
        controlUploadPermissions(result);
      }
      else {
        setMediaFiles([]);
        controlUploadPermissions([]);
      }
    };

    if (itemData && (itemData.files || itemData.youtubeLinks)) {
      prepare();
    }
    else {
      setMediaFiles([]);
      controlUploadPermissions([]);
    }
  }, [itemData])

  const controlUploadPermissions = (medias) => {
    if (user.roles.includes(1)) {
      setIsVideoUploadAllowed(true);
      setIsImageUploadAllowed(true);
      setIsYoutubeLinkAllowed(true);
      setAllowedCharacterCount(20000);
    }
    else if (user.roles.includes(2)) {
      setIsVideoUploadAllowed(false);
      setAllowedCharacterCount(1000);
      setIsYoutubeLinkAllowed(false);

      if (medias.filter(f => f.type === "image").length >= 1) {
        setIsImageUploadAllowed(false);
      }
      else {
        setIsImageUploadAllowed(true);
      }
    }
    else if (user.roles.includes(3) || user.roles.includes(4)) {
      setAllowedCharacterCount(5000);

      if (medias.filter(f => f.type === "image").length >= 4) {
        setIsImageUploadAllowed(false);
      }
      else {
        setIsImageUploadAllowed(true);
      }

      if (medias.filter(f => f.type === "video").length === 2) {
        setIsVideoUploadAllowed(false);
      }
      else {
        setIsVideoUploadAllowed(true);
      }

      if (medias.filter(f => f.type === "youtube").length === 2) {
        setIsYoutubeLinkAllowed(false);
      }
      else {
        setIsYoutubeLinkAllowed(true);
      }
    }
  }

  useEffect(() => {
    if (route?.params?.item) {
      setItemData(route?.params?.item);

      setIsOpenToComment(route?.params?.item.isOpenToComment);
      setIsPrivate(route?.params?.item.isPrivate);
      setIsLinkOnly(route?.params?.item.isLinkOnly);
      setCategoryId(route?.params?.item.categoryId);
      setBirthDate(route?.params?.item.birthDate);
      setDeathDate(route?.params?.item.deathDate);
      setPostDate(route?.params?.item.postDate);
      setName(route?.params?.item.name);
      setText(route?.params?.item.text);
    }
    else {
      setIsOpenToComment(true);
      setIsPrivate(false);
      setIsLinkOnly(false);
      setBirthDate(new Date().toISOString());
      setDeathDate(new Date().toISOString());
      setPostDate(new Date().toISOString());
    }
  }, [route?.params?.item]);

  const onSave = () => {
    if (isNullOrEmpty(categoryId) || isNullOrEmpty(name) || isNullOrEmpty(text) || isNullOrEmpty(birthDate) || isNullOrEmpty(deathDate)) {
      setSuccess({
        ...success,
        categoryId: !isNullOrEmpty(categoryId) ? true : false,
        name: !isNullOrEmpty(name) ? true : false,
        text: !isNullOrEmpty(text) ? true : false,
        birthDate: !isNullOrEmpty(birthDate) ? true : false,
        deathDate: !isNullOrEmpty(deathDate) ? true : false,
      });
    }
    else {

      let birth_date = birthDate.includes("T") ? birthDate.split('T')[0] : birthDate;
      let death_date = deathDate.includes("T") ? deathDate.split('T')[0] : deathDate;

      setLoading(true);
      if (itemData) {
        editRequest(itemData.id, user.id, birth_date, death_date, isPrivate, isLinkOnly, isOpenToComment, categoryId, name, text, postDate).then(response => {
          if (response.isSuccess) {
            getMemoryRequest(itemData.id).then(response1 => {
              setItemData(response1.data);
            })

            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });

            setTimeout(() => {
              setLoading(false);
            }, 500)
          }
          else {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_file_message'),
            });

            setLoading(false);
          }
        }).catch(error => {
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: t('error_file_message'),
          });

          setLoading(false);
        })
      }
      else {
        saveRequest(0, user.id, birth_date, death_date, isPrivate, isLinkOnly, isOpenToComment, categoryId, name, text, postDate).then(response => {
          if (response.isSuccess) {
            getMemoryRequest(response.data.id).then(response1 => {
              setItemData(response1.data);
            })

            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });

            setTimeout(() => {
              setLoading(false);
            }, 500)
          }
          else {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_file_message'),
            });

            setLoading(false);
          }
        }).catch(error => {
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: t('error_file_message'),
          });

          setLoading(false);
        })
      }
    }
  }

  const handleMediaIndexChange = (index) => {
    setActiveMediaIndex(index);
  };

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

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[BaseStyle.safeAreaView]} forceInset={{ top: 'always', bottom: 'always' }}>
        <Header title={itemData && itemData.name} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{
            flex: 1,
          }}
        >
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
                width: "100%"
              }}
            >
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <CheckBox
                  color={colors.primaryLight}
                  title={t('link_only')}
                  checked={isLinkOnly === true}
                  onPress={() => { setIsLinkOnly(!isLinkOnly); setIsPrivate(!isLinkOnly ? false : isPrivate);}}
                />

                <CheckBox
                  color={colors.primaryLight}
                  title={t('private')}
                  checked={isPrivate === true}
                  onPress={() => { setIsPrivate(!isPrivate); setIsLinkOnly(!isPrivate ? false : isLinkOnly);}}
                />

                <CheckBox
                  color={colors.primaryLight}
                  title={t('open_to_comment')}
                  checked={isOpenToComment === true}
                  onPress={() => setIsOpenToComment(isOpenToComment === true ? false : true)}
                />
              </View>

              <PickerSelect label={t('pets')} value={category} onChange={(v) => { setCategory(v); setCategoryId(v.key) }} options={categories} />

              <View style={styles.contentTitle}>
                <Text headline>
                  {t('name')}
                </Text>
              </View>
              <TextInput
                style={[BaseStyle.textInput]}
                onChangeText={(text) => setName(text)}
                autoCorrect={false}
                placeholder={t('name')}
                placeholderTextColor={success.name ? BaseColor.grayColor : colors.primary}
                value={name}
                selectionColor={colors.primary}
              />
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <DatePicker
                  placeholder={t('birth_date')}
                  formatDisplay="DD/MM/yyyy"
                  value={new Date(birthDate)}
                  label={t('birth_date')}
                  onChange={(value) => { setBirthDate(value.toISOString()) }}
                  placeholderTextColor={success.birthDate ? BaseColor.grayColor : colors.primary}
                />

                <DatePicker
                  placeholder={t('death_date')}
                  formatDisplay="DD/MM/yyyy"
                  value={new Date(deathDate)}
                  label={t('death_date')}
                  onChange={(value) => setDeathDate(value.toISOString())}
                  placeholderTextColor={success.deathDate ? BaseColor.grayColor : colors.primary}
                />
              </View>

              <View style={styles.contentTitle}>
                <Text headline>
                  {t('memory')}
                </Text>
              </View>
              <TextInput
                style={[BaseStyle.textInput, { height: 250 }]}
                multiline
                scrollEnabled
                onChangeText={(text) => setText(text)}
                autoCorrect={false}
                placeholder={t('memory')}
                placeholderTextColor={success.text ? BaseColor.grayColor : colors.primary}
                value={text}
                maxLength={allowedCharacterCount}
                selectionColor={colors.primary}
              />

            </View>
          </ScrollView>

          <View style={{ width: '100%', padding: 20 }}>
            <Button loading={loading} full onPress={() => { onSave() }}>
              {t('save')}
            </Button>
          </View>
        </KeyboardAvoidingView>
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
            onIndexChange={handleMediaIndexChange}
          />
        ) : (
          <Image
            source={Images.avata6}
            style={{ height: '100%', width: '100%' }}
          />
        )}
        {itemData && isImageUploadAllowed && <TouchableOpacity
          style={[styles.viewIcon, { backgroundColor: colors.primaryLight }]}
        >
          <Icon
            solid
            name="image"
            size={20}
            color={BaseColor.whiteColor}
            onPress={pickImage}
          />
        </TouchableOpacity>}
        {itemData && isVideoUploadAllowed && <TouchableOpacity
          style={[styles.viewIconLeft, { backgroundColor: colors.primaryLight }]}
        >
          <Icon
            solid
            name="video"
            size={20}
            color={BaseColor.whiteColor}
            onPress={pickVideo}
          />
        </TouchableOpacity>}
        {itemData && isYoutubeLinkAllowed && <TouchableOpacity
          style={[styles.viewIconMostLeft, { backgroundColor: colors.primaryLight }]}
        >
          <Icon
            solid
            name="youtube"
            size={20}
            color={BaseColor.whiteColor}
            onPress={openYoutubeLinkModal}
          />
        </TouchableOpacity>}
        {itemData && mediaFiles && mediaFiles.length > 0 && <TouchableOpacity
          style={[styles.viewIconLeastLeft, { backgroundColor: BaseColor.pinkDarkColor }]}
        >
          <Icon
            solid
            name="trash"
            size={20}
            color={BaseColor.whiteColor}
            onPress={deleteFile}
          />
        </TouchableOpacity>}
        {itemData && mediaFiles[activeMediaIndex] && mediaFiles[activeMediaIndex].type === 'image' && <TouchableOpacity
          style={[styles.primary, { backgroundColor: colors.primaryLight }]}
        >
          <CheckBox
            color={BaseColor.whiteColor}
            title={t('primary')}
            checked={mediaFiles[activeMediaIndex].isPrimary === true}
            disabled={mediaFiles[activeMediaIndex].isPrimary}
            onPress={() => {
              setMemoryFileIsPrimaryRequest(mediaFiles[activeMediaIndex].id).then(response => {
                if (response.isSuccess) {
                  getMemoryRequest(itemData.id).then(response1 => {
                    setItemData(response1.data);
                    setActiveMediaIndex(0);

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
            }}
          />
        </TouchableOpacity>}
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
            onPressLeft={() => {
              if (itemData) {
                navigation.navigate('NPostDetail', { item: itemData });
              }
              else {
                navigation.goBack();
              }
            }}
          />
        </SafeAreaView>
      </Animated.View>

      {showYoutubeLinkModal && <ModalYoutubeLink
        isProccessSuccess={() => onProccessSuccess()}
        memoryId={itemData.id}
        isVisible={showYoutubeLinkModal}
        onSwipeComplete={() => {
          setShowYoutubeLinkModal(false);
        }}
        onBackdropPress={() => {
          setShowYoutubeLinkModal(false)
        }}
      />}
    </View>
  );
};

export default NPostEditNew;
