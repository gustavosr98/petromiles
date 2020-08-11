import { shallowMount, createLocalVue  } from "@vue/test-utils";
import BuyPointForm from "@/components/Payments/BuyPointsForm.vue";

import Vuetify from 'vuetify'

const localVue = createLocalVue()

/*************** Mocking Translations functions ***************/
const $tc = () => {}
const $t = () => {}
/**************************************************************/


describe("Testing BuyPointsForm component", () => {

    let vuetify

    beforeEach(() => {
        vuetify = new Vuetify()
      })

    const wrapper = shallowMount(BuyPointForm, {
        mocks:{ $tc, $t },    
        localVue,
        vuetify,
    })            

    it("assign 50 points", () => {
        wrapper.setData({ points: 500 });        
        expect(wrapper.vm.points).toBe(500);
    })    

    it("Tests PREMIUM extra points", () => {
        const data = {
            points: 500,            
            subscription: {
                name: "PREMIUM"
            },
            infoSubscription: {
                percentage: 20,
                points: 100
            }
        }
        const extraPoints = BuyPointForm.computed.extraPoints.call(data);
        expect(extraPoints).toBe(100);
    })

    it("Tests GOLD extra points", () => {
        const data = {
            points: 500,            
            subscription: {
                name: "GOLD"
            },
            infoSubscription: {
                percentage: 30,
                points: 100
            }
        }
        const extraPoints = BuyPointForm.computed.extraPoints.call(data);
        expect(extraPoints).toBe(250);
    })

    it("Calculates rawCost", () => {
        const data = {
            points: 500,
            onePointToDollars: 2
        }        
        const calc = BuyPointForm.computed.rawCost.call(data);
        expect(calc).toBe(1000);
    })

    it("Calculates interests", () => {
        const data = {
            points: 500,
            rawCost: 0,
            onePointToDollars: 2,
            interests: [
                {
                    operation: 1,
                    amount: 75,
                    percentage: 0
                },
                {
                    operation: 1,
                    amount: 0,
                    percentage: 0.015
                }
            ]
        }
        data.rawCost = BuyPointForm.computed.rawCost.call(data);        
        const costWithInterests = BuyPointForm.computed.costWithInterests.call(data);        
        expect(costWithInterests).toBe(1015.75);
    })

    it("Executes buyPoints method correctly", async () => {
        const buyPoints = jest.fn();
        wrapper.setMethods({ buyPoints: buyPoints });
        wrapper.find("v-btn.confirm-btn").trigger("click");
        await wrapper.vm.$nextTick()
        expect(buyPoints).toHaveBeenCalled();        
    })
    
})