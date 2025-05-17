import { useState, useEffect, useCallback, useMemo } from 'react';
import { Pokemon, PokemonResponse } from '../types/pokemon';

interface UsePokemonListReturn {
  pokemonList: Pokemon[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  cache: Map<number, Pokemon>;
}

export const usePokemonList = (): UsePokemonListReturn => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cache, setCache] = useState<Map<number, Pokemon>>(new Map());

  const fetchPokemon = useCallback(async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(currentPage - 1) * 20}`);
      
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
      const newCache = new Map(cache);
      pokemonDetails.forEach((pokemon) => {
        newCache.set(pokemon.id, pokemon);
      });
      setCache(newCache);

      setPokemonList(prev => [...prev, ...data.results]);
      setHasMore(!!data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon data');
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
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
