import { Link } from "react-router";
import { useState, useEffect } from 'react';
import { fetchWithAuth } from "../utils/fetchWithAuth";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetchWithAuth("http://localhost:3000/categories", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await res.json()
                if (res.ok) {
                    setCategories(data);
                } else {
                    console.error("Fetch error:", data.error)
                }
            } catch (err) {
                console.error("Server error:", err)
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    if (loading) return <div>Loading categories...</div>;

    return (
        <>
            {categories.map((category) => (
                <li>
                    <Link to="/journals" className="text-[var(--text-light)] hover:text-[var(--accent)] transition px-4">{category.name}</Link>
                </li>
            ))}
            
        </>
    );
}

export default CategoryList;