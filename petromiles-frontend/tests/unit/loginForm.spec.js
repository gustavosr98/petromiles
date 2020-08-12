import { shallowMount, createLocalVue  } from "@vue/test-utils";
import LoginForm from "@/components/Auth/LoginForm.vue";

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
            role: "ADMINISTRATOR",
            title: "LoginForm",
            dashboardRoute: "",
            showClientElement: false
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