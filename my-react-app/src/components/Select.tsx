import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import React from "react";
import { DevTool } from "@hookform/devtools";



// Define the types for form data
interface FormData {
  username: string;
  email: string;
  password: string;
}

// Joi schema for validation


const schema = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must not exceed 20 characters",
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid format",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
});

const Select: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<FormData>({
    resolver: joiResolver(schema), // Connect Joi validation
  });

  const onSubmit = async (data:any) => {
    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result:any = await response.json();

      if (response.ok) {
        alert(result.message); // Success message from backend
        reset(); // Reset form after successful submission
      } else {
        alert(result.error); // Error message from backend
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Username</label>
        <input
          type="text"
          {...register("username")}
        />
        {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          {...register("email")}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          {...register("password")}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
      </div>

      <button type="submit">Submit</button>
      <DevTool control={control} />
    </form>
    </div>
    
  );
};

export default Select;
