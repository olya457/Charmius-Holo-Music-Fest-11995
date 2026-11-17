import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking } from 'react-native';
import { getLayout } from '../src/utils/layout';
import { resources, filterResources } from '../src/data/resources';
import { openResource } from '../src/utils/openResource';
import { useSavedResources } from '../src/hooks/useSavedResources';
import { images } from '../src/data/images';
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
}));
test('small, folded, expanded and large-text layouts stay adaptive', () => {
  expect(getLayout(320, 568)).toMatchObject({
    compact: true,
    wide: false,
    columns: 1,
    galleryColumns: 1,
  });
  expect(getLayout(390, 844)).toMatchObject({ wide: false, galleryColumns: 2 });
  expect(getLayout(626, 890)).toMatchObject({ wide: true, columns: 2 });
  expect(getLayout(840, 780, 1.4)).toMatchObject({
    compact: true,
    wide: false,
    columns: 1,
  });
  expect(getLayout(840, 780)).toMatchObject({
    wide: true,
    columns: 2,
    galleryColumns: 3,
  });
  expect(getLayout(1194, 780)).toMatchObject({ wide: true, columns: 3 });
  expect(getLayout(840, 780, 1.8)).toMatchObject({
    compact: true,
    wide: false,
    columns: 1,
    galleryColumns: 1,
  });
});
test('resources have local art, HTTPS sources and working search and saved filters', () => {
  for (const resource of resources) {
    expect(resource.url.startsWith('https://')).toBe(true);
    expect(images[resource.image]).toBeDefined();
  }
  expect(
    filterResources('dolby', 'All', false, []).map(item => item.id),
  ).toEqual(['spatial-audio']);
  expect(filterResources('', 'Video', false, [])).toHaveLength(2);
  expect(filterResources('', 'All', true, [])).toEqual([]);
  expect(filterResources('', 'All', true, ['digital-human'])).toEqual([
    resources[1],
  ]);
});
test('opens the selected resource and reports an unavailable browser', async () => {
  const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await openResource(resources[0]);
  expect(open).toHaveBeenCalledWith(resources[0].url);
  open.mockRejectedValueOnce(new Error('offline'));
  await openResource(resources[1]);
  expect(alert).toHaveBeenCalled();
  open.mockRestore();
  alert.mockRestore();
});
test('saved links survive remounts and failed writes do not change them', async () => {
  let state!: ReturnType<typeof useSavedResources>;
  function Probe() {
    state = useSavedResources();
    return null;
  }
  let renderer!: TestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = TestRenderer.create(<Probe />);
  });
  await act(async () => state.toggle('digital-human'));
  expect(state.savedIds).toEqual(['digital-human']);
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('disk full'));
  await act(async () => state.toggle('digital-human'));
  expect(state.savedIds).toEqual(['digital-human']);
  await act(async () => renderer.unmount());
  jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce('["digital-human"]');
  await act(async () => {
    renderer = TestRenderer.create(<Probe />);
  });
  expect(state.savedIds).toEqual(['digital-human']);
  await act(async () => state.toggle('digital-human'));
  expect(state.savedIds).toEqual([]);
  await act(async () => renderer.unmount());
});
