'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import type { Overall } from '@/types';

interface StackedChartProps {
  data: Overall[];
}

export default function StackedChart({ data }: StackedChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    // Transform API data to chart format
    const months = data.map(item => item.month);
    const remainSales = data.map(item => item.remain_sales_quantity);
    const excludeFactorySales = data.map(item => item.exclude_factory_sales_quantity);
    const remainOrders = data.map(item => item.remain_order_quantity);
    const excludeFactoryOrders = data.map(item => item.exclude_factory_order_quantity);
    const salesTargetPct = data.map(item => item.sales_target_pct);
    const orderTargetPct = data.map(item => item.order_target_pct);

    const option = {
      title: {
        text: 'Sales & Orders Overview',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        formatter: (params: any) => {
          let result = `<strong>${params[0].axisValue}</strong><br/>`;
          params.forEach((param: any) => {
            const value = param.seriesName.includes('%') 
              ? `${(param.value * 100).toFixed(2)}%`
              : param.value.toLocaleString();
            result += `${param.marker} ${param.seriesName}: ${value}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: [
          'Remain Sales',
          'Timber Sales',
          'Remain Orders',
          'Timber Orders',
          'Sales Target %',
          'Order Target %'
        ],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Quantity',
          position: 'left',
          axisLabel: {
            formatter: (value: number) => value.toLocaleString()
          }
        },
        {
          type: 'value',
          name: 'Target %',
          position: 'right',
          max: 1,
          axisLabel: {
            formatter: (value: number) => `${(value * 100).toFixed(0)}%`
          }
        }
      ],
      series: [
        {
          name: 'Remain Sales',
          type: 'bar',
          stack: 'sales',
          data: remainSales,
          itemStyle: {
            color: '#72BF78'
          }
        },
        {
          name: 'Timber Sales',
          type: 'bar',
          stack: 'sales',
          data: excludeFactorySales,
          itemStyle: {
            color: '#C1FFC1'
          }
        },
        {
          name: 'Remain Orders',
          type: 'bar',
          stack: 'orders',
          data: remainOrders,
          itemStyle: {
            color: '#7AB2D3'
          }
        },
        {
          name: 'Timber Orders',
          type: 'bar',
          stack: 'orders',
          data: excludeFactoryOrders,
          itemStyle: {
            color: '#DFF2EB'
          }
        },
        {
          name: 'Sales Target %',
          type: 'line',
          yAxisIndex: 1,
          data: salesTargetPct,
          itemStyle: {
            color: '#006400'
          },
          lineStyle: {
            width: 2
          },
          symbol: 'circle',
          symbolSize: 5
        },
        {
          name: 'Order Target %',
          type: 'line',
          yAxisIndex: 1,
          data: orderTargetPct,
          itemStyle: {
            color: '#00008B'
          },
          lineStyle: {
            width: 2
          },
          symbol: 'triangle',
          symbolSize: 5
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />;
}