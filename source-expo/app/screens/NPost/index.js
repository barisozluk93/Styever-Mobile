import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Header, Icon, ModalComment, ModalLike, News43, NotFound, SafeAreaView, Tag, Text } from '@/components';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { listMemory } from '@/actions/memory';
import { dislikeRequest, likeRequest } from '@/apis/memoryApi';

export const modes = {
  square: 'square',
};

const NPost = ({ mode = modes.square }) => {
  const { user } = useSelector((state) => state.user);
  const login = user ? true : false;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { loading, memories, page, totalPages, searchTerm, categoryId } = useSelector(state => state.memory);
  const [currentPage, setCurrentPage] = useState(1);
  const [likes, setLikes] = useState([]);
  const [showLikesAction, setShowLikesAction] = useState(false);
  const [memoryId, setMemoryId] = useState();
  const [showCommentsAction, setShowCommentsAction] = useState(false);
  const [refreshing] = useState(false);
  const [modeView, setModeView] = useState(mode);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fetchData();

      return () => {
        dispatch({ type: 'MEMORY_INIT' });
      };
    }, [currentPage, searchTerm, categoryId])
  );

  const fetchData = () => {
    dispatch(listMemory(currentPage, 4, searchTerm, categoryId));
  }

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
    navigation.navigate('NPostDetail', { item: item });
  };

  const openLikedList = (item) => {
    setLikes([]);
    setLikes([...item.likes]);
    setShowLikesAction(true);
  };

    const like = (item) => {
      if (user) {
        if (item.likesCount > 0 && item.likes.filter(f => f.userId === user.id)) {
          dislikeRequest(item.id, user.id).then(response => {
            if (response.isSuccess) {
              fetchData();
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
        else {
          likeRequest(0, item.id, user.id).then(response => {
            if (response.isSuccess) {
                fetchData();
  
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
    }

  const openCommentList = (item) => {
    if(item.isOpenToComment) {
      setMemoryId();
      setMemoryId(item.id);
      setShowCommentsAction(true);
    }
  };

  const onProccessSuccess = () => {
    fetchData();
  }

  const renderItem = ({ item, index }) => {
    switch (modeView) {
      case 'square':
        return (
          <News43
            avatar={item.avatar}
            loading={loading}
            style={{ marginVertical: 8 }}
            name={item.name}
            deathDate={item.deathDate}
            birthDate={item.birthDate}
            postDate={item.postDate}
            username={item.userName}
            category={item.category}
            commentCount={item.commentsCount}
            likeCount={item.likesCount}
            image={(item.files && item.files.length > 0) ? item.files.filter(f => f.isPrimary)[0]?.fileResult?.fileContents : Images.avata6}
            fileResult={(item.files && item.files.length > 0) ? item.files.filter(f => f.isPrimary)[0]?.fileResult?.fileContents : undefined}
            isLiked={login ? (item.likesCount > 0 ? (item.likes.filter(f => f.userId === user.id) ? true : false) : false) : false}
            onPress={goPostDetail(item)}
            onLikePress={() => like(item)}
            onLikeListPress={() => openLikedList(item)}
            onCommentPress={() => openCommentList(item)}
          />
        );

      default:
        break;
    }
  };

  const renderList = () => {
    return (
      <View style={{ flex: 1 }}>

        {!loading &&
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
              paddingLeft: 8,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ flex: 1, alignItems: "flex-start" }}>
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
                icon={<Icon name="sliders-h" color={BaseColor.whiteColor} size={15} />}
                onPress={() => onFilter()}
              >
                {t("filter")}
              </Tag>
            </View>
            {memories && memories.length > 0 && <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                disabled={page === 1}
                onPress={() => setCurrentPage(page - 1)}
                style={{ marginHorizontal: 6, opacity: page === 1 ? 0.4 : 1 }}
              >
                <Text style={{ paddingVertical: 2.5, borderRadius: 8, height: 25, textAlign: "center", color: colors.text, fontSize: 16 }}>‹ {t('prev')}</Text>
              </TouchableOpacity>

              <TouchableOpacity disabled={true}>
                <Text style={{ paddingVertical: 1.75, borderRadius: 8, width: 30, height: 25, textAlign: "center", color: BaseColor.whiteColor, backgroundColor: colors.primary, fontSize: 16 }}>
                  {page}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={page === totalPages}
                onPress={() => setCurrentPage(page + 1)}
                style={{ marginHorizontal: 6, opacity: page === totalPages ? 0.4 : 1 }}
              >
                <Text style={{ paddingVertical: 2.5, borderRadius: 8, height: 25, textAlign: "center", color: colors.text, fontSize: 16 }}>{t('next')} ›</Text>
              </TouchableOpacity>
            </View>}
          </View>
        }
        {!loading && memories && memories.length === 0 && <NotFound />}

        {!loading && <Animated.FlatList
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
              onRefresh={() => { }}
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
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />}

        {loading ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : null
        }

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

        {showCommentsAction && <ModalComment
          isProccessSuccess={() => onProccessSuccess()}
          memoryId={memoryId}
          isVisible={showCommentsAction}
          onSwipeComplete={() => {
            setShowCommentsAction(false);
          }}
          onBackdropPress={() => {
            setShowCommentsAction(false)
          }}
        />}

      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('memories')}
        renderLeft={() => {
          return <Text headline primaryColor style={{ width: 100 }}>
            {t('create')}
          </Text>;
        }}
        onPressLeft={() => {
          if (!login) { navigation.navigate('Pricing') }
          else {
            navigation.navigate('NPostEditNew')
          }
        }}
      />
      {renderList()}
    </SafeAreaView>
  );
};

export default NPost;
