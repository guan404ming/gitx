import { Component } from 'valdi_core/src/Component';
import { Colors } from '../utils/ColorUtils';

export interface MonthLabelViewModel {
  label: string;
  width: number;
}

export class MonthLabel extends Component<MonthLabelViewModel> {
  onRender() {
    <view width={this.viewModel.width}>
      <label
        value={this.viewModel.label}
        font={systemFont(10)}
        color={Colors.textTertiary}
      />
    </view>;
  }
}
