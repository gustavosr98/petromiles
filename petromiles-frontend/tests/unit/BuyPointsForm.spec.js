import { shallowMount, mount, config  } from "@vue/test-utils";
import BuyPointForm from "@/components/Payments/BuyPointsForm.vue";

/*************** Mocking Translations functions ***************/
const $tc = () => {}
const $t = () => {}
/**************************************************************/


describe("Testing BuyPointsForm component", () => {
    const wrapper = shallowMount(BuyPointForm, {
        mocks:{ $tc, $t }
    })

    it('has a button', () => {
        expect(wrapper.contains('v-btn')).toBe(true)
    })

    it("assign 50 points", () => {
        wrapper.setData({ points: 500 });
        console.log("Dollars: ", wrapper.vm.costWithInterests);
        expect(wrapper.vm.points).toBe(500);
    })

    it("calls buyPoints method", async () => {
        wrapper.setData({ points: 500 });
        wrapper.setData({ onePointToDollars: 2 });
        const localThis = {
            points: 500,
            onePointToDollars: 2
        }
        console.log("calculated: ", BuyPointForm.computed.rawCost.call(localThis));
        const calc = BuyPointForm.computed.rawCost.call(localThis);
        expect(calc).toBe(1000);
        //const buyPoints = BuyPointForm.buyPoints();
        //wrapper.setMethods({ buyPoints: buyPoints });
        //wrapper.find('.confirm-btn').trigger('click')
        /*wrapper.vm.buyPoints()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.buyPoints().called).toBe(true);*/
    })

    
    
/*************** Oficiales para el componente ***************/
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
        console.log("costo con intereses: ", costWithInterests);
        expect(costWithInterests).toBe(1015.75);
    })
/**************************************************************/
})