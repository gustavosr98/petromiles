import { shallowMount, createLocalVue  } from "@vue/test-utils";
import ExchangePointsForm from "@/components/Withdrawal/ExchangePointsForm.vue";

import Vuetify from 'vuetify'

const localVue = createLocalVue()

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

})