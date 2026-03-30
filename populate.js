import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bdqrzypwjrojkzbnhexs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2qXyP669Fm3gllbpEp3eow_psSzSLeo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const stewards = [
  "Sabi'u 001",
  "Mubarak 002",
  "Faith 003",
  "Abdulhafiz 004",
  "Musa 005",
  "Abbas 006",
  "Mustapha 007",
  "Favour 008"
];

const statuses = [
  "Cleaned", "Checkout", "In Progress", "Active Issues", "Occupied"
];

// Generate sample rooms
const generateRooms = () => {
  const rooms = [];

  // Ground Floor: Rooms 031-048 (18 rooms)
  const groundNumbers = Array.from({ length: 18 }, (_, i) => 31 + i);
  groundNumbers.forEach(num => {
    const numStr = num.toString().padStart(3, "0");
    rooms.push({
      number: numStr,
      floor: 0,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      steward: Math.random() > 0.3 ? stewards[Math.floor(Math.random() * stewards.length)] : null,
      last_cleaned: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      photo_url: null
    });
  });

  // Floor 1: Rooms 101-122 and 123-140 (40 rooms total)
  const floor1Numbers = [
    101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
    123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140
  ];
  floor1Numbers.forEach(num => {
    rooms.push({
      number: num.toString(),
      floor: 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      steward: Math.random() > 0.3 ? stewards[Math.floor(Math.random() * stewards.length)] : null,
      last_cleaned: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      photo_url: null
    });
  });

  // Floor 2: Rooms 201-221 and 222-240 (40 rooms total)
  const floor2Numbers = [
    201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221,
    222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240
  ];
  floor2Numbers.forEach(num => {
    rooms.push({
      number: num.toString(),
      floor: 2,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      steward: Math.random() > 0.3 ? stewards[Math.floor(Math.random() * stewards.length)] : null,
      last_cleaned: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      photo_url: null
    });
  });

  // Floor 3: Rooms 301-322 (excluding 317) and 323-329 (28 rooms total)
  const floor3Numbers = [
    301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 318, 319, 320, 321, 322,
    323, 324, 325, 326, 327, 328, 329
  ];
  floor3Numbers.forEach(num => {
    rooms.push({
      number: num.toString(),
      floor: 3,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      steward: Math.random() > 0.3 ? stewards[Math.floor(Math.random() * stewards.length)] : null,
      last_cleaned: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      photo_url: null
    });
  });

  return rooms;
};

// Populate database with sample data
const populateDatabase = async () => {
  try {
    console.log('Checking existing rooms...');
    const { data: existingRooms } = await supabase.from('rooms').select('id').limit(1);

    if (existingRooms && existingRooms.length > 0) {
      console.log('Database already has data. Skipping population.');
      return;
    }

    console.log('Populating rooms...');
    const rooms = generateRooms();
    const { error: roomsError } = await supabase.from('rooms').insert(rooms);

    if (roomsError) {
      console.error('Error inserting rooms:', roomsError);
      return;
    }

    console.log(`Successfully inserted ${rooms.length} rooms`);

    // Add some sample maintenance reports
    console.log('Adding sample maintenance reports...');
    const maintenanceReports = [
      {
        room_number: "234",
        issue_type: "AC/Heating",
        description: "Air conditioning not cooling properly. Temperature control seems unresponsive.",
        status: "Pending",
        photo_url: null
      },
      {
        room_number: "112",
        issue_type: "Tap/Plumbing",
        description: "Leaking faucet in bathroom sink",
        status: "In Progress",
        photo_url: null
      },
      {
        room_number: "305",
        issue_type: "TV/Electronics",
        description: "TV remote not working, needs battery replacement",
        status: "Resolved",
        photo_url: null,
        resolved_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    const { error: maintError } = await supabase.from('maintenance_reports').insert(maintenanceReports);

    if (maintError) {
      console.error('Error inserting maintenance reports:', maintError);
    } else {
      console.log('Successfully inserted maintenance reports');
    }

    // Add some sample missing items reports
    console.log('Adding sample missing items reports...');
    const missingItemsReports = [
      {
        room_number: "125",
        steward: "Mubarak 002",
        items: ["Towels (Bath)", "Bathrobe", "Slippers"],
        comment: "Items not found after guest checkout"
      },
      {
        room_number: "208",
        steward: "Faith 003",
        items: ["Remote Control", "Tea Cup"],
        comment: ""
      }
    ];

    const { error: missingError } = await supabase.from('missing_items_reports').insert(missingItemsReports);

    if (missingError) {
      console.error('Error inserting missing items reports:', missingError);
    } else {
      console.log('Successfully inserted missing items reports');
    }

    console.log('Database population complete!');

  } catch (error) {
    console.error('Error populating database:', error);
  }
};

// Run the population script
populateDatabase();