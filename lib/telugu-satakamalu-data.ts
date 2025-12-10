export type SatakamId =
  | "vemana"
  | "sumati"
  | "dasarathi"
  | "kalahastiswara"
  | "kumari"
  | "kumara"
  | "bhaskara"
  | "narasimha"

export interface SatakamMeta {
  id: SatakamId
  title: string
  subtitle: string
  status: "available" | "coming-soon"
}

export interface Poem {
  title: string
  poem: string
  meaningTelugu: string
  meaningEnglish: string
}

export const satakamList: SatakamMeta[] = [
  {
    id: "vemana",
    title: "వేమన శతకం",
    subtitle: "Vemana Satakam",
    status: "available",
  },
  {
    id: "sumati",
    title: "సుమతి శతకం",
    subtitle: "Sumati Satakam",
    status: "coming-soon",
  },
  {
    id: "dasarathi",
    title: "దాసరథి శతకం",
    subtitle: "Dasarathi Satakam",
    status: "coming-soon",
  },
  {
    id: "kalahastiswara",
    title: "శ్రీ కళహస్తీశ్వర శతకం",
    subtitle: "Sri Kalahastiswara Satakam",
    status: "coming-soon",
  },
  {
    id: "kumari",
    title: "కుమారి శతకం",
    subtitle: "Kumari Satakam",
    status: "coming-soon",
  },
  {
    id: "kumara",
    title: "కుమార శతకం",
    subtitle: "Kumara Satakam",
    status: "coming-soon",
  },
  {
    id: "bhaskara",
    title: "భాస్కర శతకం",
    subtitle: "Bhaskara Satakam",
    status: "coming-soon",
  },
  {
    id: "narasimha",
    title: "నరసింహ శతకం",
    subtitle: "Narasimha Satakam",
    status: "coming-soon",
  },
]

export const vemanaPoems: Poem[] = [
  {
    title: "గంగిగోవుపాలు గంటెడైనను చాలు",
    poem: `గంగిగోవుపాలు గంటెడైనను చాలు
కడివెడైననేమి ఖరముపాలు,
భక్తికలుగు కూడు పట్టెడైననుజాలు,
విశ్వదాభిరామ వినుర వేమా.`,
    meaningTelugu:
      "మనసుపూర్వకంగా పెట్టిన చిన్న అన్నం కూడా తృప్తి ఇస్తుంది; కడవ నిండా గాడిద పాలు పెట్టినా గోపాలు రుచిని ఇస్తాయా? నిజమైన భక్తితో ఇచ్చినదే విలువైనది.",
    meaningEnglish:
      "Milk from a good cow, even if it is only a little, is enough. Milk from a donkey, even if you have a lot, is never equal to cow’s milk. In the same way… A meal prepared with many rich and fancy dishes is not as valuable as even a small amount of food that is pure, simple, and fills the heart with devotion toward God. Quality is more important than quantity. Even a little, when it is pure and meaningful, is far better than a lot that has no real value.",
  },
  {
    title: "ఆత్మ శుద్ధి లేని యాచారమదియేల?",
    poem: `ఆత్మ శుద్ధి లేని యాచారమదియేల?
బాండాశుద్ధి లేని పాకమేల,
చిత్త శుద్ధి లేని శివ పూజలేలరా?
విశ్వదాభిరామ వినుర వేమా.`,
    meaningTelugu:
      "మనసు శుచిగా లేకుండా చేసే ఆచారాలకు విలువ లేదు. పాత్ర శుభ్రం కాకుంటే వంట రుచిగా రాదు; అలానే అపవిత్రమైన చిత్తంతో చేసే పూజకు ఫలం ఉండదు.",
    meaningEnglish:
      "Rituals without inner purity are hollow. A dirty pot spoils food; an impure mind spoils worship. Clean the heart first.",
  },
  {
    title: "మేడిపండుచూడ మేలిమై యుండు",
    poem: `మేడిపండుచూడ మేలిమై యుండు
పొట్టవిప్పిచూడ పురుగులుండు
పిరికి వాని మదిని బింకమీలాగురా
విశ్వదాభిరామ వినుర వేమా.`,
    meaningTelugu:
      "మేడిపండు బయట మెరుస్తుంది కానీ లోపల పురుగు ఉంటే పనికిరాదు. అలానే చెడ్డవాడు పైకి మంచివాడిలా కనిపించినా అతడి చెడు స్వభావం కీడు కలిగిస్తుంది.",
    meaningEnglish:
      "A ber fruit can shine outside yet hide worms within. Likewise, a bad person may look gentle, but the rot inside will still harm.",
  },
  {
    title: "అల్పుడెపుడు పల్కు నాడంబరముగాను",
    poem: `అల్పుడెపుడు పల్కు నాడంబరముగాను
సజ్జనుండు బల్కుజల్లగాను
కంచుమ్రోగినట్లు కనకంబు మ్రోగునా
విశ్వదాభిరామ వినుర వేమా.`,
    meaningTelugu:
      "నీచుల మాటలు గట్టిగా, అర్భాటంగా ఉంటాయి; సజ్జనుల మాటలు చల్లగా నీతితో ఉంటాయి. బంగారపు శబ్దం కంచు శబ్దంలా కర్కశంగా ఉండదు.",
    meaningEnglish:
      "The petty shout with bombast; the noble speak gently and wisely. Gold never clangs like brass.",
  },
  {
    title: "అనగా ననగ రాగ మాతిశయిల్లుచునుండు",
    poem: `అనగా ననగ రాగ మాతిశయిల్లుచునుండు
దినగదినగ వేము తియ్యగనుండు
సాధనమున పనులు సమకూరు ధరలోన
విశ్వదాభిరామ వినుర వేమా.`,
    meaningTelugu:
      "గొంతు సాధన చేస్తే పాట తియ్యగా మారుతుంది; కష్టపడితే సాధించలేని పని లేదు. దృఢ సంకల్పం, నిరంతర సాధనతో ఏ లక్ష్యమూ చేరుకోవచ్చు.",
    meaningEnglish:
      "Practice sweetens the voice day by day; effort makes hard tasks possible. Steady discipline turns goals into reality.",
  },
]


