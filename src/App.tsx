import React from 'react';
import { CircleSlash2 } from 'lucide-react';

// Pokemon types
const POKEMON_TYPES = [
  'Fire', 'Water', 'Grass', 'Steel', 'Flying', 'Electric', 
  'Poison', 'Psychic', 'Dark', 'Fighting', 'Dragon', 'Ice',
  'Fairy', 'Normal', 'Ground', 'Rock', 'Bug', 'Ghost'
];

// Helper function to get random types (1 or 2)
const getRandomTypes = () => {
  const shuffled = [...POKEMON_TYPES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.random() > 0.5 ? 1 : 2);
};

// Generate placeholder Pokemon data
const pokemonList = Array.from({ length: 151 }, (_, index) => ({
  id: index + 1,
  name: `Pokemon #${index + 1}`,
  types: getRandomTypes(),
}));

// Type badge component
const TypeBadge = ({ type }: { type: string }) => {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Fire: 'bg-red-500',
      Water: 'bg-blue-500',
      Grass: 'bg-green-500',
      Steel: 'bg-gray-400',
      Flying: 'bg-blue-300',
      Electric: 'bg-yellow-400',
      Poison: 'bg-purple-500',
      Psychic: 'bg-pink-500',
      Dark: 'bg-gray-700',
      Fighting: 'bg-red-700',
      Dragon: 'bg-indigo-600',
      Ice: 'bg-cyan-300',
      Fairy: 'bg-pink-300',
      Normal: 'bg-gray-400',
      Ground: 'bg-yellow-600',
      Rock: 'bg-yellow-800',
      Bug: 'bg-lime-500',
      Ghost: 'bg-purple-700'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <span className={`${getTypeColor(type)} text-white px-3 py-1 rounded-full text-sm font-medium mr-2`}>
      {type}
    </span>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white py-6 shadow-lg mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center">Pokédex</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pb-8">
        <div className="grid gap-4">
          {pokemonList.map((pokemon) => (
            <div 
              key={pokemon.id}
              className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`/pokemon/${pokemon.id}.png`}
                    alt={`Pokemon #${pokemon.id}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '';
                      target.parentElement?.classList.add('bg-gray-200');
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                      target.parentElement?.appendChild(icon);
                    }}
                  />
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    {pokemon.name}
                  </h2>
                  <span className="text-gray-500 text-sm">#{String(pokemon.id).padStart(3, '0')}</span>
                </div>
                
                <div className="mt-2">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </div>
                
                <div className="mt-3 text-gray-400 text-sm italic border-t pt-2">
                  Description placeholder...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;