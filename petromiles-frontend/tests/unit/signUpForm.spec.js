import { shallowMount, createLocalVue  } from "@vue/test-utils";
import SignUpForm from "@/components/Auth/SignUpForm.vue";

import Vuetify from 'vuetify'

jest.mock("@/store/index");

const localVue = createLocalVue()

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