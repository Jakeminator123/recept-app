import { useState } from "react";

export default function Index() {
  const [recipe, setRecipe] = useState(null);

  async function generateRecipe(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch("https://ulrika.onrender.com/generate", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setRecipe(data.recipe);
  }

  function formatRecipe(recipeText) {
    const sections = recipeText.split(/\n(?=\d\))/);
    return sections.map((section, index) => (
      <div key={index} className="mb-4">
        <h2 className="font-semibold text-xl mb-1">{section.split("\n")[0]}</h2>
        <p>{section.split("\n").slice(1).join("\n")}</p>
      </div>
    ));
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-8">
      <h1 className="text-3xl font-bold text-center">Generera Longevity‑recept 🍽️</h1>

      <form onSubmit={generateRecipe} encType="multipart/form-data" className="space-y-4">
        <select name="choice" className="block border p-2 w-full rounded">
          <option value="1">Inventarielista (.txt)</option>
          <option value="2">Bild på kylskåpet (.jpg/.png)</option>
          <option value="3">Befintlig inventarielista (.txt)</option>
        </select>

        <input
          type="file"
          name="textfile"
          accept=".txt,.jpg,.png"
          className="block border p-2 w-full rounded"
        />

        <input name="difficulty" placeholder="Svårighetsgrad" className="block border p-2 w-full rounded" required />
        <input name="meal_type" placeholder="Måltid" className="block border p-2 w-full rounded" required />
        <input name="num_people" placeholder="Antal personer" className="block border p-2 w-full rounded" required />
        <input name="cuisine_pref" placeholder="Kök (valfritt)" className="block border p-2 w-full rounded" />
        <input name="dietary_pref" placeholder="Kost (valfritt)" className="block border p-2 w-full rounded" />

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Generera recept
        </button>
      </form>

      {recipe && (
        <div className="mt-6 p-6 border rounded bg-gray-50 shadow-lg whitespace-pre-line">
          {formatRecipe(recipe)}
        </div>
      )}
    </div>
  );
}