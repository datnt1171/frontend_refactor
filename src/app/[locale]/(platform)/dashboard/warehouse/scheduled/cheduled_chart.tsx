'use client'

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ScheduledAndActualSales } from '@/types'

interface ScheduledChartProps {
  data: ScheduledAndActualSales[];
}

export default function ScheduledChart({ data }: ScheduledChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const months = data.map((item) => `${item.scheduled_month}`);
    const scheduledQuantities = data.map((item) => item.scheduled_quantity);
    const salesQuantities = data.map((item) => item.sales_quantity);
    const salesPercentages = data.map((item) => 
      item.sales_pct === 0 ? null : item.sales_pct * 100
    );

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [
          '預計銷售額 - Dự định GH', 
          '實際銷售額 - GH Thực tế', 
          '%達到率 - %Tỉ lệ đạt được'
        ],
        top: 0,
      },
      grid: {
        top: 30,
        left: '4%',
        right: '4%',
        bottom: '7%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        name: '月 - Tháng',
        position: 'bottom',
        nameLocation: 'middle',
        nameGap: 30,
      },
      yAxis: [
        {
          type: 'value',
          name: '數量 - Số lượng (kg)',
          position: 'left',
          nameLocation: 'middle',
          nameGap: 70,
        },
        {
          type: 'value',
          name: 'Tỉ lệ (%)',
          position: 'right',
          nameLocation: 'middle',
          nameGap: 50,
        },
      ],
      series: [
        {
          name: '預計銷售額 - Dự định GH',
          type: 'bar',
          data: scheduledQuantities,
          itemStyle: {
            color: '#7AB2D3',
          },
          yAxisIndex: 0,
          label: {
            show: true,
            position: 'top',
            color: 'blue',
            formatter: (params: any) => Math.round(params.value).toLocaleString()
          }
        },
        {
          name: '實際銷售額 - GH Thực tế',
          type: 'bar',
          data: salesQuantities,
          itemStyle: {
            color: '#72BF78',
          },
          yAxisIndex: 0,
          label: {
            show: true,
            position: 'top',
            color: 'green',
            formatter: (params: any) => Math.round(params.value).toLocaleString()
          }
        },
        {
          name: '%達到率 - %Tỉ lệ đạt được',
          type: 'line',
          data: salesPercentages,
          itemStyle: {
            color: 'red',
          },
          yAxisIndex: 1,
          lineStyle: {
            width: 2,
          },
          label: {
            show: true,
            position: 'top',
            color: 'black',
            fontSize: 14,
            formatter: (params: any) => params.value !== null ? `${Number(params.value).toFixed(1)}%` : ''
          }
        },
      ],
    };

    chart.setOption(option);

    // ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);

    // Fallback for window resize
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [data]);

  return (
    <div ref={chartRef} className="w-full h-[500px]" />
  );
}