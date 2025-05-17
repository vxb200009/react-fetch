import { useState, useEffect, useCallback, useMemo } from 'react';
import { Pokemon, PokemonResponse } from '../types/pokemon';

interface UsePokemonListReturn {
  pokemonList: Pokemon[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export const usePokemonList = (): UsePokemonListReturn => {
  const [pokemonList, setPokemonList] = useState<Set<Pokemon>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextUrl, setNextUrl] = useState<string | null>("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0");

  const fetchPokemon = useCallback(async () => {
    if (!nextUrl || loading) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching from:", nextUrl);
      
      const response = await fetch(nextUrl);
      
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

      setPokemonList(prev => new Set([...Array.from(prev), ...pokemonDetails]));
      setHasMore(!!data.next);
      setNextUrl(data.next);
      console.log("Fetched pokemon:", pokemonDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon data');
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && nextUrl) {
      fetchPokemon();
    }
  }, [loading, hasMore, nextUrl, fetchPokemon]);

  // Initial fetch
  useEffect(() => {
    fetchPokemon();
    // We only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pokemonList: Array.from(pokemonList),
    loading,
    error,
    hasMore,
    loadMore,
  };
};
