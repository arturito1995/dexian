import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import { CarList } from "../../components/CarList";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";

export const Home = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/cars`);

        if (!response.ok) throw new Error("Failed to fetch cars");

        const result = await response.json();

        if (!result.success) throw new Error("Failed to fetch cars");

        setCars(result.cars);
      } catch (error) {
        setError("Error fetching cars: " + (error instanceof Error ? error.message : "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (isLoading) return <Loader />;

  if (error) return <p>{error}</p>;

  return (
    <>
      <div className={styles.header}>
        <h1>Cars List</h1>
        <button onClick={() => navigate("/register")}>Register new car</button>
      </div>

      {cars.length > 0 ? <CarList cars={cars} /> : <p>No cars available</p>}
    </>
  );
};
