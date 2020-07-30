import { shallowMount } from "@vue/test-utils";
import ExchangePointsForm from "@/components/Withdrawal/ExchangePointsForm";

// Mount the component
const wrapper = shallowMount(ExchangePointsForm);

describe("ExchangePointsForm", () => {
  // Inspect the raw component options
  it("has a created hook", () => {
    expect(typeof ExchangePointsForm.created).toBe("function");
  });

  // Evaluate the results of functions in
  // the raw component options
  it("sets the correct default data", () => {
    await wrapper.find({name: 'points'}).click();
    await wrapper.find({name: 'points'}).sendKeys("2000");
    await wrapper.find({name: 'accounts'}).click();
    await wrapper.find(By.id("list-item-228-0")).click();
    await wrapper.find({name: 'exchange'}).click();
    await wrapper.find({name: 'success'}).click();
  });
});
