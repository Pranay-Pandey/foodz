import React, { useState, useEffect } from 'react';
import MyCard from '../components/myCard';
import ProfileCard from '../components/profile';
import { Tabs, rem, Button, Group, MultiSelect, Collapse, Paper, Grid, TextInput, Center } from '@mantine/core';
import { MdFavorite, MdBroadcastOnPersonal } from 'react-icons/md';
import { FaUserCircle } from "react-icons/fa";
import RecipeForm from '../components/recipeForm';
import { useDisclosure } from '@mantine/hooks';
import { ToastContainer } from 'react-toastify';
import { BiSolidDish } from "react-icons/bi";

function Home() {
    // will check if there is token in local storage 
    // if not, redirect to login page
    if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) {
        window.location.href = '/login';
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const [recipes, setRecipes] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [opened, { toggle }] = useDisclosure(false);
    const [added, setAdded] = useState(false);
    const [favouriteAdded, setFavouriteAdded] = useState(false);
    const [myRecipes, setMyRecipes] = useState([]);

    const changeFavourite = () => {
        setFavouriteAdded(!favouriteAdded);
    };

    const changeMyRecipes = () => {
        setAdded(!added);
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        fetchFavourites();
    }, [favouriteAdded]);

    useEffect(() => {
        fetchMyRecipes();
    }, [added]);

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

    const fetchFavourites = () => {
        // Add loading to body to indicate that the page is loading
        document.body.classList.add('loading');
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/get_favourites`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setFavourites(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally(() => {
                document.body.classList.remove('loading');
            });
    }

    const fetchMyRecipes = () => {
        // Add loading to body to indicate that the page is loading
        document.body.classList.add('loading');
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/my_recipes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setMyRecipes(data);
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

    const iconStyle = { width: rem(12), height: rem(12) };

    return (
        <div style={{ margin: '0 auto', marginTop: '1rem', padding: '2rem', maxWidth: '1500px' }}>

            <Tabs color="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))" variant="pills" defaultValue="recipes">
                <Tabs.List justify='center'>
                    <Tabs.Tab value="recipes" leftSection={<BiSolidDish style={iconStyle} />} onClick={fetchRecipes}>
                        Recipes
                    </Tabs.Tab>
                    <Tabs.Tab value="favourites" leftSection={<MdFavorite style={iconStyle} />} onClick={fetchFavourites}>
                        Favourites
                    </Tabs.Tab>
                    <Tabs.Tab value="my" leftSection={<MdBroadcastOnPersonal style={iconStyle} />} onClick={fetchMyRecipes}>
                        My Recipes
                    </Tabs.Tab>
                    <Tabs.Tab value="profile" leftSection={<FaUserCircle style={iconStyle} />}>
                        Profile
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="recipes">
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

                </Tabs.Panel>

                <Tabs.Panel value="favourites">


                    {favourites.length > 0 ?
                        <div style={
                            {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '20px',
                                marginTop: '2rem'
                            }}>
                            {favourites.map((recipe) => {
                                return <MyCard key={recipe.key}
                                    id={recipe.id}
                                    title={recipe.title}
                                    description={recipe.description}
                                    image={recipe.image}
                                    badges={recipe.ingredients}
                                    user={recipe.user}
                                    user_id={recipe.user_id}
                                    handler={changeFavourite}
                                    favourite={true}
                                />
                            })}

                        </div>
                        :
                        <Center mt={10}>
                            <h1 style={{ color: "var(--bs-highlight-bg)" }}>No favourites found</h1>
                        </Center>
                    }

                </Tabs.Panel>

                <Tabs.Panel value="my">
                    <Group justify="center" mb={5} mt={10}>
                        <Button onClick={toggle}>Add a recipe</Button>
                    </Group>
                    <Collapse in={opened}>
                        < RecipeForm handler={changeMyRecipes} />
                    </Collapse>
                    <div style={
                        {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px',
                            marginTop: '2rem'
                        }}>
                        {myRecipes.length > 0 && myRecipes.map((recipe) => {
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
                        })
                        }
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="profile" >
                    <Group style={{ marginTop: "4rem" }}>
                        < ProfileCard />
                    </Group>
                </Tabs.Panel>
            </Tabs>
            <ToastContainer />
        </div>
    );
}

export default Home;