<template>
  <div>
    <Line
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
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

// ChartJS.register(ChartDataLabels);

const props = defineProps({
  chartData: {
    type: Object,
    // required: true,
    default: () => ({
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          label: "My First dataset",
          data: [20, 30, 62, 29, 10, 40, 39, 80, 40, 20, 12, 11],
          borderColor: "red",
          backgroundColor: "red",
          fill: true,
        },
        {
          label: "My Second dataset",
          data: [40, 20, 12, 39, 60, 10, 29, 70, 30, 20, 22, 71],
          borderColor: "blue",
          backgroundColor: "blue",
          fill: true,
        },
        {
          label: "My Third dataset",
          data: [10, 2, 15, 29, 30, 10, 19, 80, 20, 20, 22, 31],
          borderColor: "green",
          backgroundColor: "green",
          fill: true,
        },
        {
          label: "My Fourth dataset",
          data: [10, 20, 12, 29, 40, 10, 69, 20, 10, 60, 42, 61],
          borderColor: "yellow",
          backgroundColor: "yellow",
          fill: true,
        },
      ],
    }),
  },
  chartId: {
    type: String,
    default: "line-chart",
  },
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 200,
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
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Month",
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Value",
          },
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