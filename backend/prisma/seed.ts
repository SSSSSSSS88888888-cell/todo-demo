import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const subjectsData = [
  {
    name: '算数',
    color: '#3B82F6',
    order: 1,
    units: ['数と計算', '図形', '測定', 'データの活用', '文章題', '割合と比'],
  },
  {
    name: '国語',
    color: '#EF4444',
    order: 2,
    units: ['漢字', '読解(物語文)', '読解(説明文)', '文法', '語彙', '作文'],
  },
  {
    name: '理科',
    color: '#10B981',
    order: 3,
    units: ['物質とエネルギー', '生命', '地球と宇宙', '実験・観察'],
  },
  {
    name: '社会',
    color: '#F59E0B',
    order: 4,
    units: ['地理', '歴史', '公民', '時事問題'],
  },
];

async function main() {
  console.log('Seeding database...');

  for (const subjectData of subjectsData) {
    const subject = await prisma.subject.upsert({
      where: { name: subjectData.name },
      update: { color: subjectData.color, order: subjectData.order },
      create: {
        name: subjectData.name,
        color: subjectData.color,
        order: subjectData.order,
      },
    });

    for (let i = 0; i < subjectData.units.length; i++) {
      await prisma.unit.upsert({
        where: {
          subjectId_name: {
            subjectId: subject.id,
            name: subjectData.units[i],
          },
        },
        update: { order: i + 1 },
        create: {
          name: subjectData.units[i],
          order: i + 1,
          subjectId: subject.id,
        },
      });
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
