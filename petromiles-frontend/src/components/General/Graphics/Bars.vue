<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
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
