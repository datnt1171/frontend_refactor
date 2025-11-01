'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import type { Overall } from '@/types';
import { useSearchParams } from 'next/navigation';

interface OverallChartProps {
  data: Overall[];
}

export default function OverallChart({ data }: OverallChartProps) {

  const searchParams = useSearchParams();
  const targetYear = searchParams.get('target_year') || '2022';
  const targetMonth = searchParams.get('target_month') || '5';

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    // Transform API data to chart format
    const months = data.map(item => item.month);
    const sales = data.map(item => item.sales_quantity);
    const remainSales = data.map(item => item.remain_sales_quantity);
    const excludeFactorySales = data.map(item => item.exclude_factory_sales_quantity);
    const orders = data.map(item => item.order_quantity);
    const remainOrders = data.map(item => item.remain_order_quantity);
    const excludeFactoryOrders = data.map(item => item.exclude_factory_order_quantity);
    const salesTargetPct = data.map(item => item.sales_target_pct);
    const orderTargetPct = data.map(item => item.order_target_pct);

    const option = {
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
      legend: [
        {
          data: [
            `相較${targetYear}年${targetMonth}月訂單達成% - ĐĐH đạt % so với tháng ${targetMonth}/${targetYear}`,
            `相較${targetYear}年${targetMonth}月送貨達成% - Giao hàng đạt % so với tháng ${targetMonth}/${targetYear}`
          ],
          orient: 'vertical',
          top: 0,
          left: 'right'
        },
        {
          data: [
            '年的每月送貨量 - SL giao hàng mỗi tháng',
            'TIMBER每月的大森的送貨量 - SL giao hàng TIMBER',
            '年的每月訂單量 - SL ĐĐH mỗi tháng',
            'TIMBER每月的大森的訂單量 - SL ĐĐH TIMBER'
          ],
          orient: 'vertical',
          top: 0,
          left: '5%'
        }
      ],
      grid: [
        {
          top: 120,
          left: '4%',
          right: '4%',
          height: '20%',
          containLabel: true
        },
        {
          top: '38%',
          left: '4%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        }
      ],
      xAxis: [
        {
          type: 'category',
          gridIndex: 0,
          data: months,
          axisLabel: {
            show: false
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          name: '月 - Tháng',
          position: 'bottom',
          nameLocation: 'middle',
          nameGap: 30,
          data: months
        }
      ],
      yAxis: [
        {
          type: 'value',
          gridIndex: 0,
          name: 'Tỉ lệ %',
          position: 'right',
          nameLocation: 'middle',
          nameGap: 50,
          axisLabel: {
            formatter: (value: number) => `${(value * 100).toFixed(0)}%`
          }
        },
        {
          type: 'value',
          gridIndex: 1,
          name: '數量 - Số lượng (kg)',
          position: 'left',
          nameLocation: 'middle',
          nameGap: 70,
          axisLabel: {
            formatter: (value: number) => value.toLocaleString()
          }
        }
      ],
      series: [
        {
          name: `相較${targetYear}年${targetMonth}月訂單達成% - ĐĐH đạt % so với tháng ${targetMonth}/${targetYear}`,
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: salesTargetPct,
          itemStyle: {
            color: 'red'
          },
          lineStyle: {
            width: 2
          },
          symbol: 'circle',
          symbolSize: 5,
          label: {
            show: true,
            position: 'bottom',
            color: 'red',
            formatter: (params: any) => `${(params.value * 100).toFixed(1)}%`
          }
        },
        {
          name: `相較${targetYear}年${targetMonth}月送貨達成% - Giao hàng đạt % so với tháng ${targetMonth}/${targetYear}`,
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: orderTargetPct,
          itemStyle: {
            color: 'orange'
          },
          lineStyle: {
            width: 2
          },
          symbol: 'triangle',
          symbolSize: 5,
          label: {
            show: true,
            position: 'top',
            color: 'orange',
            formatter: (params: any) => `${(params.value * 100).toFixed(1)}%`
          }
        },
        {
          name: '年的每月送貨量 - SL giao hàng mỗi tháng',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          stack: 'sales',
          data: remainSales,
          itemStyle: {
            color: '#72BF78'
          }
        },
        {
          name: 'TIMBER每月的大森的送貨量 - SL giao hàng TIMBER',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          stack: 'sales',
          data: excludeFactorySales,
          itemStyle: {
            color: '#C1FFC1'
          },
          label: {
            show: true,
            position: 'top',
            color: 'green',
            formatter: (params: any) => {
              const totalIndex = params.dataIndex;
              return Math.round(sales[totalIndex]!).toLocaleString();
            }
          }
        },
        {
          name: '年的每月訂單量 - SL ĐĐH mỗi tháng',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          stack: 'orders',
          data: remainOrders,
          itemStyle: {
            color: '#7AB2D3'
          }
        },
        {
          name: 'TIMBER每月的大森的訂單量 - SL ĐĐH TIMBER',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          stack: 'orders',
          data: excludeFactoryOrders,
          itemStyle: {
            color: '#DFF2EB'
          },
          label: {
            show: true,
            position: 'top',
            color: 'blue',
            formatter: (params: any) => {
              const totalIndex = params.dataIndex;
              return Math.round(orders[totalIndex]!).toLocaleString();
            }
          }
        },
      ]
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
  }, [data, targetYear, targetMonth]);

  return (
    <div ref={chartRef} className="w-full h-[600px]" />
  );
}