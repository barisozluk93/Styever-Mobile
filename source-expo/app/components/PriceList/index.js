import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { BaseColor, FontWeight, useTheme } from '@/config';
import Text from '@/components/Text';
import styles from './styles';
import { getHeightDevice, getWidthDevice } from '@/utils';
import Tag from '../Tag';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const PriceList = ({
  style = {},
  onPress = () => { },
  disabled = true,
  item = {},
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <TouchableOpacity disabled={disabled} style={[styles.container, style]} onPress={onPress}>
      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            width: getWidthDevice() - 20,
            height: "100%"
          },
        ]}
      >
        <Text headline numberOfLines={2}>
          {item.name}
        </Text>

        <Text
          light
          style={{
            paddingTop: 30,
            fontSize: 20
          }}>
          {item.description}
        </Text>

        <View
          style={{
            alignItems: 'center',
            alignContent: 'center',
            paddingTop: 30,
            paddingBottom: 30
          }}
        >
          <Tag
            light
            textStyle={{
              color: BaseColor.whiteColor,
              fontSize: 20
            }}
            style={{
              backgroundColor: colors.primaryLight,
              minWidth: 80,
            }}
          >
            {item.price}
          </Tag>
        </View>
        <View
          style={{
            alignItems: 'center',
            alignContent: 'center',
            paddingBottom: 30
          }}
        >
          {item.properties.map((property, colIndex) => (
            <Text
              light
              style={{
                paddingTop: 20,
                fontWeight: 'bold'
              }}
            >
              {'\u2022'}&nbsp;{property}
            </Text>
        ))}
        </View>

        <View full style={{position: 'absolute',
            top: '90%',
            left: '5%',
            right: '5%'}}>
          <Button full onPress={() => navigation.navigate('SignUp')}>
            {t('sign_up')}
          </Button>
        </View>
      </View>
    </TouchableOpacity>
  );
};

PriceList.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  subTitle: PropTypes.string,
  description: PropTypes.string,
  progress: PropTypes.number,
  days: PropTypes.string,
  members: PropTypes.array,
};

export default PriceList;
