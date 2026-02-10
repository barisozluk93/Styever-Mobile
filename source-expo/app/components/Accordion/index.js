import PropTypes from 'prop-types';
import { LayoutAnimation, Platform, TouchableOpacity, UIManager, View, StyleSheet } from 'react-native';
import { useTheme } from '@/config';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const Accordion = ({
  title = '',
  description = '',
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View
      style={{
        marginBottom: 12,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.8}
        style={{
          padding: 16,
          backgroundColor: colors.card,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text headline style={{flex: 1, color: colors.primary }}>
          {title}
        </Text>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: 12,
          }}
        >
          {open ? <Icon name="minus" size={14} color={colors.primary} />: <Icon name="plus" size={14} color={colors.primary} />}
        </Text>
      </TouchableOpacity>

      {open && (
        <View
          style={{
            padding: 16,
            backgroundColor: colors.card,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.primary,
          }}
        >
          <Text style={{ color: colors.primary }}>{description}</Text>
        </View>
      )}
    </View>
  );
};

Accordion.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Accordion;
