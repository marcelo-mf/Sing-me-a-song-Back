import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { recommendationService } from '../../src/services/recommendationsService';
import { CreateOneRecomendation } from '../factories/recommendationsFactory.js';

describe("recommendation service unit tests", () => {
    it("should insert a recommendation", async () => {

        const recommendationData = await CreateOneRecomendation();

        jest.spyOn(recommendationRepository, "findByName").mockResolvedValue(null);
        const insertRecommendation = jest.spyOn(recommendationRepository, "create").mockResolvedValue(null);

        await recommendationService.insert(recommendationData)

        expect(insertRecommendation).toBeCalled();
        
    })
    
    // it("should decrease the number of votes", () => {
        
    // }) 

    // it("should get a random recommendation", () => {
        
    // })

    // it("shoukd get all Recommendations", () => {
        
    // })

    // it("should get a recommendations by its is", () => {
        
    // })

    // it("should get recommendations ordered by the number of votes", () => {
        
    // })                                                  
})

 