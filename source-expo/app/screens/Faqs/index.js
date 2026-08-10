import {useCallback,useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import RenderHTML from 'react-native-render-html';
import {BaseStyle,useTheme} from '@/config';
import {Header,Icon,SafeAreaView,Text} from '@/components';
import {listFaqRequest} from '@/apis/faqApi';
import styles from './styles';

const Faqs=({navigation})=>{
  const {t}=useTranslation();
  const {colors}=useTheme();
  const {width}=useWindowDimensions();
  const {language}=useSelector(state=>state.application);

  const [loading,setLoading]=useState(false);
  const [data,setData]=useState([]);
  const [expandedIndex,setExpandedIndex]=useState(null);

  const fetchData=useCallback(async()=>{
    setLoading(true);

    try{
      const response=await listFaqRequest();

      if(response?.isSuccess){
        setData(Array.isArray(response.data)?response.data:[]);
      }
      else{
        setData([]);
      }
    }
    catch(error){
      console.log('FAQ list error:',error);
      setData([]);
    }
    finally{
      setLoading(false);
    }
  },[]);

  useFocusEffect(
    useCallback(()=>{
      fetchData();
    },[fetchData]),
  );

  const getTitle=item=>
    language==='tr'
      ?item?.header
      :item?.headerEn;

  const getDescription=item=>
    language==='tr'
      ?item?.content
      :item?.contentEn;

  const toggle=index=>{
    setExpandedIndex(current=>
      current===index
        ?null
        :index,
    );
  };

  return(
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right','top','left']}
    >
      <Header
        title=""
        renderLeft={()=>(
          <Icon
            name="angle-left"
            size={20}
            color={colors.primary}
            enableRTL={true}
          />
        )}
        onPressLeft={()=>navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heading}>
          <View style={styles.kickerRow}>
            <View
              style={[
                styles.kickerLine,
                {backgroundColor:colors.primary},
              ]}
            />
            <Text
              numberOfLines={0}
              style={[
                styles.kicker,
                {color:colors.primary},
              ]}
            >
              STYEVER
            </Text>
          </View>

          <Text numberOfLines={0} style={styles.title}>
            {t('faqs')}
          </Text>

          <Text
            numberOfLines={0}
            grayColor
            style={styles.description}
          >
            {t('faq_description')}
          </Text>
        </View>

        <View style={styles.content}>
          {loading&&(
            <View style={styles.loading}>
              <ActivityIndicator
                size="large"
                color={colors.primary}
              />
              <Text
                body2
                grayColor
                style={styles.loadingText}
              >
                {t('faq_loading')}
              </Text>
            </View>
          )}

          {!loading&&!data.length&&(
            <View
              style={[
                styles.emptyCard,
                {
                  borderColor:colors.border,
                  backgroundColor:
                    colors.card||
                    colors.background,
                },
              ]}
            >
              <View
                style={[
                  styles.emptyIcon,
                  {backgroundColor:colors.primary+'12'},
                ]}
              >
                <Icon
                  name="comments"
                  size={24}
                  color={colors.primary}
                />
              </View>

              <Text
                headline
                semibold
                style={styles.emptyTitle}
              >
                {t('faq_empty')}
              </Text>

              <Text
                body2
                grayColor
                style={styles.emptyText}
              >
                {t('faq_empty_description')}
              </Text>
            </View>
          )}

          {!loading&&data.map((item,index)=>{
            const expanded=expandedIndex===index;

            return(
              <View
                key={item?.id||index}
                style={[
                  styles.card,
                  {
                    borderColor:
                      expanded
                        ?colors.primary+'55'
                        :colors.border,
                    backgroundColor:
                      colors.card||
                      colors.background,
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.questionRow}
                  onPress={()=>toggle(index)}
                >
                  <View
                    style={[
                      styles.numberBadge,
                      {
                        backgroundColor:
                          expanded
                            ?colors.primary
                            :colors.primary+'12',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberText,
                        {
                          color:
                            expanded
                              ?'#FFFFFF'
                              :colors.primary,
                        },
                      ]}
                    >
                      {String(index+1).padStart(2,'0')}
                    </Text>
                  </View>

                  <Text
                    headline
                    semibold
                    style={styles.question}
                  >
                    {getTitle(item)}
                  </Text>

                  <View
                    style={[
                      styles.toggleButton,
                      {
                        backgroundColor:
                          expanded
                            ?colors.primary
                            :colors.primary+'10',
                      },
                    ]}
                  >
                    <Icon
                      name={
                        expanded
                          ?'minus'
                          :'plus'
                      }
                      size={13}
                      color={
                        expanded
                          ?'#FFFFFF'
                          :colors.primary
                      }
                    />
                  </View>
                </TouchableOpacity>

                {expanded&&(
                  <View
                    style={[
                      styles.answerWrapper,
                      {borderTopColor:colors.border},
                    ]}
                  >
                    <View
                      style={[
                        styles.answerAccent,
                        {backgroundColor:colors.primary},
                      ]}
                    />

                    <View style={styles.answerContent}>
                      <RenderHTML
                        contentWidth={Math.max(width-92,200)}
                        source={{
                          html:String(getDescription(item)||''),
                        }}
                        baseStyle={styles.answer}
                        tagsStyles={{
                          p:styles.htmlParagraph,
                          div:styles.htmlParagraph,
                          span:styles.htmlSpan,
                          strong:styles.htmlStrong,
                          b:styles.htmlStrong,
                          em:styles.htmlEm,
                          i:styles.htmlEm,
                          ul:styles.htmlList,
                          ol:styles.htmlList,
                          li:styles.htmlListItem,
                          a:[
                            styles.htmlLink,
                            {color:colors.primary},
                          ],
                        }}
                        defaultTextProps={{
                          selectable:true,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          {!loading&&data.length>0&&(
            <View
              style={[
                styles.footerNote,
                {
                  backgroundColor:
                    colors.primary+'0D',
                },
              ]}
            >
              <Icon
                name="heart"
                size={17}
                color={colors.primary}
              />

              <Text
                body2
                style={[
                  styles.footerText,
                  {color:colors.primary},
                ]}
              >
                {t('faq_footer_note')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Faqs;
