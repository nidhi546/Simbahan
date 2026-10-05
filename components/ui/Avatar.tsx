import React from 'react';
import { View, StyleSheet } from 'react-native';
import Img from './Img';
import { Colors } from '../../constants/Colors';
import { Radius } from '../../constants/Layout';
import AppText from './AppText';
import { useI18n } from '../../i18n';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, number> = { sm: 32, md: 44, lg: 64 };
const fontSizeMap: Record<AvatarSize, number> = { sm: 12, md: 16, lg: 22 };

const getInitials = (name?: string) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

const Avatar = ({ uri, name, size = 'md' }: AvatarProps) => {
  const { t } = useI18n();
  const dim = sizeMap[size];
  const fontSize = fontSizeMap[size];

  if (uri) {
    return (
      <Img
        source={{ uri }}
        style={{ width: dim, height: dim, borderRadius: Radius.full }}
        contentFit="cover"
        transition={200}
        accessible
        accessibilityLabel={name ?? t('ui.avatar')}
      />
    );
  }

  return (
    <View
      style={StyleSheet.flatten([styles.fallback, { width: dim, height: dim, borderRadius: Radius.full }])}
      accessible
      accessibilityLabel={name ?? t('ui.avatar')}
    >
      <AppText variant="label" color={Colors.textInverse} style={{ fontSize }}>
        {getInitials(name)}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: Colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(Avatar);
