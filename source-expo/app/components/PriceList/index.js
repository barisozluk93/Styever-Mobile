import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/config';
import Text from '@/components/Text';
import styles from './styles';
import Icon from '@/components/Icon';
import { useTranslation } from 'react-i18next';

const PriceList = ({
  style = {},
  onSelect = () => { },
  disabled = true,
  item = {},
  selected
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity style={[styles.card, style, selected && styles.selected,
      , { backgroundColor: colors.card }]} onPress={onSelect}>
      <View style={styles.checkbox}>
        {selected && (
          <Icon name="check" size={14} color={colors.primary} />
        )}
      </View>

      <Text headline style={[styles.title, { color: colors.primary }]}>{item.name.toUpperCase()}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <View style={styles.divider} />

      <View style={styles.propertiesGrid}>
        {item.properties.map((prop, index) => (
          <View key={index} style={styles.propertyItem}>
            <Icon name="check" size={14} color={colors.primary} />
            <Text style={styles.property}>{prop}</Text>
          </View>
        ))}
      </View>

      {selected && <View style={styles.trialBadge}>
        <Text style={styles.trialText}>{t('trial')}</Text>
      </View>}
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
