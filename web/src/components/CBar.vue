<template>
  <div>
    <Bar
      :chart-options="props.chartOptions"
      :chart-data="props.chartData"
      :chart-id="props.chartId"
      :dataset-id-key="props.datasetIdKey"
      :plugins="props.plugins"
      :css-classes="props.cssClasses"
      :styles="props.styles"
      :width="props.width"
      :height="props.height"
    />
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

ChartJS.register(ChartDataLabels)

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartId: {
    type: String,
    default: "bar-chart",
  },
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 400,
  },
  cssClasses: {
    default: "",
    type: String,
  },
  styles: {
    type: Object,
    default: () => {},
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        xAxis: {
          min: 95,
          ticks: {
              callback: function(value, index, ticks) {
                return value + '%';
              }
          }
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }),
  },
  plugins: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped></style>
