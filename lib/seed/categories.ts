import { Category } from "../types";

export const CATEGORIES: Category[] = [
  {
    id: "garbage",
    icon: "Trash2",
    name: {
      en: "Door to door collection",
      hi: "घर-घर कचरा उठाना",
    },
    short: {
      en: "Garbage",
      hi: "कचरा",
    },
    defaultCommonArea: false,
    subs: [
      {
        id: "garbage_not_collected",
        name: {
          en: "Garbage not collected",
          hi: "कचरा नहीं उठाया गया",
        },
      },
      {
        id: "missed_time",
        name: {
          en: "Missed scheduled timing",
          hi: "नियत समय पर गाड़ी नहीं आई",
        },
      },
    ],
  },
  {
    id: "water",
    icon: "Droplets",
    name: {
      en: "Water supply",
      hi: "पानी की आपूर्ति",
    },
    short: {
      en: "Water",
      hi: "पानी",
    },
    defaultCommonArea: false,
    subs: [
      {
        id: "no_water",
        name: {
          en: "No water supply",
          hi: "पानी नहीं आ रहा है",
        },
      },
      {
        id: "low_pressure",
        name: {
          en: "Low pressure",
          hi: "पानी का कम दबाव",
        },
      },
      {
        id: "dirty_water",
        name: {
          en: "Dirty or contaminated water",
          hi: "गंदा या बदबूदार पानी",
        },
      },
      {
        id: "pipe_leakage",
        name: {
          en: "Main pipe leakage",
          hi: "पाइप लाइन से रिसाव",
        },
      },
    ],
  },
  {
    id: "electricity",
    icon: "Zap",
    name: {
      en: "Electricity",
      hi: "बिजली आपूर्ति",
    },
    short: {
      en: "Electricity",
      hi: "बिजली",
    },
    defaultCommonArea: false,
    subs: [
      {
        id: "power_cut",
        name: {
          en: "Power cut / Phase issue",
          hi: "बिजली गुल या फेज की समस्या",
        },
      },
      {
        id: "voltage_fluctuation",
        name: {
          en: "Voltage fluctuation",
          hi: "वोल्टेज में उतार-चढ़ाव",
        },
      },
      {
        id: "common_light_off",
        name: {
          en: "Common-area light off",
          hi: "कॉमन एरिया की लाइट बंद है",
        },
      },
      {
        id: "sparking_wire",
        name: {
          en: "Loose or sparking wire",
          hi: "ढीला या स्पार्किंग करता तार",
        },
      },
    ],
  },
  {
    id: "sweeping",
    icon: "Brush",
    name: {
      en: "Road sweeping",
      hi: "सड़क सफाई",
    },
    short: {
      en: "Sweeping",
      hi: "सफाई",
    },
    defaultCommonArea: true,
    subs: [
      {
        id: "road_not_swept",
        name: {
          en: "Road not swept",
          hi: "सड़क पर झाड़ू नहीं लगी",
        },
      },
      {
        id: "park_sweeping",
        name: {
          en: "Park or common area not swept",
          hi: "पार्क या कॉमन क्षेत्र में गंदगी",
        },
      },
      {
        id: "garbage_pile",
        name: {
          en: "Garbage pile on roadside",
          hi: "सड़क किनारे कचरे का ढेर",
        },
      },
    ],
  },
  {
    id: "sewage",
    icon: "Waves",
    name: {
      en: "Sewage cleaning",
      hi: "सीवर सफाई",
    },
    short: {
      en: "Sewage",
      hi: "सीवर",
    },
    defaultCommonArea: true,
    subs: [
      {
        id: "blocked_sewer",
        name: {
          en: "Blocked sewer line",
          hi: "सीवर लाइन जाम है",
        },
      },
      {
        id: "manhole_overflow",
        name: {
          en: "Manhole overflowing",
          hi: "मैनहोल से पानी उबल रहा है",
        },
      },
      {
        id: "bad_smell",
        name: {
          en: "Foul sewer smell",
          hi: "सीवर की तेज बदबू",
        },
      },
    ],
  },
  {
    id: "drainage",
    icon: "CloudRain",
    name: {
      en: "Rainwater drainage",
      hi: "बरसाती नाला निकासी",
    },
    short: {
      en: "Drainage",
      hi: "नाला",
    },
    defaultCommonArea: true,
    subs: [
      {
        id: "waterlogging",
        name: {
          en: "Waterlogging on road",
          hi: "सड़क पर भारी जलभराव",
        },
      },
      {
        id: "blocked_storm_drain",
        name: {
          en: "Blocked storm drain",
          hi: "बरसाती नाला चोक है",
        },
      },
      {
        id: "broken_drain_cover",
        name: {
          en: "Broken drain cover / hazard",
          hi: "टूटा हुआ नाला ढक्कन (खतरा)",
        },
      },
    ],
  },
  {
    id: "street_light",
    icon: "Lamp",
    name: {
      en: "Street light",
      hi: "स्ट्रीट लाइट",
    },
    short: {
      en: "Street light",
      hi: "स्ट्रीट लाइट",
    },
    defaultCommonArea: true,
    subs: [
      {
        id: "light_not_working",
        name: {
          en: "Street light not working",
          hi: "स्ट्रीट लाइट बंद पड़ी है",
        },
      },
      {
        id: "daytime_on",
        name: {
          en: "On during daytime",
          hi: "दिन में भी लाइट जल रही है",
        },
      },
      {
        id: "flickering",
        name: {
          en: "Flickering or very dim",
          hi: "टिमटिमा रही है या बहुत धीमी है",
        },
      },
      {
        id: "damaged_pole",
        name: {
          en: "Damaged or tilted pole",
          hi: "खंभा टूटा या झुका हुआ है",
        },
      },
    ],
  },
  {
    id: "park",
    icon: "Trees",
    name: {
      en: "Park and trees",
      hi: "पार्क एवं पेड़-पौधे",
    },
    short: {
      en: "Park",
      hi: "पार्क",
    },
    defaultCommonArea: true,
    subs: [
      {
        id: "tree_trimming",
        name: {
          en: "Tree branches trimming needed",
          hi: "पेड़ की टहनियों की छंटाई",
        },
      },
      {
        id: "park_maintenance",
        name: {
          en: "Park grass & benches upkeep",
          hi: "घास कटाई और बेंच की मरम्मत",
        },
      },
      {
        id: "fallen_branch",
        name: {
          en: "Fallen branch blocking path",
          hi: "गिरी हुई टहनी से रास्ता बंद",
        },
      },
    ],
  },
];
