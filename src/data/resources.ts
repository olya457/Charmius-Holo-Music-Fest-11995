export type LearningResource = {
  id: string;
  title: string;
  publisher: string;
  type: 'Article' | 'Video' | 'Guide';
  topic: string;
  description: string;
  url: string;
  image: string;
  technologyIds: string[];
};
export const resources: LearningResource[] = [
  {
    id: 'peppers-ghost',
    title: 'How Pepper’s Ghost works',
    publisher: 'History of Science Museum, Oxford',
    type: 'Guide',
    topic: 'Projection',
    description:
      'A one-page illustrated explanation of the reflected-image illusion used in theatrical staging.',
    url: 'https://www.hsm.ox.ac.uk/files/peppersghosthowitworkssmallfilepdf',
    image: 'holographic-concert',
    technologyIds: ['holographic-projection-technology', 'projection-mapping'],
  },
  {
    id: 'digital-human',
    title: 'How do you create a digital human?',
    publisher: 'Unreal Engine',
    type: 'Article',
    topic: 'Digital performers',
    description:
      'Explore character creation, animation rigs and performance capture for virtual people.',
    url: 'https://www.unrealengine.com/explainers/digital-humans/how-do-you-create-a-digital-human',
    image: 'aurora-nova',
    technologyIds: ['virtual-performer-creation', 'real-time-3d-rendering'],
  },
  {
    id: 'animator-tutorial',
    title: 'How to use MetaHuman Animator',
    publisher: 'Epic Games',
    type: 'Video',
    topic: 'Motion capture',
    description:
      'A guided tutorial on translating an actor’s performance into facial animation.',
    url: 'https://dev.epicgames.com/community/learning/tutorials/eKbY/how-to-use-metahuman-animator-in-unreal-engine',
    image: 'neon-strike',
    technologyIds: ['motion-capture-systems', 'virtual-performer-creation'],
  },
  {
    id: 'identity-capture',
    title: 'Creating a MetaHuman Identity from footage',
    publisher: 'Unreal Engine · YouTube',
    type: 'Video',
    topic: 'Motion capture',
    description:
      'Learn how to prepare a performer, lighting and camera for a digital character capture session.',
    url: 'https://www.youtube.com/watch?v=qPhn28Jk3Mo',
    image: 'motion-canvas',
    technologyIds: ['motion-capture-systems', 'interactive-motion-tracking'],
  },
  {
    id: 'spatial-audio',
    title: 'Discover Dolby Atmos',
    publisher: 'Dolby',
    type: 'Article',
    topic: 'Spatial audio',
    description:
      'An introduction to placing sound around a listener for an immersive experience.',
    url: 'https://www.dolby.com/technologies/dolby-atmos/',
    image: 'sound-waves',
    technologyIds: ['immersive-spatial-audio', 'audio-reactive-visual-systems'],
  },
  {
    id: 'animator-reference',
    title: 'MetaHuman Animator in Unreal Engine',
    publisher: 'Epic Games Documentation',
    type: 'Guide',
    topic: 'Digital performers',
    description:
      'Explore animation workflows driven by video, audio and captured performance data.',
    url: 'https://dev.epicgames.com/documentation/metahuman/metahuman-animator-in-unreal-engine?lang=en-US',
    image: 'cyber-maestro',
    technologyIds: [
      'virtual-performer-creation',
      'motion-capture-systems',
      'real-time-3d-rendering',
    ],
  },
];
export function filterResources(
  query: string,
  type: string,
  savedOnly: boolean,
  savedIds: string[],
) {
  const term = query.trim().toLowerCase();
  return resources.filter(
    item =>
      (type === 'All' || item.type === type) &&
      (!savedOnly || savedIds.includes(item.id)) &&
      `${item.title} ${item.publisher} ${item.topic} ${item.description}`
        .toLowerCase()
        .includes(term),
  );
}
