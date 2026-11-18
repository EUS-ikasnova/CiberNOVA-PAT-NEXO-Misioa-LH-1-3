import { BadgeDef, PreferenceItem } from '../types';

export const DEFAULT_MOODLE_URL =
  'https://ikasaula.educacion.navarra.es/fpysecundaria/mod/page/view.php?id=133139&forceview=1';

export const BADGES: BadgeDef[] = [
  {
    id: 1,
    missionNumber: 1,
    title: '1. misioa',
    name: 'Nortasunaren zaindaria',
    description: 'Zure avatar segurua egin duzu eta zure datuak babestu dituzu.',
    icon: '🛡️',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    id: 2,
    missionNumber: 2,
    title: '2. misioa',
    name: 'Elkarbizitzaren bihotza',
    description: 'Ikaskideak eta haien gustuak errespetatzen dakizu.',
    icon: '🤝',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 3,
    missionNumber: 3,
    title: '3. misioa',
    name: 'Pribatutasunaren giltza',
    description: 'Zer konta daitekeen eta zer gorde behar den ikasi duzu.',
    icon: '🔐',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 4,
    missionNumber: 4,
    title: '4. misioa',
    name: 'Konfiantzazko ahotsa',
    description: 'Sorpresa onak eta kontatu beharreko gauzak bereizten dakizu.',
    icon: '💓',
    gradient: 'from-violet-500 to-purple-600',
  },
];

export const FAMILY_OPTIONS = [
  { role: 'ama', label: 'Ama', avatarChar: '👩', roleDescription: 'Etxekoa' },
  { role: 'aita', label: 'Aita', avatarChar: '👨', roleDescription: 'Etxekoa' },
  { role: 'arreba', label: 'Ahizpa / Arreba', avatarChar: '👧', roleDescription: 'Etxekoa' },
  { role: 'neba', label: 'Anaia / Neba', avatarChar: '👦', roleDescription: 'Etxekoa' },
  { role: 'amona', label: 'Amona', avatarChar: '👵', roleDescription: 'Familia' },
  { role: 'aitona', label: 'Aitona', avatarChar: '👴', roleDescription: 'Familia' },
  { role: 'laguna-m', label: 'Laguna', avatarChar: '🧒', roleDescription: 'Eskolako laguna' },
  { role: 'laguna-n', label: 'Laguna', avatarChar: '👧', roleDescription: 'Eskolako laguna' },
  { role: 'txakurra', label: 'Txakurra', avatarChar: '🐶', roleDescription: 'Maskota' },
  { role: 'katua', label: 'Katua', avatarChar: '🐱', roleDescription: 'Maskota' },
];

export const PREFERENCE_ITEMS: PreferenceItem[] = [
  { id: 'saskibaloia', label: 'Saskibaloia', category: 'sport', emoji: '🏀', iconBg: 'bg-orange-500' },
  { id: 'futbola', label: 'Futbola', category: 'sport', emoji: '⚽', iconBg: 'bg-emerald-600' },
  { id: 'patinak', label: 'Patinak', category: 'sport', emoji: '🛹', iconBg: 'bg-cyan-600' },
  { id: 'igeriketa', label: 'Igeriketa', category: 'sport', emoji: '🏊', iconBg: 'bg-blue-500' },
  { id: 'bizikleta', label: 'Bizikleta', category: 'sport', emoji: '🚲', iconBg: 'bg-yellow-600' },
  { id: 'pizza', label: 'Pizza', category: 'food', emoji: '🍕', iconBg: 'bg-amber-600' },
  { id: 'tortilla', label: 'Patata-tortilla', category: 'food', emoji: '🥔', iconBg: 'bg-yellow-500' },
  { id: 'fruta', label: 'Sagarrak eta fruta', category: 'food', emoji: '🍎', iconBg: 'bg-red-500' },
  { id: 'barazkiak', label: 'Barazkiak', category: 'food', emoji: '🥦', iconBg: 'bg-green-600' },
  { id: 'izozkia', label: 'Izozkia', category: 'food', emoji: '🍦', iconBg: 'bg-pink-500' },
  { id: 'txakurrak', label: 'Txakurrak', category: 'animal', emoji: '🐕', iconBg: 'bg-amber-700' },
  { id: 'katuak', label: 'Katuak', category: 'animal', emoji: '🐈', iconBg: 'bg-indigo-500' },
  { id: 'dinosauroak', label: 'Dinosauroak', category: 'animal', emoji: '🦖', iconBg: 'bg-teal-600' },
  { id: 'izurdeak', label: 'Izurdeak', category: 'animal', emoji: '🐬', iconBg: 'bg-sky-500' },
  { id: 'armiarma', label: 'Armiarmak eta zomorroak', category: 'animal', emoji: '🕷️', iconBg: 'bg-slate-700' },
  { id: 'marraztea', label: 'Marraztea', category: 'hobby', emoji: '🎨', iconBg: 'bg-purple-600' },
  { id: 'irakurtzea', label: 'Ipuinak irakurtzea', category: 'hobby', emoji: '📚', iconBg: 'bg-blue-600' },
  { id: 'musika', label: 'Musika eta dantza', category: 'hobby', emoji: '🎵', iconBg: 'bg-rose-500' },
  { id: 'bideojokoak', label: 'Jolasak', category: 'hobby', emoji: '🎮', iconBg: 'bg-violet-600' },
  { id: 'blokeak', label: 'Blokeekin jolastea', category: 'hobby', emoji: '🧱', iconBg: 'bg-red-600' },
];

export interface QuizQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  emoji: string;
  voiceText: string;
  hint: string;
  explanation: string;
}

export const MISSION2_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    statement: 'Pertsona guztien gustuak eta itxura errespetatu behar ditugu.',
    isTrue: true,
    emoji: '🤝',
    voiceText: 'Pertsona guztien gustuak eta itxura errespetatu behar ditugu. Egia ala gezurra da?',
    hint: 'Zuri gustatzen zaizu besteek zu errespetatzea. Beste pertsonei ere bai. Elkar errespetatu behar al dugu?',
    explanation: 'Oso ongi! Denok merezi dugu errespetua, garen bezalakoak izateagatik.',
  },
  {
    id: 'q2',
    statement: 'Beti gu geu izan behar dugu, bai eskolan bai interneten.',
    isTrue: true,
    emoji: '🌟',
    voiceText: 'Beti gu geu izan behar dugu, bai eskolan bai interneten. Egia ala gezurra da?',
    hint: 'Onena zintzoa izatea eta itxurakeriarik ez egitea da. Egia al da?',
    explanation: 'Egia! Eskolan eta interneten beti gu geu izan behar dugu.',
  },
  {
    id: 'q3',
    statement: 'Nire lagunak bezalakoa izan behar dut.',
    isTrue: false,
    emoji: '🎨',
    voiceText: 'Nire lagunak bezalakoa izan behar dut. Egia ala gezurra da?',
    hint: 'Lagun bakoitzak bere gustuak ditu. Besteak kopiatu behar al ditugu?',
    explanation: 'Gezurra! Lagun bakoitza berezia da. Ez duzu inor kopiatu behar.',
  },
  {
    id: 'q4',
    statement: 'Pertsona guztiok berdinak gara.',
    isTrue: false,
    emoji: '🧩',
    voiceText: 'Pertsona guztiok berdinak gara. Egia ala gezurra da?',
    hint: 'Begiratu gelan: denek ile bera edo jolas bera al dugu gustuko?',
    explanation: 'Gezurra! Eskubide berak ditugu, baina pertsona bakoitza desberdina da.',
  },
  {
    id: 'q5',
    statement: 'Berezia naiz besteengandik desberdina naizelako.',
    isTrue: true,
    emoji: '💎',
    voiceText: 'Berezia naiz besteengandik desberdina naizelako. Egia ala gezurra da?',
    hint: 'Zure gustuak eta gauza onak zureak dira. Horrek berezi egiten al zaitu?',
    explanation: 'Egia! Desberdin izateak berezi egiten zaitu.',
  },
];

export const MISSION2_CELEBRATION_IMAGE = `${import.meta.env.BASE_URL}src/assets/images/mision2_elkarbizitza_scene_1795000013026.jpg`;

export interface StoryOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface StorySequence {
  id: number;
  timePosition: string;
  progressPercent: number;
  characterName: string;
  characterAvatar: string;
  sceneTitle: string;
  sceneContext: 'public' | 'private' | 'intimate';
  imagePath: string;
  storyScript: string;
  voiceScript: string;
  question: {
    prompt: string;
    voicePrompt: string;
    options: StoryOption[];
  };
}

export const MISSION3_SEQUENCES: StorySequence[] = [
  {
    id: 1,
    timePosition: '1/6',
    progressPercent: 17,
    characterName: 'Pixi eta Nexo parkean',
    characterAvatar: '👦🤖',
    sceneTitle: '1. eszena: Superheroiak parkean',
    sceneContext: 'public',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision3_seq1_parkea_1795000012136.jpg`,
    storyScript:
      'Gaur Pixi oso pozik dago. Nexo bere lagunarekin parkean dago. Mutil handiago batekin elkartu da, eta superheroi izatera jolastea gustatzen zaio.',
    voiceScript:
      'Gaur Pixi oso pozik dago eta Nexo bere lagunarekin parkean dago. Pixiri superheroi izatera jolastea gustatzen zaio. Nori kontatu ahal dio hori?',
    question: {
      prompt: 'Nori esan diezaioke superheroi izatera jolastea gustatzen zaiola?',
      voicePrompt: 'Nori esan diezaioke Pixik superheroi izatera jolastea gustatzen zaiola?',
      options: [
        {
          id: 'opt-1-1',
          text: 'Edonori.',
          isCorrect: true,
          feedback: 'Oso ongi! Zure jolasak eta gustuak lasai kontatu ditzakezu.',
        },
        {
          id: 'opt-1-2',
          text: 'Konfiantzazko norbaiti.',
          isCorrect: true,
          feedback: 'Hori ere ongi dago! Zure lagunei edo familiari kontatu diezaiekezu.',
        },
        {
          id: 'opt-1-3',
          text: 'Inori ez.',
          isCorrect: false,
          feedback: 'Pista: Zure jolasak ez dira sekretu txarrak. Gustukoak partekatzea polita da!',
        },
      ],
    },
  },
  {
    id: 2,
    timePosition: '2/6',
    progressPercent: 33,
    characterName: 'Mutil handiagoa',
    characterAvatar: '🧑‍🚀',
    sceneTitle: '2. eszena: Urtebetetze-festa',
    sceneContext: 'private',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision3_seq2_urtebetetzea_1795000013276.jpg`,
    storyScript:
      'Pixi lagun baten urtebetetzera doa, herriko igerilekura. Bidean, mutil handiagoak galdetu dio: "Nora zoaz hain pozik?".',
    voiceScript:
      'Pixi lagun baten urtebetetzera doa, herriko igerilekura. Bidean mutilak galdetu dio: Nora zoaz hain pozik? Zer erantzun behar du Pixik?',
    question: {
      prompt: 'Zer erantzun behar du Pixik?',
      voicePrompt: 'Zer erantzun behar du Pixik?',
      options: [
        {
          id: 'opt-2-1',
          text: 'Lagun baten urtebetetzera noa.',
          isCorrect: true,
          feedback: 'Primeran! Ezagutzen ez duzunari ez diozu esaten zein tokitara zoazen zehazki.',
        },
        {
          id: 'opt-2-2',
          text: 'Herriko igerilekura noa urtebetetzera.',
          isCorrect: false,
          feedback: 'Kontuz! Ez dugu esan behar non egongo garen ezezagunei.',
        },
      ],
    },
  },
  {
    id: 3,
    timePosition: '3/6',
    progressPercent: 50,
    characterName: 'Robot ezezaguna',
    characterAvatar: '🤖',
    sceneTitle: '3. eszena: Biharko plana',
    sceneContext: 'private',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision3_seq3_errobota_1795000013170.jpg`,
    storyScript:
      'Etxera itzultzean, Pixi eserleku batean eseri da. Robot ezezagun bat hurbildu da eta galdetu dio: "Zer egingo duzu bihar?".',
    voiceScript:
      'Pixi atseden hartzera eseri da. Robot ezezagun batek galdetu dio: Zer egingo duzu bihar? Zer erantzun behar du Pixik?',
    question: {
      prompt: 'Zer erantzun behar du Pixik?',
      voicePrompt: 'Zer erantzun behar du Pixik robot ezezagunari?',
      options: [
        {
          id: 'opt-3-1',
          text: 'Familiarekin pelikula bat ikustera noa.',
          isCorrect: true,
          feedback: 'Oso ongi! Plana esan duzu, baina ez non eta ez zein ordutan.',
        },
        {
          id: 'opt-3-2',
          text: 'Hondartzako zinemara noa arratsaldeko 7etan.',
          isCorrect: false,
          feedback: 'Kontuz! Ezezagunei ez zaie esaten zein ordutan eta non egongo garen.',
        },
      ],
    },
  },
  {
    id: 4,
    timePosition: '4/6',
    progressPercent: 67,
    characterName: 'Bizilaguna',
    characterAvatar: '👩‍🏫',
    sceneTitle: '4. eszena: Etxeko gauzak',
    sceneContext: 'private',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision3_seq4_bizilaguna_1795000013362.jpg`,
    storyScript:
      'Pixik etxean entzun du familia tableta erosiko dioten ala ez hitz egiten. Kalera atera denean, bizilagunak galdetu dio: "Non dago ama?".',
    voiceScript:
      'Pixik entzun du familia etxean tableta erosiko dioten ala ez hitz egiten. Kalean bizilagunak galdetu dio: Non dago ama? Zer erantzun behar du Pixik?',
    question: {
      prompt: 'Zer erantzun behar du Pixik?',
      voicePrompt: 'Zer erantzun behar du Pixik bizilagunari?',
      options: [
        {
          id: 'opt-4-1',
          text: 'Nire familia tableta erosiko didaten hitz egiten ari da.',
          isCorrect: true,
          feedback: 'Oso ongi! Etxeko gauza pribatuak etxean geratzen dira.',
        },
        {
          id: 'opt-4-2',
          text: 'Nire familia etxean haserre eztabaidatzen ari da tabletarengatik.',
          isCorrect: false,
          feedback: 'Gogoratu! Etxeko haserreak eta arazoak ez dira kalean kontatzen.',
        },
      ],
    },
  },
  {
    id: 5,
    timePosition: '5/6',
    progressPercent: 83,
    characterName: 'Gelako laguna',
    characterAvatar: '👧',
    sceneTitle: '5. eszena: Aitonaren bila',
    sceneContext: 'intimate',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision3_seq5_estazioa_1795000016456.jpg`,
    storyScript:
      'Pixi geltokira doa aitonaren bila. Bidean gelako lagun batekin elkartu da, eta honek galdetu dio: "Nora zoaz hain azkar?".',
    voiceScript:
      'Pixi geltokira doa aitonaren bila. Gelako lagunak galdetu dio: Nora zoaz hain azkar? Zer esan behar du Pixik?',
    question: {
      prompt: 'Zer esan behar du Pixik?',
      voicePrompt: 'Zer esan behar du Pixik gelako lagunari?',
      options: [
        {
          id: 'opt-5-1',
          text: 'Geltokira noa aitonaren bila.',
          isCorrect: true,
          feedback: 'Zuzen! Familiakoen osasuna gauza pribatua da.',
        },
        {
          id: 'opt-5-2',
          text: 'Geltokira noa oso gaixo dagoen nire aitonaren bila.',
          isCorrect: false,
          feedback: 'Kontuz! Osasunari buruzko gauzak ez dira besteei kontatu behar.',
        },
      ],
    },
  },
  {
    id: 6,
    timePosition: '6/6',
    progressPercent: 100,
    characterName: 'Pixi triste dago',
    characterAvatar: '💙',
    sceneTitle: '6. eszena: Barruko emozioak',
    sceneContext: 'intimate',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision3_seq6_emozioak_1795000017499.jpg`,
    storyScript:
      'Geltokian zain dagoela, Pixik amonaren argazkia ikusi du eta oso triste jarri da, negar egiteko gogoz. Nexo bere laguna hurbildu zaio.',
    voiceScript:
      'Pixi triste jarri da amona gogoratuta. Nori kontatu behar dio triste dagoela?',
    question: {
      prompt: 'Nori esan diezaioke Pixik triste dagoela?',
      voicePrompt: 'Nori esan diezaioke Pixik triste dagoela?',
      options: [
        {
          id: 'opt-6-1',
          text: 'Konfiantzazko norbaiti.',
          isCorrect: true,
          feedback: 'Oso ongi! Triste gaudenean ama, aita edo irakaslearekin hitz egin behar dugu.',
        },
        {
          id: 'opt-6-2',
          text: 'Edonori.',
          isCorrect: false,
          feedback: 'Ez! Barruko sentimenduak ez zaizkie ezezagunei kontatzen.',
        },
        {
          id: 'opt-6-3',
          text: 'Inori ez.',
          isCorrect: false,
          feedback: 'Tristura barruan gordetzea ez da ona. Eskatu laguntza konfiantzazko heldu bati!',
        },
      ],
    },
  },
];

export const MISSION3_RULES = [
  {
    number: 1,
    title: 'Gustuak eta jolasak (Publikoa)',
    description: 'Zure jolasak eta gustuak lasai kontatu ditzakezu.',
    tone: 'emerald' as const,
  },
  {
    number: 2,
    title: 'Tokiak eta orduak (Pribatua)',
    description: 'Ez esan ezezagunei non zauden edo zein ordutan joango zaren.',
    tone: 'amber' as const,
  },
  {
    number: 3,
    title: 'Etxea eta osasuna (Intimoa)',
    description: 'Etxeko kontuak eta osasun-gauzak etxean gordetzen dira.',
    tone: 'indigo' as const,
  },
  {
    number: 4,
    title: 'Zure emozioak (Konfiantza)',
    description: 'Triste edo beldur bazaude, esan beti ama, aita edo irakasleari.',
    tone: 'rose' as const,
  },
];

export interface SecretScenario {
  id: number;
  title: string;
  subtitle: string;
  imagePath?: string;
  fallbackType?: 'park-puppies';
  sceneText: string;
  promptText: string;
  explainPrompt: string;
  type: 'pleasant' | 'unpleasant';
  emotionLabel: string;
  mustTell: boolean;
  whyExplanation: string;
}

export const MISSION4_SECRETS: SecretScenario[] = [
  {
    id: 1,
    title: '1. egoera: Ahizparen oparia',
    subtitle: 'Urtebetetze-sorpresa',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision4_sec1_oparia_1795000018777.jpg`,
    sceneText: 'Nire familiak esan dit ahizpari jostailu bat oparituko diotela urtebetetzean.',
    promptText: 'Entzun eta esan nola sentitzen zaren:',
    explainPrompt: 'Esan zurekin dagoenari zergatik ematen dizun poza eta gorde behar den.',
    type: 'pleasant',
    emotionLabel: 'Poza eta ilusioa',
    mustTell: false,
    whyExplanation: 'Poza ematen digu! Sorpresa polita da eta gorde egiten dugu urtebetetzera arte.',
  },
  {
    id: 2,
    title: '2. egoera: Norbaitek min ematen dit',
    subtitle: 'Laguntza eskatzea',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision4_sec2_mina_1795000018164.jpg`,
    sceneText: 'Eskolan edo parkean norbaitek min egin dit, iraindu nau eta inori ez esateko esan dit.',
    promptText: 'Entzun eta esan nola sentitzen zaren:',
    explainPrompt: 'Esan zurekin dagoenari zergatik sentitzen zaren gaizki eta nori kontatu behar diozun.',
    type: 'unpleasant',
    emotionLabel: 'Tristura eta beldurra',
    mustTell: true,
    whyExplanation: 'Tristura eta beldurra ematen digu. Berehala esan behar diogu heldu bati, gu babesteko.',
  },
  {
    id: 3,
    title: '3. egoera: Lagunaren sorpresa-festa',
    subtitle: 'Gelako ospakizuna',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision4_sec3_festa_1795000017517.jpg`,
    sceneText: 'Gelan sorpresa-festa bat prestatzen ari gara gure lagunarentzat, biharko.',
    promptText: 'Entzun eta esan nola sentitzen zaren:',
    explainPrompt: 'Esan zergatik ematen dizun poza eta noiz arte gordeko dugun.',
    type: 'pleasant',
    emotionLabel: 'Poza eta dibertsioa',
    mustTell: false,
    whyExplanation: 'Poz handia ematen digu! Bihar arte gordeko dugu gure laguna pozteko.',
  },
  {
    id: 4,
    title: '4. egoera: Ezezaguna eta txakurtxoak',
    subtitle: 'Kontuz parkean',
    fallbackType: 'park-puppies',
    sceneText: 'Parkean pertsona ezezagun batek galdetu digu ea txakurtxoak ikusi nahi ditugun, eta inori ez esateko esan digu.',
    promptText: 'Entzun eta esan nola sentitzen zaren:',
    explainPrompt: 'Esan zergatik ematen dizun beldurra eta nori kontatu behar diozun berehala.',
    type: 'unpleasant',
    emotionLabel: 'Beldurra eta deserosotasuna',
    mustTell: true,
    whyExplanation: 'Beldurra ematen digu. Ez gara inoiz ezezagunekin joan behar, eta beti esan behar diogu heldu bati.',
  },
  {
    id: 5,
    title: '5. egoera: Amaren haurdunaldia',
    subtitle: 'Familiako albiste ona',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision4_sec5_haurdunaldia_1795000018381.jpg`,
    sceneText: 'Nire ama haurdun dago, baina oraindik etxekoek bakarrik dakigu.',
    promptText: 'Entzun eta esan nola sentitzen zaren:',
    explainPrompt: 'Esan zergatik ematen duen poza eta noiz kontatuko dugun.',
    type: 'pleasant',
    emotionLabel: 'Familiako poza',
    mustTell: false,
    whyExplanation: 'Poza ematen digu! Gorde egingo dugu familiak kontatzea erabaki arte.',
  },
  {
    id: 6,
    title: '6. egoera: Nahi gabeko musua patioan',
    subtitle: 'Gorputza errespetatzea',
    imagePath: `${import.meta.env.BASE_URL}src/assets/images/mision4_sec6_patioa_1795000019437.jpg`,
    sceneText: 'Patioan ikaskide batek musu bat eman dio lagun bati. Berak ez zuen nahi, eta beldur da irakasleari esateko.',
    promptText: 'Entzun eta esan nola sentitzen zaren:',
    explainPrompt: 'Esan zergatik den garrantzitsua irakasleari edo familiari kontatzea.',
    type: 'unpleasant',
    emotionLabel: 'Deserosotasuna eta beldurra',
    mustTell: true,
    whyExplanation: 'Deserosotasuna eta beldurra ematen ditu. Inork ez du guk nahi ez dugunik egin behar; beti esan heldu bati.',
  },
];
