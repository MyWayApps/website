// Hindi Vocabulary Data

export interface VocabularyItem {
  english: string
  hindi: string
}

export interface VocabularyCategory {
  id: string
  nameEnglish: string
  nameHindi: string
  items: VocabularyItem[]
}

export const vocabularyCategories: VocabularyCategory[] = [
  {
    id: "days",
    nameEnglish: "Days of the Week",
    nameHindi: "सप्ताह के दिन",
    items: [
      { english: "Sunday", hindi: "रविवार" },
      { english: "Monday", hindi: "सोमवार" },
      { english: "Tuesday", hindi: "मंगलवार" },
      { english: "Wednesday", hindi: "बुधवार" },
      { english: "Thursday", hindi: "गुरुवार" },
      { english: "Friday", hindi: "शुक्रवार" },
      { english: "Saturday", hindi: "शनिवार" },
    ]
  },
  {
    id: "directions",
    nameEnglish: "Directions",
    nameHindi: "दिशाएँ",
    items: [
      { english: "East", hindi: "पूर्व" },
      { english: "West", hindi: "पश्चिम" },
      { english: "North", hindi: "उत्तर" },
      { english: "South", hindi: "दक्षिण" },
      { english: "Above / Up", hindi: "ऊपर" },
      { english: "Below / Down", hindi: "नीचे" },
      { english: "Right", hindi: "दायाँ" },
      { english: "Left", hindi: "बायाँ" },
      { english: "Inside", hindi: "अंदर" },
      { english: "Outside", hindi: "बाहर" },
      { english: "Front", hindi: "आगे" },
      { english: "Back / Behind", hindi: "पीछे" },
    ]
  },
  {
    id: "relatives",
    nameEnglish: "Relatives",
    nameHindi: "रिश्तेदार",
    items: [
      { english: "Mother", hindi: "माँ" },
      { english: "Father", hindi: "पिता" },
      { english: "Grandfather (father's side)", hindi: "दादा" },
      { english: "Grandmother (father's side)", hindi: "दादी" },
      { english: "Grandfather (mother's side)", hindi: "नाना" },
      { english: "Grandmother (mother's side)", hindi: "नानी" },
      { english: "Elder Brother", hindi: "बड़ा भाई" },
      { english: "Younger Brother", hindi: "छोटा भाई" },
      { english: "Elder Sister", hindi: "बड़ी बहन" },
      { english: "Younger Sister", hindi: "छोटी बहन" },
      { english: "Uncle (maternal)", hindi: "मामा" },
      { english: "Uncle (paternal)", hindi: "चाचा" },
      { english: "Aunt", hindi: "चाची" },
      { english: "Son", hindi: "बेटा" },
      { english: "Daughter", hindi: "बेटी" },
      { english: "Husband", hindi: "पति" },
      { english: "Wife", hindi: "पत्नी" },
    ]
  },
  {
    id: "fruits",
    nameEnglish: "Fruits",
    nameHindi: "फल",
    items: [
      { english: "Mango", hindi: "आम" },
      { english: "Banana", hindi: "केला" },
      { english: "Apple", hindi: "सेब" },
      { english: "Orange", hindi: "संतरा" },
      { english: "Guava", hindi: "अमरूद" },
      { english: "Grapes", hindi: "अंगूर" },
      { english: "Papaya", hindi: "पपीता" },
      { english: "Pineapple", hindi: "अनानास" },
      { english: "Watermelon", hindi: "तरबूज" },
      { english: "Muskmelon", hindi: "खरबूजा" },
      { english: "Coconut", hindi: "नारियल" },
      { english: "Lemon", hindi: "नींबू" },
      { english: "Pomegranate", hindi: "अनार" },
    ]
  },
  {
    id: "vegetables",
    nameEnglish: "Vegetables",
    nameHindi: "सब्ज़ियाँ",
    items: [
      { english: "Potato", hindi: "आलू" },
      { english: "Tomato", hindi: "टमाटर" },
      { english: "Brinjal", hindi: "बैंगन" },
      { english: "Carrot", hindi: "गाजर" },
      { english: "Cabbage", hindi: "पत्तागोभी" },
      { english: "Cauliflower", hindi: "फूलगोभी" },
      { english: "Chili", hindi: "मिर्च" },
      { english: "Onion", hindi: "प्याज" },
      { english: "Peas", hindi: "मटर" },
      { english: "Beans", hindi: "फलियाँ" },
      { english: "Pumpkin", hindi: "कद्दू" },
      { english: "Bitter Gourd", hindi: "करेला" },
      { english: "Bottle Gourd", hindi: "लौकी" },
      { english: "Drumstick", hindi: "सहजन" },
      { english: "Spinach", hindi: "पालक" },
    ]
  },
  {
    id: "birds",
    nameEnglish: "Birds",
    nameHindi: "पक्षी",
    items: [
      { english: "Peacock", hindi: "मोर" },
      { english: "Pigeon", hindi: "कबूतर" },
      { english: "Crow", hindi: "कौआ" },
      { english: "Sparrow", hindi: "गौरैया" },
      { english: "Parrot", hindi: "तोता" },
      { english: "Eagle", hindi: "चील" },
      { english: "Hen", hindi: "मुर्गी" },
      { english: "Crane", hindi: "सारस" },
      { english: "Duck", hindi: "बत्तख" },
      { english: "Swan", hindi: "हंस" },
      { english: "Owl", hindi: "उल्लू" },
    ]
  },
  {
    id: "animals",
    nameEnglish: "Animals",
    nameHindi: "जानवर",
    items: [
      { english: "Cow", hindi: "गाय" },
      { english: "Buffalo", hindi: "भैंस" },
      { english: "Goat", hindi: "बकरी" },
      { english: "Sheep", hindi: "भेड़" },
      { english: "Dog", hindi: "कुत्ता" },
      { english: "Cat", hindi: "बिल्ली" },
      { english: "Horse", hindi: "घोड़ा" },
      { english: "Donkey", hindi: "गधा" },
      { english: "Elephant", hindi: "हाथी" },
      { english: "Lion", hindi: "शेर" },
      { english: "Tiger", hindi: "बाघ" },
      { english: "Bear", hindi: "भालू" },
      { english: "Fox", hindi: "लोमड़ी" },
      { english: "Camel", hindi: "ऊँट" },
      { english: "Rabbit", hindi: "खरगोश" },
      { english: "Monkey", hindi: "बंदर" },
    ]
  },
  {
    id: "places",
    nameEnglish: "Places",
    nameHindi: "स्थान",
    items: [
      { english: "School", hindi: "स्कूल" },
      { english: "Market", hindi: "बाज़ार" },
      { english: "Shop", hindi: "दुकान" },
      { english: "Village", hindi: "गाँव" },
      { english: "Town", hindi: "कस्बा" },
      { english: "City", hindi: "शहर" },
      { english: "Temple", hindi: "मंदिर" },
      { english: "Road", hindi: "सड़क" },
      { english: "River", hindi: "नदी" },
      { english: "Mountain", hindi: "पहाड़" },
      { english: "Forest", hindi: "जंगल" },
      { english: "House", hindi: "घर" },
      { english: "Garden", hindi: "बगीचा" },
    ]
  },
  {
    id: "colours",
    nameEnglish: "Colours",
    nameHindi: "रंग",
    items: [
      { english: "Red", hindi: "लाल" },
      { english: "Blue", hindi: "नीला" },
      { english: "Green", hindi: "हरा" },
      { english: "Yellow", hindi: "पीला" },
      { english: "Black", hindi: "काला" },
      { english: "White", hindi: "सफ़ेद" },
      { english: "Pink", hindi: "गुलाबी" },
      { english: "Orange", hindi: "नारंगी" },
      { english: "Brown", hindi: "भूरा" },
      { english: "Grey", hindi: "स्लेटी" },
    ]
  },
  {
    id: "professions",
    nameEnglish: "Professions",
    nameHindi: "पेशे",
    items: [
      { english: "Farmer", hindi: "किसान" },
      { english: "Doctor", hindi: "डॉक्टर" },
      { english: "Teacher", hindi: "शिक्षक" },
      { english: "Carpenter", hindi: "बढ़ई" },
      { english: "Driver", hindi: "ड्राइवर" },
      { english: "Painter", hindi: "चित्रकार" },
      { english: "Police", hindi: "पुलिस" },
      { english: "Shopkeeper", hindi: "दुकानदार" },
      { english: "Barber", hindi: "नाई" },
      { english: "Cobbler", hindi: "मोची" },
    ]
  },
  {
    id: "shapes",
    nameEnglish: "Shapes",
    nameHindi: "आकार",
    items: [
      { english: "Circle", hindi: "वृत्त" },
      { english: "Square", hindi: "वर्ग" },
      { english: "Rectangle", hindi: "आयत" },
      { english: "Triangle", hindi: "त्रिभुज" },
      { english: "Oval", hindi: "अंडाकार" },
      { english: "Star", hindi: "तारा" },
      { english: "Heart", hindi: "दिल" },
      { english: "Line", hindi: "रेखा" },
      { english: "Dot", hindi: "बिंदु" },
    ]
  },
  {
    id: "bodyparts",
    nameEnglish: "Body Parts",
    nameHindi: "शरीर के अंग",
    items: [
      { english: "Head", hindi: "सिर" },
      { english: "Hair", hindi: "बाल" },
      { english: "Eye", hindi: "आँख" },
      { english: "Ear", hindi: "कान" },
      { english: "Nose", hindi: "नाक" },
      { english: "Mouth", hindi: "मुँह" },
      { english: "Teeth", hindi: "दाँत" },
      { english: "Tongue", hindi: "जीभ" },
      { english: "Hand", hindi: "हाथ" },
      { english: "Leg", hindi: "टांग" },
      { english: "Foot", hindi: "पैर" },
      { english: "Finger", hindi: "उंगली" },
      { english: "Stomach", hindi: "पेट" },
      { english: "Back", hindi: "पीठ" },
      { english: "Neck", hindi: "गर्दन" },
      { english: "Shoulder", hindi: "कंधा" },
      { english: "Knee", hindi: "घुटना" },
    ]
  },
  {
    id: "household",
    nameEnglish: "Household Items",
    nameHindi: "घरेलू सामान",
    items: [
      { english: "Door", hindi: "दरवाज़ा" },
      { english: "Window", hindi: "खिड़की" },
      { english: "Bed", hindi: "बिस्तर" },
      { english: "Chair", hindi: "कुर्सी" },
      { english: "Table", hindi: "मेज़" },
      { english: "Cup", hindi: "कप" },
      { english: "Plate", hindi: "थाली" },
      { english: "Broom", hindi: "झाड़ू" },
      { english: "Bucket", hindi: "बाल्टी" },
      { english: "Mug", hindi: "मग" },
    ]
  },
  {
    id: "seasons",
    nameEnglish: "Seasons",
    nameHindi: "ऋतुएँ",
    items: [
      { english: "Spring", hindi: "वसंत ऋतु" },
      { english: "Summer", hindi: "ग्रीष्म ऋतु" },
      { english: "Rainy Season", hindi: "वर्षा ऋतु" },
      { english: "Autumn", hindi: "शरद ऋतु" },
      { english: "Early Winter", hindi: "हेमंत ऋतु" },
      { english: "Winter", hindi: "शिशिर ऋतु" },
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
