import React, { useState, useEffect } from 'react';
import MyCard from '../components/myCard';
import { Center } from '@mantine/core';

const Favourites = (props) => {
    const [favourites, setFavourites] = useState([]);
    let render = props.render;

    const removeFavourite = (id) => {
        // remove the favourite recipe from the list favourites
        // This will be called on successful API call for deletion of the favourite recipe
        let newFavourites = favourites.filter((favourite) => favourite.id !== id);
        setFavourites(newFavourites); 
    };

    useEffect(() => {
        fetchFavourites();
    }, [render]);


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

    return (
        <>
            {favourites.length > 0 ?
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
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
                            handler={() => removeFavourite(recipe.id)}
                            favourite={true}
                        />
                    })}
                </div>
                :
                <Center mt={10}>
                    <h1 style={{ color: "var(--bs-highlight-bg)" }}>No favourites found</h1>
                </Center>
            }
        </>
    )
    
}

export default Favourites;