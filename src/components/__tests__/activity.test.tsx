import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { Activity } from '../activity';
import { CircleCheck, CircleDashed } from 'lucide-react-native';
import colors from 'tailwindcss/colors';

describe('Activity', () => {
  const mockData = {
    id: 'test-id',
    title: 'Test Activity',
    hour: '10:00',
    isBefore: false
  };

  it('should render activity with correct title and hour', () => {
    const { getByText } = render(<Activity data={mockData} />);
    
    expect(getByText('Test Activity')).toBeTruthy();
    expect(getByText('10:00')).toBeTruthy();
  });

  it('should render CircleDashed icon when isBefore is false', () => {
    const { UNSAFE_getByType } = render(<Activity data={mockData} />);
    
    const circleDashed = UNSAFE_getByType(CircleDashed);
    expect(circleDashed.props.color).toBe(colors.zinc[400].toUpperCase());
    expect(circleDashed.props.size).toBe(20);
  });

  it('should render CircleCheck icon when isBefore is true', () => {
    const { UNSAFE_getByType } = render(
      <Activity data={{ ...mockData, isBefore: true }} />
    );
    
    const circleCheck = UNSAFE_getByType(CircleCheck);
    expect(circleCheck.props.color).toBe(colors.lime[300].toUpperCase());
    expect(circleCheck.props.size).toBe(20);
  });

  it('should apply opacity style when isBefore is true', () => {
    const { UNSAFE_getByType } = render(
      <Activity data={{ ...mockData, isBefore: true }} />
    );
    
    const view = UNSAFE_getByType(View);
    expect(view.props.className).toContain('opacity-50');
  });

  it('should not apply opacity style when isBefore is false', () => {
    const { UNSAFE_getByType } = render(<Activity data={mockData} />);
    
    const view = UNSAFE_getByType(View);
    expect(view.props.className).not.toContain('opacity-50');
  });
});
