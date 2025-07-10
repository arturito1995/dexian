// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { CAR_CARD_HEADER_TEST_ID, CAR_CARD_TEST_ID, CAR_CARD_YEAR_TEST_ID, CarCard } from ".";

describe("CarCard", () => {
  const car: Car = {
    id: "1",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    color: "Blue",
    price: 20000,
    mileage: 15000,
    package: "Standard",
  };

  const navigate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render car details", () => {
    const { getByTestId, unmount } = render(<CarCard car={car} navigate={navigate} />);

    expect(getByTestId(CAR_CARD_HEADER_TEST_ID).textContent).toBe(`${car.make} ${car.model}`);
    expect(getByTestId(CAR_CARD_YEAR_TEST_ID).textContent).toBe(`Year: ${car.year}`);

    unmount();
  });

  it("should navigate to car details on click", () => {
    const { getByTestId, unmount } = render(<CarCard car={car} navigate={navigate} />);

    fireEvent.click(getByTestId(CAR_CARD_TEST_ID));

    expect(navigate).toHaveBeenCalledWith(`/car/${car.id}`);

    unmount();
  });
});
