import { Component } from 'valdi_core/src/Component';
import { Colors } from '../utils/ColorUtils';

export interface EmptyStateViewModel {
  message: string;
  isLoading?: boolean;
}

export class EmptyState extends Component<EmptyStateViewModel> {
  onRender() {
    const { message, isLoading } = this.viewModel;

    <view
      width='100%'
      paddingVertical={40}
      alignItems='center'
      justifyContent='center'
    >
      {isLoading && <spinner color={Colors.textTertiary} />}
      <label
        value={message}
        font={systemFont(14)}
        color={Colors.textTertiary}
        marginTop={isLoading ? 12 : 0}
        textAlign='center'
      />
    </view>;
  }
}
