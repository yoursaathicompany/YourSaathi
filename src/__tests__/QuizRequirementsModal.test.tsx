import { render, screen, fireEvent } from '@testing-library/react';
import QuizRequirementsModal from '@/components/QuizRequirementsModal';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('QuizRequirementsModal', () => {
  it('renders without crashing', () => {
    render(<QuizRequirementsModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Generate Quiz')).toBeInTheDocument();
  });

  it('allows user input', () => {
    render(<QuizRequirementsModal isOpen={true} onClose={() => {}} />);
    
    const input = screen.getByPlaceholderText(/e.g. Photosynthesis/i);
    fireEvent.change(input, { target: { value: 'Biology' } });
    
    expect(input).toHaveValue('Biology');
  });

  it('does not render when closed', () => {
    const { container } = render(<QuizRequirementsModal isOpen={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
