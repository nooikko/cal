import { ENTITIES, LOCATIONS, STARTERS, TIMES, TITLES, VERBS } from './seed'; // adjust your actual import paths

function getRandomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSentence() {
  // Pick a starter
  const starter = getRandomItem(STARTERS);

  // Pick a verb
  const verb = getRandomItem(VERBS);

  // Pick an entity
  const entity = getRandomItem(ENTITIES);

  // Randomly decide if we use a title + name or just a title
  // For example, "doctor" could be by itself, or "doctor Smith"
  // but for simplicity here, we use just the title (like "doctor")
  // or maybe you have a separate list of names to combine
  const title = getRandomItem(TITLES);

  // Randomly choose whether to add a time phrase (50% chance)
  const includeTime = Math.random() < 0.5;
  const time = includeTime ? getRandomItem(TIMES) : null;

  // Randomly choose whether to add a location (50% chance)
  const includeLocation = Math.random() < 0.5;
  const location = includeLocation ? getRandomItem(LOCATIONS) : null;

  // Construct a sentence
  // e.g. "Please help me schedule an appointment with doctor tomorrow at the park"
  let sentence = `${starter} ${verb} an ${entity} with ${title}`;

  if (time) {
    sentence += ` ${time}`;
  }
  if (location) {
    sentence += ` ${location}`;
  }
  sentence += '.';

  return sentence.trim();
}

function generateDataset(numSentences = 20) {
  const data = [];
  for (let i = 0; i < numSentences; i++) {
    data.push(generateSentence());
  }
  return data;
}

// Example usage:
const N = 30; // how many synthetic sentences you want
const syntheticData = generateDataset(N);

console.log('Generated synthetic data:\n');
syntheticData.forEach((s, i) => {
  console.log(`${i + 1}. ${s}`);
});
