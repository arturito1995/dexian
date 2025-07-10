import { useNavigate } from "react-router-dom";

import { CarCard } from "../CarCard";

import styles from "./styles.module.scss";

interface CarListProps {
  cars: Car[];
}

export const CarList = ({ cars }: CarListProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      {cars.map((car) => (
        <CarCard key={car.id} car={car} navigate={navigate} />
      ))}
    </div>
  );
};
