import ReactApexChart from 'react-apexcharts';
import React from 'react';
import { TransactionCurrency } from "../../../../../../../server/src/core/entity/Transaction";
import BlankPieChart from "../../shared/BlankPieChart";

type TProps = { categories: any, currency: TransactionCurrency };
export default function AnalyticByCategoryStackedBarChart({ categories, currency }: TProps){
  const [series, setSeries] = React.useState<number[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);

  React.useEffect(() => {
    setSeries([]);
    setLabels([]);
    const _series: number[] = [];
    const _labels: string[] = [];
    for(const category of Object.keys(categories)) {
      series.push(categories[category]);
      labels.push(category);
    }
    setSeries(_series);
    setLabels(_labels);
  }, [categories]);

  return <BlankPieChart series={series} labels={labels} currency={currency} />;
}
