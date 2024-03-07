import React, {useState, useEffect} from 'react';
import MyCard from '../components/myCard'; // Correct the casing here
import { Tabs, rem , Button, Group, MultiSelect, Collapse, Paper, Grid, TextInput} from '@mantine/core';
import { CiHeart } from 'react-icons/ci';
import RecipeForm from '../components/recipeForm';
import { useDisclosure } from '@mantine/hooks';

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
        fetchFavourites();
        fetchMyRecipes();
    }, []);

    useEffect(() => {
        fetchFavourites();
    }, [favouriteAdded]);

    useEffect(() => {
        fetchMyRecipes();
    }, [added]);

    const fetchRecipes = () => {
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
            });
    }

    const fetchFavourites = () => {
        
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
            });

        
    }

    const fetchMyRecipes = () => {
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
            });
    }


    const handleSearch = () => {
        // Handle search by searchTerm
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({name: searchTerm})
        })
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
      };
    
      const handleSelect = () => {
        // Handle search by selectedIngredients
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/recipe_from_ingredients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ingredients: selectedIngredients})
        })
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
      };

    const iconStyle = { width: rem(12), height: rem(12) };

    return (
        <div style={{ margin: '0 auto', marginTop: '5rem', padding: '2rem', maxWidth: '1200px' }}>

            <Tabs color="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))" variant="pills" defaultValue="recipes">
                <Tabs.List>
                    <Tabs.Tab value="recipes" leftSection={<CiHeart style={iconStyle}/>} onClick={fetchRecipes}>
                        Recipes
                    </Tabs.Tab>
                    <Tabs.Tab value="favourites" leftSection={<CiHeart style={iconStyle} />} onClick={fetchFavourites}>
                        Favourites
                    </Tabs.Tab>
                    <Tabs.Tab value="my" leftSection={<CiHeart style={iconStyle} />} onClick={fetchMyRecipes}>
                        My Recipes
                    </Tabs.Tab>
                    <Tabs.Tab value="profile" leftSection={<CiHeart style={iconStyle} />}>
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
                    <div style={
                        { display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '20px', 
                        marginTop: '2rem' }}>
                        
                        { recipes.length>0 ?   recipes.map((recipe) => {
                            return <MyCard key={recipe.key}
                            id={recipe.id}
                            title={recipe.title}
                            description={recipe.description}
                            image={recipe.image}
                            badges={recipe.ingredients}
                            user={recipe.user}
                            user_id={recipe.user_id}
                            handler={()=>{}}
                            favourite={recipe.favourite}
                            />
                        }): <h1>No recipes found</h1>
                        }
                    </div>

                </Tabs.Panel>

                <Tabs.Panel value="favourites">
                    <div style={
                        { display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '20px', 
                        marginTop: '2rem' }}>
                        
                        { favourites.length>0 ? favourites.map((recipe) => {
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
                        }): <h1>No favourites found</h1>
                        }
                    </div>

                </Tabs.Panel>

                <Tabs.Panel value="my">
                    <Group justify="center" mb={5}>
                        <Button onClick={toggle}>Add a recipe</Button>
                    </Group>
                    <Collapse in={opened}>
                        < RecipeForm handler={changeMyRecipes}/>
                    </Collapse>
                    <div style={
                        { display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '20px', 
                        marginTop: '2rem' }}>
                    { myRecipes.length>0 &&  myRecipes.map((recipe) => {
                        return <MyCard key={recipe.key}
                        id={recipe.id}
                        title={recipe.title}
                        description={recipe.description}
                        image={recipe.image}
                        badges={recipe.ingredients}
                        user={recipe.user}
                        user_id={recipe.user_id}
                        handler={()=>{}}
                        favourite={recipe.favourite}
                        />
                    })
                    }
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="profile">
                    Profile
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}

export default Home;