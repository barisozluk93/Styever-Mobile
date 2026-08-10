import PropTypes from 'prop-types';
import {TouchableOpacity,View} from 'react-native';
import {useTheme} from '@/config';
import Text from '@/components/Text';
import styles from './styles';
import Icon from '@/components/Icon';
import {useTranslation} from 'react-i18next';

const PriceList=({
  style={},
  onSelect=()=>{},
  item={},
  isStandByPage=false,
  isProfilePage=false,
  selected=false,
})=>{
  const {colors}=useTheme();
  const {t}=useTranslation();

  return(
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        style,
        {
          backgroundColor:colors.card,
          borderColor:selected
            ?colors.primary
            :colors.border,
        },
      ]}
      onPress={onSelect}
    >
      {item.preferred&&(
        <View
          style={[
            styles.preferredBadge,
            {backgroundColor:colors.primary},
          ]}
        >
          <Text style={styles.preferredText}>
            {t('most_preferred')}
          </Text>

          <Icon
            solid
            name="star"
            size={11}
            color="#D4AF37"
          />
        </View>
      )}

      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text numberOfLines={0} style={styles.title}>
            {item.name}
          </Text>

          <Text
            numberOfLines={0}
            style={[
              styles.price,
              {color:colors.primary},
            ]}
          >
            {item.price}
          </Text>
        </View>

        <View
          style={[
            styles.selectCircle,
            {borderColor:colors.primary},
            selected&&{
              backgroundColor:colors.primary,
            },
          ]}
        >
          {selected&&(
            <Icon
              name="check"
              size={11}
              color="#FFFFFF"
            />
          )}
        </View>
      </View>

      <View style={styles.properties}>
        {item.properties.map((prop,index)=>(
          <View
            key={`${item.id}-${index}`}
            style={styles.propertyItem}
          >
            <View
              style={[
                styles.checkIcon,
                {backgroundColor:colors.primary},
              ]}
            >
              <Icon
                name="check"
                size={8}
                color="#FFFFFF"
              />
            </View>

            <Text
              numberOfLines={0}
              style={styles.property}
            >
              {prop}
            </Text>
          </View>
        ))}
      </View>

      {selected&&!isProfilePage&&!isStandByPage&&(
        <View
          style={[
            styles.trialBadge,
            {backgroundColor:colors.primary},
          ]}
        >
          <Text style={styles.trialText}>
            {t('trial')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

PriceList.propTypes={
  onSelect:PropTypes.func,
  style:PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  item:PropTypes.object,
  isStandByPage:PropTypes.bool,
  isProfilePage:PropTypes.bool,
  selected:PropTypes.bool,
};

export default PriceList;
