import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import * as Utils from '@/utils';
import { Button, CheckBox, Header, Icon, SafeAreaView, Tag, Text, TextInput } from '@/components';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrEmpty } from '@/utils/utility';

const categories = [
  { value: '1', text: 'bird' },
  { value: '2', text: 'cat' },
  { value: '3', text: 'dog' },
  { value: '4', text: 'fish' },
  { value: '5', text: 'hamster' },
  { value: '6', text: 'horse' },
  { value: '7', text: 'turtle' }
];

const NFilter = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState();
  const [isMine, setIsMine] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const { categoryId, searchTerm, isMyList } = useSelector(state => state.memory);
  const { user } = useSelector(state => state.user);

  const renderItem = ({ item, checked, onPress }) => {
    return (
      <Tag
        key={item.id}
        icon={checked ? <Icon style={{ marginRight: 5 }} name="check" color={BaseColor.whiteColor} size={16} /> : null}
        primary={checked}
        outline={!checked}
        style={{
          marginTop: 8,
          marginRight: 8,
          height: 28,
          minWidth: 100,
        }}
        onPress={onPress}
      >
        {t(item.text)}
      </Tag>
    );
  };

  useEffect(() => {
    if(searchTerm && !isNullOrEmpty(searchTerm)) {
      setSearch(searchTerm);
    }

    if(categoryId && !isNullOrEmpty(categoryId) && !isNaN(categoryId)) {
      setCategory(categoryId);
    } 
    
    if(isMyList && !isNullOrEmpty(isMyList) && !isNaN(isMyList)) {
      setIsMine(isMyList);
    }

  }, [categoryId, searchTerm, isMyList]);

  const onClear = () => {
    setSearch('');
    setCategory();
    setIsMine(false);
  };

  const onFilter = () => {
    var filter = {};
    if(search) {
      filter.searchTerm = search;
    }
    else{
      filter.searchTerm = undefined;
    }

    if(category) {
      filter.categoryId = category;
    }
    else{
      filter.categoryId = undefined;
    }

    if(user) {
      filter.isMyList = isMine;
    }
    else{
      filter.isMyList = false;
    }

    dispatch({ type: 'MEMORY_SET_FILTER', payload: filter ? filter : null });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
      <Header
        title={t('filtering')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('clear')}
            </Text>
          );
        }}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => onClear()}
      />
      <ScrollView
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          {user && <View style={[styles.wrapContent, { marginTop: 8 }]}>
            <CheckBox
              color={BaseColor.darkgreenColor}
              title={t('my_memories')}
              checked={isMine}
              onPress={() => {
                setIsMine(!isMine);              
              }}
            />
          </View>}
          <Text headline semibold style={{ marginTop: 20 }}>
            {t('search')}
          </Text>
          <View style={[styles.wrapContent, { marginTop: 8 }]}>
            <TextInput
              value={search}
              onChangeText={(val) => setSearch(val)}
              placeholder={t('search')}
              iconLeft={<Icon name="magnifying-glass" color={colors.border} style={{ marginRight: 8 }} size={18} />}
            />
          </View>
          <Text headline semibold style={{ marginTop: 20 }}>
            {t('pets')}
          </Text>
          <View style={styles.wrapContent}>
            {categories.map((item, index) => (
              <Fragment key={index}>
                {renderItem({
                  item,
                  index,
                  checked: category ? item.value === category : false,
                  onPress: () => setCategory(item.value),
                })}
              </Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Button
          full
          onPress={onFilter}
        >
          {t('apply')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default NFilter;
