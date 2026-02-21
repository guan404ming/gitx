import { Component } from 'valdi_core/src/Component';
import { Colors } from '../utils/ColorUtils';

export interface SectionHeaderViewModel {
  title: string;
}

export class SectionHeader extends Component<SectionHeaderViewModel> {
  onRender() {
    <view paddingHorizontal={16} paddingTop={24} paddingBottom={8}>
      <label
        value={this.viewModel.title}
        font={systemBoldFont(16)}
        color={Colors.textPrimary}
      />
    </view>;
  }
}
