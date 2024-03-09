import React from 'react';
import { CiHeart } from 'react-icons/ci';
import { MdFavorite } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Card, Image, Text, Group, Badge, Button, ActionIcon, MantineProvider } from '@mantine/core';
import classes from '../styles/BadgeCard.module.css';
import { toast } from 'react-toastify';

export default function MyCard(props) {
  const mockdata = {
    user: props.user,
    user_id: props.user_id,
    id: props.id,
    image: "https://cdn.dribbble.com/users/200279/screenshots/16510142/artboard_281_4x.png",
    title: props.title,
    description: props.description,
    badges: props.badges
  };
  const owner = props.myRecipe ? true : false;
  const handler = props.handler;

  const handleDelete =  () => {
    document.body.classList.add('loading');
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/delete/${mockdata.id}`, { 
      method: 'DELETE',
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error deleting recipe');
      }
      toast.success('Recipe Deleted');
      props.onDelete();
      return response.json()})
    .catch((error) => {
      console.error(error);
      toast.error('Error deleting recipe');
    }).finally(() => {
      // Remove loading from the body
      document.body.classList.remove('loading');
    });
  };

  if (props.image && props.image !== ''){
    mockdata.image = `${props.image}`;
  }

  const { image, title, description, badges } = mockdata;
  const [favourite, setFavourite] = React.useState(props.favourite || false);

  const toogleFavourite = () => {
    // Make the API call to add or remove the recipe from favourites
    setFavourite(!favourite);
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/favourite/${mockdata.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }
    }).then(response => {
      if (response.ok) {
        if (favourite){
          toast.success('Recipe removed from favourites', {
            autoClose: 500,
          });
        }
        else{
          toast.success('Recipe added to favourites', {
            autoClose: 500,
          });
        }
        handler();
      }
      else{
        throw new Error('Error toggling favourite');
      }
    }).catch(error => {
      setFavourite(!favourite);
      console.error('Error:', error);
      toast.error('Error adding recipe to favourites');
    });
  };
  const features = badges.map((badge) => (
    <Badge variant="light" key={badge} >
      {badge}
    </Badge>
  ));

  return (
      <Card shadow="sm" className={classes.card}>
        <Card.Section>
          <Image src={image} alt={title} height={180} fit='cover' />
        </Card.Section>

        <Card.Section className={classes.section} mt="md">
          <Group justify="apart">
            <Text fz="lg" fw={500}>
              {title}
            </Text>
          </Group>
          <Text fz="sm" mt="xs">
            {description}
          </Text>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} c="dimmed">
            Ingredients
          </Text>
          <Group gap={7} mt={5}>
            {features}
          </Group>
        </Card.Section>

        <Group mt="xs">
          < Link to={`/recipe/${mockdata.id}`} style={{ textDecoration: 'none' }}>
            <Button radius="md" style={{ flex: 1 }}>
              Show details
            </Button>
          </Link>
          <ActionIcon variant="default" radius="md" size={36} onClick={toogleFavourite} >
            {favourite ? <MdFavorite className={classes.like} stroke={1.5} /> : <CiHeart className={classes.like}  />}
          </ActionIcon>
          {owner && 
              <Button radius="md" style={{ flex: 1, backgroundColor: "red" }} onClick={handleDelete}>
                Delete
              </Button>
          }
        </Group>
      </Card>
  );
}
