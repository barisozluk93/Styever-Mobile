import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Animated, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Header, Icon, News44, NotFound, SafeAreaView, Tag, TextInput } from '@/components';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { listArticle } from '@/actions/article';
import styles from './styles';
import { articleUploadFolderUrl } from '@/utils/utility';

export const modes = {
  square: 'square',
};

const NArticle = ({ mode = modes.square }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const { loading, articles, searchTerm } = useSelector(state => state.article);
  const { language } = useSelector(state => state.application);
  const [refreshing] = useState(false);
  const [modeView, setModeView] = useState(mode);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fetchData();

      return () => {
        dispatch({ type: 'ARTICLE_INIT' });
      };
    }, [searchTerm, language])
  );

  const fetchData = () => {
    dispatch(listArticle(searchTerm, language));
  }

  const onFilter = () => {
    navigation.navigate('NSearchFilter');
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
    navigation.navigate('NArticleDetail', { item: item });
  };


  const renderItem = ({ item, index }) => {
    switch (modeView) {      
      case 'square':
        return (
          <News44
            loading={loading}
            style={{ marginVertical: 8 }}
            title={language === 'tr' ? item.header : item.headerEn}
            image={item.file ? articleUploadFolderUrl + `${item.file.path.split("\\")[item.file.path.split("\\").length-1]}` : Images.avata6}
            onPress={goPostDetail(item)}
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
              paddingHorizontal: 16,
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
          </View>
        }
        {!loading && articles && articles.length === 0 && <NotFound />}

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
          data={articles}
          key={getTotalCol()}
          numColumns={getTotalCol()}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />}

        {loading ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : null
        }
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('support')}
      />
      {renderList()}
    </SafeAreaView>
  );
};

export default NArticle;
