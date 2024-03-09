import React, { useState, useEffect } from 'react';
import MyCard from '../components/myCard';
import { Button,  MultiSelect, Paper, Grid, TextInput, Center } from '@mantine/core';

const RecipeSearch = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const [recipes, setRecipes] = useState([]);
    let render = props.render;

    useEffect(() => {
        fetchRecipes();
    }, [render]);

    const fetchRecipes = () => {
        // Add loading to body to indicate that the page is loading
        document.body.classList.add('loading');
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/ingredients`)
            .then(response => response.json())
            .then(data => {
                data = data.map((ingredient) => {
                    return ingredient.name;
                }
                );
                setIngredients(data);
            })
            .catch(error => console.error(error));

        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally(() => {
                document.body.classList.remove('loading');
            });
    }

    const handleSearch = () => {
        // Handle search by searchTerm
        // Add loading to body 
        document.body.classList.add('loading');
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: searchTerm })
        })
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally(() => {
                document.body.classList.remove('loading');
            });
    };

    const handleSelect = () => {
        // Handle search by selectedIngredients
        // Add loading to body
        document.body.classList.add('loading');
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/recipe_from_ingredients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ ingredients: selectedIngredients })
        })
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally(() => {
                document.body.classList.remove('loading');
            });
    };

    return (
        <>
        <Paper p="xl" shadow="xs" style={{ maxWidth: 800, margin: 'auto', marginTop: '2rem' }}>
                        <Grid style={{ marginBottom: 15 }}>
                            <Grid.Col span={8}>
                                <TextInput
                                    label="Search"
                                    placeholder="Enter search term"
                                    value={searchTerm}
                                    onChange={
                                        (event) => {
                                            let value = event.currentTarget.value
                                            console.log(value)
                                            setSearchTerm(value)
                                        }
                                    }
                                    disabled={selectedIngredients.length > 0}
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <MultiSelect
                                    data={ingredients}
                                    label="Ingredients"
                                    placeholder="Select ingredients"
                                    value={selectedIngredients}
                                    onChange={setSelectedIngredients}
                                    disabled={searchTerm !== ''}
                                    searchable
                                />
                            </Grid.Col>
                        </Grid>
                        <Button onClick={searchTerm !== '' ? handleSearch : handleSelect}>
                            Search
                        </Button>
                    </Paper>


                    {recipes.length > 0 ?
                        <div style={
                            {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '20px',
                                marginTop: '2rem'
                            }}>
                            {recipes.map((recipe) => {
                                return <MyCard key={recipe.key}
                                    id={recipe.id}
                                    title={recipe.title}
                                    description={recipe.description}
                                    image={recipe.image}
                                    badges={recipe.ingredients}
                                    user={recipe.user}
                                    user_id={recipe.user_id}
                                    handler={() => { }}
                                    favourite={recipe.favourite}
                                />

                            })}
                        </div> : <Center mt={10}>
                            <h1 style={{ color: "var(--bs-highlight-bg)" }}>No recipes found</h1>
                        </Center>
                    }
        </>
    )
}

export default RecipeSearch;