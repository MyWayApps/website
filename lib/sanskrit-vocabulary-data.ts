// Sanskrit Vocabulary Data

export interface VocabularyItem {
  english: string
  sanskrit: string
}

export interface VocabularyCategory {
  id: string
  nameEnglish: string
  nameSanskrit: string
  items: VocabularyItem[]
}

export const vocabularyCategories: VocabularyCategory[] = [
  {
    id: "days",
    nameEnglish: "Days of the Week",
    nameSanskrit: "सप्ताहवासराः",
    items: [
      { english: "Sunday", sanskrit: "रविवासरः" },
      { english: "Monday", sanskrit: "सोमवासरः" },
      { english: "Tuesday", sanskrit: "मङ्गलवासरः" },
      { english: "Wednesday", sanskrit: "बुधवासरः" },
      { english: "Thursday", sanskrit: "गुरुवासरः" },
      { english: "Friday", sanskrit: "शुक्रवासरः" },
      { english: "Saturday", sanskrit: "शनिवासरः" },
    ]
  },
  {
    id: "directions",
    nameEnglish: "Directions",
    nameSanskrit: "दिशः",
    items: [
      { english: "East", sanskrit: "पूर्वदिक्" },
      { english: "West", sanskrit: "पश्चिमदिक्" },
      { english: "North", sanskrit: "उत्तरदिक्" },
      { english: "South", sanskrit: "दक्षिणदिक्" },
      { english: "Above / Up", sanskrit: "उपरि" },
      { english: "Below / Down", sanskrit: "अधः" },
      { english: "Right", sanskrit: "दक्षिणम्" },
      { english: "Left", sanskrit: "वामम्" },
      { english: "Inside", sanskrit: "अन्तः" },
      { english: "Outside", sanskrit: "बहिः" },
      { english: "Front", sanskrit: "अग्रे" },
      { english: "Back / Behind", sanskrit: "पृष्ठतः" },
    ]
  },
  {
    id: "relatives",
    nameEnglish: "Relatives",
    nameSanskrit: "बान्धवाः",
    items: [
      { english: "Mother", sanskrit: "माता" },
      { english: "Father", sanskrit: "पिता" },
      { english: "Grandfather (father's side)", sanskrit: "पितामहः" },
      { english: "Grandmother (father's side)", sanskrit: "पितामही" },
      { english: "Grandfather (mother's side)", sanskrit: "मातामहः" },
      { english: "Grandmother (mother's side)", sanskrit: "मातामही" },
      { english: "Elder Brother", sanskrit: "ज्येष्ठभ्राता" },
      { english: "Younger Brother", sanskrit: "कनिष्ठभ्राता" },
      { english: "Elder Sister", sanskrit: "ज्येष्ठभगिनी" },
      { english: "Younger Sister", sanskrit: "कनिष्ठभगिनी" },
      { english: "Uncle (maternal)", sanskrit: "मातुलः" },
      { english: "Uncle (paternal)", sanskrit: "पितृव्यः" },
      { english: "Aunt", sanskrit: "मातृष्वसा" },
      { english: "Son", sanskrit: "पुत्रः" },
      { english: "Daughter", sanskrit: "पुत्री" },
      { english: "Husband", sanskrit: "पतिः" },
      { english: "Wife", sanskrit: "पत्नी" },
    ]
  },
  {
    id: "fruits",
    nameEnglish: "Fruits",
    nameSanskrit: "फलानि",
    items: [
      { english: "Mango", sanskrit: "आम्रम्" },
      { english: "Banana", sanskrit: "कदलीफलम्" },
      { english: "Apple", sanskrit: "सेवफलम्" },
      { english: "Orange", sanskrit: "नारङ्गफलम्" },
      { english: "Guava", sanskrit: "अमरूदम्" },
      { english: "Grapes", sanskrit: "द्राक्षा" },
      { english: "Papaya", sanskrit: "पपायाफलम्" },
      { english: "Pineapple", sanskrit: "अनानासफलम्" },
      { english: "Watermelon", sanskrit: "कलिङ्गम्" },
      { english: "Muskmelon", sanskrit: "खर्बूजम्" },
      { english: "Coconut", sanskrit: "नारिकेलम्" },
      { english: "Lemon", sanskrit: "निम्बूकम्" },
      { english: "Pomegranate", sanskrit: "दाडिमम्" },
    ]
  },
  {
    id: "vegetables",
    nameEnglish: "Vegetables",
    nameSanskrit: "शाकानि",
    items: [
      { english: "Potato", sanskrit: "आलुकम्" },
      { english: "Tomato", sanskrit: "रक्तवृन्ताकम्" },
      { english: "Brinjal", sanskrit: "वृन्ताकम्" },
      { english: "Carrot", sanskrit: "गृञ्जनम्" },
      { english: "Cabbage", sanskrit: "कोबीशाकम्" },
      { english: "Cauliflower", sanskrit: "पुष्पशाकम्" },
      { english: "Chili", sanskrit: "मरीचम्" },
      { english: "Onion", sanskrit: "पलाण्डुः" },
      { english: "Peas", sanskrit: "कलायः" },
      { english: "Beans", sanskrit: "शिम्बी" },
      { english: "Pumpkin", sanskrit: "कूष्माण्डम्" },
      { english: "Bitter Gourd", sanskrit: "कारवेल्लम्" },
      { english: "Bottle Gourd", sanskrit: "अलाबुः" },
      { english: "Drumstick", sanskrit: "शोभाञ्जनम्" },
      { english: "Spinach", sanskrit: "पालक्यशाकम्" },
    ]
  },
  {
    id: "birds",
    nameEnglish: "Birds",
    nameSanskrit: "पक्षिणः",
    items: [
      { english: "Peacock", sanskrit: "मयूरः" },
      { english: "Pigeon", sanskrit: "कपोतः" },
      { english: "Crow", sanskrit: "काकः" },
      { english: "Sparrow", sanskrit: "चटकः" },
      { english: "Parrot", sanskrit: "शुकः" },
      { english: "Eagle", sanskrit: "श्येनः" },
      { english: "Hen", sanskrit: "कुक्कुटी" },
      { english: "Crane", sanskrit: "बकः" },
      { english: "Duck", sanskrit: "कादम्बः" },
      { english: "Swan", sanskrit: "हंसः" },
      { english: "Owl", sanskrit: "उलूकः" },
    ]
  },
  {
    id: "animals",
    nameEnglish: "Animals",
    nameSanskrit: "पशवः",
    items: [
      { english: "Cow", sanskrit: "गौः" },
      { english: "Buffalo", sanskrit: "महिषः" },
      { english: "Goat", sanskrit: "अजा" },
      { english: "Sheep", sanskrit: "मेषः" },
      { english: "Dog", sanskrit: "श्वा" },
      { english: "Cat", sanskrit: "मार्जारः" },
      { english: "Horse", sanskrit: "अश्वः" },
      { english: "Donkey", sanskrit: "गर्दभः" },
      { english: "Elephant", sanskrit: "गजः" },
      { english: "Lion", sanskrit: "सिंहः" },
      { english: "Tiger", sanskrit: "व्याघ्रः" },
      { english: "Bear", sanskrit: "ऋक्षः" },
      { english: "Fox", sanskrit: "लोमशः" },
      { english: "Camel", sanskrit: "उष्ट्रः" },
      { english: "Rabbit", sanskrit: "शशः" },
      { english: "Monkey", sanskrit: "वानरः" },
    ]
  },
  {
    id: "places",
    nameEnglish: "Places",
    nameSanskrit: "स्थानानि",
    items: [
      { english: "School", sanskrit: "पाठशाला" },
      { english: "Market", sanskrit: "आपणः" },
      { english: "Shop", sanskrit: "विपणिः" },
      { english: "Village", sanskrit: "ग्रामः" },
      { english: "Town", sanskrit: "पुरम्" },
      { english: "City", sanskrit: "नगरम्" },
      { english: "Temple", sanskrit: "मन्दिरम्" },
      { english: "Road", sanskrit: "मार्गः" },
      { english: "River", sanskrit: "नदी" },
      { english: "Mountain", sanskrit: "पर्वतः" },
      { english: "Forest", sanskrit: "वनम्" },
      { english: "House", sanskrit: "गृहम्" },
      { english: "Garden", sanskrit: "उद्यानम्" },
    ]
  },
  {
    id: "colours",
    nameEnglish: "Colours",
    nameSanskrit: "वर्णाः",
    items: [
      { english: "Red", sanskrit: "रक्तवर्णः" },
      { english: "Blue", sanskrit: "नीलवर्णः" },
      { english: "Green", sanskrit: "हरितवर्णः" },
      { english: "Yellow", sanskrit: "पीतवर्णः" },
      { english: "Black", sanskrit: "कृष्णवर्णः" },
      { english: "White", sanskrit: "श्वेतवर्णः" },
      { english: "Pink", sanskrit: "पाटलवर्णः" },
      { english: "Orange", sanskrit: "नारङ्गवर्णः" },
      { english: "Brown", sanskrit: "कपिशवर्णः" },
      { english: "Grey", sanskrit: "धूसरवर्णः" },
    ]
  },
  {
    id: "professions",
    nameEnglish: "Professions",
    nameSanskrit: "वृत्तयः",
    items: [
      { english: "Farmer", sanskrit: "कृषकः" },
      { english: "Doctor", sanskrit: "वैद्यः" },
      { english: "Teacher", sanskrit: "अध्यापकः" },
      { english: "Carpenter", sanskrit: "काष्ठकारः" },
      { english: "Driver", sanskrit: "चालकः" },
      { english: "Painter", sanskrit: "चित्रकारः" },
      { english: "Police", sanskrit: "आरक्षकः" },
      { english: "Shopkeeper", sanskrit: "वणिक्" },
      { english: "Barber", sanskrit: "नापितः" },
      { english: "Cobbler", sanskrit: "चर्मकारः" },
    ]
  },
  {
    id: "shapes",
    nameEnglish: "Shapes",
    nameSanskrit: "आकृतयः",
    items: [
      { english: "Circle", sanskrit: "वृत्तम्" },
      { english: "Square", sanskrit: "चतुरस्रम्" },
      { english: "Rectangle", sanskrit: "आयतः" },
      { english: "Triangle", sanskrit: "त्रिकोणः" },
      { english: "Oval", sanskrit: "दीर्घवृत्तम्" },
      { english: "Star", sanskrit: "तारा" },
      { english: "Heart", sanskrit: "हृदयम्" },
      { english: "Line", sanskrit: "रेखा" },
      { english: "Dot", sanskrit: "बिन्दुः" },
    ]
  },
  {
    id: "bodyparts",
    nameEnglish: "Body Parts",
    nameSanskrit: "शरीरावयवाः",
    items: [
      { english: "Head", sanskrit: "शिरः" },
      { english: "Hair", sanskrit: "केशाः" },
      { english: "Eye", sanskrit: "नेत्रम्" },
      { english: "Ear", sanskrit: "कर्णः" },
      { english: "Nose", sanskrit: "नासिका" },
      { english: "Mouth", sanskrit: "मुखम्" },
      { english: "Teeth", sanskrit: "दन्ताः" },
      { english: "Tongue", sanskrit: "जिह्वा" },
      { english: "Hand", sanskrit: "हस्तः" },
      { english: "Leg", sanskrit: "जङ्घा" },
      { english: "Foot", sanskrit: "पादः" },
      { english: "Finger", sanskrit: "अङ्गुलिः" },
      { english: "Stomach", sanskrit: "उदरम्" },
      { english: "Back", sanskrit: "पृष्ठम्" },
      { english: "Neck", sanskrit: "ग्रीवा" },
      { english: "Shoulder", sanskrit: "स्कन्धः" },
      { english: "Knee", sanskrit: "जानु" },
    ]
  },
  {
    id: "household",
    nameEnglish: "Household Items",
    nameSanskrit: "गृहोपकरणानि",
    items: [
      { english: "Door", sanskrit: "द्वारम्" },
      { english: "Window", sanskrit: "वातायनम्" },
      { english: "Bed", sanskrit: "शय्या" },
      { english: "Chair", sanskrit: "आसन्दी" },
      { english: "Table", sanskrit: "फलकम्" },
      { english: "Cup", sanskrit: "चषकः" },
      { english: "Plate", sanskrit: "स्थालिका" },
      { english: "Broom", sanskrit: "सम्मार्जनी" },
      { english: "Bucket", sanskrit: "जलपात्रम्" },
      { english: "Mug", sanskrit: "लघुपात्रम्" },
    ]
  },
  {
    id: "seasons",
    nameEnglish: "Seasons",
    nameSanskrit: "ऋतवः",
    items: [
      { english: "Spring", sanskrit: "वसन्तः" },
      { english: "Summer", sanskrit: "ग्रीष्मः" },
      { english: "Rainy Season", sanskrit: "वर्षाः" },
      { english: "Autumn", sanskrit: "शरत्" },
      { english: "Early Winter", sanskrit: "हेमन्तः" },
      { english: "Winter", sanskrit: "शिशिरः" },
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
