// Malayalam Vocabulary Data

export interface VocabularyItem {
  english: string
  malayalam: string
}

export interface VocabularyCategory {
  id: string
  nameEnglish: string
  nameMalayalam: string
  items: VocabularyItem[]
}

export const vocabularyCategories: VocabularyCategory[] = [
  {
    id: "days",
    nameEnglish: "Days of the Week",
    nameMalayalam: "ആഴ്ചയിലെ ദിവസങ്ങൾ",
    items: [
      { english: "Sunday", malayalam: "ഞായറാഴ്ച" },
      { english: "Monday", malayalam: "തിങ്കളാഴ്ച" },
      { english: "Tuesday", malayalam: "ചൊവ്വാഴ്ച" },
      { english: "Wednesday", malayalam: "ബുധനാഴ്ച" },
      { english: "Thursday", malayalam: "വ്യാഴാഴ്ച" },
      { english: "Friday", malayalam: "വെള്ളിയാഴ്ച" },
      { english: "Saturday", malayalam: "ശനിയാഴ്ച" },
    ]
  },
  {
    id: "directions",
    nameEnglish: "Directions",
    nameMalayalam: "ദിശകൾ",
    items: [
      { english: "East", malayalam: "കിഴക്ക്" },
      { english: "West", malayalam: "പടിഞ്ഞാറ്" },
      { english: "North", malayalam: "വടക്ക്" },
      { english: "South", malayalam: "തെക്ക്" },
      { english: "Above / Up", malayalam: "മുകളിൽ" },
      { english: "Below / Down", malayalam: "താഴെ" },
      { english: "Right", malayalam: "വലത്" },
      { english: "Left", malayalam: "ഇടത്" },
      { english: "Inside", malayalam: "അകത്ത്" },
      { english: "Outside", malayalam: "പുറത്ത്" },
      { english: "Front", malayalam: "മുന്നിൽ" },
      { english: "Back / Behind", malayalam: "പിന്നിൽ" },
    ]
  },
  {
    id: "relatives",
    nameEnglish: "Relatives",
    nameMalayalam: "ബന്ധുക്കൾ",
    items: [
      { english: "Mother", malayalam: "അമ്മ" },
      { english: "Father", malayalam: "അച്ഛൻ" },
      { english: "Grandfather (father's side)", malayalam: "അപ്പൂപ്പൻ (അച്ഛന്റെ വശം)" },
      { english: "Grandmother (father's side)", malayalam: "അമ്മൂമ്മ (അച്ഛന്റെ വശം)" },
      { english: "Grandfather (mother's side)", malayalam: "അപ്പൂപ്പൻ (അമ്മയുടെ വശം)" },
      { english: "Grandmother (mother's side)", malayalam: "അമ്മൂമ്മ (അമ്മയുടെ വശം)" },
      { english: "Elder Brother", malayalam: "ജ്യേഷ്ഠൻ" },
      { english: "Younger Brother", malayalam: "അനുജൻ" },
      { english: "Elder Sister", malayalam: "ചേച്ചി" },
      { english: "Younger Sister", malayalam: "അനുജത്തി" },
      { english: "Uncle (maternal)", malayalam: "അമ്മാവൻ" },
      { english: "Uncle (paternal)", malayalam: "ചെറിയച്ഛൻ" },
      { english: "Aunt", malayalam: "അമ്മായി" },
      { english: "Son", malayalam: "മകൻ" },
      { english: "Daughter", malayalam: "മകൾ" },
      { english: "Husband", malayalam: "ഭർത്താവ്" },
      { english: "Wife", malayalam: "ഭാര്യ" },
    ]
  },
  {
    id: "fruits",
    nameEnglish: "Fruits",
    nameMalayalam: "പഴങ്ങൾ",
    items: [
      { english: "Mango", malayalam: "മാമ്പഴം" },
      { english: "Banana", malayalam: "വാഴപ്പഴം" },
      { english: "Apple", malayalam: "ആപ്പിൾ" },
      { english: "Orange", malayalam: "ഓറഞ്ച്" },
      { english: "Guava", malayalam: "പേരയ്ക്ക" },
      { english: "Grapes", malayalam: "മുന്തിരി" },
      { english: "Papaya", malayalam: "പപ്പായ" },
      { english: "Pineapple", malayalam: "കൈതച്ചക്ക" },
      { english: "Watermelon", malayalam: "തണ്ണിമത്തൻ" },
      { english: "Muskmelon", malayalam: "മസ്‌ക്‌മെലൺ" },
      { english: "Coconut", malayalam: "തേങ്ങ" },
      { english: "Lemon", malayalam: "നാരങ്ങ" },
      { english: "Pomegranate", malayalam: "മാതളനാരങ്ങ" },
    ]
  },
  {
    id: "vegetables",
    nameEnglish: "Vegetables",
    nameMalayalam: "പച്ചക്കറികൾ",
    items: [
      { english: "Potato", malayalam: "ഉരുളക്കിഴങ്ങ്" },
      { english: "Tomato", malayalam: "തക്കാളി" },
      { english: "Brinjal", malayalam: "വഴുതനങ്ങ" },
      { english: "Carrot", malayalam: "കാരറ്റ്" },
      { english: "Cabbage", malayalam: "കാബേജ്" },
      { english: "Cauliflower", malayalam: "കോളിഫ്ലവർ" },
      { english: "Chili", malayalam: "മുളക്" },
      { english: "Onion", malayalam: "ഉള്ളി" },
      { english: "Peas", malayalam: "പട്ടാണി" },
      { english: "Beans", malayalam: "ബീൻസ്" },
      { english: "Pumpkin", malayalam: "മത്തങ്ങ" },
      { english: "Bitter Gourd", malayalam: "പാവയ്ക്ക" },
      { english: "Bottle Gourd", malayalam: "ചുരയ്ക്ക" },
      { english: "Drumstick", malayalam: "മുരിങ്ങയ്ക്ക" },
      { english: "Spinach", malayalam: "ചീര" },
    ]
  },
  {
    id: "birds",
    nameEnglish: "Birds",
    nameMalayalam: "പക്ഷികൾ",
    items: [
      { english: "Peacock", malayalam: "മയിൽ" },
      { english: "Pigeon", malayalam: "പ്രാവ്" },
      { english: "Crow", malayalam: "കാക്ക" },
      { english: "Sparrow", malayalam: "കുരുവി" },
      { english: "Parrot", malayalam: "തത്ത" },
      { english: "Eagle", malayalam: "പരുന്ത്" },
      { english: "Hen", malayalam: "കോഴി" },
      { english: "Crane", malayalam: "കൊക്ക്" },
      { english: "Duck", malayalam: "താറാവ്" },
      { english: "Swan", malayalam: "അരയന്നം" },
      { english: "Owl", malayalam: "മൂങ്ങ" },
    ]
  },
  {
    id: "animals",
    nameEnglish: "Animals",
    nameMalayalam: "മൃഗങ്ങൾ",
    items: [
      { english: "Cow", malayalam: "പശു" },
      { english: "Buffalo", malayalam: "എരുമ" },
      { english: "Goat", malayalam: "ആട്" },
      { english: "Sheep", malayalam: "ചെമ്മരിയാട്" },
      { english: "Dog", malayalam: "നായ" },
      { english: "Cat", malayalam: "പൂച്ച" },
      { english: "Horse", malayalam: "കുതിര" },
      { english: "Donkey", malayalam: "കഴുത" },
      { english: "Elephant", malayalam: "ആന" },
      { english: "Lion", malayalam: "സിംഹം" },
      { english: "Tiger", malayalam: "കടുവ" },
      { english: "Bear", malayalam: "കരടി" },
      { english: "Fox", malayalam: "കുറുക്കൻ" },
      { english: "Camel", malayalam: "ഒട്ടകം" },
      { english: "Rabbit", malayalam: "മുയൽ" },
      { english: "Monkey", malayalam: "കുരങ്ങ്" },
    ]
  },
  {
    id: "places",
    nameEnglish: "Places",
    nameMalayalam: "സ്ഥലങ്ങൾ",
    items: [
      { english: "School", malayalam: "സ്കൂൾ" },
      { english: "Market", malayalam: "ചന്ത" },
      { english: "Shop", malayalam: "കട" },
      { english: "Village", malayalam: "ഗ്രാമം" },
      { english: "Town", malayalam: "പട്ടണം" },
      { english: "City", malayalam: "നഗരം" },
      { english: "Temple", malayalam: "ക്ഷേത്രം" },
      { english: "Road", malayalam: "റോഡ്" },
      { english: "River", malayalam: "നദി" },
      { english: "Mountain", malayalam: "മല" },
      { english: "Forest", malayalam: "കാട്" },
      { english: "House", malayalam: "വീട്" },
      { english: "Garden", malayalam: "തോട്ടം" },
    ]
  },
  {
    id: "colours",
    nameEnglish: "Colours",
    nameMalayalam: "നിറങ്ങൾ",
    items: [
      { english: "Red", malayalam: "ചുവപ്പ്" },
      { english: "Blue", malayalam: "നീല" },
      { english: "Green", malayalam: "പച്ച" },
      { english: "Yellow", malayalam: "മഞ്ഞ" },
      { english: "Black", malayalam: "കറുപ്പ്" },
      { english: "White", malayalam: "വെള്ള" },
      { english: "Pink", malayalam: "പിങ്ക്" },
      { english: "Orange", malayalam: "ഓറഞ്ച് നിറം" },
      { english: "Brown", malayalam: "തവിട്ട്" },
      { english: "Grey", malayalam: "ചാര നിറം" },
    ]
  },
  {
    id: "professions",
    nameEnglish: "Professions",
    nameMalayalam: "തൊഴിലുകൾ",
    items: [
      { english: "Farmer", malayalam: "കർഷകൻ" },
      { english: "Doctor", malayalam: "ഡോക്ടർ" },
      { english: "Teacher", malayalam: "അധ്യാപകൻ" },
      { english: "Carpenter", malayalam: "ആശാരി" },
      { english: "Driver", malayalam: "ഡ്രൈവർ" },
      { english: "Painter", malayalam: "ചിത്രകാരൻ" },
      { english: "Police", malayalam: "പോലീസ്" },
      { english: "Shopkeeper", malayalam: "കടക്കാരൻ" },
      { english: "Barber", malayalam: "ക്ഷുരകൻ" },
      { english: "Cobbler", malayalam: "ചെരുപ്പുകുത്തി" },
    ]
  },
  {
    id: "shapes",
    nameEnglish: "Shapes",
    nameMalayalam: "ആകൃതികൾ",
    items: [
      { english: "Circle", malayalam: "വൃത്തം" },
      { english: "Square", malayalam: "സമചതുരം" },
      { english: "Rectangle", malayalam: "ചതുരം" },
      { english: "Triangle", malayalam: "ത്രികോണം" },
      { english: "Oval", malayalam: "ദീർഘവൃത്തം" },
      { english: "Star", malayalam: "നക്ഷത്രം" },
      { english: "Heart", malayalam: "ഹൃദയം" },
      { english: "Line", malayalam: "വര" },
      { english: "Dot", malayalam: "പുള്ളി" },
    ]
  },
  {
    id: "bodyparts",
    nameEnglish: "Body Parts",
    nameMalayalam: "ശരീരഭാഗങ്ങൾ",
    items: [
      { english: "Head", malayalam: "തല" },
      { english: "Hair", malayalam: "മുടി" },
      { english: "Eye", malayalam: "കണ്ണ്" },
      { english: "Ear", malayalam: "ചെവി" },
      { english: "Nose", malayalam: "മൂക്ക്" },
      { english: "Mouth", malayalam: "വായ" },
      { english: "Teeth", malayalam: "പല്ല്" },
      { english: "Tongue", malayalam: "നാക്ക്" },
      { english: "Hand", malayalam: "കൈ" },
      { english: "Leg", malayalam: "കാല്" },
      { english: "Foot", malayalam: "പാദം" },
      { english: "Finger", malayalam: "വിരൽ" },
      { english: "Stomach", malayalam: "വയറ്" },
      { english: "Back", malayalam: "മുതുക്" },
      { english: "Neck", malayalam: "കഴുത്ത്" },
      { english: "Shoulder", malayalam: "തോൾ" },
      { english: "Knee", malayalam: "മുട്ട്" },
    ]
  },
  {
    id: "household",
    nameEnglish: "Household Items",
    nameMalayalam: "വീട്ടുപകരണങ്ങൾ",
    items: [
      { english: "Door", malayalam: "വാതിൽ" },
      { english: "Window", malayalam: "ജനാല" },
      { english: "Bed", malayalam: "കട്ടിൽ" },
      { english: "Chair", malayalam: "കസേര" },
      { english: "Table", malayalam: "മേശ" },
      { english: "Cup", malayalam: "കപ്പ്" },
      { english: "Plate", malayalam: "പ്ലേറ്റ്" },
      { english: "Broom", malayalam: "ചൂൽ" },
      { english: "Bucket", malayalam: "ബക്കറ്റ്" },
      { english: "Mug", malayalam: "മഗ്" },
    ]
  },
  {
    id: "seasons",
    nameEnglish: "Seasons",
    nameMalayalam: "ഋതുക്കൾ",
    items: [
      { english: "Spring", malayalam: "വസന്തകാലം" },
      { english: "Summer", malayalam: "വേനൽക്കാലം" },
      { english: "Rainy Season", malayalam: "മഴക്കാലം" },
      { english: "Autumn", malayalam: "ശരത്കാലം" },
      { english: "Early Winter", malayalam: "ഹേമന്തകാലം" },
      { english: "Winter", malayalam: "ശിശിരകാലം" },
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
