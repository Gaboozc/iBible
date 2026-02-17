import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

// Catalog of all books with chapter counts
const bibilioBooksChapters: Record<string, number> = {
  genesis: 50,
  exodus: 40,
  leviticus: 27,
  numbers: 36,
  deuteronomy: 34,
  joshua: 24,
  judges: 21,
  ruth: 4,
  '1-samuel': 31,
  '2-samuel': 24,
  '1-kings': 22,
  '2-kings': 25,
  '1-chronicles': 29,
  '2-chronicles': 36,
  ezra: 10,
  nehemiah: 13,
  esther: 10,
  job: 42,
  psalms: 150,
  proverbs: 31,
  ecclesiastes: 12,
  'song-of-songs': 8,
  isaiah: 66,
  jeremiah: 52,
  lamentations: 5,
  ezekiel: 48,
  daniel: 12,
  hosea: 14,
  joel: 3,
  amos: 9,
  obadiah: 1,
  jonah: 4,
  micah: 7,
  nahum: 3,
  habakkuk: 3,
  zephaniah: 3,
  haggai: 2,
  zechariah: 14,
  malachi: 4,
  matthew: 28,
  mark: 16,
  luke: 24,
  john: 21,
  acts: 28,
  romans: 16,
  '1-corinthians': 16,
  '2-corinthians': 13,
  galatians: 6,
  ephesians: 6,
  philippians: 4,
  colossians: 4,
  '1-thessalonians': 5,
  '2-thessalonians': 3,
  '1-timothy': 6,
  '2-timothy': 4,
  titus: 3,
  philemon: 1,
  hebrews: 13,
  james: 5,
  '1-peter': 5,
  '2-peter': 3,
  '1-john': 5,
  '2-john': 1,
  '3-john': 1,
  jude: 1,
  revelation: 22,
};

function generateAnalysisData(book: string, chapter: number) {
  return {
    title: `Análisis Estructural de ${book.charAt(0).toUpperCase() + book.slice(1)} ${chapter}`,
    sections: [
      {
        verses: `1-${Math.min(10, chapter)}`,
        title: 'Introducción y Contexto',
        description: `Este segmento presenta la introducción y contexto general del capítulo ${chapter}.`,
        significance:
          'Establece el marco y la dirección del pasaje que seguirá a continuación.',
      },
      {
        verses: `${Math.min(11, chapter)}-${Math.min(20, chapter * 2)}`,
        title: 'Desarrollo Principal',
        description: `La sección central desarrolla los temas clave presentados en la introducción.`,
        significance: 'Contiene los mensajes y narrativas más importantes del capítulo.',
      },
      {
        verses: `${Math.min(21, chapter * 2 + 1)}-final`,
        title: 'Conclusión y Aplicación',
        description: `Los versículos finales resumen y aplican los temas tratados en el capítulo.`,
        significance: 'Proporciona las lecciones prácticas y espirituales de la sección.',
      },
    ],
    repeatedWords: [
      {
        word: 'Patrón temático recurrente',
        count: 2,
        significance:
          'Este concepto aparece múltiples veces, enfatizando su importancia en el pasaje.',
      },
      {
        word: 'Motivo literario',
        count: 2,
        significance: 'Estructura literaria que refuerza el mensaje del autor.',
      },
    ],
  };
}

function generateContextData(book: string, chapter: number) {
  return {
    period: 'Período bíblico general',
    dominantEmpire: 'Contexto geográfico y histórico variado',
    kingName: 'Según contexto histórico del libro',
    kingRegion: 'Región de Palestina y alrededores',
    activeProphets: ['Profetas según el período'],
    templeStatus: 'Según la era histórica del libro',
    location: 'Tierra de Israel',
    summary: `${book.charAt(0).toUpperCase() + book.slice(1)} capítulo ${chapter} presenta narrativas, enseñanzas, o salmos que forman parte de la revelación bíblica. Este capítulo se sitúa en el contexto histórico y teológico del libro en su conjunto, contribuyendo a los temas generales de la obra.`,
    spiritualContext:
      'La espiritualidad de este capítulo refleja los valores y enseñanzas bíblicas centrales: fe en Dios, obediencia, arrepentimiento, redención y transformación espiritual. Los temas teológicos del capítulo continúan el mensaje divino a través de la historia bíblica.',
  };
}

function generateEtymologyData(book: string, chapter: number) {
  return [
    {
      hebrew: 'דָּבָר (dabar)',
      english: 'word, matter, thing',
      literalMeaning: 'aquello que se dice o se hace',
      primaryMeaning: 'Una palabra hablada; un asunto o cuestión',
      theologicalMeaning:
        'En la teología bíblica, "dabar" es fundamental - la palabra de Dios es creativa y poderosa. Dios habla y las cosas existen.',
      root: 'Raíz primitiva, posiblemente relacionada con el movimiento o la acción',
      cognates: ['dibrah (palabra)', 'dober (hablador)'],
      semanticEvolution: 'La palabra ha mantenido su significado core a través del hebreo antiguo y moderno.',
      relatedWords: ['amar (decir)', 'lashon (lengua)', 'kol (voz)'],
      keyAppearances: [`${book} ${chapter}`],
      biblicalFrequency: 1440,
    },
  ];
}

function generateConnectionsData(book: string, chapter: number) {
  return [
    {
      type: 'thematic' as const,
      reference: 'Referencias temáticas en la Biblia',
      title: 'Tema Central del Capítulo',
      description: `Este capítulo conecta con el tema general del libro de ${book}.`,
    },
    {
      type: 'historical' as const,
      reference: `${book} ${chapter}`,
      title: 'Conexión Histórica',
      description: 'Este pasaje se sitúa en un momento clave de la historia bíblica.',
    },
  ];
}

function generateQuestionsData(book: string, chapter: number) {
  return [
    {
      stage: 'observation',
      question: `¿Cuáles son los personajes, lugares y eventos principales en ${book} ${chapter}?`,
      guidance:
        'Lee cuidadosamente el texto y anota: ¿Quiénes hablan? ¿Dónde ocurre? ¿Qué acciones suceden? No interpretes aún, solo observa.',
    },
    {
      stage: 'observation',
      question: `¿Qué palabras o frases se repiten en este capítulo?`,
      guidance:
        'Busca patrones lingüísticos que el autor enfatiza. Las repeticiones indican importancia teológica.',
    },
    {
      stage: 'interpretation',
      question: `¿Cuál es el mensaje central o propósito de ${book} ${chapter}?`,
      guidance:
        'Considera el contexto del libro entero. ¿Cómo se relaciona este capítulo con los capítulos anteriores y posteriores?',
    },
    {
      stage: 'interpretation',
      question: `¿Qué nos enseña este capítulo sobre la naturaleza de Dios?`,
      guidance: 'Busca atributos divinos revelados: poder, amor, justicia, misericordia, etc.',
    },
    {
      stage: 'application',
      question: `¿Cómo puedo aplicar las enseñanzas de ${book} ${chapter} a mi vida hoy?`,
      guidance: 'Busca verdades prácticas que cambien tu forma de pensar, sentir o actuar.',
    },
  ];
}

async function generateAllAnalysisFiles() {
  console.log('🔧 Generando archivos de análisis para todos los capítulos...\n');

  let totalCreated = 0;
  let skipped = 0;

  for (const [book, chapters] of Object.entries(bibilioBooksChapters)) {
    console.log(`📖 ${book}: ${chapters} capítulos`);

    for (let chapter = 1; chapter <= chapters; chapter++) {
      const analysisDir = path.join(process.cwd(), 'data', 'bible', 'analysis', book);
      const contextDir = path.join(process.cwd(), 'data', 'bible', 'context', book);
      const etymologyDir = path.join(process.cwd(), 'data', 'bible', 'etymology', book);
      const connectionsDir = path.join(process.cwd(), 'data', 'bible', 'connections', book);
      const questionsDir = path.join(process.cwd(), 'data', 'bible', 'questions', book);

      // Create directories if they don't exist
      [analysisDir, contextDir, etymologyDir, connectionsDir, questionsDir].forEach((dir) => {
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      });

      // Skip if files already exist (don't overwrite)
      const analysisFile = path.join(analysisDir, `${chapter}.json`);
      if (existsSync(analysisFile)) {
        skipped++;
        continue;
      }

      try {
        // Generate and write analysis data
        writeFileSync(analysisFile, JSON.stringify(generateAnalysisData(book, chapter), null, 2));
        writeFileSync(
          path.join(contextDir, `${chapter}.json`),
          JSON.stringify(generateContextData(book, chapter), null, 2)
        );
        writeFileSync(
          path.join(etymologyDir, `${chapter}.json`),
          JSON.stringify(generateEtymologyData(book, chapter), null, 2)
        );
        writeFileSync(
          path.join(connectionsDir, `${chapter}.json`),
          JSON.stringify(generateConnectionsData(book, chapter), null, 2)
        );
        writeFileSync(
          path.join(questionsDir, `${chapter}.json`),
          JSON.stringify(generateQuestionsData(book, chapter), null, 2)
        );

        totalCreated++;
      } catch (error) {
        console.error(`❌ Error creating files for ${book} ${chapter}:`, error);
      }
    }
    console.log(`   ✅ Completado\n`);
  }

  console.log(`\n📊 Resumen:`);
  console.log(`✅ Archivos creados: ${totalCreated}`);
  console.log(`⏭️  Archivos omitidos (ya existentes): ${skipped}`);
  console.log(`🎉 Total de capítulos: ${Object.values(bibilioBooksChapters).reduce((a, b) => a + b, 0)}`);
}

generateAllAnalysisFiles().catch(console.error);
