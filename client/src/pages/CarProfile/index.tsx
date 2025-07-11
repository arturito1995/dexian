import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Loader } from "../../components/Loader";

import styles from "./styles.module.scss";

export const CarProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleNavigateHome = () => navigate("/");

  const handleDeleteCar = async () => {
    try {
      setIsLoading(true);
      if (!id) throw new Error("Car ID is required to delete");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete car");
    } catch {
      alert("Error deleting car. Please try again later.");
    } finally {
      setIsLoading(false);
      handleNavigateHome();
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Car ID is required");
      setIsLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/cars/${id}`);

        if (!response.ok) throw new Error("Failed to fetch car details");

        const result = await response.json();

        if (!result.success) throw new Error("Failed to fetch car details");

        setCar(result.car);
      } catch (error) {
        setError("Error fetching car: " + (error instanceof Error ? error.message : "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (isLoading) return <Loader />;

  if (error) return <p>{error}</p>;

  return (
    <div className={styles.wrapper}>
      {car ? (
        <>
          <h1>
            {car.make} {car.model}
          </h1>
          <div className={styles.profile}>
            <span>Year: {car.year}</span>
            <span>Color: {car.color}</span>
            <span>Price: ${car.price}</span>
            <span>Mileage: {car.mileage} mi</span>
            <span>Package: {car.package}</span>
          </div>
        </>
      ) : (
        <h1>No info to show</h1>
      )}
      <button onClick={handleDeleteCar}>Delete car</button>
      <button onClick={handleNavigateHome}>Go back to home</button>
    </div>
  );
};
