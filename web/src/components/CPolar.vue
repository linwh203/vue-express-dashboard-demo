<template>
  <div>
    <PolarArea
      :chart-options="props.chartOptions"
      :chart-data="props.chartData"
      :chart-id="props.chartId"
      :css-classes="props.cssClasses"
      :styles="props.styles"
      :width="props.width"
      :height="props.height"
    />
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { PolarArea } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(Title, Tooltip, Legend, ArcElement, RadialLinearScale);

// ChartJS.register(ChartDataLabels);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartId: {
    type: String,
    default: "polar-chart",
  },
  width: {
    type: Number,
    default: 200,
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
      maintainAspectRatio: false,
      scales: {
        r: {
          pointLabels: {
            display: true,
            centerPointLabels: true,
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "left",
          align: "start",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            font: {
              size: 10,
            },
          },
        },
      },
    }),
  },
});
</script>

<style lang="scss" scoped></style>
