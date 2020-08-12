import { shallowMount, createLocalVue  } from "@vue/test-utils";
import SignUpForm from "@/components/Auth/SignUpForm.vue";

import Vuetify from 'vuetify'
import Vue from "vue";

jest.mock("@/store/index");

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

describe("Testing SignUpForm component", () => {

    let vuetify

    beforeEach(() => {
        vuetify = new Vuetify()
      })

    const wrapper = shallowMount(SignUpForm, {
        mocks:{ $tc, $t },    
        localVue,
        vuetify,
    })
    
    it("signup user", async () => {
        wrapper.setData({
            firstName: 'Rafael',
            email: 'mendez_98_@petromiles.com.ve',
            password: '12345678',
            lastName: 'Mendezz'
        });
        const signUp = jest.fn();
        wrapper.setMethods({ signUp: signUp });
        wrapper.vm.buildUser();
        await wrapper.vm.$nextTick();
        expect(signUp).toHaveBeenCalled();
    })

})