import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Menu, Search, MoonIcon as PokemonIcon, List } from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  description: string;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function TypeBadge({ type }: { type: string }) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      grass: 'bg-green-500',
      steel: 'bg-gray-400',
      flying: 'bg-blue-300',
      electric: 'bg-yellow-400',
      poison: 'bg-purple-500',
      psychic: 'bg-pink-500',
      dark: 'bg-gray-700',
      fighting: 'bg-red-700',
      dragon: 'bg-indigo-600',
      ice: 'bg-cyan-300',
      fairy: 'bg-pink-300',
      normal: 'bg-gray-400',
      ground: 'bg-yellow-600',
      rock: 'bg-yellow-800',
      bug: 'bg-lime-500',
      ghost: 'bg-purple-700'
    };
    return colors[type.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <span className={`${getTypeColor(type)} text-white px-3 py-1 rounded-full text-sm font-medium mr-2`}>
      {capitalizeFirstLetter(type)}
    </span>
  );
}

function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        console.log('Fetching Pokemon data...');
        const { data, error } = await supabase
          .from('pokemon')
          .select('*')
          .order('id');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn('No Pokemon data received');
          throw new Error('No Pokemon data available');
        }

        console.log('Pokemon data received:', data.length, 'records');
        setPokemonList(data);
      } catch (err) {
        console.error('Error fetching Pokemon:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching Pokemon data');
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemonList.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || pokemon.types.includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  const allTypes = Array.from(new Set(pokemonList.flatMap(pokemon => pokemon.types)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading Pokédex...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white py-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold" style={{ fontFamily: 'Pokemon Solid, system-ui' }}>Pokédex</h1>
              <div className="flex items-center mt-2">
                <PokemonIcon size={24} className="mr-2" />
                <span className="text-sm font-semibold">Kanto Region</span>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-red-700 rounded-full transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="container mx-auto px-4 py-4 bg-white shadow-lg mt-2">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Pokémon..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Filter by Type:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`px-3 py-1 rounded-full text-sm ${!selectedType ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                >
                  All
                </button>
                {allTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedType === type ? 'bg-gray-800 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {capitalizeFirstLetter(type)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold flex items-center">
              <List className="mr-2" />
              Generation 1
            </h2>
          </div>
          <div className="divide-y">
            {filteredPokemon.map((pokemon) => (
              <div 
                key={pokemon.id}
                className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    <img 
                      src={`/pokemon/${pokemon.id}.png`}
                      alt={pokemon.name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '';
                        target.parentElement?.classList.add('bg-gray-200');
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {pokemon.name}
                    </h3>
                    <span className="ml-2 text-sm text-gray-500">#{String(pokemon.id).padStart(3, '0')}</span>
                  </div>
                  
                  <div className="mt-1">
                    {pokemon.types.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {pokemon.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;