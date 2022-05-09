import { prisma } from "../src/database.js";

async function main() {

    await prisma.recommendation.createMany({
        data: [
            {name: 'Free Fall - Illenium', youtubeLink: 'https://www.youtube.com/watch?v=DfLqy83UHk8', score: 10},
            {name: 'Bones - Imagine Dragons', youtubeLink: 'https://www.youtube.com/watch?v=TO-_3tck2tg', score: 7},
            {name: 'Heat Waves - Glass Animals', youtubeLink: 'https://www.youtube.com/watch?v=mRD0-GxqHVo', score: 3}
        ],
        skipDuplicates: true 
    })
    
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })