import 'dotenv/config'; 
import { prisma } from '../src/utils/prisma';

async function main() {
  await prisma.application.create({
    data: {
      companyName: "Spotify",
      jobTitle: "Fullstack Developer",
      jobUrl: "https://www.spotifyjobs.com/",
      status: "Applied",
      matchScore: 9,
      notes: "Referral from Anders.",
      dateApplied: new Date(),
    },
  });
  console.log("Seed data created!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());