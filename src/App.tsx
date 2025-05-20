import React from 'react';
import PostList from './components/PostList';
import ProductList from './components/ProductList';
import PokemonList from './components/PokemonList';
import PostListWithPagination from './components/PostListWithPagination';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">
        <PostListWithPagination />
        
        {/* Other components can be uncommented and used as needed */}
        {/* <PostList /> */}
        {/* <ProductList /> */}
        {/* <PokemonList /> */}
      </main>
    </div>
  );
}

export default App;
