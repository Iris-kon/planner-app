import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { CircleCheck, CircleDashed } from 'lucide-react-native';
import { Participant } from '../participant';

import { colors } from "@/styles/colors"

describe('Participant', () => {
  const mockParticipantData = {
    id: 'test-id-john',
    name: 'John Doe',
    email: 'john@example.com',
    is_confirmed: true
  };

  it('should render participant name and email', () => {
    const { getByText } = render(<Participant data={mockParticipantData} />);
    
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
  });

  it('should render "Pendente" when name is null', () => {
    const { getByText } = render(
      <Participant 
        data={{ ...mockParticipantData, name: null }} 
      />
    );
    
    expect(getByText('Pendente')).toBeTruthy();
  });

  it('should render CircleCheck when participant is confirmed', () => {
    const { UNSAFE_getByType } = render(
      <Participant data={mockParticipantData} />
    );
    
    const checkIcon = UNSAFE_getByType(CircleCheck);
    expect(checkIcon.props.color).toBe(colors.lime[300]);
    expect(checkIcon.props.size).toBe(20);
  });

  it('should render CircleDashed when participant is not confirmed', () => {
    const { UNSAFE_getByType } = render(
      <Participant 
        data={{ ...mockParticipantData, is_confirmed: false }} 
      />
    );
    
    const dashedIcon = UNSAFE_getByType(CircleDashed);
    expect(dashedIcon.props.color).toBe(colors.zinc[400]);
    expect(dashedIcon.props.size).toBe(20);
  });
});
