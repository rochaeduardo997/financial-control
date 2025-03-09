import ReactApexChart from 'react-apexcharts';
import React from 'react';
import { TransactionCurrency } from "../../../../../../server/src/core/entity/Transaction";

export type TSeries = { data: number[] };
type TProps = { series: TSeries[]; categories: string[], currency: TransactionCurrency };
export default function BlankBarChart({ series, categories, currency }: TProps){
  const [state, setState] = React.useState({
    series,
    options: {
      chart: { type: 'bar', height: 350, toolbar: { show: false }},
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true
        }
      },
      dataLabels: { enabled: true, formatter: (x: number) => `${currency}${x}` },
      grid: { show: false },
      xaxis: {
        categories,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      tooltip: {
        enabled: true,
        y: { formatter: (x: number) => `${currency}${x}` }
      },
      colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7' ]
    }
  });

  React.useEffect(() => {
    setState((prev) => {
      return {
      ...prev,
      series,
      xaxis: { categories }
    }});
  }, [series, categories]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="bar" height={250} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}
