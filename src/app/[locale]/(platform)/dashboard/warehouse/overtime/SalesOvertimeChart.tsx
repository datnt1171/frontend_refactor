'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface SalesData {
  [key: string]: any
  sales_quantity: number
}

interface SalesOvertimeChartProps {
  data: SalesData[]
  group_by: string
  xAxisName: string
}

export default function SalesOvertimeChart({ data, group_by, xAxisName }: SalesOvertimeChartProps) {

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const groupBy = group_by.split(',') || ['year', 'month']
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    // Single field case
    if (groupBy.length === 1) {
      const xField = groupBy[0]
      
      const xAxisData = data.map(item => item[xField!])
      const seriesData = data.map(item => item.sales_quantity)

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '7%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          position: 'bottom',
          nameLocation: 'middle',
          nameGap: 30,
          data: xAxisData,
          name: xAxisName
        },
        yAxis: {
          type: 'value',
          name: '數量 - Số lượng',
          position: 'left',
          nameLocation: 'middle',
          nameGap: 70,
        },
        series: [{
          name: '數量 - Số lượng',
          type: 'line',
          data: seriesData,
          label: {
            show: true,
            formatter: (params: any) => Math.round(params.value).toLocaleString()
          }
        }]
      }

      chart.setOption(option)
    }
    
    // Two fields case
    else if (groupBy.length === 2) {
      const [field1, field2] = groupBy
      
      // Determine if this should be a concatenated timeline (single line)
      // year,quarter | year,month | year,week_of_year
      const isConcatenatedTimeline = 
        field1 === 'year' && ['quarter', 'month', 'week_of_year'].includes(field2!)
      
      if (isConcatenatedTimeline) {
        // Single line: concatenated timeline
        const xAxisData = data.map(item => `${item[field1]}-${item[field2!]}`)
        const seriesData = data.map(item => item.sales_quantity)

        const option: echarts.EChartsOption = {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '4%',
            right: '4%',
            bottom: '7%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            position: 'bottom',
            nameLocation: 'middle',
            nameGap: 30,
            data: xAxisData,
            name: xAxisName
          },
          yAxis: {
            type: 'value',
            name: 'Sales Quantity',
            position: 'left',
            nameLocation: 'middle',
            nameGap: 70,
          },
          series: [{
            name: 'Sales',
            type: 'line',
            data: seriesData,
            label: {
              show: true,
              formatter: (params: any) => Math.round(params.value).toLocaleString()
            }
          }]
        }

        chart.setOption(option)
      } else {
        // Multiple lines: determine which field should be the group vs x-axis
        // If one field is 'year', it should be the grouping field (each line = one year)
        // Otherwise, first field groups, second field is x-axis
        
        let groupField = field1
        let xField = field2
        
        // If second field is 'year', swap them (year should group, not be x-axis)
        if (field2 === 'year') {
          groupField = field2
          xField = field1
        }
        
        const groups = [...new Set(data.map(item => item[groupField!]))]
        const xAxisValues = [...new Set(data.map(item => item[xField!]))]
        
        const series = groups.map(group => {
          const groupData = xAxisValues.map(xValue => {
            const point = data.find(
              item => item[groupField!] === group && item[xField!] === xValue
            )
            return point ? point.sales_quantity : null
          })
          
          return {
            name: String(group),
            type: 'line' as const,
            data: groupData,
            connectNulls: false,
            label: {
              show: true,
              formatter: (params: any) => Math.round(params.value).toLocaleString()
            }
          }
        })

        const option: echarts.EChartsOption = {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '4%',
            right: '4%',
            bottom: '7%',
            containLabel: true
          },
          legend: {
            data: groups.map(String),
            top: 0
          },
          xAxis: {
            type: 'category',
            data: xAxisValues,
            name: xAxisName,
            position: 'bottom',
            nameLocation: 'middle',
            nameGap: 30,
          },
          yAxis: {
            type: 'value',
            name: 'Sales Quantity',
            position: 'left',
            nameLocation: 'middle',
            nameGap: 70,
          },
          series
        }

        chart.setOption(option)
      }
    }

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
  }, [data, groupBy])

  return (
    <div ref={chartRef} className="w-full h-[500px]" />
  );
}