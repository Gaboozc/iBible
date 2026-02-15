import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
  log: ['query'],
});

async function main() {
  console.log('🌱 Sembrando base de datos...');

  // Crear Testamentos
  const at = await prisma.testament.upsert({
    where: { slug: 'antiguo-testamento' },
    update: {},
    create: {
      name: 'Antiguo Testamento',
      nameEn: 'Old Testament',
      slug: 'antiguo-testamento',
      order: 1,
    },
  });

  const nt = await prisma.testament.upsert({
    where: { slug: 'nuevo-testamento' },
    update: {},
    create: {
      name: 'Nuevo Testamento',
      nameEn: 'New Testament',
      slug: 'nuevo-testamento',
      order: 2,
    },
  });

  console.log('✅ Testamentos creados:', { at: at.name, nt: nt.name });

  // Crear libro de Ezequiel (piloto)
  const ezequiel = await prisma.book.upsert({
    where: { slug: 'ezequiel' },
    update: {},
    create: {
      testamentId: at.id,
      name: 'Ezequiel',
      nameEn: 'Ezekiel',
      slug: 'ezequiel',
      abbreviation: 'Ez',
      order: 26,
      authorTraditional: 'Ezequiel hijo de Buzí',
      dateApproximate: '593-571 a.C.',
      literaryGenre: 'Profético, Apocalíptico',
      literaryGenreEn: 'Prophetic, Apocalyptic',
      originalAudience: 'Judíos en exilio babilónico',
      originalAudienceEn: 'Jews in Babylonian exile',
      centralTheme: 'La gloria de YHWH abandona y luego restaura a su pueblo',
      centralThemeEn: 'The glory of YHWH departs and then restores his people',
      historicalLocation: 'Exilio en Babilonia (Tel-Aviv, río Quebar)',
      historicalLocationEn: 'Babylonian Exile (Tel-Aviv, Kebar River)',
    },
  });

  console.log('✅ Libro creado:', ezequiel.name);

  // Crear Jonás (segundo libro piloto)
  const jonas = await prisma.book.upsert({
    where: { slug: 'jonas' },
    update: {},
    create: {
      testamentId: at.id,
      name: 'Jonás',
      nameEn: 'Jonah',
      slug: 'jonas',
      abbreviation: 'Jon',
      order: 32,
      authorTraditional: 'Jonás hijo de Amitai',
      dateApproximate: '760 a.C.',
      literaryGenre: 'Narrativo, Profético',
      literaryGenreEn: 'Narrative, Prophetic',
      originalAudience: 'Israel del Norte',
      originalAudienceEn: 'Northern Kingdom of Israel',
      centralTheme: 'La misericordia de Dios para todas las naciones',
      centralThemeEn: "God's mercy for all nations",
      historicalLocation: 'Nínive, capital de Asiria',
      historicalLocationEn: 'Nineveh, capital of Assyria',
    },
  });

  console.log('✅ Libro creado:', jonas.name);

  console.log('🎉 Base de datos inicializada correctamente');
}

main()
  .catch((e) => {
    console.error('❌ Error sembrando base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
