<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  props: ["chartData", "options"],
  watch: {
    chartData(oldChartData, newChartData) {
      this.renderChart(this.chartData, this.options);
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
