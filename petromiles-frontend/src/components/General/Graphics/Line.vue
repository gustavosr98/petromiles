<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
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
