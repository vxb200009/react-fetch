import React from 'react';
import { Pokemon } from '../../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  cache: Map<number, Pokemon>;
  onClick?: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = React.memo(({ pokemon, cache, onClick }) => {
  const cachedPokemon = cache.get(pokemon.id);
  const type = cachedPokemon?.types?.[0]?.type?.name || 'unknown';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
        margin: '0.5rem',
        borderRadius: '8px',
        backgroundColor: '#f5f5f5',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onClick={onClick}
    >
      <h3 style={{ margin: '0.5rem 0' }}>{pokemon.name}</h3>
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <span style={{ fontSize: '2rem' }}>#{pokemon.id}</span>
      </div>
      <div
        style={{
          backgroundColor: `#${type.charAt(0).toUpperCase()}${type.slice(1)}`,
          color: '#fff',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
        }}
      >
        {type}
      </div>
    </div>
  );
});
