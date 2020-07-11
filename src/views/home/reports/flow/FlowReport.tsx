import React, { useMemo, useCallback } from 'react';
import { Chart } from 'react-charts';
import { subHours, subDays } from 'date-fns';
import { chartColors } from '../../../../styles/Themes';

interface Props {
  isTime: string;
  isType: string;
  parsedData: any[];
  parsedData2: any[];
}

export const FlowReport = ({
  isTime,
  isType,
  parsedData,
  parsedData2,
}: Props) => {
  const getDate = (period: number) => {
    if (isTime === 'day') {
      return subHours(new Date(), period);
    }
    return subDays(new Date(), period);
  };

  const getFirstDate = useCallback(() => {
    switch (isTime) {
      case 'day':
        return subHours(new Date(), 25);
      case 'week':
        return subDays(new Date(), 8);
      case 'month':
        return subDays(new Date(), 151);
      default:
        break;
    }
  }, [isTime]);

  const mapped = parsedData.map(p => [getDate(p.period), p[isType]]);
  const mapped2 = parsedData2.map(p => [getDate(p.period), -1 * p[isType]]);

  const data = useMemo(
    () => [
      { label: 'Invoices', data: [[getFirstDate(), 0], ...mapped] },
      { label: 'Payments', data: [[getFirstDate(), 0], ...mapped2] },
    ],
    [mapped, mapped2, getFirstDate]
  );

  const series = React.useMemo(
    () => ({
      type: 'bar',
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom', show: false },
      {
        type: 'linear',
        position: 'left',
        show: false,
      },
    ],
    []
  );

  let barWidth = 3;
  if (isTime === 'week') {
    barWidth = 15;
  }

  const getSeriesStyle = React.useCallback(
    series => {
      if (series.index === 0) {
        return {
          color: chartColors.darkyellow,
          width: `${barWidth}px`,
        };
      }
      return {
        color: chartColors.orange2,
        width: `${barWidth}px`,
      };
    },
    [barWidth]
  );

  return (
    <div
      style={{
        width: '100%',
        height: '300px',
      }}
    >
      <Chart
        data={data}
        series={series}
        axes={axes}
        tooltip
        getSeriesStyle={getSeriesStyle}
      />
    </div>
  );
};
