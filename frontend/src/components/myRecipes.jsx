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
import RecipeSearch from '../components/recipeSearch';
import Favourites from '../components/favourites';

const MyRecipes = (props) => {
    const [opened, { toggle }] = useDisclosure(false);
    const [myRecipes, setMyRecipes] = useState([]);
    const [added, setAdded] = useState(false);
    let render = props.render;

    useEffect(() => {
        fetchMyRecipes();
    }, [added, render]);

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

    const changeMyRecipes = () => {
        setAdded(!added);
    };

    const onDelete = (id) => {
        // remove the recipe from the list myRecipes
        setMyRecipes(myRecipes.filter(recipe => recipe.id !== id));
    }

    return (
        <>
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
                        handler={() => { }}
                        favourite={recipe.favourite}
                        myRecipe={true}
                        onDelete={()=>{onDelete(recipe.id)}}
                    />
                })
                }
            </div>
        </>
    )
};

export default MyRecipes;