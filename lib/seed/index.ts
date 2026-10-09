import { User, Complaint, Notice, Contact, ResidentRecord } from "../types";
import { APP_CONFIG } from "../config";

export function getDemoUsers(): Record<string, User> {
  return {
    resident: {
      id: "usr_resident_1",
      role: "resident",
      name: APP_CONFIG.demoResident.name,
      phone: APP_CONFIG.demoResident.phone,
      address: "",
    },
    member: {
      id: "usr_member_1",
      role: "member",
      name: APP_CONFIG.demoMember.name,
      phone: APP_CONFIG.demoMember.phone,
      address: "B-12, Block B, Sushant Lok 2",
      memberId: APP_CONFIG.demoMember.memberId,
      designation: APP_CONFIG.demoMember.designation,
    },
  };
}

export function generateSeedData(baseTime = Date.now()) {
  const hour = 3600 * 1000;
  const day = 24 * hour;

  const users = getDemoUsers();

  const contacts: Contact[] = [
    {
      id: "c_1",
      name: "Rajesh Verma",
      role: "President",
      phone: "98100 12345",
      type: "office",
    },
    {
      id: "c_2",
      name: "Sunita Rao",
      role: "Vice President",
      phone: "98100 23456",
      type: "office",
    },
    {
      id: "c_3",
      name: "Anil Sharma",
      role: "General Secretary",
      phone: "98100 34567",
      type: "office",
    },
    {
      id: "c_4",
      name: "Pooja Malhotra",
      role: "Treasurer",
      phone: "98100 45678",
      type: "office",
    },
    {
      id: "c_5",
      name: "Vikram Chauhan",
      role: "Executive Member",
      phone: "98100 56789",
      type: "office",
    },
    {
      id: "c_6",
      name: "Manoj Goyal",
      role: "Estate Manager",
      phone: "98100 67890",
      type: "office",
    },
    {
      id: "c_em_1",
      name: "National Emergency",
      role: "Police / All Help",
      phone: "112",
      type: "emergency",
    },
    {
      id: "c_em_2",
      name: "Ambulance",
      role: "Medical Services",
      phone: "102",
      type: "emergency",
    },
    {
      id: "c_em_3",
      name: "Fire Brigade",
      role: "Fire Station Gurugram",
      phone: "101",
      type: "emergency",
    },
  ];

  const residents: ResidentRecord[] = [
    {
      id: "res_1",
      name: "Prince Kumar",
      phone: "90000 00010",
      house: "F-69",
      block: "Block F",
      society: "Sushant Lok 2",
      ownership: "owned",
    },
    {
      id: "res_2",
      name: "Rajesh Verma",
      phone: "90000 00020",
      house: "B-12",
      block: "Block B",
      society: "Sushant Lok 2",
      ownership: "owned",
    },
    {
      id: "res_3",
      name: "Meenakshi Sundaram",
      phone: "98111 22334",
      house: "C-104",
      block: "Block C",
      society: "Sushant Lok 2",
      ownership: "rented",
    },
    {
      id: "res_4",
      name: "Harpreet Singh",
      phone: "98112 33445",
      house: "A-45",
      block: "Block A",
      society: "Sushant Lok 3",
      ownership: "owned",
    },
    {
      id: "res_5",
      name: "Deepak Singhania",
      phone: "98113 44556",
      house: "D-201",
      block: "Block D",
      society: "Sushant Lok 2",
      ownership: "rented",
    },
    {
      id: "res_6",
      name: "Shalini Gupta",
      phone: "98114 55667",
      house: "E-18",
      block: "Block E",
      society: "Sushant Lok 3",
      ownership: "owned",
    },
    {
      id: "res_7",
      name: "Arun Kulkarni",
      phone: "98115 66778",
      house: "F-12",
      block: "Block F",
      society: "Sushant Lok 2",
      ownership: "rented",
    },
    {
      id: "res_8",
      name: "Kavita Sethi",
      phone: "98116 77889",
      house: "G-88",
      block: "Block G",
      society: "Sushant Lok 3",
      ownership: "owned",
    },
    {
      id: "res_9",
      name: "Mohit Bansal",
      phone: "98117 88990",
      house: "C-402",
      block: "Block C",
      society: "Sushant Lok 2",
      ownership: "owned",
    },
    {
      id: "res_10",
      name: "Naveen Joshi",
      phone: "98118 99001",
      house: "B-55",
      block: "Block B",
      society: "Sushant Lok 2",
      ownership: "rented",
    },
    {
      id: "res_11",
      name: "Tarun Bajaj",
      phone: "98119 11223",
      house: "A-90",
      block: "Block A",
      society: "Sushant Lok 3",
      ownership: "owned",
    },
    {
      id: "res_12",
      name: "Ritu Chawla",
      phone: "98120 22334",
      house: "D-15",
      block: "Block D",
      society: "Sushant Lok 2",
      ownership: "rented",
    },
    {
      id: "res_13",
      name: "Vikas Aggarwal",
      phone: "98121 33445",
      house: "E-72",
      block: "Block E",
      society: "Sushant Lok 3",
      ownership: "owned",
    },
    {
      id: "res_14",
      name: "Geeta Nambiar",
      phone: "98122 44556",
      house: "F-33",
      block: "Block F",
      society: "Sushant Lok 2",
      ownership: "owned",
    },
  ];

  const notices: Notice[] = [
    {
      id: "nt_1",
      title: "Revised Door-to-Door Waste Collection Monthly Charges",
      body: "Starting next month, the municipal agency has revised collection charges to ₹150 per household. Segregation of wet and dry waste is strictly mandatory.",
      topic: "Garbage",
      important: true,
      audience: "all",
      byName: "Rajesh Verma (President)",
      createdAt: new Date(baseTime - 3 * hour).toISOString(),
    },
    {
      id: "nt_2",
      title: "Morning Water Supply Pressure Testing in Block F & B",
      body: "Booster pump maintenance will take place between 7:00 AM to 9:30 AM tomorrow. Low pressure might be observed on upper floors.",
      topic: "Water",
      important: false,
      audience: "residents",
      byName: "Manoj Goyal (Estate Manager)",
      createdAt: new Date(baseTime - 14 * hour).toISOString(),
    },
    {
      id: "nt_3",
      title: "Monthly RWA Committee Executive Meeting Schedule",
      body: "All office bearers are requested to gather at the community hall this Sunday at 11 AM to review open complaints and quarterly balance sheets.",
      topic: "General",
      important: false,
      audience: "members",
      byName: "Anil Sharma (General Secretary)",
      createdAt: new Date(baseTime - 1 * day).toISOString(),
    },
    {
      id: "nt_4",
      title: "Scheduled Electricity Line Trimming & Transformer Servicing",
      body: "DHBVN team will carry out branch trimming near high-tension lines in Block A and C between 11 AM and 2 PM on Thursday.",
      topic: "Electricity",
      important: false,
      audience: "all",
      byName: "Vikram Chauhan",
      createdAt: new Date(baseTime - 2 * day).toISOString(),
    },
    {
      id: "nt_5",
      title: "Rainwater Drain Desilting Drive Before Monsoon",
      body: "Contractors are cleaning roadside storm drains across all blocks. Please avoid parking over drain inspection covers.",
      topic: "Maintenance",
      important: false,
      audience: "all",
      byName: "Pooja Malhotra",
      createdAt: new Date(baseTime - 4 * day).toISOString(),
    },
    {
      id: "nt_6",
      title: "Summer Evening Water Tanker Filling Timings",
      body: "Secondary supply tankers arrive daily at 4:30 PM. Underground reservoir pumps will operate until 7:00 PM.",
      topic: "Water",
      important: false,
      audience: "residents",
      byName: "Manoj Goyal",
      createdAt: new Date(baseTime - 5 * day).toISOString(),
    },
  ];

  // 12 Complaints across 8 categories
  const complaints: Complaint[] = [
    // 1. Belong to demo resident (Prince Kumar) - In Progress, open, journey card target
    {
      id: "AH-1042",
      categoryId: "water",
      subId: "low_pressure",
      description:
        "Water pressure on 2nd floor is extremely low since yesterday morning. Booster pump doesn't seem to be operating.",
      photos: ["/demo/water.svg"],
      location: "F-69, Block F",
      commonArea: false,
      reporterId: "usr_resident_1",
      reporterName: "Prince Kumar",
      reporterFlat: "F-69, Block F",
      status: "in_progress",
      createdAt: new Date(baseTime - 8 * hour).toISOString(),
      updatedAt: new Date(baseTime - 2 * hour).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 8 * hour).toISOString(),
          byName: "Prince Kumar",
        },
        {
          status: "in_progress",
          at: new Date(baseTime - 2 * hour).toISOString(),
          byName: "Rajesh Verma",
          note: "Plumber Raju assigned. Booster motor inspection underway.",
        },
      ],
      replies: [
        {
          id: "rep_1042_1",
          byName: "Rajesh Verma",
          byRole: "member",
          text: "स्टाफ को सूचित कर दिया गया है। आज दोपहर तक काम पूरा हो जाएगा।",
          at: new Date(baseTime - 2 * hour).toISOString(),
        },
      ],
    },
    // 2. Demo resident - Pending
    {
      id: "AH-1041",
      categoryId: "garbage",
      subId: "garbage_not_collected",
      description:
        "Door to door garbage vehicle missed our row today. Wet waste is sitting outside.",
      photos: [], // no photo
      location: "F-69, Block F",
      commonArea: false,
      reporterId: "usr_resident_1",
      reporterName: "Prince Kumar",
      reporterFlat: "F-69, Block F",
      status: "pending",
      createdAt: new Date(baseTime - 4 * hour).toISOString(),
      updatedAt: new Date(baseTime - 4 * hour).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 4 * hour).toISOString(),
          byName: "Prince Kumar",
        },
      ],
      replies: [],
    },
    // 3. Demo resident - Resolved
    {
      id: "AH-1040",
      categoryId: "electricity",
      subId: "voltage_fluctuation",
      description:
        "Severe voltage surge in our phase causing AC inverter trips.",
      photos: ["/demo/electricity.svg"],
      location: "F-69, Block F",
      commonArea: false,
      reporterId: "usr_resident_1",
      reporterName: "Prince Kumar",
      reporterFlat: "F-69, Block F",
      status: "resolved",
      createdAt: new Date(baseTime - 2 * day).toISOString(),
      updatedAt: new Date(baseTime - 1 * day).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 2 * day).toISOString(),
          byName: "Prince Kumar",
        },
        {
          status: "in_progress",
          at: new Date(baseTime - 36 * hour).toISOString(),
          byName: "Rajesh Verma",
          note: "DHBVN sub-station technician called.",
        },
        {
          status: "resolved",
          at: new Date(baseTime - 1 * day).toISOString(),
          byName: "Rajesh Verma",
          note: "Phase neutral wire tightened at pillar box. Voltage normal.",
        },
      ],
      replies: [
        {
          id: "rep_1040_1",
          byName: "Prince Kumar",
          byRole: "resident",
          text: "Thanks, the technician checked and it is fine now.",
          at: new Date(baseTime - 20 * hour).toISOString(),
        },
      ],
    },
    // 4. Overdue Pending complaint (9 days waiting - for member stat card)
    {
      id: "AH-1039",
      categoryId: "street_light",
      subId: "damaged_pole",
      description:
        "Street light pole bent near Main Gate 2 after a delivery truck hit it. Wires are exposed.",
      photos: [
        "/demo/street_light.svg",
        "/demo/street_light.svg",
        "/demo/street_light.svg",
      ], // 3 photos
      location: "Gate 2, Sushant Lok 2 Main Road",
      commonArea: true,
      reporterId: "res_4",
      reporterName: "Harpreet Singh",
      reporterFlat: "A-45, Block A",
      status: "pending",
      createdAt: new Date(baseTime - 9 * day).toISOString(),
      updatedAt: new Date(baseTime - 9 * day).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 9 * day).toISOString(),
          byName: "Harpreet Singh",
        },
      ],
      replies: [],
    },
    // 5. Pending with Hindi description
    {
      id: "AH-1038",
      categoryId: "sweeping",
      subId: "garbage_pile",
      description:
        "पार्क नंबर 3 के मुख्य द्वार के सामने कई दिनों से सूखे पत्तों और प्लास्टिक कचरे का बड़ा ढेर लगा हुआ है।",
      photos: ["/demo/sweeping.svg"],
      location: "पार्क 3 गेट के पास, ब्लॉक डी",
      commonArea: true,
      reporterId: "res_5",
      reporterName: "Deepak Singhania",
      reporterFlat: "D-201, Block D",
      status: "pending",
      createdAt: new Date(baseTime - 1 * day).toISOString(),
      updatedAt: new Date(baseTime - 1 * day).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 1 * day).toISOString(),
          byName: "Deepak Singhania",
        },
      ],
      replies: [],
    },
    // 6. Pending - Sewage overflow
    {
      id: "AH-1037",
      categoryId: "sewage",
      subId: "manhole_overflow",
      description:
        "Manhole behind Block C row houses is overflowing with dirty foul water onto walking pavement.",
      photos: ["/demo/sewage.svg"],
      location: "Behind Block C-100 lane",
      commonArea: true,
      reporterId: "res_3",
      reporterName: "Meenakshi Sundaram",
      reporterFlat: "C-104, Block C",
      status: "pending",
      createdAt: new Date(baseTime - 5 * hour).toISOString(),
      updatedAt: new Date(baseTime - 5 * hour).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 5 * hour).toISOString(),
          byName: "Meenakshi Sundaram",
        },
      ],
      replies: [],
    },
    // 7. In progress - Rainwater drain waterlogging
    {
      id: "AH-1036",
      categoryId: "drainage",
      subId: "waterlogging",
      description:
        "Heavy waterlogging near roundabout even after light rain. Storm inlet grating blocked by silt.",
      photos: ["/demo/drainage.svg"],
      location: "Block E Central Roundabout",
      commonArea: true,
      reporterId: "res_6",
      reporterName: "Shalini Gupta",
      reporterFlat: "E-18, Block E",
      status: "in_progress",
      createdAt: new Date(baseTime - 2 * day).toISOString(),
      updatedAt: new Date(baseTime - 6 * hour).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 2 * day).toISOString(),
          byName: "Shalini Gupta",
        },
        {
          status: "in_progress",
          at: new Date(baseTime - 6 * hour).toISOString(),
          byName: "Rajesh Verma",
          note: "Drain cleaning team deployed with suction machine.",
        },
      ],
      replies: [
        {
          id: "rep_1036_1",
          byName: "Rajesh Verma",
          byRole: "member",
          text: "Work will be done today by afternoon.",
          at: new Date(baseTime - 6 * hour).toISOString(),
        },
      ],
    },
    // 8. In progress - Park fallen branch
    {
      id: "AH-1035",
      categoryId: "park",
      subId: "fallen_branch",
      description:
        "Large neem tree branch cracked and hanging dangerously over the pedestrian jogging track.",
      photos: ["/demo/park.svg"],
      location: "Community Park 1 Jogging Track",
      commonArea: true,
      reporterId: "res_8",
      reporterName: "Kavita Sethi",
      reporterFlat: "G-88, Block G",
      status: "in_progress",
      createdAt: new Date(baseTime - 18 * hour).toISOString(),
      updatedAt: new Date(baseTime - 3 * hour).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 18 * hour).toISOString(),
          byName: "Kavita Sethi",
        },
        {
          status: "in_progress",
          at: new Date(baseTime - 3 * hour).toISOString(),
          byName: "Anil Sharma",
          note: "Gardener Ramu instructed to safely cut branch.",
        },
      ],
      replies: [],
    },
    // 9. Resolved - Long Hindi description & full timeline
    {
      id: "AH-1034",
      categoryId: "street_light",
      subId: "light_not_working",
      description:
        "गली नंबर 4 के कोने पर लगी एलईडी लाइट पिछले 4 दिनों से लगातार बंद पड़ी है जिसके कारण रात में काफी अंधेरा रहता है।",
      photos: ["/demo/street_light.svg"],
      location: "गली नंबर 4, ब्लॉक बी",
      commonArea: true,
      reporterId: "res_10",
      reporterName: "Naveen Joshi",
      reporterFlat: "B-55, Block B",
      status: "resolved",
      createdAt: new Date(baseTime - 4 * day).toISOString(),
      updatedAt: new Date(baseTime - 1 * day).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 4 * day).toISOString(),
          byName: "Naveen Joshi",
        },
        {
          status: "in_progress",
          at: new Date(baseTime - 3 * day).toISOString(),
          byName: "Rajesh Verma",
          note: "New LED bulb requisitioned.",
        },
        {
          status: "resolved",
          at: new Date(baseTime - 1 * day).toISOString(),
          byName: "Rajesh Verma",
          note: "Choke and LED unit replaced. Working fine.",
        },
      ],
      replies: [],
    },
    // 10. Resolved - Pipe leakage
    {
      id: "AH-1033",
      categoryId: "water",
      subId: "pipe_leakage",
      description:
        "Sub-line valve leaking under ground near Block A parking lot.",
      photos: ["/demo/water.svg"],
      location: "Block A Covered Parking",
      commonArea: true,
      reporterId: "res_11",
      reporterName: "Tarun Bajaj",
      reporterFlat: "A-90, Block A",
      status: "resolved",
      createdAt: new Date(baseTime - 6 * day).toISOString(),
      updatedAt: new Date(baseTime - 3 * day).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 6 * day).toISOString(),
          byName: "Tarun Bajaj",
        },
        {
          status: "in_progress",
          at: new Date(baseTime - 5 * day).toISOString(),
          byName: "Rajesh Verma",
        },
        {
          status: "resolved",
          at: new Date(baseTime - 3 * day).toISOString(),
          byName: "Rajesh Verma",
          note: "Coupling clamp fixed.",
        },
      ],
      replies: [],
    },
    // 11. Resolved - Road swept
    {
      id: "AH-1032",
      categoryId: "sweeping",
      subId: "road_not_swept",
      description: "Main central road not swept after weekend storm.",
      photos: ["/demo/sweeping.svg"],
      location: "Sushant Lok 2 Central Avenue",
      commonArea: true,
      reporterId: "res_9",
      reporterName: "Mohit Bansal",
      reporterFlat: "C-402, Block C",
      status: "resolved",
      createdAt: new Date(baseTime - 7 * day).toISOString(),
      updatedAt: new Date(baseTime - 5 * day).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 7 * day).toISOString(),
          byName: "Mohit Bansal",
        },
        {
          status: "in_progress",
          at: new Date(baseTime - 6 * day).toISOString(),
          byName: "Rajesh Verma",
        },
        {
          status: "resolved",
          at: new Date(baseTime - 5 * day).toISOString(),
          byName: "Rajesh Verma",
          note: "Sweepers cleaned both avenues.",
        },
      ],
      replies: [],
    },
    // 12. Resolved - Park maintenance
    {
      id: "AH-1031",
      categoryId: "park",
      subId: "park_maintenance",
      description: "Broken bench slat near children swing area.",
      photos: ["/demo/park.svg"],
      location: "Park 2 Children Play Area",
      commonArea: true,
      reporterId: "res_14",
      reporterName: "Geeta Nambiar",
      reporterFlat: "F-33, Block F",
      status: "resolved",
      createdAt: new Date(baseTime - 10 * day).toISOString(),
      updatedAt: new Date(baseTime - 8 * day).toISOString(),
      statusHistory: [
        {
          status: "pending",
          at: new Date(baseTime - 10 * day).toISOString(),
          byName: "Geeta Nambiar",
        },
        {
          status: "in_progress",
          at: new Date(baseTime - 9 * day).toISOString(),
          byName: "Rajesh Verma",
        },
        {
          status: "resolved",
          at: new Date(baseTime - 8 * day).toISOString(),
          byName: "Rajesh Verma",
          note: "Carpenter fixed wooden slat.",
        },
      ],
      replies: [],
    },
  ];

  return {
    users,
    contacts,
    residents,
    notices,
    complaints,
    nextComplaintNumber: 1043,
  };
}
