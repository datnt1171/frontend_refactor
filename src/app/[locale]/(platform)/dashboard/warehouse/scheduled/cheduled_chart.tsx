'use client'

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ScheduledSalesData {
  scheduled_month: number;
  scheduled_quantity: number;
  sales_quantity: number;
  sales_pct: number;
}

interface ScheduledChartProps {
  data: ScheduledSalesData[];
}

export default function ScheduledChart({ data }: ScheduledChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const months = data.map((item) => `Month ${item.scheduled_month}`);
    const scheduledQuantities = data.map((item) => item.scheduled_quantity);
    const salesQuantities = data.map((item) => item.sales_quantity);
    const salesPercentages = data.map((item) => 
      item.sales_pct === 0 ? null : (item.sales_pct * 100).toFixed(2)
    );

    const option: echarts.EChartsOption = {
      title: {
        text: 'Scheduled vs Actual Sales',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Scheduled Quantity', 'Sales Quantity', 'Sales %'],
        top: 30,
      },
      grid: {
        top: 80,
        left: 50,
        right: 80,
        bottom: 50,
      },
      xAxis: {
        type: 'category',
        data: months,
      },
      yAxis: [
        {
          type: 'value',
          name: 'Quantity',
          position: 'left',
        },
        {
          type: 'value',
          name: 'Sales %',
          position: 'right',
        },
      ],
      series: [
        {
          name: 'Scheduled Quantity',
          type: 'bar',
          data: scheduledQuantities,
          itemStyle: {
            color: '#3b82f6',
          },
          yAxisIndex: 0,
        },
        {
          name: 'Sales Quantity',
          type: 'bar',
          data: salesQuantities,
          itemStyle: {
            color: '#10b981',
          },
          yAxisIndex: 0,
        },
        {
          name: 'Sales %',
          type: 'line',
          data: salesPercentages,
          itemStyle: {
            color: '#f59e0b',
          },
          yAxisIndex: 1,
          lineStyle: {
            width: 2,
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '400px'
      }}
    />
  );
}