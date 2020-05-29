import { statesArray } from "@/constants/state.js";

export const getColor = {
  methods: {
    getColor(state) {
      let color = "";
      statesArray.map(s => {
        if (s.state === state) {
          color = s.color;
        }
      });
      return color;
    },
  },
};
