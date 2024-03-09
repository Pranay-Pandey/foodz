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
import MyRecipes from '../components/myRecipes';

function Home() {
    // will check if there is token in local storage 
    // if not, redirect to login page
    if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) {
        window.location.href = '/login';
    }

    const [favouriteAdded, setFavouriteAdded] = useState(false);
    const [searchRender, setSearchRender] = useState(false);
    const [myRecipesRender, setMyRecipesRender] = useState(false);

    const changeFavourite = () => {
        setFavouriteAdded(!favouriteAdded);
    };

    const changeSearchRender = () => {
        setSearchRender(!searchRender);
    };

    const changeMyRecipesRender = () => {
        setMyRecipesRender(!myRecipesRender);
    };

    const iconStyle = { width: rem(12), height: rem(12) };

    return (
        <div style={{ margin: '0 auto', marginTop: '1rem', padding: '2rem', maxWidth: '1500px' }}>

            <Tabs color="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))" variant="pills" defaultValue="recipes">
                <Tabs.List justify='center'>
                    <Tabs.Tab value="recipes" leftSection={<BiSolidDish style={iconStyle} />} onClick={changeSearchRender}>
                        Recipes
                    </Tabs.Tab>
                    <Tabs.Tab value="favourites" leftSection={<MdFavorite style={iconStyle} />} onClick={changeFavourite} >
                        Favourites
                    </Tabs.Tab>
                    <Tabs.Tab value="my" leftSection={<MdBroadcastOnPersonal style={iconStyle} />} onClick={changeMyRecipesRender}>
                        My Recipes
                    </Tabs.Tab>
                    <Tabs.Tab value="profile" leftSection={<FaUserCircle style={iconStyle} />}>
                        Profile
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="recipes">
                    <RecipeSearch render={searchRender}/>

                </Tabs.Panel>

                <Tabs.Panel value="favourites">
                    <Favourites render={favouriteAdded} />
                </Tabs.Panel>

                <Tabs.Panel value="my">
                    < MyRecipes render={myRecipesRender} />
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