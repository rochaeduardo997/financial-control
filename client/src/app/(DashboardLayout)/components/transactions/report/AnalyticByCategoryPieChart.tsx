import ReactApexChart from 'react-apexcharts';
import React from 'react';
import { TransactionCurrency } from "../../../../../../../server/src/core/entity/Transaction";

type TProps = { categories: any, currency: TransactionCurrency };
export default function AnalyticByCategoryStackedBarChart({ categories, currency }: TProps){
  const [state, setState] = React.useState({
    series: [], 
    options: { 
      colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7' ],
      chart: { type: 'pie', toolbar: { show: false }}, 
      legend: { 
        markers: { shape: 'square' }, 
        position: 'bottom' 
      },
      labels: [], 
      responsive: [
        { 
          breakpoint: 480, 
        }
      ],
      tooltip: {
        y: {
          show: true,
          formatter: (x: number) => `${currency}${x}`
        },
      }
    }
  });

  React.useEffect(() => {
    const series: any = [];
    const labels: any = [];
    for(const category of Object.keys(categories)) {
      labels.push(category);
      series.push(categories[category]);
    }
    setState((prev) => ({
      ...prev, 
      series,
      options: { ...prev.options, labels }
    }));
  }, [categories]);

  return (
    <div>
      <div id="chart">
          <ReactApexChart options={state.options} series={state.series} type="pie" height={250} />
        </div>
      <div id="html-dist"></div>
    </div>
  );
}
