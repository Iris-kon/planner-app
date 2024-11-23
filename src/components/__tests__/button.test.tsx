import { render } from '@testing-library/react-native';
import { TouchableOpacityProps } from 'react-native';

type Variants = "primary" | "secondary"

type ButtonProps = TouchableOpacityProps & {
  variant?: Variants;
  isLoading?: boolean;
};

describe('ButtonProps type', () => {
  it('should allow variant prop', () => {
    const props: ButtonProps = {
      variant: 'primary'
    };
    expect(props.variant).toBe('primary');
  });

  it('should allow isLoading prop', () => {
    const props: ButtonProps = {
      isLoading: true
    };
    expect(props.isLoading).toBe(true);
  });

  it('should allow TouchableOpacity props', () => {
    const props: ButtonProps = {
      onPress: () => {},
      disabled: true,
      testID: 'test-button'
    };
    expect(props.disabled).toBe(true);
    expect(props.testID).toBe('test-button');
    expect(typeof props.onPress).toBe('function');
  });

  it('should allow combination of all props', () => {
    const props: ButtonProps = {
      variant: 'secondary',
      isLoading: false,
      onPress: () => {},
      disabled: false,
      testID: 'test-button'
    };
    expect(props.variant).toBe('secondary');
    expect(props.isLoading).toBe(false);
    expect(props.disabled).toBe(false);
    expect(typeof props.onPress).toBe('function');
    expect(props.testID).toBe('test-button');
  });
});
