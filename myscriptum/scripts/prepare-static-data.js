const fs = require('fs');
const path = require('path');

console.log('📋 Preparing static Bible data for production...');

const dataDir = path.join(process.cwd(), 'data', 'bible');
const publicDir = path.join(process.cwd(), 'public', 'data');

// Create public/data if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('📁 Created public/data directory');
}

// Copy Bible data
const bibelDir = path.join(dataDir);
const targetBibleDir = path.join(publicDir, 'bible');

if (fs.existsSync(bibelDir)) {
  // Recursively copy
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      const stat = fs.statSync(srcFile);
      
      if (stat.isDirectory()) {
        copyDir(srcFile, destFile);
      } else {
        fs.copyFileSync(srcFile, destFile);
      }
    });
  };
  
  copyDir(bibelDir, targetBibleDir);
  console.log('✅ Bible data copied to public/data/bible');
} else {
  console.warn('⚠️  data/bible directory not found');
}

// Create featured-verses.json in public/data
const featuredVersesPath = path.join(publicDir, 'featured-verses.json');
const featuredVerses = [
  {"bookSlug": "john", "bookName": "Juan", "chapter": 3, "verse": 16, "text": "Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.", "version": "rv1909"},
  {"bookSlug": "john", "bookName": "John", "chapter": 3, "verse": 16, "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", "version": "kjv"},
  {"bookSlug": "psalms", "bookName": "Salmos", "chapter": 23, "verse": 1, "text": "JEHOVA es mi pastor; nada me faltará.", "version": "rv1909"},
  {"bookSlug": "psalms", "bookName": "Psalms", "chapter": 23, "verse": 1, "text": "The LORD is my shepherd; I shall not want.", "version": "kjv"},
  {"bookSlug": "proverbs", "bookName": "Proverbios", "chapter": 3, "verse": 5, "text": "Fíate de Jehová de todo tu corazón, Y no estribes en tu prudencia.", "version": "rv1909"},
  {"bookSlug": "proverbs", "bookName": "Proverbs", "chapter": 3, "verse": 5, "text": "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", "version": "kjv"},
  {"bookSlug": "romans", "bookName": "Romanos", "chapter": 8, "verse": 28, "text": "Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien, es á saber, á los que conforme al propósito son llamados.", "version": "rv1909"},
  {"bookSlug": "romans", "bookName": "Romans", "chapter": 8, "verse": 28, "text": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", "version": "kjv"},
  {"bookSlug": "philippians", "bookName": "Filipenses", "chapter": 4, "verse": 13, "text": "Todo lo puedo en Cristo que me fortalece.", "version": "rv1909"},
  {"bookSlug": "philippians", "bookName": "Philippians", "chapter": 4, "verse": 13, "text": "I can do all things through Christ which strengtheneth me.", "version": "kjv"},
  {"bookSlug": "jeremiah", "bookName": "Jeremías", "chapter": 29, "verse": 11, "text": "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.", "version": "rv1909"},
  {"bookSlug": "jeremiah", "bookName": "Jeremiah", "chapter": 29, "verse": 11, "text": "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", "version": "kjv"},
  {"bookSlug": "matthew", "bookName": "Mateo", "chapter": 28, "verse": 20, "text": "Enseñándoles que guarden todas las cosas que os he mandado: y he aquí, yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.", "version": "rv1909"},
  {"bookSlug": "matthew", "bookName": "Matthew", "chapter": 28, "verse": 20, "text": "Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.", "version": "kjv"},
  {"bookSlug": "isaiah", "bookName": "Isaías", "chapter": 40, "verse": 31, "text": "Mas los que esperan á Jehová tendrán nuevas fuerzas; levantarán las alas como águilas, correrán, y no se cansarán, caminarán, y no se fatigarán.", "version": "rv1909"},
  {"bookSlug": "isaiah", "bookName": "Isaiah", "chapter": 40, "verse": 31, "text": "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", "version": "kjv"},
  {"bookSlug": "genesis", "bookName": "Génesis", "chapter": 1, "verse": 1, "text": "EN el principio crió Dios los cielos y la tierra.", "version": "rv1909"},
  {"bookSlug": "genesis", "bookName": "Genesis", "chapter": 1, "verse": 1, "text": "In the beginning God created the heaven and the earth.", "version": "kjv"}
];

if (!fs.existsSync(featuredVersesPath)) {
  fs.writeFileSync(featuredVersesPath, JSON.stringify(featuredVerses, null, 2));
  console.log('✅ Created featured-verses.json');
}

console.log('🎉 Static data preparation complete!');
