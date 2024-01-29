"use client";
import Image from "next/image";
import localFont from "next/font/local";
import { ChartThumbnail } from "./ui/ChartThumbnail";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ChartViewPage } from "./ui/ChartViewPage";

const myFont = localFont({ src: "./castledown-regular-trial.otf" });

export default function Home() {
  const charts = [
    {
      title: "Starter picks",
      subtitle: "Which Voidpet did players choose?",
      chartType: "donut",
    },
    { title: "Downloads", subtitle: "Downloads by month", chartType: "bar" },
    { title: "MAU & DAU", subtitle: "Active users", chartType: "line" },
  ];

  const dotStyle = " w-5 h-5 rounded-full mx-1";

  return (
    <main
      style={{ backgroundColor: "#23222E" }}
      className="flex min-h-screen flex-col items-center"
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between p-24 font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:bg-primary-800 dark:bg-primary-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-primary-800/30">
          voidpulse
        </p>
        <div className="items-center flex-row flex">
          <div className={"bg-secondary-zen-100" + dotStyle}></div>
          <div className={"bg-secondary-energy-100" + dotStyle}></div>
          <div className={"bg-secondary-mind-100" + dotStyle}></div>
          <div className={"bg-secondary-body-100" + dotStyle}></div>
        </div>
        <div className={myFont.className}>voidpulse says: hello</div>
      </div>

      <ChartViewPage />

      {/* Dashboard of chart thumbnails shows up here */}
      <div className="grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        {charts.map((chart) => {
          return (
            <div className="m-2">
              <ChartThumbnail
                key={chart.title}
                title={chart.title}
                subtitle={chart.subtitle}
                chartType={chart.chartType}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}