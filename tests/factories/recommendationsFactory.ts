import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database.js';

export async function CreateManyRecomendations() {

    const x = Math.floor(Math.random()*6) + 4;
    
    for(let i = 0; i < x; i++) {
        await prisma.recommendation.create({
            data:{
                name: faker.name.firstName(),
                youtubeLink: faker.internet.url(),
                score: Math.floor(Math.random()*20)
            }
        })
    }  
}


