// Kannada Vocabulary Data

export interface VocabularyItem {
  english: string
  kannada: string
}

export interface VocabularyCategory {
  id: string
  nameEnglish: string
  nameKannada: string
  items: VocabularyItem[]
}

export const vocabularyCategories: VocabularyCategory[] = [
  {
    id: "days",
    nameEnglish: "Days of the Week",
    nameKannada: "ವಾರದ ದಿನಗಳು",
    items: [
      { english: "Sunday", kannada: "ಭಾನುವಾರ" },
      { english: "Monday", kannada: "ಸೋಮವಾರ" },
      { english: "Tuesday", kannada: "ಮಂಗಳವಾರ" },
      { english: "Wednesday", kannada: "ಬುಧವಾರ" },
      { english: "Thursday", kannada: "ಗುರುವಾರ" },
      { english: "Friday", kannada: "ಶುಕ್ರವಾರ" },
      { english: "Saturday", kannada: "ಶನಿವಾರ" },
    ]
  },
  {
    id: "directions",
    nameEnglish: "Directions",
    nameKannada: "ದಿಕ್ಕುಗಳು",
    items: [
      { english: "East", kannada: "ಪೂರ್ವ" },
      { english: "West", kannada: "ಪಶ್ಚಿಮ" },
      { english: "North", kannada: "ಉತ್ತರ" },
      { english: "South", kannada: "ದಕ್ಷಿಣ" },
      { english: "Above / Up", kannada: "ಮೇಲೆ" },
      { english: "Below / Down", kannada: "ಕೆಳಗೆ" },
      { english: "Right", kannada: "ಬಲ" },
      { english: "Left", kannada: "ಎಡ" },
      { english: "Inside", kannada: "ಒಳಗೆ" },
      { english: "Outside", kannada: "ಹೊರಗೆ" },
      { english: "Front", kannada: "ಮುಂದೆ" },
      { english: "Back / Behind", kannada: "ಹಿಂದೆ" },
    ]
  },
  {
    id: "relatives",
    nameEnglish: "Relatives",
    nameKannada: "ಸಂಬಂಧಿಕರು",
    items: [
      { english: "Mother", kannada: "ತಾಯಿ" },
      { english: "Father", kannada: "ತಂದೆ" },
      { english: "Grandfather (father's side)", kannada: "ಅಜ್ಜ (ತಂದೆಯ ಕಡೆ)" },
      { english: "Grandmother (father's side)", kannada: "ಅಜ್ಜಿ (ತಂದೆಯ ಕಡೆ)" },
      { english: "Grandfather (mother's side)", kannada: "ಅಜ್ಜ (ತಾಯಿಯ ಕಡೆ)" },
      { english: "Grandmother (mother's side)", kannada: "ಅಜ್ಜಿ (ತಾಯಿಯ ಕಡೆ)" },
      { english: "Elder Brother", kannada: "ಅಣ್ಣ" },
      { english: "Younger Brother", kannada: "ತಮ್ಮ" },
      { english: "Elder Sister", kannada: "ಅಕ್ಕ" },
      { english: "Younger Sister", kannada: "ತಂಗಿ" },
      { english: "Uncle (maternal)", kannada: "ಮಾವ" },
      { english: "Uncle (paternal)", kannada: "ಚಿಕ್ಕಪ್ಪ" },
      { english: "Aunt", kannada: "ಅತ್ತೆ" },
      { english: "Son", kannada: "ಮಗ" },
      { english: "Daughter", kannada: "ಮಗಳು" },
      { english: "Husband", kannada: "ಗಂಡ" },
      { english: "Wife", kannada: "ಹೆಂಡತಿ" },
    ]
  },
  {
    id: "fruits",
    nameEnglish: "Fruits",
    nameKannada: "ಹಣ್ಣುಗಳು",
    items: [
      { english: "Mango", kannada: "ಮಾವಿನ ಹಣ್ಣು" },
      { english: "Banana", kannada: "ಬಾಳೆಹಣ್ಣು" },
      { english: "Apple", kannada: "ಸೇಬು" },
      { english: "Orange", kannada: "ಕಿತ್ತಳೆ" },
      { english: "Guava", kannada: "ಸೀಬೆ ಹಣ್ಣು" },
      { english: "Grapes", kannada: "ದ್ರಾಕ್ಷಿ" },
      { english: "Papaya", kannada: "ಪರಂಗಿ ಹಣ್ಣು" },
      { english: "Pineapple", kannada: "ಅನಾನಸ್" },
      { english: "Watermelon", kannada: "ಕಲ್ಲಂಗಡಿ ಹಣ್ಣು" },
      { english: "Muskmelon", kannada: "ಖರ್ಬೂಜ" },
      { english: "Coconut", kannada: "ತೆಂಗಿನಕಾಯಿ" },
      { english: "Lemon", kannada: "ನಿಂಬೆಹಣ್ಣು" },
      { english: "Pomegranate", kannada: "ದಾಳಿಂಬೆ" },
    ]
  },
  {
    id: "vegetables",
    nameEnglish: "Vegetables",
    nameKannada: "ತರಕಾರಿಗಳು",
    items: [
      { english: "Potato", kannada: "ಆಲೂಗಡ್ಡೆ" },
      { english: "Tomato", kannada: "ಟೊಮ್ಯಾಟೊ" },
      { english: "Brinjal", kannada: "ಬದನೆಕಾಯಿ" },
      { english: "Carrot", kannada: "ಕ್ಯಾರೆಟ್" },
      { english: "Cabbage", kannada: "ಎಲೆಕೋಸು" },
      { english: "Cauliflower", kannada: "ಹೂಕೋಸು" },
      { english: "Chili", kannada: "ಮೆಣಸಿನಕಾಯಿ" },
      { english: "Onion", kannada: "ಈರುಳ್ಳಿ" },
      { english: "Peas", kannada: "ಬಟಾಣಿ" },
      { english: "Beans", kannada: "ಬೀನ್ಸ್" },
      { english: "Pumpkin", kannada: "ಕುಂಬಳಕಾಯಿ" },
      { english: "Bitter Gourd", kannada: "ಹಾಗಲಕಾಯಿ" },
      { english: "Bottle Gourd", kannada: "ಸೋರೆಕಾಯಿ" },
      { english: "Drumstick", kannada: "ನುಗ್ಗೆಕಾಯಿ" },
      { english: "Spinach", kannada: "ಪಾಲಕ್ ಸೊಪ್ಪು" },
    ]
  },
  {
    id: "birds",
    nameEnglish: "Birds",
    nameKannada: "ಪಕ್ಷಿಗಳು",
    items: [
      { english: "Peacock", kannada: "ನವಿಲು" },
      { english: "Pigeon", kannada: "ಪಾರಿವಾಳ" },
      { english: "Crow", kannada: "ಕಾಗೆ" },
      { english: "Sparrow", kannada: "ಗುಬ್ಬಚ್ಚಿ" },
      { english: "Parrot", kannada: "ಗಿಳಿ" },
      { english: "Eagle", kannada: "ಹದ್ದು" },
      { english: "Hen", kannada: "ಕೋಳಿ" },
      { english: "Crane", kannada: "ಕೊಕ್ಕರೆ" },
      { english: "Duck", kannada: "ಬಾತುಕೋಳಿ" },
      { english: "Swan", kannada: "ಹಂಸ" },
      { english: "Owl", kannada: "ಗೂಬೆ" },
    ]
  },
  {
    id: "animals",
    nameEnglish: "Animals",
    nameKannada: "ಪ್ರಾಣಿಗಳು",
    items: [
      { english: "Cow", kannada: "ಹಸು" },
      { english: "Buffalo", kannada: "ಎಮ್ಮೆ" },
      { english: "Goat", kannada: "ಮೇಕೆ" },
      { english: "Sheep", kannada: "ಕುರಿ" },
      { english: "Dog", kannada: "ನಾಯಿ" },
      { english: "Cat", kannada: "ಬೆಕ್ಕು" },
      { english: "Horse", kannada: "ಕುದುರೆ" },
      { english: "Donkey", kannada: "ಕತ್ತೆ" },
      { english: "Elephant", kannada: "ಆನೆ" },
      { english: "Lion", kannada: "ಸಿಂಹ" },
      { english: "Tiger", kannada: "ಹುಲಿ" },
      { english: "Bear", kannada: "ಕರಡಿ" },
      { english: "Fox", kannada: "ನರಿ" },
      { english: "Camel", kannada: "ಒಂಟೆ" },
      { english: "Rabbit", kannada: "ಮೊಲ" },
      { english: "Monkey", kannada: "ಕೋತಿ" },
    ]
  },
  {
    id: "places",
    nameEnglish: "Places",
    nameKannada: "ಸ್ಥಳಗಳು",
    items: [
      { english: "School", kannada: "ಶಾಲೆ" },
      { english: "Market", kannada: "ಮಾರುಕಟ್ಟೆ" },
      { english: "Shop", kannada: "ಅಂಗಡಿ" },
      { english: "Village", kannada: "ಹಳ್ಳಿ" },
      { english: "Town", kannada: "ಪಟ್ಟಣ" },
      { english: "City", kannada: "ನಗರ" },
      { english: "Temple", kannada: "ದೇವಸ್ಥಾನ" },
      { english: "Road", kannada: "ರಸ್ತೆ" },
      { english: "River", kannada: "ನದಿ" },
      { english: "Mountain", kannada: "ಬೆಟ್ಟ" },
      { english: "Forest", kannada: "ಕಾಡು" },
      { english: "House", kannada: "ಮನೆ" },
      { english: "Garden", kannada: "ತೋಟ" },
    ]
  },
  {
    id: "colours",
    nameEnglish: "Colours",
    nameKannada: "ಬಣ್ಣಗಳು",
    items: [
      { english: "Red", kannada: "ಕೆಂಪು" },
      { english: "Blue", kannada: "ನೀಲಿ" },
      { english: "Green", kannada: "ಹಸಿರು" },
      { english: "Yellow", kannada: "ಹಳದಿ" },
      { english: "Black", kannada: "ಕಪ್ಪು" },
      { english: "White", kannada: "ಬಿಳಿ" },
      { english: "Pink", kannada: "ಗುಲಾಬಿ" },
      { english: "Orange", kannada: "ಕಿತ್ತಳೆ ಬಣ್ಣ" },
      { english: "Brown", kannada: "ಕಂದು" },
      { english: "Grey", kannada: "ಬೂದು" },
    ]
  },
  {
    id: "professions",
    nameEnglish: "Professions",
    nameKannada: "ವೃತ್ತಿಗಳು",
    items: [
      { english: "Farmer", kannada: "ರೈತ" },
      { english: "Doctor", kannada: "ವೈದ್ಯ" },
      { english: "Teacher", kannada: "ಶಿಕ್ಷಕ" },
      { english: "Carpenter", kannada: "ಬಡಗಿ" },
      { english: "Driver", kannada: "ಚಾಲಕ" },
      { english: "Painter", kannada: "ಚಿತ್ರಕಾರ" },
      { english: "Police", kannada: "ಪೊಲೀಸ್" },
      { english: "Shopkeeper", kannada: "ಅಂಗಡಿಯವನು" },
      { english: "Barber", kannada: "ಕ್ಷೌರಿಕ" },
      { english: "Cobbler", kannada: "ಚಮ್ಮಾರ" },
    ]
  },
  {
    id: "shapes",
    nameEnglish: "Shapes",
    nameKannada: "ಆಕಾರಗಳು",
    items: [
      { english: "Circle", kannada: "ವೃತ್ತ" },
      { english: "Square", kannada: "ಚೌಕ" },
      { english: "Rectangle", kannada: "ಆಯತ" },
      { english: "Triangle", kannada: "ತ್ರಿಕೋನ" },
      { english: "Oval", kannada: "ಅಂಡಾಕಾರ" },
      { english: "Star", kannada: "ನಕ್ಷತ್ರ" },
      { english: "Heart", kannada: "ಹೃದಯ" },
      { english: "Line", kannada: "ಗೆರೆ" },
      { english: "Dot", kannada: "ಚುಕ್ಕೆ" },
    ]
  },
  {
    id: "bodyparts",
    nameEnglish: "Body Parts",
    nameKannada: "ದೇಹದ ಭಾಗಗಳು",
    items: [
      { english: "Head", kannada: "ತಲೆ" },
      { english: "Hair", kannada: "ಕೂದಲು" },
      { english: "Eye", kannada: "ಕಣ್ಣು" },
      { english: "Ear", kannada: "ಕಿವಿ" },
      { english: "Nose", kannada: "ಮೂಗು" },
      { english: "Mouth", kannada: "ಬಾಯಿ" },
      { english: "Teeth", kannada: "ಹಲ್ಲು" },
      { english: "Tongue", kannada: "ನಾಲಿಗೆ" },
      { english: "Hand", kannada: "ಕೈ" },
      { english: "Leg", kannada: "ಕಾಲು" },
      { english: "Foot", kannada: "ಪಾದ" },
      { english: "Finger", kannada: "ಬೆರಳು" },
      { english: "Stomach", kannada: "ಹೊಟ್ಟೆ" },
      { english: "Back", kannada: "ಬೆನ್ನು" },
      { english: "Neck", kannada: "ಕುತ್ತಿಗೆ" },
      { english: "Shoulder", kannada: "ಭುಜ" },
      { english: "Knee", kannada: "ಮೊಣಕಾಲು" },
    ]
  },
  {
    id: "household",
    nameEnglish: "Household Items",
    nameKannada: "ಮನೆಯ ವಸ್ತುಗಳು",
    items: [
      { english: "Door", kannada: "ಬಾಗಿಲು" },
      { english: "Window", kannada: "ಕಿಟಕಿ" },
      { english: "Bed", kannada: "ಹಾಸಿಗೆ" },
      { english: "Chair", kannada: "ಕುರ್ಚಿ" },
      { english: "Table", kannada: "ಮೇಜು" },
      { english: "Cup", kannada: "ಕಪ್" },
      { english: "Plate", kannada: "ತಟ್ಟೆ" },
      { english: "Broom", kannada: "ಪೊರಕೆ" },
      { english: "Bucket", kannada: "ಬಕೆಟ್" },
      { english: "Mug", kannada: "ಮಗ್" },
    ]
  },
  {
    id: "seasons",
    nameEnglish: "Seasons",
    nameKannada: "ಋತುಗಳು",
    items: [
      { english: "Spring", kannada: "ವಸಂತ ಋತು" },
      { english: "Summer", kannada: "ಗ್ರೀಷ್ಮ ಋತು" },
      { english: "Rainy Season", kannada: "ವರ್ಷ ಋತು" },
      { english: "Autumn", kannada: "ಶರದ ಋತು" },
      { english: "Early Winter", kannada: "ಹೇಮಂತ ಋತು" },
      { english: "Winter", kannada: "ಶಿಶಿರ ಋತು" },
    ]
  },
]

// Helper function to get category by ID
export function getCategoryById(id: string): VocabularyCategory | undefined {
  return vocabularyCategories.find(cat => cat.id === id)
}

// Helper function to get all items from all categories
export function getAllVocabularyItems(): VocabularyItem[] {
  return vocabularyCategories.flatMap(cat => cat.items)
}
