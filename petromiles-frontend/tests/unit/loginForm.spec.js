import { shallowMount, createLocalVue  } from "@vue/test-utils";
import LoginForm from "@/components/Auth/LoginForm.vue";

import Vuetify from 'vuetify'

jest.mock("@/store/index");

const localVue = createLocalVue()

/*************** Mocking Translations functions ***************/
const $tc = () => {}
const $t = () => {}
/**************************************************************/

describe("Testing LoginForm component", () => {

    let vuetify    

    beforeEach(() => {
      vuetify = new Vuetify()       
    })

    const wrapper = shallowMount(LoginForm, {
        mocks:{ $tc, $t },    
        localVue,
        vuetify,
        propsData: {
            role: "ADMINISTRATOR"
        }
    })  

    it("Logs user in", async () => {
        wrapper.setData({
            email: 'admin@petromiles.com',
            password: 'test1234'
        });        
        const login = jest.fn();
        wrapper.setMethods({ login: login });
        wrapper.find("v-btn.login-btn").trigger("click");
        await wrapper.vm.$nextTick();
        expect(login).toHaveBeenCalled();
    })    
})