import ReactApexChart from 'react-apexcharts';
import React from 'react';
import { TransactionCurrency } from "../../../../../../../server/src/core/entity/Transaction";
import BlankBarChart, { TSeries } from "../../shared/BlankBarChart";

type TProps = { categories: any, currency: TransactionCurrency };
export default function AnalyticByCategoryStackedBarChart({ categories, currency }: TProps){
  const [series, setSeries] = React.useState<TSeries[]>([]);
  const [chartCategories, setChartCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    setSeries([]);
    setChartCategories([]);
    const _series: any = [{ data: [] }];
    const _chartCategories: any = [];
    for(const category of Object.keys(categories)) {
      _chartCategories.push(category);
      _series[0].data.push(categories[category]);
    }
    setSeries(_series);
    setChartCategories(_chartCategories);
  }, [categories]);

  return <BlankBarChart series={series} categories={chartCategories} currency={currency} />;
}
