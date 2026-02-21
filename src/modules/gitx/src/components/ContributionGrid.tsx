import { StatefulComponent } from 'valdi_core/src/Component';
import { ContributionCalendar } from '../models/Contribution';
import { Colors } from '../utils/ColorUtils';
import { getMonthFromDateStr, getMonthLabel } from '../utils/DateUtils';
import { DayCell } from './DayCell';
import { MonthLabel } from './MonthLabel';
import { styles } from '../utils/Styles';

export interface ContributionGridViewModel {
  calendar: ContributionCalendar;
}

interface GridState {
  selectedDate: string | null;
  selectedCount: number;
}

const CELL_SIZE = 11;
const CELL_GAP = 2;
const CELL_TOTAL = CELL_SIZE + CELL_GAP;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export class ContributionGrid extends StatefulComponent<ContributionGridViewModel, GridState> {
  state: GridState = { selectedDate: null, selectedCount: 0 };

  private handleDayTap = (date: string, count: number) => {
    this.setState({ selectedDate: date, selectedCount: count });
  };

  onRender() {
    const { calendar } = this.viewModel;
    const { selectedDate, selectedCount } = this.state;

    // Build month labels
    const monthLabels = this.buildMonthLabels(calendar);

    <view style={styles.card}>
      {/* Header */}
      <view flexDirection='row' justifyContent='space-between' marginBottom={8}>
        <label
          value={`${calendar.totalContributions} contributions in the last year`}
          font={systemFont(13)}
          color={Colors.textSecondary}
        />
      </view>

      {/* Selected day tooltip */}
      {selectedDate !== null && (
        <view
          backgroundColor={Colors.textPrimary}
          borderRadius={4}
          padding={6}
          marginBottom={8}
          alignSelf='flex-start'
        >
          <label
            value={`${selectedCount} contributions on ${selectedDate}`}
            font={systemFont(11)}
            color={Colors.background}
          />
        </view>
      )}

      {/* Month labels row */}
      <scroll horizontal={true} width='100%'>
        <view flexDirection='column'>
          {/* Month markers */}
          <view flexDirection='row' marginLeft={28} marginBottom={4}>
            {monthLabels.forEach((m) => {
              <MonthLabel label={m.label} width={m.width} />;
            })}
          </view>

          {/* Grid area: day labels + cells */}
          <view flexDirection='row'>
            {/* Day-of-week labels */}
            <view flexDirection='column' marginRight={4} width={24}>
              {DAY_LABELS.forEach((label) => {
                <view height={CELL_TOTAL} justifyContent='center'>
                  <label
                    value={label}
                    font={systemFont(9)}
                    color={Colors.textTertiary}
                  />
                </view>;
              })}
            </view>

            {/* Week columns */}
            <view flexDirection='row'>
              {calendar.weeks.forEach((week) => {
                <view flexDirection='column'>
                  {week.days.forEach((day) => {
                    <view margin={1}>
                      <DayCell
                        level={day.level}
                        count={day.count}
                        date={day.date}
                        size={CELL_SIZE}
                        onTap={this.handleDayTap}
                      />
                    </view>;
                  })}
                </view>;
              })}
            </view>
          </view>
        </view>
      </scroll>

      {/* Legend */}
      <view flexDirection='row' alignItems='center' justifyContent='flex-end' marginTop={8}>
        <label value='Less' font={systemFont(9)} color={Colors.textTertiary} marginRight={4} />
        {([0, 1, 2, 3, 4] as const).forEach((level) => {
          <DayCell level={level} count={0} date='' size={CELL_SIZE} />;
        })}
        <label value='More' font={systemFont(9)} color={Colors.textTertiary} marginLeft={4} />
      </view>
    </view>;
  }

  private buildMonthLabels(
    calendar: ContributionCalendar
  ): Array<{ label: string; width: number }> {
    const labels: Array<{ label: string; width: number }> = [];
    let currentMonth = -1;
    let weekCount = 0;

    for (const week of calendar.weeks) {
      const firstDay = week.days[0];
      if (!firstDay) continue;

      const month = getMonthFromDateStr(firstDay.date);
      if (month !== currentMonth) {
        if (currentMonth !== -1) {
          labels.push({
            label: getMonthLabel(currentMonth),
            width: weekCount * CELL_TOTAL,
          });
        }
        currentMonth = month;
        weekCount = 1;
      } else {
        weekCount++;
      }
    }

    // Push last month
    if (currentMonth !== -1) {
      labels.push({
        label: getMonthLabel(currentMonth),
        width: weekCount * CELL_TOTAL,
      });
    }

    return labels;
  }
}
