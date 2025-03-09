import ReactApexChart from 'react-apexcharts';
import React from 'react';
import { TransactionCurrency } from "../../../../../../../server/src/core/entity/Transaction";

type TProps = { categories: any, currency: TransactionCurrency };
export default function AnalyticByCategoryStackedBarChart({ categories, currency }: TProps){
  const [state, setState] = React.useState({ 
    series: [{ data: [] }],
    options: { 
      chart: { type: 'bar', height: 350, toolbar: { show: false }}, 
      plotOptions: { 
        bar: { 
          distributed: true,
          borderRadius: 4, 
          borderRadiusApplication: 'end', 
          horizontal: true, 
        } 
      }, 
      dataLabels: { enabled: true, formatter: (x: number) => `${currency}${x}` }, 
      grid: {
        show: false,
      },
      xaxis: {
        categories: [], 
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (x: number) => `${currency}${x}`
        }
      },
      colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7' ],
    }
  });

  React.useEffect(() => {
    const series: any = [{ data: [] }];
    const chartCategories: any = [];
    for(const category of Object.keys(categories)) {
      chartCategories.push(category);
      series[0].data.push(categories[category]);
    }
    setState((prev) => ({
      ...prev, 
      series,
      options: {
        ...prev.options,
        xaxis: { categories: chartCategories }
      }
    }));
  }, [categories]);

  return (
    <div>
      <div id="chart">
          <ReactApexChart options={state.options} series={state.series} type="bar" height={250} />
        </div>
      <div id="html-dist"></div>
    </div>
  );
}
