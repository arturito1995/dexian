import type { NavigateFunction } from "react-router-dom";
import styles from "./styles.module.scss";

interface CarCardProps {
  car: Car;
  navigate: NavigateFunction;
}

export const CAR_CARD_TEST_ID = "car-card-test-id";
export const CAR_CARD_HEADER_TEST_ID = "car-card-header-test-id";
export const CAR_CARD_YEAR_TEST_ID = "car-card-year-test-id";

export const CarCard = ({ car, navigate }: CarCardProps) => {
  const handleClick = () => navigate(`/car/${car.id}`);

  return (
    <div className={styles.card} role="button" onClick={handleClick} data-testid={CAR_CARD_TEST_ID}>
      <h2 data-testid={CAR_CARD_HEADER_TEST_ID}>
        {car.make} {car.model}
      </h2>
      <span data-testid={CAR_CARD_YEAR_TEST_ID}>Year: {car.year}</span>
    </div>
  );
};
