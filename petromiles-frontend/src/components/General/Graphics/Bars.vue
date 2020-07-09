<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["datacollection", "options"],
  mounted() {
    this.renderChart(this.datacollection, this.options);
  },
};
</script>
