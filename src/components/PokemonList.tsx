import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

const PokemonErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      console.error('PokemonList error:', event);
      setHasError(true);
    };

    window.addEventListener('error', handleError as EventListener);
    window.addEventListener('unhandledrejection', handleError as EventListener);

    return () => {
      window.removeEventListener('error', handleError as EventListener);
      window.removeEventListener('unhandledrejection', handleError as EventListener);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Something went wrong!</h2>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

const usePokemonList = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cache, setCache] = useState<Map<number, Pokemon>>(new Map());

  const fetchPokemon = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(page - 1) * 20}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PokemonResponse = await response.json();
      
      // Fetch additional details for each Pokemon
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch details for ${pokemon.name}`);
          }
          return detailResponse.json();
        })
      );

      // Update cache with new Pokemon details
      pokemonDetails.forEach((pokemon) => {
        cache.set(pokemon.id, pokemon as Pokemon);
      });
      setCache(new Map(cache));

      setPokemonList([...pokemonList, ...data.results]);
      setHasMore(!!data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon data');
    } finally {
      setLoading(false);
    }
  }, [pokemonList, cache]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    fetchPokemon(page);
  }, [page, fetchPokemon]);

  return {
    pokemonList,
    loading,
    error,
    hasMore,
    loadMore,
    cache,
  };
};

const PokemonCard = React.memo(({ pokemon, cache }: { pokemon: Pokemon; cache: Map<number, Pokemon> }) => {
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
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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

export default function PokemonList() {
  const { pokemonList, loading, error, hasMore, loadMore, cache } = usePokemonList();

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Error: {error}</h2>
        <button
          onClick={() => window.location.reload()}
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Pokemon List</h1>
      
      <PokemonErrorBoundary>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {pokemonList.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} cache={cache} />
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              border: '2px solid #4CAF50',
              borderRadius: '50%',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
            }}></div>
          </div>
        )}

        {!loading && hasMore && (
          <button
            onClick={loadMore}
            style={{
              display: 'block',
              margin: '2rem auto',
              padding: '0.5rem 1rem',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Load More
          </button>
        )}
      </PokemonErrorBoundary>
    </div>
  );
}