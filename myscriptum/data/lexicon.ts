export type LexiconLanguage = 'hebrew' | 'greek';

export interface LexiconEntry {
  id: string;
  lemma: string;
  transliteration: string;
  language: LexiconLanguage;
  strong?: string;
  gloss_es: string;
  gloss_en: string;
  origin_es: string;
  origin_en: string;
  usage_es: string;
  usage_en: string;
  related: string[];
}

export const lexiconEntries: LexiconEntry[] = [
  {
    id: 'kavod',
    lemma: 'kavod',
    transliteration: 'kavod',
    language: 'hebrew',
    strong: 'H3519',
    gloss_es: 'gloria, peso, importancia, honor',
    gloss_en: 'glory, weight, importance, honor',
    origin_es: 'De una raiz que indica peso o gravedad; paso de lo fisico a lo simbolico.',
    origin_en: 'From a root meaning weight or heaviness; moved from physical to symbolic meaning.',
    usage_es: 'Describe la gloria de Dios como algo con peso y valor real.',
    usage_en: 'Describes the glory of God as something with weight and real value.',
    related: ['kavad', 'kabed'],
  },
  {
    id: 'hesed',
    lemma: 'hesed',
    transliteration: 'hesed',
    language: 'hebrew',
    strong: 'H2617',
    gloss_es: 'misericordia, pacto, lealtad',
    gloss_en: 'mercy, covenant loyalty, steadfast love',
    origin_es: 'Expresa amor leal dentro de una relacion de pacto.',
    origin_en: 'Expresses loyal love within a covenant relationship.',
    usage_es: 'Usado para describir la fidelidad de Dios a su pueblo.',
    usage_en: 'Used to describe God\'s faithfulness to his people.',
    related: ['emet', 'ahavah'],
  },
  {
    id: 'ruach',
    lemma: 'ruach',
    transliteration: 'ruach',
    language: 'hebrew',
    strong: 'H7307',
    gloss_es: 'viento, aliento, espiritu',
    gloss_en: 'wind, breath, spirit',
    origin_es: 'Termino fisico que paso a describir la vida y la presencia divina.',
    origin_en: 'A physical term that came to describe life and divine presence.',
    usage_es: 'Puede referirse al aliento humano o al Espiritu de Dios.',
    usage_en: 'Can refer to human breath or the Spirit of God.',
    related: ['neshamah'],
  },
  {
    id: 'logos',
    lemma: 'logos',
    transliteration: 'logos',
    language: 'greek',
    strong: 'G3056',
    gloss_es: 'palabra, mensaje, razon',
    gloss_en: 'word, message, reason',
    origin_es: 'Del verbo lego: reunir, decir. Base filosofica y teologica.',
    origin_en: 'From lego: to gather, to say. Philosophical and theological base.',
    usage_es: 'En Juan 1 describe a Cristo como la Palabra eterna.',
    usage_en: 'In John 1 describes Christ as the eternal Word.',
    related: ['rhema'],
  },
  {
    id: 'agape',
    lemma: 'agape',
    transliteration: 'agape',
    language: 'greek',
    strong: 'G26',
    gloss_es: 'amor sacrificial, amor de pacto',
    gloss_en: 'sacrificial love, covenant love',
    origin_es: 'Termino elevado para el amor que se entrega por el otro.',
    origin_en: 'Elevated term for love that gives itself for others.',
    usage_es: 'Caracteriza el amor de Dios y el amor cristiano.',
    usage_en: 'Characterizes God’s love and Christian love.',
    related: ['phileo', 'eros'],
  },
];
