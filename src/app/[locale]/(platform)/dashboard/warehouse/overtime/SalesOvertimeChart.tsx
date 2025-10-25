'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface SalesData {
  [key: string]: any
  sales_quantity: number
}

interface SalesOvertimeChartProps {
  data: SalesData[]
  groupBy: string[] // e.g., ['year', 'month'] or ['month']
}

export default function SalesOvertimeChart({ data, groupBy }: SalesOvertimeChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const chart = echarts.init(chartRef.current)

    // Single field case
    if (groupBy.length === 1) {
      const xField = groupBy[0]
      
      const xAxisData = data.map(item => item[xField])
      const seriesData = data.map(item => item.sales_quantity)

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          name: xField
        },
        yAxis: {
          type: 'value',
          name: 'Sales Quantity'
        },
        series: [{
          name: 'Sales',
          type: 'line',
          data: seriesData,
          smooth: true
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
        field1 === 'year' && ['quarter', 'month', 'week_of_year'].includes(field2)
      
      if (isConcatenatedTimeline) {
        // Single line: concatenated timeline
        const xAxisData = data.map(item => `${item[field1]}-${item[field2]}`)
        const seriesData = data.map(item => item.sales_quantity)

        const option: echarts.EChartsOption = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            name: `${field1}, ${field2}`
          },
          yAxis: {
            type: 'value',
            name: 'Sales Quantity'
          },
          series: [{
            name: 'Sales',
            type: 'line',
            data: seriesData,
            smooth: true
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
        
        const groups = [...new Set(data.map(item => item[groupField]))]
        const xAxisValues = [...new Set(data.map(item => item[xField]))]
        
        const series = groups.map(group => {
          const groupData = xAxisValues.map(xValue => {
            const point = data.find(
              item => item[groupField] === group && item[xField] === xValue
            )
            return point ? point.sales_quantity : null
          })
          
          return {
            name: String(group),
            type: 'line',
            data: groupData,
            smooth: true,
            connectNulls: false
          }
        })

        const option: echarts.EChartsOption = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: groups.map(String)
          },
          xAxis: {
            type: 'category',
            data: xAxisValues,
            name: xField
          },
          yAxis: {
            type: 'value',
            name: 'Sales Quantity'
          },
          series
        }

        chart.setOption(option)
      }
    }

    // Cleanup
    return () => {
      chart.dispose()
    }
  }, [data, groupBy])

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}