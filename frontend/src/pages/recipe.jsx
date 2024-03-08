import React, { useEffect, useState } from 'react';
import { Paper, Text, Image, Badge, Grid, Divider, TextInput, NumberInput, FileInput, TagsInput, Button, ActionIcon , Group, Textarea} from '@mantine/core';
import { ToastContainer, toast } from 'react-toastify';
import { FaClock, FaTimes , FaTrash, FaPlusCircle} from "react-icons/fa";
import { CiHeart } from 'react-icons/ci';
import { MdFavorite } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import classes from '../styles/BadgeCard.module.css';

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [editable, setEditable] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
        // Add loading to the body
        document.body.classList.add('loading'); 
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/get_recipe_by_id/${id}`,
        {headers: {
          Authorization: `${localStorage.getItem('token')}`
        }})
          .then(response => {
            if (!response.ok) {
              throw new Error('Error fetching recipe');
            }
            return response.json()})
          .then(data => {
            setRecipe({
            title: data.title,
            description: data.description,
            time: data.time,
            image: (data.image && data.image !== "") ? `${data.image}`: 
            'https://cdn.dribbble.com/users/200279/screenshots/16510142/artboard_281_4x.png',
            ingredients: data.ingredients,
            procedure: data.procedure,
          });
          if (data.user_id.toString() === localStorage.getItem('user_id')) {
            setEditable(true);
          }
          setFavourite(data.favourite);
        })
          .catch(error => {
            toast.error(error.error || 'Failed to fetch recipe');
            console.error(error);
            // Redirect to home
            window.location.href = '/';
          }
            ).finally(() => {
              // Remove loading from the body
              document.body.classList.remove('loading');
            });
      }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('title', recipe.title);
    formData.append('description', recipe.description);
    formData.append('time', recipe.time);
    formData.append('image', newImage);
    let ing = [];
    for (let i = 0; i < recipe.ingredients.length; i++) {
      ing.push(recipe.ingredients[i]);
    }
    formData.append('ingredients', ing);
    formData.append('procedure', recipe.procedure.join('\n'));

    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/update/${id}`, { 
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
        toast.success('Recipe updated');
    })
    .catch((error) => {
      console.error(error);
      toast.error('Error updating recipe');
    }).finally(() => {
      setEditing(false);
    });
  };

  const handleDelete = () => {
    // Handle update
    // Add loading to the body
    document.body.classList.add('loading');
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/delete/${id}`, { 
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
      window.location.href = '/';
      return response.json()})
    .catch((error) => {
      console.error(error);
      toast.error('Error deleting recipe');
    }).finally(() => {
      setEditing(false);
      // Remove loading from the body
      document.body.classList.remove('loading');
    });
  };

  const toggleFavourite = () => {
    // Add loading to the body
    document.body.classList.add('loading');
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/favourite/${id}`, {
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
        setFavourite(!favourite);
      }
      else{
        throw new Error('Error toggling favourite');
      }
    }).catch(error => {
      console.error('Error:', error);
      toast.error('Error adding recipe to favourites');
    }).finally(() => {
      // Remove loading from the body
      document.body.classList.remove('loading');
    });
  };

  const handleImageRemove = () => {
    setNewImage(null);
    setRecipe({ ...recipe, image: 'https://cdn.dribbble.com/users/200279/screenshots/16510142/artboard_281_4x.png' });
  };

  const addStepAfter = (index) => {
    const newProcedure = [...recipe.procedure];
    newProcedure.splice(index + 1, 0, '');
    setRecipe({ ...recipe, procedure: newProcedure });
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const deleteStep = (index) => {
    setRecipe({ ...recipe, procedure: recipe.procedure.filter((_, i) => i !== index) });
  };

  const { title, description, time, image, ingredients, procedure } = recipe;

  return (
    <Paper p="xl" shadow="xs" style={{ width: "80%"  , maxWidth: 1000, margin: 'auto', marginTop: "2rem" }}>
      <Group justify="apart" style={{position: "relative"}}>
        {editing ? (
          <TextInput
            label="Title"
            value={title}
            onChange={(event) => setRecipe({ ...recipe, title: event.currentTarget.value })}
          />
        ) : (
          <Text align="center" size="xl" weight={500}>
            {title}
          </Text>
        )}
          <ActionIcon variant="default" radius="md" size={36} onClick={toggleFavourite} style={{position: "absolute", right: 10}}>
            {favourite ? <MdFavorite className={classes.like} stroke={1.5} /> : 
            <CiHeart className={classes.like}  />}
          </ActionIcon>
      </Group>
      <div style={{ height: 10 }}></div>
      {editing ? (
        <div style={{ position: 'relative'}}>
          <Image src={image} alt={title}  style={{ width: "fit-content", margin:"auto", height: 300, maxWidth: "600px" }} />
          <ActionIcon variant="transparent" radius="xl" style={{ position: 'absolute', top: 10, right: 10 }} onClick={handleImageRemove}>
            <FaTimes />
          </ActionIcon>
          < TextInput
            label="Image"
            placeholder="Enter image URL"
            value={image}
            onChange={(event) => setRecipe({ ...recipe, image: event.currentTarget.value })
          }
          />
        </div>
      ) : (
        <Image src={image} alt={title}  style={{ width: "fit-content", margin:"auto", height: 300, maxWidth: "600px" }} />
      )}
      {editing ? (
        <TextInput
          label="Description"
          multiline
          value={description}
          onChange={(event) => setRecipe({ ...recipe, description: event.currentTarget.value })}
        />
      ) : (
        <Text size="sm" style={{ marginTop: 15 }}>
          {description}
        </Text>
      )}
      <Divider style={{ margin: '15px 0' }} />
      <Grid>
        <Grid.Col style={{ alignItems: 'center', display: "flex", gap: "2%" }}>
            < FaClock size={20} />
            {editing ? (
              <NumberInput
                label="Time"
                value={time}
                onChange={(value) => setRecipe({ ...recipe, time: value })}
              />
            ) : (
              <Text>{time} minutes</Text>
            )}
        </Grid.Col>
      </Grid>
      <Divider style={{ margin: '15px 0' }} />
      <Text size="lg" weight={500} style={{ marginBottom: 10 }}>
        Ingredients
      </Text>
      {editing ? (
        <TagsInput
          label="Ingredients"
          value={ingredients}
          onChange={(value) => setRecipe({ ...recipe, ingredients: value })}
        />
      ) : (
        ingredients.map((ingredient) => (
          <Badge key={ingredient} variant="outline" color="blue" style={{ marginRight: 5 }}>
            {ingredient}
          </Badge>
        ))
      )}
      <Divider style={{ margin: '15px 0' }} />
      {/* <Text size="lg" weight={500} style={{ marginBottom: 10 }}>
        Procedure
      </Text>
      {editing ? (
        <TextInput
          label="Procedure"
          multiline
          value={procedure}
          onChange={(event) => setRecipe({ ...recipe, procedure: event.currentTarget.value })}
        />
      ) : (
        <Text size="sm">{procedure}</Text>
      )} */}
      <Text size="lg" weight={500} style={{ marginBottom: 10 }}>
          Procedure
      </Text>
        {editing ? 
        <>{(
          recipe.procedure.map((step, index) => (
            <div key={index} style={{ }}>
              <Grid>
                <Grid.Col span={1}>
                  <Badge color="blue" size="lg" style={{ marginRight: '1rem'}}>{index + 1}</Badge>
                </Grid.Col>
                <Grid.Col span={10}>
                  <Textarea
                    resize="both"
                    placeholder={`Enter step ${index + 1}`}
                    required
                    value={step}
                    onChange={(event) => setRecipe({ ...recipe, procedure: recipe.procedure.map((s, i) => i === index ? event.currentTarget.value : s) })}
                    autosize
                    minRows={2}
                    maxRows={6}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <ActionIcon color="red" onClick={() => deleteStep(index)}><FaTrash /></ActionIcon>
                  
                  {/* <ActionIcon color="green" onClick={() => deleteStep(index)}><FaTrash /></ActionIcon> */}
                  <ActionIcon color="green" onClick={() => addStepAfter(index)}><FaPlusCircle /></ActionIcon>
                </Grid.Col>
              </Grid>
            </div>
          ))  )}
          </>    
         : (
          procedure.map((step, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Badge color="blue" style={{ marginRight: '1rem' }}>{index + 1}</Badge>
              <Text size="sm">{step}</Text>
            </div>
          ))
        )}
      < Divider style={{ margin: '15px 0' }} />
      {editable && (
        <Group>
          <Button onClick={editing ? handleUpdate : handleEdit}>
            {editing ? 'Update' : 'Edit'}
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      )}
      < ToastContainer />
    </Paper>
  );
}

export default RecipePage;
