"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import claims from "@/data/claims.json";
import { Claim } from "@/types/claim";

type FormValues = {
  claimID: string;
};

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = (formData: FormValues) => {
    const claim = claims.find(
      (item) =>
        item.claimID.toLowerCase() === formData.claimID.trim().toLowerCase()
    );

    if (claim) {
      router.push(`/home/${formData.claimID}`);
    } else {
      alert("❌ Invalid Claim ID");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-600 to-black px-4">
      {/* Card */}
      <div className="flex flex-col text-black self-center py-10 px-6 sm:px-10 bg-white w-full max-w-md md:max-w-lg lg:max-w-xl rounded-lg shadow-lg">
        <h1 className="font-bold text-red-500 text-3xl sm:text-4xl text-center">
          Claim Portal
        </h1>
        <p className="mt-6 sm:mt-10 text-base sm:text-lg text-gray-500 text-center">
          Enter claim ID below to check your claim status
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row mt-6 sm:mt-8 gap-4 sm:gap-5 justify-center"
        >
          <input
            className="border border-red-400 rounded-lg p-2 w-full sm:w-[60%] text-black"
            type="text"
            placeholder="Claim ID"
            {...register("claimID", { required: "Claim ID is required" })}
          />

          <button
            className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg font-semibold w-full sm:w-auto"
            type="submit"
          >
            View Claim
          </button>
        </form>

        {errors.claimID && (
          <span className="bg-red-500 text-white px-3 py-2 mt-4 rounded-lg block text-center text-sm sm:text-base">
            {errors.claimID.message}
          </span>
        )}
      </div>
    </div>
  );
}
