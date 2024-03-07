import React from 'react';
import { CiHeart } from 'react-icons/ci';
import { MdFavorite } from 'react-icons/md';
import { Card, Image, Text, Group, Badge, Button, ActionIcon, MantineProvider } from '@mantine/core';
import classes from '../styles/BadgeCard.module.css';
import { ToastContainer, toast } from 'react-toastify';

export default function MyCard(props) {
  const mockdata = {
    user: props.user,
    user_id: props.user_id,
    id: props.id,
    image: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    title: props.title,
    description: props.description,
    badges: props.badges
  };
  const handler = props.handler;

  if (props.image){
    mockdata.image = `${import.meta.env.VITE_BACKEND_BASE_URL}${props.image}`;
  }

  const { image, title, description, badges } = mockdata;
  const [favourite, setFavourite] = React.useState(props.favourite || false);

  const toogleFavourite = () => {
    // Make the API call to add or remove the recipe from favourites
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/favourite/${mockdata.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }
    }).then(response => {
      if (response.ok) {
        setFavourite(!favourite);
        handler();

      }
      else{
        throw new Error('Error toggling favourite');
      }
    }).catch(error => {
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
            {/* <Badge size="sm" variant="light">
              {country}
            </Badge> */}
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
          <Button radius="md" style={{ flex: 1 }}>
            Show details
          </Button>
          <ActionIcon variant="default" radius="md" size={36} onClick={toogleFavourite} >
            {favourite ? <MdFavorite className={classes.like} stroke={1.5} /> : <CiHeart className={classes.like}  />}
          </ActionIcon>
        </Group>
        <ToastContainer />
      </Card>
  );
}
