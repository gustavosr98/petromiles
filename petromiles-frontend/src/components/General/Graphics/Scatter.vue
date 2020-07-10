<script>
import { Scatter } from "vue-chartjs";

export default {
  extends: Scatter,
  props: ["datacollection", "options"],
  watch: {
    chartData(oldChartData, newChartData){
      this.renderChart(this.chartData, this.options)
    },
  },  
  mounted() {
    this.renderChart(this.datacollection, this.options);
  },
};
</script>
