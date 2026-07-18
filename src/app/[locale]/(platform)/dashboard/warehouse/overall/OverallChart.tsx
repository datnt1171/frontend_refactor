'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import type { Overall } from '@/types';
import { useSearchParams } from 'next/navigation';

interface OverallChartProps {
  data: Overall[];
}

// Fixed palette for excluded-factory breakout bars. Color assignment is
// based on the sorted factory code, not selection order, so a given
// factory always renders the same color regardless of pick order.
const PALETTE = ['#f7f5bc', '#f1ee8e', '#ece75f', '#e8e337', '#e5de00', '#e6cc00', '#e6b400', '#e69b00',];

function colorForFactory(factoryCode: string, allCodes: string[]) {
  const sorted = [...allCodes].sort();
  return PALETTE[sorted.indexOf(factoryCode) % PALETTE.length];
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
    const orders = data.map(item => item.order_quantity);
    const remainOrders = data.map(item => item.remain_order_quantity);
    const salesTargetPct = data.map(item => item.sales_target_pct);
    const orderTargetPct = data.map(item => item.order_target_pct);

    // All factory codes present across the excluded set, sorted for stable coloring
    const factoryCodes = Array.from(
      new Set(data.flatMap(item => item.factory_breakdown.map(f => f.factory_code)))
    ).sort();

    // code -> display name lookup (falls back to code if name is missing)
    const factoryNameByCode = new Map(
      data.flatMap(item =>
        item.factory_breakdown.map(f => [f.factory_code, f.factory_name || f.factory_code] as const)
      )
    );

    // Built once, used for both legend entries and series names so they
    // can never drift out of sync with each other.
    const factoryDisplay = factoryCodes.map(code => ({
      code,
      name: factoryNameByCode.get(code) ?? code
    }));

    // Create data with dynamic label positions
    const orderTargetData = orderTargetPct.map((value, index) => ({
      value,
      label: {
        position: (value ?? 0) >= (salesTargetPct[index] ?? 0) ? 'top' : 'bottom'
      }
    }));

    const salesTargetData = salesTargetPct.map((value, index) => ({
      value,
      label: {
        position: (value ?? 0) > (orderTargetPct[index] ?? 0) ? 'top' : 'bottom'
      }
    }));

    const allPercentages = [...salesTargetPct, ...orderTargetPct].filter(val => val != null) as number[];
    const maxPct = Math.max(...allPercentages);
    const minPct = Math.min(...allPercentages);
    const yAxisMax = maxPct + 0.05; // Add 5% buffer
    const yAxisMin = Math.max(minPct - 0.05, 0); // Subtract 5% but floor at 0%

    // Helper to look up a factory's quantity for a given month row
    const factoryValue = (item: Overall, factoryCode: string, field: 'sales_quantity' | 'order_quantity') =>
      item.factory_breakdown.find(f => f.factory_code === factoryCode)?.[field] ?? 0;

    const salesBreakdownSeries = factoryDisplay.map(({ code, name }, idx) => {
      const isLast = idx === factoryDisplay.length - 1;
      return {
        name: `${name} - SL GH 送貨量`,
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        stack: 'sales',
        data: data.map(item => factoryValue(item, code, 'sales_quantity')),
        itemStyle: { color: colorForFactory(code, factoryCodes) },
        label: isLast
          ? {
              show: true,
              position: 'top',
              color: 'green',
              formatter: (params: any) => Math.round(sales[params.dataIndex]!).toLocaleString()
            }
          : undefined
      };
    });

    const orderBreakdownSeries = factoryDisplay.map(({ code, name }, idx) => {
      const isLast = idx === factoryDisplay.length - 1;
      return {
        name: `${name} - SL ĐĐH 訂單量`,
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        stack: 'orders',
        data: data.map(item => factoryValue(item, code, 'order_quantity')),
        itemStyle: { color: colorForFactory(code, factoryCodes) },
        label: isLast
          ? {
              show: true,
              position: 'top',
              color: 'blue',
              formatter: (params: any) => Math.round(orders[params.dataIndex]!).toLocaleString()
            }
          : undefined
      };
    });

    // If nothing is excluded, the remain bar carries the total label itself
    const noBreakdown = factoryDisplay.length === 0;

    const option = {
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
            '年的每月訂單量 - SL ĐĐH mỗi tháng',
            ...factoryDisplay.map(f => `${f.name} - SL GH 送貨量`),
            ...factoryDisplay.map(f => `${f.name} - SL ĐĐH 訂單量`)
          ],
          orient: 'vertical',
          type: 'scroll',
          top: 0,
          bottom: 20,
          left: '5%',
          width: '55%',
          textStyle: {
            fontSize: 12
          }
        }
      ],
      grid: [
        {
          top: 120,
          left: '4%',
          right: '4%',
          height: '30%',
          containLabel: true
        },
        {
          top: '55%',
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
          min: yAxisMin,
          max: yAxisMax,
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
          data: orderTargetData,
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
            color: 'red',
            formatter: (params: any) => `${(params.value * 100).toFixed(1)}%`
          }
        },
        {
          name: `相較${targetYear}年${targetMonth}月送貨達成% - Giao hàng đạt % so với tháng ${targetMonth}/${targetYear}`,
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: salesTargetData,
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
          },
          label: noBreakdown
            ? {
                show: true,
                position: 'top',
                color: 'green',
                formatter: (params: any) => Math.round(sales[params.dataIndex]!).toLocaleString()
              }
            : undefined
        },
        ...salesBreakdownSeries,
        {
          name: '年的每月訂單量 - SL ĐĐH mỗi tháng',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          stack: 'orders',
          data: remainOrders,
          itemStyle: {
            color: '#7AB2D3'
          },
          label: noBreakdown
            ? {
                show: true,
                position: 'top',
                color: 'blue',
                formatter: (params: any) => Math.round(orders[params.dataIndex]!).toLocaleString()
              }
            : undefined
        },
        ...orderBreakdownSeries,
      ]
    };

    chart.setOption(option, true); // true = don't merge stale series from a previous factory selection

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