import { Alert, Linking } from 'react-native';
import { LearningResource } from '../data/resources';
export async function openResource(resource: LearningResource) {
  try {
    await Linking.openURL(resource.url);
  } catch {
    Alert.alert(
      'Unable to open this resource',
      'Check your connection and make sure a browser is available, then try again.',
    );
  }
}
