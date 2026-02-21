import { Component } from 'valdi_core/src/Component';
import { Colors } from '../utils/ColorUtils';
import { styles } from '../utils/Styles';

export interface StatsCardViewModel {
  label: string;
  value: string;
}

export class StatsCard extends Component<StatsCardViewModel> {
  onRender() {
    const { label, value } = this.viewModel;

    <view style={styles.cardInner}>
      <label
        value={value}
        font={systemBoldFont(22)}
        color={Colors.textPrimary}
      />
      <label
        value={label}
        font={systemFont(12)}
        color={Colors.textSecondary}
        marginTop={4}
      />
    </view>;
  }
}
