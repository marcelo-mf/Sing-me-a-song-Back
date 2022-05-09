import supertest from "supertest"
import app from "../../src/app.js"
import { prisma } from "../../src/database.js"
import { CreateManyRecomendations } from "../factories/recommendationsFactory.js"

describe("Sing-me-a-song integraton test", () => {

    describe("GET /", () => {
        it("shoul return all musics", async() => {

            await CreateManyRecomendations();

            const numberOfRecommendations = (await prisma.recommendation.findMany()).length;
            const response = await supertest(app).get("/recommendations/");

            expect(response.status).toEqual(200);
            expect(response.body.length).toEqual(numberOfRecommendations);
        })
    })

    describe("GET /random", () => {
        it("shoul return a random music", async() => {

            const response = await supertest(app).get("/recommendations/random");

            let x = 0;

            const r1 = await supertest(app).get("/recommendations/random");
            const r2 = await supertest(app).get("/recommendations/random");
            const r3 = await supertest(app).get("/recommendations/random");

            if(r1.body === r2.body && r2.body === r3){x = 1}

            expect(response.status).toEqual(200);
            expect(x).toEqual(0)
        })
    })

    describe("GET /top/:amount", () => {
        it("shoul return top musics", async() => {

            const amount = Math.floor(Math.random()*10);

            const topRecommendations = await prisma.recommendation.findMany({
                orderBy: {score: 'desc'},
                take: amount
            })
            
            const response = await supertest(app).get(`/recommendations/top/${amount}`);

            expect(response.status).toEqual(200);
            expect(response.body).toEqual(topRecommendations);
        })
    })

    describe("GET /:id", () => {
        it("shoul return music by id", async() => {

            const recommendation = await prisma.recommendation.findFirst();
            const response = await supertest(app).get(`/recommendations/${recommendation.id}`);

            expect(response.status).toEqual(200);
            expect(response.body).toEqual(recommendation);
        })
    })

    describe("POST /recommendations", () => {

        const recommendation = {
            name: "The Chainsmokers - Don't Let Me Down",
            youtubeLink: 'https://www.youtube.com/watch?v=Io0fBr1XBUA'
        }

        beforeEach(async () => {
            await prisma.$executeRaw`TRUNCATE TABLE recommendations`
        })

        it("shoul add a music", async() => {

            const response = await supertest(app).post(`/recommendations`).send(recommendation);

            const createdRecommendation = await prisma.recommendation.findFirst({
                where: {
                    name: recommendation.name,
                    youtubeLink: recommendation.youtubeLink
                }
            })

            expect(response.status).toEqual(201);
            expect(createdRecommendation).not.toBeNull();
        })
    })

    describe("POST /:id/upvote", () => {
        it("shoul increase the number of votes in 1", async() => {

            const recommendation = await prisma.recommendation.findFirst();
            const response = await supertest(app).post(`/recommendations/${recommendation.id}/upvote`);
            const updatedRecommendation = await prisma.recommendation.findUnique({
                where: {
                    id: recommendation.id
                }
            })

            expect(response.status).toEqual(200);
            expect(recommendation.score + 1).toEqual(updatedRecommendation.score);
        })
    })

    describe("POST /:id/downvote", () => {
        it("shoul decrease the number of votes in 1", async() => {

            const recommendation = await prisma.recommendation.findFirst();
            const response = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
            const updatedRecommendation = await prisma.recommendation.findUnique({
                where: {
                    id: recommendation.id
                }
            })

            expect(response.status).toEqual(200);
            expect(recommendation.score - 1).toEqual(updatedRecommendation.score);
        })
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    })

})