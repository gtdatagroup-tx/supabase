import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart"

export type  BarChartProps = {
  data?: DataPoint[],
  attribute: string,
  yAxisLimit?: number | string,
  format?: string,
  highlightedValue?: number | string,
  customDateFormat?: string,
  displayDateInUtc?: boolean ,
  label: string,
  onBarClick?: (v: CategoricalChartState) => void,
  minimalHeader?: boolean,
  chartSize?: string,
  className?: string,
  noDataTitle?: string,
  noDataMessage?: string,
}

export type HeaderType = {
  attribute: string,
  focus: number | null,
  format?: string,
  highlightedValue?: number | string,
  data?: DataPoint[],
  customDateFormat?: string,
  label: string,
  minimalHeader?: boolean,
  displayDateInUtc?: boolean,
}

export type DataPoint = {
  [attribute: string]: number | string,
}
