import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {PlatformInterestService} from "@/modules/management/services/platform-interest.service";
import {ThirdPartyInterest} from "@/entities/third-party-interest.entity";
import {PlatformInterest} from "@/entities/platform-interest.entity";
import {WinstonModule} from "nest-winston";
import createOptions from "@/logger/winston/winston-config";
import {PaymentProvider} from "@/enums/payment-provider.enum";
import * as Stripe from "stripe";
import {TransactionType} from "@/enums/transaction.enum";


describe('platformInterestService', ()=>{
    let platformInterestService: PlatformInterestService;
    let RepositoryMock : jest.Mock;
    let thirdPartyInterestRepository: Repository<ThirdPartyInterest>;
    let platformInterestRepository: Repository<PlatformInterest>;

    beforeEach(()=>{
        RepositoryMock = jest.fn( () => ({
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            query: jest.fn(),
        }));
    });

    beforeEach( async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                WinstonModule.forRoot(
                    createOptions({ fileName: 'petromiles-global.log' }),
                ),
            ],
            providers: [
                PlatformInterestService,
                {
                    provide: getRepositoryToken(PlatformInterest),
                    useClass: RepositoryMock,
                },
                {
                    provide: getRepositoryToken(ThirdPartyInterest),
                    useClass: RepositoryMock,
                },
            ],
        }).compile();

        platformInterestService = module.get<PlatformInterestService>(PlatformInterestService);
        platformInterestRepository = module.get(getRepositoryToken(PlatformInterest));
        thirdPartyInterestRepository = module.get(getRepositoryToken(ThirdPartyInterest));
    });

    describe('endLast(idPointsConversion)', ()=>{
        let expectedFindOne;
        let expectedCurrentPoint;
        let idPlatformInterest;
        let result;

        describe('Case: success', ()=>{
            describe('whe everything works well', ()=>{
                beforeEach(async  ()=>{
                    expectedFindOne = {
                        idPlatformInterest:2,
                        onePointEqualsDollars:"0.00166666666667",
                        initialDate:"2020-08-12T04:00:00.000Z",
                        finalDate:null,
                    };
                    idPlatformInterest = 2;
                    expectedCurrentPoint ={
                        onePointEqualsDollars:0.005,
                        finalDate:null,
                        idPointsConversion:3,
                        initialDate:"2020-08-12T04:00:00.000Z"
                    };


                    (platformInterestRepository.findOne as jest.Mock).mockResolvedValue(
                        expectedFindOne,
                    );
                    (platformInterestRepository.save as jest.Mock).mockResolvedValue(
                        expectedCurrentPoint,
                    );

                    result = await platformInterestService.endLast(
                        idPlatformInterest,
                    );
                });

                it('should invoke pointsConversionRepository.findOne ',  ()=>{
                    expect(platformInterestRepository.findOne).toHaveBeenCalledTimes(1);
                    expect(platformInterestRepository.findOne).toHaveBeenCalledWith(
                        {idPlatformInterest},
                    );
                });
                it('should return endLast',  ()=> {
                    expect(result).toStrictEqual(expectedCurrentPoint);
                });
            });
        });
    });

    describe('verifyCorrectAmount(amount, name)', ()=>{
        let name;
        let amount;
        let expectedFind;
        let retorno;
        let result;
        describe(' case: success', ()=>{
            describe('whe everything works well', ()=>{
                beforeEach(async ()=>{
                    expectedFind = {
                        idThirdPartyInterest:1,
                        name:"Transaction Interest",
                        transactionType:"deposit",
                        paymentProvider:"STRIPE",amountDollarCents:75,
                        percentage:null,
                        initialDate:"2020-08-12T04:00:00.000Z",
                        finalDate:null,
                    };
                    amount = 300;
                    name = 'verification';
                    retorno = true;

                    (thirdPartyInterestRepository.findOne as jest.Mock).mockResolvedValue(
                        expectedFind,
                    );

                    result = await platformInterestService.verifyCorrectAmount(
                        amount,
                        name,
                    )
                });
                it('should invoke thirdPartyInterestRepository.findOne ',  () =>{
                    expect(thirdPartyInterestRepository.findOne).toHaveBeenCalledTimes(1);
                    expect(thirdPartyInterestRepository.findOne).toHaveBeenCalledWith(
                        {
                            where: {
                                paymentProvider: PaymentProvider.STRIPE,
                                transactionType: TransactionType.DEPOSIT,
                                finalDate: null
                            },
                        }
                    );
                });
                it('should return if its verified',  () =>{
                    expect(result).toStrictEqual(retorno);
                });
            });
        });
    });
});