import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Input } from '../input';

describe('Input', () => {
  it('should render with default primary variant', () => {
    const { UNSAFE_getByType } = render(
      <Input >
        <Text>Test Content</Text>
      </Input>
    );
    const view = UNSAFE_getByType(View);
    expect(view.props.className).not.toContain('border-zinc-800');
    expect(view.props.className).not.toContain('bg-zinc-950');
    expect(view.props.className).not.toContain('bg-zinc-900');
  });

  it('should render with secondary variant', () => {
    const { UNSAFE_getByType } = render(
      <Input variant="secondary" >
        <Text>Test Content</Text>
      </Input>
    );
    const view = UNSAFE_getByType(View);
    expect(view.props.className).toContain('border-zinc-800');
    expect(view.props.className).toContain('bg-zinc-950');
  });

  it('should render with tertiary variant', () => {
    const { UNSAFE_getByType } = render(
      <Input variant="tertiary" >
        <Text>Test Content</Text>
      </Input>
    );
    const view = UNSAFE_getByType(View);
    expect(view.props.className).toContain('border-zinc-800');
    expect(view.props.className).toContain('bg-zinc-900');
  });

  it('should apply custom className', () => {
    const { UNSAFE_getByType } = render(
      <Input className="test-class" >
        <Text>Test Content</Text>
      </Input>
    );
    const view = UNSAFE_getByType(View);
    expect(view.props.className).toContain('test-class');
  });

  it('should render children content', () => {
    const { getByText } = render(
      <Input>
        <View>
          <Text>Test Content</Text>
        </View>
      </Input>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should pass through rest props', () => {
    const testId = 'test-input';
    const { getByTestId } = render(
      <Input testID={testId} >
        <Text>Test Content</Text>
      </Input>
    );
    expect(getByTestId(testId)).toBeTruthy();
  });
});
