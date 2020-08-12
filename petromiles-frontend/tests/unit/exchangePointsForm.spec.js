import { shallowMount, createLocalVue  } from "@vue/test-utils";
import ExchangePointsForm from "@/components/Withdrawal/ExchangePointsForm.vue";

import Vuetify from 'vuetify'
import Vue from "vue";

const localVue = createLocalVue()

Vue.config.ignoredElements = [
    'v-text-field', 'v-card-text', 'v-col', 'v-row', 'v-form',
    'router-link', 'v-btn', 'v-img', 'v-card', 'v-select',
    'v-dialog', 'v-card-title', 'v-card-actions', 'v-spacer',
    
]

/*************** Mocking Translations functions ***************/
const $tc = () => {}
const $t = () => {}
/**************************************************************/

describe("Testing ExchangePointsForm component", () => {

    let vuetify

    beforeEach(() => {
        vuetify = new Vuetify()
      })

    const wrapper = shallowMount(ExchangePointsForm, {
        mocks:{ $tc, $t },    
        localVue,
        vuetify,
    })  

    it("Assigns 150 points to exchange", () => {
        wrapper.setData({ points: 150 });
        expect(wrapper.vm.points).toBe(150);
    })

    it("Calculates rawCost", () => {
        const data = {
            points: 500,
            onePointToDollars: 2
        }        
        const calc = ExchangePointsForm.computed.rawCost.call(data);
        expect(calc).toBe(1000);
    })

    it("Calculates cost with interests", () => {
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
                    percentage: 0.05
                }
            ]
        }
        data.rawCost = ExchangePointsForm.computed.rawCost.call(data);        
        const costWithInterests = ExchangePointsForm.computed.costWithInterests.call(data);        
        expect(costWithInterests).toBe(949.25);
    })

    it("Calculates total points left after exchanged", () => {
        const data = {
            points:150,
            totalPoints: 2000
        }
        const pointsLeft = ExchangePointsForm.computed.totalPointsRest.call(data);
        expect(pointsLeft).toBe(1850);
    })

    it("Executes exchangePoints method correctly", async () => {
        const exchangePoints = jest.fn();
        wrapper.setMethods({ exchangePoints: exchangePoints });
        wrapper.find("v-btn.confirm-btn").trigger("click");
        await wrapper.vm.$nextTick()
        expect(exchangePoints).toHaveBeenCalled();        
    })

})