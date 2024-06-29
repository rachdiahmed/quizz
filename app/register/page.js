"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import background from "../../public/background.png";


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check registration status on page load
    checkRegistration();
  }, []);

  const checkRegistration = async () => {
    try {
      const response = await fetch("/api/check-registration");
      if (response.ok) {
        // If user is already registered, redirect to quiz
        router.push("/quiz/1");
      }
    } catch (error) {
      console.error("Failed to check registration:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Simulate registration request
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName: name, email, phoneNumber: phone }),
      });

      if (response.ok) {
        // If registration succeeds, redirect to quiz
        const data = await response.json();
        const userID = data.id;
        localStorage.setItem("userID", userID);
        router.push("/quiz");
       
      } else {
        alert("Failed to register");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="bg-white p-8 rounded shadow-lg max-w-xl w-full">
        <h1
          className="text-6xl font-extrabold text-center mb-4"
          style={{ fontFamily: "Poppins", fontWeight: 700, color: "#19255B" }}
        >
          Identification
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold text-lg"
              style={{ fontFamily: "Poppins", color: "#19255B" }}
            >
              Nom et prénom :
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              placeholder="Veuillez saisir votre nom et prénom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold text-lg"
              style={{ fontFamily: "Poppins", color: "#19255B" }}
            >
              Adresse E-mail :
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded"
              placeholder="Veuillez saisir adresse E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-bold text-lg"
              style={{ fontFamily: "Poppins", color: "#19255B" }}
            >
              Téléphone :
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded"
              placeholder="Veuillez saisir téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-4 px-3 rounded"
              style={{
                backgroundColor: "#19255B",
                width: "70%",
                maxWidth: "300px",
              }}
            >
              Suivant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
