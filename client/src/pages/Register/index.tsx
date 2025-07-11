import { useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { Loader } from "../../components/Loader";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Car, "id">>({
    color: "",
    make: "",
    model: "",
    package: "",
    mileage: 0,
    year: 0,
    price: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNavigateHome = () => navigate("/");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to register vehicle");

      const result = await response.json();

      if (!result.success) throw new Error(result.error || "Failed to register vehicle");

      alert("Vehicle registered successfully!");
    } catch (error) {
      alert("Error registering vehicle: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      handleNavigateHome();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericalValue = Number(value);

    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numericalValue) ? value : numericalValue,
    }));
  };

  const isSubmitBtnDisabled = useMemo(
    () => Object.values(formData).some((value) => value === "" || value === 0),
    [formData]
  );

  return (
    <>
      <h1>Register Vehicle</h1>
      {isSubmitting ? (
        <Loader />
      ) : (
        <form className={styles["register-form"]} onSubmit={handleSubmit}>
          <label htmlFor="make">
            Make:
            <input type="text" name="make" value={formData.make} onChange={handleChange} required />
          </label>
          <label htmlFor="model">
            Model:
            <input type="text" name="model" value={formData.model} onChange={handleChange} required />
          </label>
          <label htmlFor="color">
            Color:
            <input type="text" name="color" value={formData.color} onChange={handleChange} required />
          </label>
          <label htmlFor="package">
            Package:
            <input type="text" name="package" value={formData.package} onChange={handleChange} required />
          </label>
          <label htmlFor="mileage">
            Mileage:
            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required />
          </label>
          <label htmlFor="year">
            Year:
            <input type="number" name="year" value={formData.year} onChange={handleChange} required />
          </label>
          <label htmlFor="price">
            Price:
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </label>
          <button type="submit" disabled={isSubmitBtnDisabled}>
            Submit
          </button>
        </form>
      )}
      <button onClick={handleNavigateHome}>Go back to home</button>
    </>
  );
};
