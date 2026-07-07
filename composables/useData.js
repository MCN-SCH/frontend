import { Brain, Cpu, Database, Globe, Shield, Users } from 'lucide-vue-next'

export const researchAreas = [
  {
    title: 'AI & Machine Learning',
    korean: '인공지능',
    desc: 'Advanced AI algorithms for real-world applications.',
    features: ['Deep Learning', 'Computer Vision', 'NLP'],
    icon: 'Brain',
    color: 'from-purple-500 to-pink-500',
    stats: '15+ Papers',
  },
  {
    title: 'Network Design',
    korean: 'HCI 연구',
    desc: 'Intuitive interfaces for next-gen digital experiences.',
    features: ['Accessibility'],
    icon: 'Users',
    color: 'from-blue-500 to-cyan-400',
    stats: '10 Projects',
  },
  {
    title: 'Security',
    korean: '보안',
    desc: 'Threat detection and privacy technologies.',
    features: ['Blockchain', 'Cryptography', 'Zero Trust'],
    icon: 'Shield',
    color: 'from-green-500 to-emerald-400',
    stats: '8 Patents',
  },
  {
    title: 'Big Data Analytics',
    korean: '빅데이터',
    desc: 'Processing massive datasets for insights.',
    features: ['Real-time', 'Data Mining', 'Visualization'],
    icon: 'Database',
    color: 'from-orange-500 to-red-500',
    stats: '12TB+ Data',
  },
  {
    title: 'Quantum Computing',
    korean: '양자 컴퓨팅',
    desc: 'Quantum algorithms and applications.',
    features: ['Quantum ML', 'Simulation', 'Algorithms'],
    icon: 'Cpu',
    color: 'from-indigo-500 to-purple-600',
    stats: '5 Research',
  },
]

export const professorInfo = {
  name: 'Professor Kim Seokhoon',
  title: 'Professor, Ph.D.',

  currentPositions: [
    {
      position: 'Supervisor',
      organization: 'Mobile Computing & Networking Laboratory',
    },
    {
      position: 'Professor',
      department: 'Computer Software Engineering',
      organization: 'Soonchunhyang University',
    },
  ],

  education: [
    {
      degree: 'Doctor of Philosophy (Ph.D.)',
      field: 'Computer Engineering',
      institution: 'Kyung Hee University',
      startYear: 2000,
      endYear: 2004,
    },
    {
      degree: 'Bachelor of Engineering (B.E.)',
      field: 'Computer Engineering',
      institution: 'Kyung Hee University',
      startYear: 1995,
      endYear: 2000,
    },
  ],

  researchInterests: [
    'Cloud Computing',
    'Mobile Edge Computing',
    'Internet of Things (IoT)',
    'Heterogeneous Internet of Things',
    'Software Defined Networking (SDN)',
    'Network Function Virtualization (NFV)',
    'Mobile Systems and Communications',
    'Machine Learning',
    'Big Data',
  ],

  profile: `Professor Kim Seokhoon received his B.E. and Ph.D. in Computer Engineering from Kyung Hee University, Korea, in 2000 and 2004, respectively. From 2004 to 2006, he worked at IPOne, Inc. as a Research Engineer. From 2006 to 2009, he worked at Neowave, Inc., where he developed Mobile WiMAX (IEEE 802.16) devices. He later served as a Research Professor and Postdoctoral Researcher at Kyung Hee University and as an Assistant Professor at Changshin University. Since 2016, he has been with Soonchunhyang University. His research interests include Cloud and Mobile Edge Computing, IoT, SDN, NFV, Mobile Systems, and Machine Learning based on Big Data.`,

  experiences: [
    {
      period: '2016 - Present',
      position: 'Professor',
      organization: 'Soonchunhyang University',
      department: 'Computer Software Engineering',
    },
    {
      period: '2013 - 2016',
      position: 'Assistant Professor',
      organization: 'Changshin University',
      department: 'Mobile Communications Engineering',
    },
    {
      period: '2011 - 2013',
      position: 'Research Professor',
      organization: 'Kyung Hee University',
      department: 'Computer Engineering',
    },
    {
      period: '2009 - 2011',
      position: 'Postdoctoral Researcher',
      organization: 'Kyung Hee University',
      department: 'RU-IPTV Research Center',
    },
    {
      period: '2006 - 2009',
      position: 'Research Engineer',
      organization: 'Neowave Inc.',
      department: 'Technology Lab',
    },
    {
      period: '2004 - 2006',
      position: 'Research Engineer',
      organization: 'IPOne, Inc.',
      department: 'Technology Lab',
    },
  ],
}

export const labMembers = [
  {
    id: 1,
    name: 'Professor Kim Seokhoon',
    role: 'Professor, Lab Director',
    education: 'Ph.D. in Computer Engineering from Kyunghee University.',
    bio: 'Leading research in artificial intelligence and machine learning with applications in healthcare.',
    image: '/images/members/seokhoon_kim.jpg',
    expertise: [
      'Machine Learning',
      'Deep Learning',
      'Computer Vision',
      'Healthcare AI',
    ],
    publications: 42,
    projects: 8,
    year: 2015,
    email: 'jane.kim@snu.ac.kr',
    website: 'https://cs.snu.ac.kr/professor/jane-kim',
    linkedin: 'https://linkedin.com/in/janekim',
  },
  {
    id: 2,
    name: 'Dr. Minho Park',
    role: 'Postdoctoral Researcher',
    education: 'Ph.D. in Electrical Engineering, KAIST',
    bio: 'Researching neuromorphic computing and brain-inspired AI systems.',
    image: '/members/minho-park.jpg',
    expertise: [
      'Neuromorphic Computing',
      'Spiking Neural Networks',
      'Hardware Acceleration',
    ],
    publications: 18,
    projects: 4,
    year: 2021,
    email: 'minho.park@snu.ac.kr',
  },
  {
    id: 3,
    name: 'Soojin Lee',
    role: 'PhD Student',
    education: 'M.S. in Computer Science, Soonchunhyang University',
    bio: 'Developing explainable AI methods for medical diagnostics.',
    image: '/members/soojin-lee.jpg',
    expertise: [
      'Explainable AI',
      'Medical Imaging',
      'Interpretability',
      'Deep Learning',
    ],
    publications: 6,
    projects: 3,
    year: 2020,
    email: 'soojin.lee@snu.ac.kr',
  },
  {
    id: 4,
    name: 'Jiwon Choi',
    role: 'Masters Student',
    education: 'B.S. in Computer Engineering, POSTECH',
    bio: 'Working on federated learning for privacy-preserving healthcare applications.',
    image: '/members/jiwon-choi.jpg',
    expertise: [
      'Federated Learning',
      'Privacy',
      'Healthcare AI',
      'Distributed Systems',
    ],
    publications: 2,
    projects: 2,
    year: 2022,
    email: 'jiwon.choi@snu.ac.kr',
  },
  {
    id: 5,
    name: 'Yongjun Kim',
    role: 'Undergraduate Research Assistant',
    education:
      'B.S. in Computer Science, Soonchunhyang University (Expected 2024)',
    bio: 'Assisting in data preprocessing and model evaluation for various AI projects.',
    image: '/members/yongjun-kim.jpg',
    expertise: [
      'Python',
      'Data Analysis',
      'Machine Learning',
      'Software Engineering',
    ],
    publications: 0,
    projects: 2,
    year: 2023,
    email: 'yongjun.kim@snu.ac.kr',
  },

  // ALUMNI MEMBERS
  {
    id: 100,
    name: 'Dr. Seunghee Han',
    role: 'Alumni: PhD Graduate',
    status: 'alumni',
    education: 'Ph.D. in Computer Science, Soonchunhyang University',
    currentPosition: 'Research Scientist at Google Brain',
    bio: 'Former PhD student specializing in reinforcement learning and robotics.',
    image: '/members/seunghee-han.jpg',
    alumniContribution:
      'Developed novel RL algorithms for robotic manipulation, published 8 papers during PhD.',
    expertise: [
      'Reinforcement Learning',
      'Robotics',
      'Control Systems',
      'Deep RL',
    ],
    publications: 12,
    projects: 5,
    startYear: 2017,
    endYear: 2022,
    email: 'seunghee.han@gmail.com',
    website: 'https://sites.google.com/view/seunghee-han',
    linkedin: 'https://linkedin.com/in/seunghee-han',
  },
  {
    id: 101,
    name: 'Dr. Hyunwoo Lee',
    role: 'Alumni: Postdoctoral Researcher',
    status: 'alumni',
    education: 'Ph.D. in Computer Vision, KAIST',
    currentPosition: 'Assistant Professor at Yonsei University',
    bio: 'Former postdoc working on 3D computer vision and autonomous driving.',
    image: '/members/hyunwoo-lee.jpg',
    alumniContribution:
      'Led the autonomous vehicle perception project, secured national research grant.',
    expertise: [
      '3D Computer Vision',
      'Autonomous Driving',
      'Point Cloud Processing',
      'SLAM',
    ],
    publications: 25,
    projects: 6,
    startYear: 2019,
    endYear: 2021,
    email: 'hyunwoo.lee@yonsei.ac.kr',
    website: 'https://cvlab.yonsei.ac.kr/professor/hyunwoo-lee',
  },
  {
    id: 102,
    name: 'Minji Park',
    role: 'Alumni: Masters Graduate',
    status: 'alumni',
    education: 'M.S. in Computer Science, Soonchunhyang University',
    currentPosition: 'AI Engineer at Samsung Research',
    bio: 'Former Masters student focusing on natural language processing.',
    image: '/members/minji-park.jpg',
    alumniContribution:
      "Developed Korean language models for Samsung's Bixby assistant.",
    expertise: [
      'Natural Language Processing',
      'Korean NLP',
      'Transformers',
      'Chatbots',
    ],
    publications: 4,
    projects: 3,
    startYear: 2020,
    endYear: 2022,
    email: 'minji.park@samsung.com',
    linkedin: 'https://linkedin.com/in/minji-park-samsung',
  },
  {
    id: 103,
    name: 'Dr. Jaeho Kim',
    role: 'Alumni: PhD Graduate',
    status: 'alumni',
    education: 'Ph.D. in Computer Science, Soonchunhyang University',
    currentPosition: 'Senior AI Researcher at Naver AI Lab',
    bio: 'Former PhD student working on multimodal learning and vision-language models.',
    image: '/members/jaeho-kim.jpg',
    alumniContribution:
      'Developed Korean multimodal datasets and models used widely in industry.',
    expertise: [
      'Multimodal Learning',
      'Vision-Language Models',
      'Korean AI',
      'CLIP',
    ],
    publications: 15,
    projects: 4,
    startYear: 2016,
    endYear: 2021,
    email: 'jaeho.kim@navercorp.com',
    website: 'https://clova.ai/researcher/jaeho-kim',
  },
  {
    id: 104,
    name: 'Sora Yoon',
    role: 'Alumni: Undergraduate Researcher',
    status: 'alumni',
    education: 'B.S. in Computer Science, Soonchunhyang University',
    currentPosition: 'PhD Student at MIT CSAIL',
    bio: 'Former undergraduate researcher working on fairness in machine learning.',
    image: '/members/sora-yoon.jpg',
    alumniContribution:
      'Published first-author paper on algorithmic fairness as an undergraduate.',
    expertise: [
      'Algorithmic Fairness',
      'Ethical AI',
      'Bias Detection',
      'ML Ethics',
    ],
    publications: 3,
    projects: 2,
    startYear: 2020,
    endYear: 2022,
    email: 'sora.yoon@mit.edu',
    website: 'https://sora-yoon.github.io',
  },
  {
    id: 105,
    name: 'Dr. Taeyoung Kim',
    role: 'Alumni: Visiting Scholar',
    status: 'alumni',
    education: 'Ph.D. in Robotics, Carnegie Mellon University',
    currentPosition: 'Professor at KAIST Robotics Department',
    bio: 'Former visiting scholar collaborating on robot learning projects.',
    image: '/members/taeyoung-kim.jpg',
    alumniContribution:
      'Established international collaboration between SNU and CMU robotics labs.',
    expertise: [
      'Robot Learning',
      'Manipulation',
      'Sim2Real',
      'Policy Learning',
    ],
    publications: 8,
    projects: 3,
    startYear: 2020,
    endYear: 2021,
    email: 'taeyoung.kim@kaist.ac.kr',
    website: 'https://robot.kaist.ac.kr/professor/taeyoung-kim',
  },
  {
    id: 106,
    name: 'Hyejin Cho',
    role: 'Alumni: Masters Graduate',
    status: 'alumni',
    education: 'M.S. in Computer Science, Soonchunhyang University',
    currentPosition: 'Data Scientist at Coupang',
    bio: 'Former Masters student working on recommendation systems and personalization.',
    image: '/members/hyejin-cho.jpg',
    alumniContribution:
      'Developed novel recommendation algorithms now used in production at Coupang.',
    expertise: [
      'Recommendation Systems',
      'Personalization',
      'E-commerce',
      'A/B Testing',
    ],
    publications: 3,
    projects: 2,
    startYear: 2019,
    endYear: 2021,
    email: 'hyejin.cho@coupang.com',
    linkedin: 'https://linkedin.com/in/hyejin-cho-coupang',
  },
  {
    id: 107,
    name: 'Dr. Youngmin Park',
    role: 'Alumni: PhD Graduate',
    status: 'alumni',
    education: 'Ph.D. in Computer Science, Soonchunhyang University',
    currentPosition: 'Founder & CEO of DeepLearning AI Startup',
    bio: 'Former PhD student working on efficient deep learning models for edge devices.',
    image: '/members/youngmin-park.jpg',
    alumniContribution:
      'Founded successful AI startup based on PhD research, raised $10M in funding.',
    expertise: [
      'Efficient AI',
      'Edge Computing',
      'Model Compression',
      'Startup',
    ],
    publications: 10,
    projects: 4,
    startYear: 2015,
    endYear: 2020,
    email: 'youngmin@edgeai.co.kr',
    website: 'https://edgeai.co.kr',
    linkedin: 'https://linkedin.com/in/youngmin-park-edgeai',
  },
  {
    id: 108,
    name: 'Jieun Lee',
    role: 'Alumni: Undergraduate Researcher',
    status: 'alumni',
    education: 'B.S. in Electrical Engineering, Soonchunhyang University',
    currentPosition: 'Software Engineer at Meta AI',
    bio: 'Former undergraduate researcher working on AI for social good applications.',
    image: '/members/jieun-lee.jpg',
    alumniContribution:
      'Developed AI tools for disaster response that won international competitions.',
    expertise: [
      'AI for Social Good',
      'Disaster Response',
      'Computer Vision',
      'Software Engineering',
    ],
    publications: 2,
    projects: 2,
    startYear: 2021,
    endYear: 2023,
    email: 'jieun.lee@meta.com',
    linkedin: 'https://linkedin.com/in/jieun-lee-meta',
  },
]

export const recentPublications = [
  {
    title: 'Vehicle Record Management Using Permissioned Blockchain Network',
    authors: 'La Seavyong, Chea Daly, Kim Minjun',
    venue: 'IEEE Transactions on Dependable and Secure Computing (TDSC)',
    year: '2024',
    impact: 'SCI, IF: 6.4',
    link: 'https://doi.org/10.1109/TDSC.2024.123456',
    award: 'Best Paper Candidate',
    badge: 'Blockchain',
    abstract:
      'Proposes a novel blockchain-based system for secure and efficient vehicle record management.',
    citations: 12,
    status: 'Published',
  },
  {
    title: 'Federated Learning for Privacy-Preserving Healthcare Applications',
    authors: 'Choi Jiwon, Lee Soojin, Kim Jane',
    venue: 'Journal of Medical Internet Research (JMIR)',
    year: '2023',
    impact: 'SCI, IF: 5.2',
    link: 'https://doi.org/10.2196/45678',
    award: 'Top Cited Paper 2023',
    badge: 'Federated Learning',
    abstract:
      'Explores federated learning techniques to enable collaborative healthcare data analysis while preserving patient privacy.',
    citations: 30,
    status: 'Published',
  },
  // ... other publications
]

export const achievements = [
  {
    count: '20+',
    label: 'Graduate Students',
    description: 'Mentored in cutting-edge research projects',
    icon: '👨‍🎓',
    color: '#00897B',
  },
  {
    count: '100+',
    label: 'Research Papers',
    description: 'International Publications',
    icon: '📄',
    color: '#2196F3',
  },
  {
    count: '50+',
    label: 'Projects',
    description: 'Completed & Ongoing',
    icon: '🚀',
    color: '#FF9800',
  },
  {
    count: '30+',
    label: 'Patents',
    description: 'Registered & Pending',
    icon: '⚡',
    color: '#9C27B0',
  },
  {
    count: '15+',
    label: 'Countries',
    description: 'Collaborations Worldwide',
    icon: '🌏',
    color: '#F44336',
  },
  // ... other achievements
]

export const currentProjects = [
  {
    title: 'AI-Driven Edge Computing for Smart Cities',
    funding: 'National Research Foundation of Korea (NRF)',
    duration: '2023 - 2026',
    description:
      'Developing AI algorithms optimized for edge devices to enhance smart city applications.',
    teamMembers: 5,
    progress: 60,
    image: '/projects/smart-city.jpg',
  },
  // ... other projects
]

export const facilities = [
  {
    name: 'High-Performance Computing Lab',
    description:
      'Equipped with state-of-the-art servers and GPUs for large-scale simulations and data processing.',
    image: '/facilities/hpc-lab.jpg',
  },
  {
    name: 'AI Research Lab',
    description:
      'Dedicated space for AI algorithm development and testing with collaborative workstations.',
    image: '/facilities/ai-lab.jpg',
  },
  {
    name: 'Virtual Reality Lab',
    description:
      'Facility for developing and testing AR/VR applications with advanced headsets and motion tracking.',
    image: '/facilities/vr-lab.jpg',
  },
  {
    name: 'Networking Lab',
    description:
      'Focused on research in network security, cryptography, and threat detection technologies.',
    image: '/facilities/cybersecurity-lab.jpg',
  }
  // ... other facilities
]

export const newsUpdates = [
  {
    date: '2024-05-15',
    title: 'Lab Receives Major Grant for Edge Computing Research',
    content:
      'Our lab has been awarded a significant grant from the National Research Foundation of Korea to advance edge computing technologies.',
    link: '/news/edge-computing-grant',
  },
  // ... other news
]

export const upcomingEvents = [
  {
    date: '2024-07-10',
    title: 'International Workshop on Cloud Computing',
    description:
      'Join us for a workshop featuring leading experts discussing the latest trends in cloud computing.',
    location: 'Engineering Bldg. 101',
    link: '/events/cloud-computing-workshop',
  },
  // ... other events
]

export const resources = [
  {
    type: 'Dataset',
    title: 'Edge Computing Benchmark Dataset',
    description:
      'A comprehensive dataset for benchmarking edge computing algorithms and systems.',
    link: 'https://example.com/datasets/edge-computing-benchmark',
  },
  // ... other resources
]

// Export all data
export default {
  researchAreas,
  labMembers,
  recentPublications,
  achievements,
  currentProjects,
  facilities,
  newsUpdates,
  upcomingEvents,
  resources,
}
