export interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

export interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}
