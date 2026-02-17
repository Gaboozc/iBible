type BibleVersion = 'rv1909' | 'kjv';

type BookDirMap = Record<string, { rv1909: string; kjv: string }>;

const PREFIXED_BOOK_DIRS: BookDirMap = {
  '1-samuel': { rv1909: '10-1sasparv1909', kjv: '10-1saeng-kjv2006' },
  '2-samuel': { rv1909: '11-2sasparv1909', kjv: '11-2saeng-kjv2006' },
  '1-kings': { rv1909: '12-1kisparv1909', kjv: '12-1kieng-kjv2006' },
  '2-kings': { rv1909: '13-2kisparv1909', kjv: '13-2kieng-kjv2006' },
  '1-chronicles': { rv1909: '14-1chsparv1909', kjv: '14-1cheng-kjv2006' },
  '2-chronicles': { rv1909: '15-2chsparv1909', kjv: '15-2cheng-kjv2006' },
  ezra: { rv1909: '16-ezrsparv1909', kjv: '16-ezreng-kjv2006' },
  nehemiah: { rv1909: '17-nehsparv1909', kjv: '17-neheng-kjv2006' },
  esther: { rv1909: '18-estsparv1909', kjv: '18-esteng-kjv2006' },
  job: { rv1909: '19-jobsparv1909', kjv: '19-jobeng-kjv2006' },
  hosea: { rv1909: '29-hossparv1909', kjv: '29-hoseng-kjv2006' },
  joel: { rv1909: '30-jolsparv1909', kjv: '30-joleng-kjv2006' },
  amos: { rv1909: '31-amosparv1909', kjv: '31-amoeng-kjv2006' },
  obadiah: { rv1909: '32-obasparv1909', kjv: '32-obaeng-kjv2006' },
  micah: { rv1909: '34-micsparv1909', kjv: '34-miceng-kjv2006' },
  nahum: { rv1909: '35-namsparv1909', kjv: '35-nameng-kjv2006' },
  habakkuk: { rv1909: '36-habsparv1909', kjv: '36-habeng-kjv2006' },
  zephaniah: { rv1909: '37-zepsparv1909', kjv: '37-zepeng-kjv2006' },
  haggai: { rv1909: '38-hagsparv1909', kjv: '38-hageng-kjv2006' },
  zechariah: { rv1909: '39-zecsparv1909', kjv: '39-zeceng-kjv2006' },
  malachi: { rv1909: '40-malsparv1909', kjv: '40-maleng-kjv2006' },
  '1-corinthians': { rv1909: '76-1cosparv1909', kjv: '76-1coeng-kjv2006' },
  '2-corinthians': { rv1909: '77-2cosparv1909', kjv: '77-2coeng-kjv2006' },
  galatians: { rv1909: '78-galsparv1909', kjv: '78-galeng-kjv2006' },
  ephesians: { rv1909: '79-ephsparv1909', kjv: '79-epheng-kjv2006' },
  philippians: { rv1909: '80-phpsparv1909', kjv: '80-phpeng-kjv2006' },
  colossians: { rv1909: '81-colsparv1909', kjv: '81-coleng-kjv2006' },
  '1-thessalonians': { rv1909: '82-1thsparv1909', kjv: '82-1theng-kjv2006' },
  '2-thessalonians': { rv1909: '83-2thsparv1909', kjv: '83-2theng-kjv2006' },
  '1-timothy': { rv1909: '84-1tisparv1909', kjv: '84-1tieng-kjv2006' },
  '2-timothy': { rv1909: '85-2tisparv1909', kjv: '85-2tieng-kjv2006' },
  titus: { rv1909: '86-titsparv1909', kjv: '86-titeng-kjv2006' },
  philemon: { rv1909: '87-phmsparv1909', kjv: '87-phmeng-kjv2006' },
  hebrews: { rv1909: '88-hebsparv1909', kjv: '88-hebeng-kjv2006' },
  james: { rv1909: '89-jassparv1909', kjv: '89-jaseng-kjv2006' },
  '1-peter': { rv1909: '90-1pesparv1909', kjv: '90-1peeng-kjv2006' },
  '2-peter': { rv1909: '91-2pesparv1909', kjv: '91-2peeng-kjv2006' },
  '1-john': { rv1909: '92-1jnsparv1909', kjv: '92-1jneng-kjv2006' },
  '2-john': { rv1909: '93-2jnsparv1909', kjv: '93-2jneng-kjv2006' },
  '3-john': { rv1909: '94-3jnsparv1909', kjv: '94-3jneng-kjv2006' },
  jude: { rv1909: '95-judsparv1909', kjv: '95-judeng-kjv2006' },
  revelation: { rv1909: '96-revsparv1909', kjv: '96-reveng-kjv2006' },
};

export const resolveBookDir = (version: BibleVersion, slug: string) => {
  const entry = PREFIXED_BOOK_DIRS[slug];
  if (entry) {
    return entry[version];
  }
  return slug;
};
