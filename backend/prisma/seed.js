const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.player.createMany({
		data: [
            { name: 'Player One', password: '23213' },
            { name: 'Player Two', password: 'password123' },
            { name: 'Player Three', password: 'qwerty' },
        ]
    });
	console.log('Users created successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
      await prisma.$disconnect();
  });
