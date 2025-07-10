import type { NavigateFunction } from "react-router-dom";
import styles from "./styles.module.scss";

interface CarCardProps {
  car: Car;
  navigate: NavigateFunction;
}

export const CarCard = ({ car, navigate }: CarCardProps) => {
  const handleClick = () => navigate(`/car/${car.id}`);

  return (
    <div className={styles.card} role="button" onClick={handleClick}>
      <h2>
        {car.make} {car.model}
      </h2>
      <span>Year: {car.year}</span>
    </div>
  );
};
