'use client'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip,Filler} from 'chart.js'
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
)

export default function ReportChart({ report }) {
  return (
      <Line
        options={{
          fill:true,
          borderColor:'#03A9F5',
          backgroundColor: (context) => {
            const bgColor = [
              'rgba(16, 156, 241, 0.2)',
              'rgba(16, 156, 241, 0.2)',
            ];
          
            if (!context.chart.chartArea) return;
          
            const { ctx, chartArea: { top, bottom } } = context.chart;
          
            const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
          
            gradientBg.addColorStop(0.43, bgColor[0]);
            gradientBg.addColorStop(0.9957, 'rgba(16, 156, 241, 0)');
          
            return gradientBg;
          },
          
          scales: {
            y: {
              border:{
                dash:[15,10]
              },
              grid: { 
                display: true,
              }
            },
            x: {
              grid: { display: false}
            }
          }
        }}
        data={report}
        className='w-full h-full'
      />
  )
}
