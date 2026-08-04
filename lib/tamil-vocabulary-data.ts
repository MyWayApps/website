// Tamil Vocabulary Data

export interface VocabularyItem {
  english: string
  tamil: string
}

export interface VocabularyCategory {
  id: string
  nameEnglish: string
  nameTamil: string
  items: VocabularyItem[]
}

export const vocabularyCategories: VocabularyCategory[] = [
  {
    id: "days",
    nameEnglish: "Days of the Week",
    nameTamil: "வார நாட்கள்",
    items: [
      { english: "Sunday", tamil: "ஞாயிற்றுக்கிழமை" },
      { english: "Monday", tamil: "திங்கட்கிழமை" },
      { english: "Tuesday", tamil: "செவ்வாய்க்கிழமை" },
      { english: "Wednesday", tamil: "புதன்கிழமை" },
      { english: "Thursday", tamil: "வியாழக்கிழமை" },
      { english: "Friday", tamil: "வெள்ளிக்கிழமை" },
      { english: "Saturday", tamil: "சனிக்கிழமை" },
    ]
  },
  {
    id: "directions",
    nameEnglish: "Directions",
    nameTamil: "திசைகள்",
    items: [
      { english: "East", tamil: "கிழக்கு" },
      { english: "West", tamil: "மேற்கு" },
      { english: "North", tamil: "வடக்கு" },
      { english: "South", tamil: "தெற்கு" },
      { english: "Above / Up", tamil: "மேலே" },
      { english: "Below / Down", tamil: "கீழே" },
      { english: "Right", tamil: "வலது" },
      { english: "Left", tamil: "இடது" },
      { english: "Inside", tamil: "உள்ளே" },
      { english: "Outside", tamil: "வெளியே" },
      { english: "Front", tamil: "முன்" },
      { english: "Back / Behind", tamil: "பின்" },
    ]
  },
  {
    id: "relatives",
    nameEnglish: "Relatives",
    nameTamil: "உறவினர்கள்",
    items: [
      { english: "Mother", tamil: "அம்மா" },
      { english: "Father", tamil: "அப்பா" },
      { english: "Grandfather (father's side)", tamil: "தாத்தா (அப்பா வழி)" },
      { english: "Grandmother (father's side)", tamil: "பாட்டி (அப்பா வழி)" },
      { english: "Grandfather (mother's side)", tamil: "தாத்தா (அம்மா வழி)" },
      { english: "Grandmother (mother's side)", tamil: "பாட்டி (அம்மா வழி)" },
      { english: "Elder Brother", tamil: "அண்ணன்" },
      { english: "Younger Brother", tamil: "தம்பி" },
      { english: "Elder Sister", tamil: "அக்கா" },
      { english: "Younger Sister", tamil: "தங்கை" },
      { english: "Uncle (maternal)", tamil: "மாமா" },
      { english: "Uncle (paternal)", tamil: "சித்தப்பா" },
      { english: "Aunt", tamil: "அத்தை" },
      { english: "Son", tamil: "மகன்" },
      { english: "Daughter", tamil: "மகள்" },
      { english: "Husband", tamil: "கணவன்" },
      { english: "Wife", tamil: "மனைவி" },
    ]
  },
  {
    id: "fruits",
    nameEnglish: "Fruits",
    nameTamil: "பழங்கள்",
    items: [
      { english: "Mango", tamil: "மாம்பழம்" },
      { english: "Banana", tamil: "வாழைப்பழம்" },
      { english: "Apple", tamil: "ஆப்பிள்" },
      { english: "Orange", tamil: "ஆரஞ்சு" },
      { english: "Guava", tamil: "கொய்யாப்பழம்" },
      { english: "Grapes", tamil: "திராட்சை" },
      { english: "Papaya", tamil: "பப்பாளி" },
      { english: "Pineapple", tamil: "அன்னாசி" },
      { english: "Watermelon", tamil: "தர்பூசணி" },
      { english: "Muskmelon", tamil: "முலாம்பழம்" },
      { english: "Coconut", tamil: "தேங்காய்" },
      { english: "Lemon", tamil: "எலுமிச்சை" },
      { english: "Pomegranate", tamil: "மாதுளை" },
    ]
  },
  {
    id: "vegetables",
    nameEnglish: "Vegetables",
    nameTamil: "காய்கறிகள்",
    items: [
      { english: "Potato", tamil: "உருளைக்கிழங்கு" },
      { english: "Tomato", tamil: "தக்காளி" },
      { english: "Brinjal", tamil: "கத்தரிக்காய்" },
      { english: "Carrot", tamil: "கேரட்" },
      { english: "Cabbage", tamil: "முட்டைக்கோஸ்" },
      { english: "Cauliflower", tamil: "பூக்கோஸ்" },
      { english: "Chili", tamil: "மிளகாய்" },
      { english: "Onion", tamil: "வெங்காயம்" },
      { english: "Peas", tamil: "பட்டாணி" },
      { english: "Beans", tamil: "அவரைக்காய்" },
      { english: "Pumpkin", tamil: "பூசணிக்காய்" },
      { english: "Bitter Gourd", tamil: "பாகற்காய்" },
      { english: "Bottle Gourd", tamil: "சுரைக்காய்" },
      { english: "Drumstick", tamil: "முருங்கைக்காய்" },
      { english: "Spinach", tamil: "கீரை" },
    ]
  },
  {
    id: "birds",
    nameEnglish: "Birds",
    nameTamil: "பறவைகள்",
    items: [
      { english: "Peacock", tamil: "மயில்" },
      { english: "Pigeon", tamil: "புறா" },
      { english: "Crow", tamil: "காகம்" },
      { english: "Sparrow", tamil: "குருவி" },
      { english: "Parrot", tamil: "கிளி" },
      { english: "Eagle", tamil: "கழுகு" },
      { english: "Hen", tamil: "கோழி" },
      { english: "Crane", tamil: "கொக்கு" },
      { english: "Duck", tamil: "வாத்து" },
      { english: "Swan", tamil: "அன்னப்பறவை" },
      { english: "Owl", tamil: "ஆந்தை" },
    ]
  },
  {
    id: "animals",
    nameEnglish: "Animals",
    nameTamil: "விலங்குகள்",
    items: [
      { english: "Cow", tamil: "பசு" },
      { english: "Buffalo", tamil: "எருமை" },
      { english: "Goat", tamil: "ஆடு" },
      { english: "Sheep", tamil: "செம்மறியாடு" },
      { english: "Dog", tamil: "நாய்" },
      { english: "Cat", tamil: "பூனை" },
      { english: "Horse", tamil: "குதிரை" },
      { english: "Donkey", tamil: "கழுதை" },
      { english: "Elephant", tamil: "யானை" },
      { english: "Lion", tamil: "சிங்கம்" },
      { english: "Tiger", tamil: "புலி" },
      { english: "Bear", tamil: "கரடி" },
      { english: "Fox", tamil: "நரி" },
      { english: "Camel", tamil: "ஒட்டகம்" },
      { english: "Rabbit", tamil: "முயல்" },
      { english: "Monkey", tamil: "குரங்கு" },
    ]
  },
  {
    id: "places",
    nameEnglish: "Places",
    nameTamil: "இடங்கள்",
    items: [
      { english: "School", tamil: "பள்ளி" },
      { english: "Market", tamil: "சந்தை" },
      { english: "Shop", tamil: "கடை" },
      { english: "Village", tamil: "கிராமம்" },
      { english: "Town", tamil: "பட்டணம்" },
      { english: "City", tamil: "நகரம்" },
      { english: "Temple", tamil: "கோயில்" },
      { english: "Road", tamil: "சாலை" },
      { english: "River", tamil: "ஆறு" },
      { english: "Mountain", tamil: "மலை" },
      { english: "Forest", tamil: "காடு" },
      { english: "House", tamil: "வீடு" },
      { english: "Garden", tamil: "தோட்டம்" },
    ]
  },
  {
    id: "colours",
    nameEnglish: "Colours",
    nameTamil: "நிறங்கள்",
    items: [
      { english: "Red", tamil: "சிவப்பு" },
      { english: "Blue", tamil: "நீலம்" },
      { english: "Green", tamil: "பச்சை" },
      { english: "Yellow", tamil: "மஞ்சள்" },
      { english: "Black", tamil: "கருப்பு" },
      { english: "White", tamil: "வெள்ளை" },
      { english: "Pink", tamil: "இளஞ்சிவப்பு" },
      { english: "Orange", tamil: "ஆரஞ்சு நிறம்" },
      { english: "Brown", tamil: "பழுப்பு" },
      { english: "Grey", tamil: "சாம்பல்" },
    ]
  },
  {
    id: "professions",
    nameEnglish: "Professions",
    nameTamil: "தொழில்கள்",
    items: [
      { english: "Farmer", tamil: "விவசாயி" },
      { english: "Doctor", tamil: "மருத்துவர்" },
      { english: "Teacher", tamil: "ஆசிரியர்" },
      { english: "Carpenter", tamil: "தச்சர்" },
      { english: "Driver", tamil: "ஓட்டுநர்" },
      { english: "Painter", tamil: "ஓவியர்" },
      { english: "Police", tamil: "போலீஸ்" },
      { english: "Shopkeeper", tamil: "கடைக்காரர்" },
      { english: "Barber", tamil: "முடிதிருத்துபவர்" },
      { english: "Cobbler", tamil: "செருப்புத் தைப்பவர்" },
    ]
  },
  {
    id: "shapes",
    nameEnglish: "Shapes",
    nameTamil: "வடிவங்கள்",
    items: [
      { english: "Circle", tamil: "வட்டம்" },
      { english: "Square", tamil: "சதுரம்" },
      { english: "Rectangle", tamil: "செவ்வகம்" },
      { english: "Triangle", tamil: "முக்கோணம்" },
      { english: "Oval", tamil: "நீள்வட்டம்" },
      { english: "Star", tamil: "நட்சத்திரம்" },
      { english: "Heart", tamil: "இதயம்" },
      { english: "Line", tamil: "கோடு" },
      { english: "Dot", tamil: "புள்ளி" },
    ]
  },
  {
    id: "bodyparts",
    nameEnglish: "Body Parts",
    nameTamil: "உடல் உறுப்புகள்",
    items: [
      { english: "Head", tamil: "தலை" },
      { english: "Hair", tamil: "முடி" },
      { english: "Eye", tamil: "கண்" },
      { english: "Ear", tamil: "காது" },
      { english: "Nose", tamil: "மூக்கு" },
      { english: "Mouth", tamil: "வாய்" },
      { english: "Teeth", tamil: "பல்" },
      { english: "Tongue", tamil: "நாக்கு" },
      { english: "Hand", tamil: "கை" },
      { english: "Leg", tamil: "கால்" },
      { english: "Foot", tamil: "பாதம்" },
      { english: "Finger", tamil: "விரல்" },
      { english: "Stomach", tamil: "வயிறு" },
      { english: "Back", tamil: "முதுகு" },
      { english: "Neck", tamil: "கழுத்து" },
      { english: "Shoulder", tamil: "தோள்" },
      { english: "Knee", tamil: "முழங்கால்" },
    ]
  },
  {
    id: "household",
    nameEnglish: "Household Items",
    nameTamil: "வீட்டுப் பொருட்கள்",
    items: [
      { english: "Door", tamil: "கதவு" },
      { english: "Window", tamil: "ஜன்னல்" },
      { english: "Bed", tamil: "படுக்கை" },
      { english: "Chair", tamil: "நாற்காலி" },
      { english: "Table", tamil: "மேசை" },
      { english: "Cup", tamil: "கோப்பை" },
      { english: "Plate", tamil: "தட்டு" },
      { english: "Broom", tamil: "துடைப்பம்" },
      { english: "Bucket", tamil: "வாளி" },
      { english: "Mug", tamil: "மக்" },
    ]
  },
  {
    id: "seasons",
    nameEnglish: "Seasons",
    nameTamil: "பருவகாலங்கள்",
    items: [
      { english: "Spring", tamil: "இளவேனிற் காலம்" },
      { english: "Summer", tamil: "கோடை காலம்" },
      { english: "Rainy Season", tamil: "மழைக் காலம்" },
      { english: "Autumn", tamil: "இலையுதிர் காலம்" },
      { english: "Early Winter", tamil: "முன்பனிக் காலம்" },
      { english: "Winter", tamil: "பின்பனிக் காலம்" },
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
