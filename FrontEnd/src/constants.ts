export const INTERESTS = ["Fiction", "Non-fiction", "Poetry", "Biographies", "Classics", "Science Fiction", "Fantasy", "Mystery", "Thriller", "Romance", "Historical Fiction", "Young Adult", "Children's Literature", "Comic Books", "Manga", "Creative Writing", "Journalism", "Blogging", "Painting", "Drawing", "Sculpture", "Photography", "Film", "Theater", "Dance", "Music", "Classical Music", "Jazz", "Rock", "Pop", "Hip Hop", "Electronic Music", "Opera", "Ballet", "Modern Art", "Contemporary Art", "Art History", "Museums", "Physics", "Chemistry", "Biology", "Astronomy", "Geology", "Environmental Science", "Computer Science", "Artificial Intelligence", "Machine Learning", "Robotics", "Cybersecurity", "Blockchain", "Virtual Reality", "Augmented Reality", "Quantum Computing", "Biotechnology", "Nanotechnology", "Psychology", "Sociology", "Anthropology", "Philosophy", "History", "Archaeology", "Political Science", "Economics", "Linguistics", "Education", "Law", "Ethics", "Religion", "Mythology", "Nutrition", "Fitness", "Yoga", "Meditation", "Mental Health", "Alternative Medicine", "Sports Medicine", "Public Health", "Football", "Basketball", "Baseball", "Soccer", "Tennis", "Golf", "Swimming", "Cycling", "Running", "Hiking", "Camping", "Fishing", "Hunting", "Skiing", "Snowboarding", "Surfing", "Rock Climbing", "Martial Arts", "Cooking", "Baking","Languages", "Geography", "Entrepreneurship", "Startups", "Marketing", "Finance", "Investing", "Real Estate", "E-commerce", "Cryptocurrency", "Gardening", "Knitting",  "Woodworking", "Metalworking", "Pottery", "Jewelry Making", "Origami", "Scrapbooking", "Video Games", "Board Games", "Chess", "Puzzles", "Programming", "Web Development", "Mobile App Development", "3D Printing", "Drones", "Wildlife Conservation", "Climate Change", "Sustainability", "Renewable Energy", "Organic Farming", "Animal Rights", "Marine Biology", "Botany", "Human Rights", "Social Justice", "Volunteering", "Philanthropy", "Community Service", "Activism", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Software Engineering", "Data Science", "DevOps", "Cloud Computing", "Internet of Things", "Big Data", "Network Security", "Embedded Systems", "Automation", "Control Systems", "Telecommunications", "Aerospace", "Automotive", "Biomedical", "Chemical Engineering", "Materials Science", "System Design", "Industry", "Manufacturing", "Nanomaterials", "Renewable Resources", "Smart Cities", "Urban Planning", "Geo", "Hydrology", "Seismology", "Transport", "Water"];

export const badges = [
    { 
      name: "Rising Blogger", 
      description: "Published your first article on ReadMates.", 
      type: "rising-blogger" as const, 
      earned: true,
      progress: 100,
      points: 50,
      category: "Writing"
    },
    { 
      name: "Pro Contributor", 
      description: "Published 10+ articles.", 
      type: "pro-contributor" as const, 
      earned: false,
      progress: 4,
      points: 100,
      category: "Writing"
    },
    { 
      name: "Tech Guru", 
      description: "Published 25+ high-rated articles.", 
      type: "tech-guru" as const, 
      earned: false,
      progress: 12,
      points: 250,
      category: "Writing"
    },
    { 
      name: "Avid Reader", 
      description: "Completed reading 5 articles.", 
      type: "avid-reader" as const, 
      earned: true,
      progress: 100,
      points: 75,
      category: "Reading"
    },
    { 
      name: "Deep Diver", 
      description: "Spent 10+ hours reading.", 
      type: "deep-diver" as const, 
      earned: false,
      progress: 40,
      points: 150,
      category: "Reading"
    },
    { 
      name: "Top Critic", 
      description: "Provided valuable feedback on 10+ articles.", 
      type: "top-critic" as const, 
      earned: false,
      progress: 6,
      points: 200,
      category: "Community"
    },
    { 
      name: "Community Builder", 
      description: "Started or engaged in 10+ discussions.", 
      type: "community-builder" as const, 
      earned: true,
      progress: 100,
      points: 125,
      category: "Community"
    },
    { 
      name: "Helper", 
      description: "Engaged with 5 'Ask the Author' queries.", 
      type: "helper" as const, 
      earned: false,
      progress: 2,
      points: 100,
      category: "Community"
    },
    { 
      name: "First Steps", 
      description: "Completed the onboarding process.", 
      type: "first-steps" as const, 
      earned: true,
      progress: 100,
      points: 25,
      category: "Milestone"
    },
    { 
      name: "Streak Keeper", 
      description: "Maintained a 7-day engagement streak.", 
      type: "streak-keeper" as const, 
      earned: false,
      progress: 3,
      points: 175,
      category: "Milestone"
    }
  ];
  