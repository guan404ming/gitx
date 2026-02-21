import { Component } from 'valdi_core/src/Component';
import { ContributionLevel } from '../models/Contribution';
import { getHeatmapColor } from '../utils/ColorUtils';

export interface DayCellViewModel {
  level: ContributionLevel;
  count: number;
  date: string;
  size: number;
  onTap?: (date: string, count: number) => void;
}

export class DayCell extends Component<DayCellViewModel> {
  onRender() {
    const { level, count, date, size, onTap } = this.viewModel;
    const color = getHeatmapColor(level);

    <view
      width={size}
      height={size}
      backgroundColor={color}
      borderRadius={2}
      onTap={() => onTap?.(date, count)}
    />;
  }
}
