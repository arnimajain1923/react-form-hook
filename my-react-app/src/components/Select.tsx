import {useForm} from "react-hook-form";
import React from "react";
import {DevTool} from "@hookform/devtools";

export const Select =()=> {

  const form = useForm<FormValues>();
  const {register , control , formState} = form ;
  const {errors} = formState;
  type FormValues ={
    username : String
    email : String
    password :String
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
 
  return (
    <div className="bg-cyan-700 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit} 
        noValidate
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Sign Up
        </h1>

        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            {...register('username' ,{
              required:"username is required",
              pattern:{
                value:/^[a-zA-Z][a-zA-Z0-9-_]{3,19}$/,
                message:"Username must start with a letter(4-20 characters)",
              },
              validate:{
                usernameLength:(fieldValue)=>{
                  return fieldValue.length >= 8 || "username must be atleast 8 character long!"
                }
              }
                
            })}
          
            className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p >
            {errors.username?.message}
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            {...register('email',{
              required:"email is required",
              pattern:{
                value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message:"Invalid email address",
              }
              
            })}
            
            className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p>
            {errors.email?.message}
          </p>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            {...register('password',{
              required:"password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|;:'",.<>?/]).{8,}$/,
                message: "Password is not strong"
              }
            })}
            
            className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p>
            {errors.password?.message}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium py-2 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          Submit
        </button>
      </form>
      <DevTool control={control}/>
    </div>
  );
}

export default Select;
