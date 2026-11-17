import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams } from '../navigation/types';
import { filterResources } from '../data/resources';
import { useSavedResources } from '../hooks/useSavedResources';
import { Button, Filters, Page, RoundButton } from '../components/ui';
import { Grid } from '../components/Responsive';
import { ResourceCard } from '../components/ResourceCard';
import { colors, styles as s } from '../theme';
export function LearningScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'Learning'>) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [savedOnly, setSavedOnly] = useState(false);
  const saved = useSavedResources();
  const filtered = filterResources(query, type, savedOnly, saved.savedIds);
  return (
    <Page>
      <View style={s.row}>
        <RoundButton
          icon="back"
          label="Go back"
          onPress={() => navigation.goBack()}
        />
        <Text style={s.eyebrow}>LEARNING LIBRARY</Text>
      </View>
      <Text style={s.title}>Beyond the Stage</Text>
      <Text style={s.muted}>
        English articles, guides and videos from the people building immersive
        experiences.
      </Text>
      <TextInput
        accessibilityLabel="Search learning resources"
        value={query}
        onChangeText={setQuery}
        placeholder="Search topics, creators or titles"
        placeholderTextColor={colors.muted}
        style={l.search}
        autoCorrect={false}
        returnKeyType="search"
      />
      <Filters
        values={['All', 'Article', 'Video', 'Guide']}
        selected={type}
        onSelect={setType}
      />
      <Filters
        values={['All Resources', 'Saved']}
        selected={savedOnly ? 'Saved' : 'All Resources'}
        onSelect={value => setSavedOnly(value === 'Saved')}
      />
      {saved.error && (
        <View style={[s.card, s.padded]}>
          <Text style={s.muted}>{saved.error}</Text>
          {!saved.ready && <Button title="Retry" onPress={saved.reload} />}
        </View>
      )}
      <Text style={s.small}>
        External resources open in your browser and need internet access. Saved
        links remain available here; videos and external articles are not
        downloaded.
      </Text>
      <Text accessibilityLiveRegion="polite" style={s.small}>
        {filtered.length} resources
      </Text>
      {filtered.length ? (
        <Grid>
          {filtered.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              saved={saved.savedIds.includes(resource.id)}
              disabled={!saved.ready || saved.busy}
              onSave={() => saved.toggle(resource.id)}
            />
          ))}
        </Grid>
      ) : (
        <View style={[s.card, s.padded]}>
          <Text style={s.heading}>
            {savedOnly ? 'No saved matches yet' : 'No matching resources'}
          </Text>
          <Text style={s.muted}>
            Try another search or browse all resources.
          </Text>
          <Button
            outline
            title="Show All Resources"
            onPress={() => {
              setQuery('');
              setType('All');
              setSavedOnly(false);
            }}
          />
        </View>
      )}
    </Page>
  );
}
const l = StyleSheet.create({
  search: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    padding: 15,
    borderRadius: 14,
    minHeight: 52,
    fontSize: 16,
  },
});
