import React from 'react';
import { Image, Text, View } from 'react-native';
import { LearningResource } from '../data/resources';
import { images } from '../data/images';
import { openResource } from '../utils/openResource';
import { styles as s } from '../theme';
import { Button } from './ui';
export function ResourceCard({
  resource,
  saved,
  onSave,
  disabled,
}: {
  resource: LearningResource;
  saved?: boolean;
  onSave?: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={s.card}>
      <Image
        source={images[resource.image]}
        style={{ width: '100%', height: 155 }}
      />
      <View style={s.padded}>
        <Text style={s.eyebrow}>{resource.type.toUpperCase()} · ENGLISH</Text>
        <Text style={s.heading}>{resource.title}</Text>
        <Text style={s.small}>
          {resource.publisher} · {resource.topic}
        </Text>
        <Text style={s.muted}>{resource.description}</Text>
        <Button
          title={
            resource.type === 'Video' ? 'Watch Video ↗' : 'Read Resource ↗'
          }
          onPress={() => openResource(resource)}
        />
        {onSave && (
          <Button
            outline
            title={saved ? 'Saved · Remove' : 'Save for Later'}
            onPress={onSave}
            disabled={disabled}
          />
        )}
      </View>
    </View>
  );
}
