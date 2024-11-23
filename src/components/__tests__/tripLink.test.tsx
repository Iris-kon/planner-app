import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import { Link2 } from 'lucide-react-native';
import colors from 'tailwindcss/colors';
import { TripLink } from '../tripLink';

describe('TripLink', () => {
  const mockData = {
    id: 'test-link-id',
    title: 'Test Link',
    url: 'https://test.com'
  };

  beforeEach(() => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve(true));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render link title and url correctly', () => {
    const { getByText } = render(<TripLink data={mockData} />);
    
    expect(getByText('Test Link')).toBeTruthy();
    expect(getByText('https://test.com')).toBeTruthy();
  });

  it('should render Link2 icon with correct props', () => {
    const { UNSAFE_getByType } = render(<TripLink data={mockData} />);
    
    const link2Icon = UNSAFE_getByType(Link2);
    expect(link2Icon.props.color).toBe(colors.zinc[400].toUpperCase());
    expect(link2Icon.props.size).toBe(20);
  });

  it('should call Linking.openURL when TouchableOpacity is pressed', () => {
    const { UNSAFE_getByType } = render(<TripLink data={mockData} />);
    
    const touchable = UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(touchable);
    
    expect(Linking.openURL).toHaveBeenCalledWith(mockData.url);
    expect(Linking.openURL).toHaveBeenCalledTimes(1);
  });

  it('should have correct opacity on TouchableOpacity', () => {
    const { UNSAFE_getByType } = render(<TripLink data={mockData} />);
    
    const touchable = UNSAFE_getByType(TouchableOpacity);
    expect(touchable.props.activeOpacity).toBe(0.7);
  });
});
