import config from "../../../../tailwind.config";
const colors = config.theme.extend.colors;

export const lineChartStyle = {
  fill: false,
  tension: 0.1,
  borderColor: colors.secondary["zen-100"],
  pointRadius: 0,
  pointHitRadius: 16,
  pointHoverRadius: 8,
  pointBorderColor: colors.secondary["zen-100"],
};

export const donutChartStyle = {
  backgroundColor: [
    colors.secondary["zen-100"],
    colors.secondary["energy-100"],
    colors.secondary["mind-100"],
    colors.secondary["body-100"],
  ],
  borderColor: ["transparent"],
  hoverOffset: 4,
};

export const barChartStyle = {
  backgroundColor: [
    colors.secondary["zen-100"],
    colors.secondary["energy-100"],
    colors.secondary["mind-100"],
    colors.secondary["body-100"],
    colors.secondary["ego-100"],
    colors.secondary["aura-100"],
    colors.secondary["psyche-100"],
  ],
  borderColor: ["transparent"],
  borderWidth: 2,
  borderRadius: 4,
  hoverBorderColor: [colors.primary[300]],
  hoverBorderRadius: 4,
};

export const generalChartOptions = {
  layout: {
    autoPadding: true,
  },
  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      borderColor: colors.primary[700],
      borderWidth: 1,
      backgroundColor: colors.primary[800],
      padding: 16,
      displayColors: true,
      boxPadding: 8,
      caretSize: 10,

      callbacks: {
        //TO DO: Fill this properly, this is placeholder function
        label: (context: {
          dataset: { label: string };
          parsed: { y: number | bigint | null };
        }) => {
          let label = context.dataset.label || "";

          // if (label) {
          //   label += ": ";
          // }
          // if (context.parsed.y !== null) {
          //   label += new Intl.NumberFormat("en-US", {
          //     style: "currency",
          //     currency: "USD",
          //   }).format(context.parsed.y);
          // }
          return label + ": " + context.parsed.y;
        },
      },
    },
  },

  //All of these are important for making the axes look good
  scales: {
    //These options format the x axis
    x: {
      grid: {
        //The little legs at the bottom of the chart
        drawOnChartArea: false,
        lineWidth: 1,
        color: [colors.primary[800]],
      },
      //The labels and increments
      ticks: {
        color: [colors.primary[500]],
        drawTicks: true,
        autoSkip: true,
        maxRotation: 0,
        maxTicksLimit: 5,
        padding: 4,
      },
    },
    //Y axis
    y: {
      stackWeight: 1,
      grid: {
        color: [colors.primary[800]],
      },
      ticks: {
        color: [colors.primary[500]],
        padding: 16,
        maxTicksLimit: 5,
      },
      border: {
        color: "transparent",
      },
    },
  },
};
