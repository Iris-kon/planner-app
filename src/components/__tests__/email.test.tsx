import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { GuestEmail } from '../email';
import { colors } from '@/styles/colors';

describe('GuestEmail', () => {
  const mockEmail = 'test@example.com';
  const mockOnRemove = jest.fn();

  it('should render email text correctly', () => {
    const { getByText } = render(
      <GuestEmail email={mockEmail} onRemove={mockOnRemove} />
    );
    
    expect(getByText(mockEmail)).toBeTruthy();
  });

  it('should call onRemove when X button is pressed', () => {
    const { UNSAFE_getByType } = render(
      <GuestEmail email={mockEmail} onRemove={mockOnRemove} />
    );
    
    const touchable = UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(touchable);
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('should render X icon with correct props', () => {
    const { UNSAFE_getByType } = render(
      <GuestEmail email={mockEmail} onRemove={mockOnRemove} />
    );
    
    const xIcon = UNSAFE_getByType(X);
    expect(xIcon.props.color).toBe(colors.zinc[400]);
    expect(xIcon.props.size).toBe(16);
  });

  it('should have correct styling classes', () => {
    const { UNSAFE_getByType } = render(
      <GuestEmail email={mockEmail} onRemove={mockOnRemove} />
    );
    
    const container = UNSAFE_getByType(View);
    const emailText = UNSAFE_getByType(Text);
    
    expect(container.props.className).toContain('bg-zinc-800');
    expect(container.props.className).toContain('rounded-lg');
    expect(emailText.props.className).toContain('text-zinc-300');
  });
});
