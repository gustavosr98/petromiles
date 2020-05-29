import { statesArray } from "@/constants/state.js";
import upperFirst from "lodash/upperFirst";

export const getColor = {
  methods: {
    getColor(state) {
      let color = "";
      statesArray.map(s => {
        console.log(state);
        if (s.state === upperFirst(state)) {
          color = s.color;
        }
      });
      return color;
    },
  },
};
