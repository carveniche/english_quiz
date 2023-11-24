import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameModeSelection from "../GameModeSelection.tsx";

test("renders GameModeSelection component", () => {
  const startSpeedMathMock = jest.fn();
  const selectedPlayModeMock = jest.fn();

  render(
    <GameModeSelection
      startSpeedMath={startSpeedMathMock}
      selectedPlayMode={selectedPlayModeMock}
      remoteParticipantCount={1}
      playMode="computer"
    />
  );
  expect(screen.getByText(/Select Play Mode for Kids/i)).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText(/Play with computer/i));
});
