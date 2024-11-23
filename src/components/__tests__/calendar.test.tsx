import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { Calendar } from '../calendar';

describe('Calendar', () => {
  it('should render calendar component', () => {
    const { UNSAFE_getByType } = render(<Calendar />);
    
    const view = UNSAFE_getByType(View);
    expect(view).toBeTruthy();
  });
});
