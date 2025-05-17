import React, { useCallback, useRef, useEffect } from 'react';
import { Pokemon } from '../types/pokemon';
import { usePokemonList } from '../hooks/usePokemonList';
import { PokemonErrorBoundary } from './Pokemon/PokemonErrorBoundary';
import { PokemonCard } from './Pokemon/PokemonCard';

const PokemonList: React.FC = () => {
  const { pokemonList, loading, error, hasMore, loadMore, cache } = usePokemonList();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPokemonRef = useRef<HTMLDivElement>(null);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (lastPokemonRef.current) {
      observer.current.observe(lastPokemonRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMore]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Error: {error}</h2>
        <button
          onClick={handleRetry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <PokemonErrorBoundary onRetry={handleRetry}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Pokédex</h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          padding: '0 1rem',
        }}>
          {pokemonList.map((pokemon, index) => {
            if (index === pokemonList.length - 1) {
              return (
                <div key={pokemon.name} ref={lastPokemonRef}>
                  <PokemonCard pokemon={pokemon} cache={cache} />
                </div>
              );
            }
            return <PokemonCard key={pokemon.name} pokemon={pokemon} cache={cache} />;
          })}
        </div>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading more Pokémon...</p>
          </div>
        )}
        
        {!loading && !hasMore && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No more Pokémon to load</p>
          </div>
        )}
      </div>
    </PokemonErrorBoundary>
  );
};

export default PokemonList;