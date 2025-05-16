import { useEffect, useState } from "react";

interface Product {
}
export default function ProductList() {
    const [products,setProducts]=useState<any[]>();
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState<string | null>(null);

    useEffect(()=>{
        const fetchProducts = async()=>{
            try{
                const response = await fetch('https://dummyjson.com/todos');
                if(!response.ok){
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                console.log(data);
                setProducts(data?.todos);
                console.log(data);
            }
            catch(err){
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
            finally{
                setLoading(false);
            }
        }
        fetchProducts();
    },[])

    if(loading){
        return <div>Loading...</div>
    }

    if(error){
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <p>Products</p>
            {products?.map((product:any)=>{
                return(
                    <div key={product.id} style={{
                        border:"1px solid #ccc",
                        padding:"1rem",
                        margin:"1rem",
                        borderRadius:"5px"
                    }}>
                        <p>Task: {product.todo}</p>
                        <p>Status: {product.completed?"Completed":"Pending"}</p>
                        
                    </div>
                )
            })}
        </div>
    )
        
}