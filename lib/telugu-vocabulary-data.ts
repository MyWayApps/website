// Telugu Vocabulary Data

export interface VocabularyItem {
  english: string
  telugu: string
}

export interface VocabularyCategory {
  id: string
  nameEnglish: string
  nameTelugu: string
  items: VocabularyItem[]
}

export const vocabularyCategories: VocabularyCategory[] = [
  {
    id: "days",
    nameEnglish: "Days of the Week",
    nameTelugu: "వారాలు",
    items: [
      { english: "Sunday", telugu: "ఆదివారం" },
      { english: "Monday", telugu: "సోమవారం" },
      { english: "Tuesday", telugu: "మంగళవారం" },
      { english: "Wednesday", telugu: "బుధవారం" },
      { english: "Thursday", telugu: "గురువారం" },
      { english: "Friday", telugu: "శుక్రవారం" },
      { english: "Saturday", telugu: "శనివారం" },
    ]
  },
  {
    id: "directions",
    nameEnglish: "Directions",
    nameTelugu: "దిశలు",
    items: [
      { english: "East", telugu: "తూర్పు" },
      { english: "West", telugu: "పడమర" },
      { english: "North", telugu: "ఉత్తరం" },
      { english: "South", telugu: "దక్షిణం" },
      { english: "Above / Up", telugu: "పై" },
      { english: "Below / Down", telugu: "కింది" },
      { english: "Right", telugu: "కుడి" },
      { english: "Left", telugu: "ఎడమ" },
      { english: "Inside", telugu: "లోపల" },
      { english: "Outside", telugu: "బయట" },
      { english: "Front", telugu: "ముందు" },
      { english: "Back / Behind", telugu: "వెనుక" },
    ]
  },
  {
    id: "relatives",
    nameEnglish: "Relatives",
    nameTelugu: "బంధువులు",
    items: [
      { english: "Mother", telugu: "తల్లి" },
      { english: "Father", telugu: "తండ్రి" },
      { english: "Grandfather (father's side)", telugu: "తాత" },
      { english: "Grandmother (father's side)", telugu: "నానమ్మ" },
      { english: "Grandfather (mother's side)", telugu: "మామయ్య" },
      { english: "Grandmother (mother's side)", telugu: "అమ్మమ్మ" },
      { english: "Elder Brother", telugu: "అన్న" },
      { english: "Younger Brother", telugu: "తమ్ముడు" },
      { english: "Elder Sister", telugu: "అక్క" },
      { english: "Younger Sister", telugu: "చెల్లి" },
      { english: "Uncle (maternal)", telugu: "మామ" },
      { english: "Uncle (paternal)", telugu: "బాబాయి" },
      { english: "Aunt", telugu: "అత్త" },
      { english: "Son", telugu: "కుమారుడు" },
      { english: "Daughter", telugu: "కుమార్తె" },
      { english: "Husband", telugu: "భర్త" },
      { english: "Wife", telugu: "భార్య" },
    ]
  },
  {
    id: "fruits",
    nameEnglish: "Fruits",
    nameTelugu: "పండ్లు",
    items: [
      { english: "Mango", telugu: "మామిడి పండు" },
      { english: "Banana", telugu: "అరటి పండు" },
      { english: "Apple", telugu: "యాపిల్" },
      { english: "Orange", telugu: "నారింజ" },
      { english: "Guava", telugu: "జామ పండు" },
      { english: "Grapes", telugu: "ద్రాక్ష" },
      { english: "Papaya", telugu: "బొప్పాయి" },
      { english: "Pineapple", telugu: "అనాస పండు" },
      { english: "Watermelon", telugu: "పుచ్చకాయ" },
      { english: "Muskmelon", telugu: "ఖర్బూజా" },
      { english: "Coconut", telugu: "కొబ్బరి కాయ" },
      { english: "Lemon", telugu: "నిమ్మకాయ" },
      { english: "Pomegranate", telugu: "దానిమ్మ" },
    ]
  },
  {
    id: "vegetables",
    nameEnglish: "Vegetables",
    nameTelugu: "కూరగాయలు",
    items: [
      { english: "Potato", telugu: "బంగాళాదుంప" },
      { english: "Tomato", telugu: "టమాటా" },
      { english: "Brinjal", telugu: "వంకాయ" },
      { english: "Carrot", telugu: "గాజర్" },
      { english: "Cabbage", telugu: "క్యాబేజీ" },
      { english: "Cauliflower", telugu: "కాలీఫ్లవర్" },
      { english: "Chili", telugu: "మిర్చి" },
      { english: "Onion", telugu: "ఉల్లిపాయ" },
      { english: "Peas", telugu: "బటానీలు" },
      { english: "Beans", telugu: "బీన్స్" },
      { english: "Pumpkin", telugu: "గుమ్మడికాయ" },
      { english: "Bitter Gourd", telugu: "కాకర కాయ" },
      { english: "Bottle Gourd", telugu: "సొరకాయ" },
      { english: "Drumstick", telugu: "మునగకాయ" },
      { english: "Spinach", telugu: "పాలకూర" },
    ]
  },
  {
    id: "birds",
    nameEnglish: "Birds",
    nameTelugu: "పక్షులు",
    items: [
      { english: "Peacock", telugu: "నెమలి" },
      { english: "Pigeon", telugu: "పావురం" },
      { english: "Crow", telugu: "కాకి" },
      { english: "Sparrow", telugu: "గువ్వ" },
      { english: "Parrot", telugu: "చిలుక" },
      { english: "Eagle", telugu: "గద్ద" },
      { english: "Hen", telugu: "కోడి" },
      { english: "Crane", telugu: "కొంగ" },
      { english: "Duck", telugu: "బాతు" },
      { english: "Swan", telugu: "హంస" },
      { english: "Owl", telugu: "గుడ్లగూబ" },
    ]
  },
  {
    id: "animals",
    nameEnglish: "Animals",
    nameTelugu: "మృగాలు",
    items: [
      { english: "Cow", telugu: "ఆవు" },
      { english: "Buffalo", telugu: "గేదె" },
      { english: "Goat", telugu: "మేక" },
      { english: "Sheep", telugu: "గొర్రె" },
      { english: "Dog", telugu: "కుక్క" },
      { english: "Cat", telugu: "పిల్లి" },
      { english: "Horse", telugu: "గుర్రం" },
      { english: "Donkey", telugu: "గాడిద" },
      { english: "Elephant", telugu: "ఏనుగు" },
      { english: "Lion", telugu: "సింహం" },
      { english: "Tiger", telugu: "పులి" },
      { english: "Bear", telugu: "ఎలుగు బంటి" },
      { english: "Fox", telugu: "నక్క" },
      { english: "Camel", telugu: "ఒంటె" },
      { english: "Rabbit", telugu: "కుందేలు" },
      { english: "Monkey", telugu: "కోతి" },
    ]
  },
  {
    id: "places",
    nameEnglish: "Places",
    nameTelugu: "ప్రదేశాలు",
    items: [
      { english: "School", telugu: "పాఠశాల" },
      { english: "Market", telugu: "మార్కెట్" },
      { english: "Shop", telugu: "దుకాణం" },
      { english: "Village", telugu: "గ్రామం" },
      { english: "Town", telugu: "పట్టణం" },
      { english: "City", telugu: "నగరం" },
      { english: "Temple", telugu: "దేవాలయం" },
      { english: "Road", telugu: "రహదారి" },
      { english: "River", telugu: "నది" },
      { english: "Mountain", telugu: "పర్వతం" },
      { english: "Forest", telugu: "అడవి" },
      { english: "House", telugu: "ఇల్లు" },
      { english: "Garden", telugu: "తోట" },
    ]
  },
  {
    id: "colours",
    nameEnglish: "Colours",
    nameTelugu: "రంగాలు",
    items: [
      { english: "Red", telugu: "ఎరుపు" },
      { english: "Blue", telugu: "నీలం" },
      { english: "Green", telugu: "ఆకుపచ్చ" },
      { english: "Yellow", telugu: "పసుపు" },
      { english: "Black", telugu: "నలుపు" },
      { english: "White", telugu: "తెలుపు" },
      { english: "Pink", telugu: "గులాబీ" },
      { english: "Orange", telugu: "కమల రంగు" },
      { english: "Brown", telugu: "గోధుమ రంగు" },
      { english: "Grey", telugu: "బూడిద రంగు" },
    ]
  },
  {
    id: "professions",
    nameEnglish: "Professions",
    nameTelugu: "వృత్తులు",
    items: [
      { english: "Farmer", telugu: "రైతు" },
      { english: "Doctor", telugu: "వైద్యుడు" },
      { english: "Teacher", telugu: "ఉపాధ్యాయుడు" },
      { english: "Carpenter", telugu: "వడ్రంగి" },
      { english: "Driver", telugu: "డ్రైవర్" },
      { english: "Painter", telugu: "చిత్రకారుడు" },
      { english: "Police", telugu: "పోలీసు" },
      { english: "Shopkeeper", telugu: "దుకాణదారుడు" },
      { english: "Barber", telugu: "నాయుడు" },
      { english: "Cobbler", telugu: "చెప్పుల కుట్టేవాడు" },
    ]
  },
  {
    id: "shapes",
    nameEnglish: "Shapes",
    nameTelugu: "ఆకారాలు",
    items: [
      { english: "Circle", telugu: "వృత్తం" },
      { english: "Square", telugu: "చదరంగం" },
      { english: "Rectangle", telugu: "దీర్ఘచతురస్రం" },
      { english: "Triangle", telugu: "త్రిభుజం" },
      { english: "Oval", telugu: "దీర్ఘ వృత్తం" },
      { english: "Star", telugu: "నక్షత్రం" },
      { english: "Heart", telugu: "గుండె ఆకారం" },
      { english: "Line", telugu: "గీత" },
      { english: "Dot", telugu: "బొట్టు" },
    ]
  },
  {
    id: "bodyparts",
    nameEnglish: "Body Parts",
    nameTelugu: "శరీర భాగాలు",
    items: [
      { english: "Head", telugu: "తల" },
      { english: "Hair", telugu: "జుట్టు" },
      { english: "Eye", telugu: "కన్ను" },
      { english: "Ear", telugu: "చెవి" },
      { english: "Nose", telugu: "ముక్కు" },
      { english: "Mouth", telugu: "నోరు" },
      { english: "Teeth", telugu: "పళ్లు" },
      { english: "Tongue", telugu: "నాలుక" },
      { english: "Hand", telugu: "చేయి" },
      { english: "Leg", telugu: "కాలు" },
      { english: "Foot", telugu: "పాదం" },
      { english: "Finger", telugu: "వేళ్లు" },
      { english: "Stomach", telugu: "పొట్ట" },
      { english: "Back", telugu: "వెన్నుపూస" },
      { english: "Neck", telugu: "మెడ" },
      { english: "Shoulder", telugu: "భుజం" },
      { english: "Knee", telugu: "మోకాలు" },
    ]
  },
  {
    id: "household",
    nameEnglish: "Household Items",
    nameTelugu: "ఇంటి వస్తువులు",
    items: [
      { english: "Door", telugu: "తలుపు" },
      { english: "Window", telugu: "కిటికీ" },
      { english: "Bed", telugu: "మంచం" },
      { english: "Chair", telugu: "కుర్చీ" },
      { english: "Table", telugu: "బల్ల" },
      { english: "Cup", telugu: "కప్పు" },
      { english: "Plate", telugu: "పళ్లెం" },
      { english: "Broom", telugu: "చీపురు" },
      { english: "Bucket", telugu: "బకెట్" },
      { english: "Mug", telugu: "మగ్గు" },
    ]
  },
  {
    id: "seasons",
    nameEnglish: "Seasons",
    nameTelugu: "ఋతువులు",
    items: [
      { english: "Summer", telugu: "వేసవి" },
      { english: "Winter", telugu: "శీతాకాలం" },
      { english: "Rainy Season", telugu: "వర్షాకాలం" },
      { english: "Autumn", telugu: "శరదృతువు" },
      { english: "Spring", telugu: "వసంతం" },
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

