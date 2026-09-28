/**
 * BunkWise - Real Student Demo Dataset
 * Directly extracted from the student's actual college portal screenshots.
 * Overall Attendance: 89 / 137 = 64.96%
 */

const DEMO_DATA = {
  settings: {
    targetAttendance: 75,
    semester: "Semester 6 :: AI & Data Science",
    lastUpdated: new Date().toISOString(),
    demoQuotaLimit: 100,
    hfToken: "" // Optional user-provided token
  },

  subjects: [
    {
      id: "DSC04",
      code: "DSC04",
      name: "Coursera Track 4 (DSC04)",
      faculty: "Mrs. Gayatri Girish Asalkar (GGA)",
      type: "theory",
      attended: 7,
      conducted: 9,
      color: "#10B981"
    },
    {
      id: "DSC05",
      code: "DSC05",
      name: "Coursera Track 5 (DSC05)",
      faculty: "Mr. Vijaykumar Raghunath Ghule (VRG)",
      type: "theory",
      attended: 6,
      conducted: 7,
      color: "#059669"
    },
    {
      id: "DS3201_TH",
      code: "DS3201",
      name: "Deep Learning (Theory)",
      faculty: "Mrs. Dhammjyoti Vithalrao Dhawase (DVD)",
      type: "theory",
      attended: 15,
      conducted: 31,
      color: "#EF4444"
    },
    {
      id: "DS3201_LAB",
      code: "DS3201-Lab",
      name: "Deep Learning (Lab)",
      faculty: "Mrs. Dhammjyoti Vithalrao Dhawase (DVD)",
      type: "lab",
      attended: 9,
      conducted: 11,
      color: "#3B82F6"
    },
    {
      id: "DS3202_TH",
      code: "DS3202",
      name: "Prompt Engineering (Theory)",
      faculty: "Dr. Deepa Abin (DA)",
      type: "theory",
      attended: 14,
      conducted: 22,
      color: "#F59E0B"
    },
    {
      id: "DS3202_LAB",
      code: "DS3202-Lab",
      name: "Prompt Engineering (Lab)",
      faculty: "Priyanka Dhananjay More (PDM)",
      type: "lab",
      attended: 3,
      conducted: 7,
      color: "#EC4899"
    },
    {
      id: "DS3203A_TH",
      code: "DS3203A",
      name: "Computational Data (Theory)",
      faculty: "Mr. Keshav Gopinath Tambre (KGT)",
      type: "theory",
      attended: 18,
      conducted: 27,
      color: "#8B5CF6"
    },
    {
      id: "DS3203A_LAB",
      code: "DS3203A-Lab",
      name: "Computational Data (Lab)",
      faculty: "Mr. Keshav Gopinath Tambre (KGT)",
      type: "lab",
      attended: 9,
      conducted: 12,
      color: "#06B6D4"
    },
    {
      id: "DS3205",
      code: "DS3205",
      name: "Design Thinking (DT5)",
      faculty: "Shikha S Sharma (SSS)",
      type: "tutorial",
      attended: 8,
      conducted: 11,
      color: "#F97316"
    },
    {
      id: "MD3204",
      code: "MD3204",
      name: "Management (MGT)",
      faculty: "Mr. Vijaykumar Raghunath Ghule",
      type: "theory",
      attended: 0,
      conducted: 0,
      color: "#6B7280"
    },
    {
      id: "MM1501D",
      code: "MM1501D",
      name: "PLCM Course",
      faculty: "Dr. Avadhoot Umakant Rajurkar",
      type: "theory",
      attended: 0,
      conducted: 0,
      color: "#64748B"
    }
  ],

  timetable: [
    // --- TUESDAY ---
    {
      id: "tt_tue_1",
      day: "Tuesday",
      startTime: "13:00",
      endTime: "14:00",
      subjectId: "DS3203A_TH",
      subjectCode: "DS3203A",
      subjectName: "Computational Data (Theory)",
      type: "theory",
      faculty: "KGT",
      room: "D208"
    },
    {
      id: "tt_tue_2",
      day: "Tuesday",
      startTime: "14:00",
      endTime: "16:00",
      subjectId: "DS3203A_LAB",
      subjectCode: "DS3203A-Lab",
      subjectName: "Computational Data (Lab)",
      type: "lab",
      faculty: "KGT",
      room: "D207"
    },
    {
      id: "tt_tue_3",
      day: "Tuesday",
      startTime: "16:00",
      endTime: "18:00",
      subjectId: "DS3201_LAB",
      subjectCode: "DS3201-Lab",
      subjectName: "Deep Learning (Lab)",
      type: "lab",
      faculty: "DVD",
      room: "D205"
    },

    // --- WEDNESDAY ---
    {
      id: "tt_wed_1",
      day: "Wednesday",
      startTime: "11:00",
      endTime: "12:00",
      subjectId: "DSC04",
      subjectCode: "DSC04",
      subjectName: "Coursera Track 4",
      type: "theory",
      faculty: "GGA",
      room: "Online/D1"
    },
    {
      id: "tt_wed_2",
      day: "Wednesday",
      startTime: "12:00",
      endTime: "13:00",
      subjectId: "DSC05",
      subjectCode: "DSC05",
      subjectName: "Coursera Track 5",
      type: "theory",
      faculty: "VRG",
      room: "Online/D1"
    },
    {
      id: "tt_wed_3",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "15:00",
      subjectId: "DS3205",
      subjectCode: "DS3205",
      subjectName: "Design Thinking",
      type: "tutorial",
      faculty: "SSS",
      room: "Tutorial-2"
    },
    {
      id: "tt_wed_4",
      day: "Wednesday",
      startTime: "16:00",
      endTime: "18:00",
      subjectId: "DS3203A_TH",
      subjectCode: "DS3203A",
      subjectName: "Computational Data (Theory)",
      type: "theory",
      faculty: "KGT",
      room: "D201"
    },

    // --- THURSDAY ---
    {
      id: "tt_thu_1",
      day: "Thursday",
      startTime: "12:00",
      endTime: "14:00",
      subjectId: "DS3202_LAB",
      subjectCode: "DS3202-Lab",
      subjectName: "Prompt Engineering (Lab)",
      type: "lab",
      faculty: "PDM",
      room: "D206"
    },
    {
      id: "tt_thu_2",
      day: "Thursday",
      startTime: "15:00",
      endTime: "16:00",
      subjectId: "DS3202_TH",
      subjectCode: "DS3202",
      subjectName: "Prompt Engineering (Theory)",
      type: "theory",
      faculty: "DA",
      room: "D201"
    },

    // --- FRIDAY ---
    {
      id: "tt_fri_1",
      day: "Friday",
      startTime: "09:00",
      endTime: "10:00",
      subjectId: "DS3201_TH",
      subjectCode: "DS3201",
      subjectName: "Deep Learning (Theory)",
      type: "theory",
      faculty: "DVD",
      room: "D208"
    },
    {
      id: "tt_fri_2",
      day: "Friday",
      startTime: "11:00",
      endTime: "12:00",
      subjectId: "DS3201_TH",
      subjectCode: "DS3201",
      subjectName: "Deep Learning (Theory)",
      type: "theory",
      faculty: "DVD",
      room: "D208"
    },

    // --- SATURDAY ---
    {
      id: "tt_sat_1",
      day: "Saturday",
      startTime: "11:00",
      endTime: "12:00",
      subjectId: "DS3201_TH",
      subjectCode: "DS3201",
      subjectName: "Deep Learning (Theory)",
      type: "theory",
      faculty: "DVD",
      room: "D201"
    },
    {
      id: "tt_sat_2",
      day: "Saturday",
      startTime: "14:00",
      endTime: "15:00",
      subjectId: "DS3202_TH",
      subjectCode: "DS3202",
      subjectName: "Prompt Engineering (Theory)",
      type: "theory",
      faculty: "DA",
      room: "D201"
    }
  ],

  attendanceHistory: [
    {
      id: "hist_1",
      timestamp: new Date().toISOString(),
      dateString: "Today",
      subjectId: "DS3203A_TH",
      subjectCode: "DS3203A",
      action: "attended", // or 'skipped'
      previousAttended: 17,
      previousConducted: 26,
      newAttended: 18,
      newConducted: 27
    }
  ]
};

// Export to window if in browser
if (typeof window !== "undefined") {
  window.DEMO_DATA = DEMO_DATA;
}
