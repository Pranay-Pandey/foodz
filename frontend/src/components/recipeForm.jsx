import React, { useState } from 'react';
import { TextInput, NumberInput, FileInput, TagsInput, Button, Paper, Text, Textarea } from '@mantine/core';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RecipeForm(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [procedure, setProcedure] = useState('');
  const handler = props.handler;

  const onSubmit = (event) => {
    event.preventDefault();
    // Add loading to the body
    document.body.classList.add('loading');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('time', time);
    formData.append('image', image);
    let ing = [];
    for (let i = 0; i < ingredients.length; i++) {
      ing.push(ingredients[i]);
    }
    formData.append('ingredients', ing);
    formData.append('procedure', procedure);

    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/recipe/create`, {
      method: 'POST',
      body: formData,
        headers: {
            Authorization: `${localStorage.getItem('token')}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
      toast.success("Recipe added successfully")
      handler();
    })
    .catch((error) => {
      console.error(error)
      toast.error("Error adding recipe")
    }).finally(() => {
      // Remove loading from the body
      document.body.classList.remove('loading');
    });
  };

  return (
    <Paper shadow="xs" p="xl" style={{ maxWidth: 600, margin: 'auto' }}>
      <form onSubmit={onSubmit}>
        <TextInput
          label="Title"
          placeholder="Enter recipe title"
          required
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
        <TextInput
          label="Description"
          placeholder="Enter recipe description"
          required
          multiline
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <NumberInput
          label="Time"
          placeholder="Time in minutes"
          required
          value={time}
          onChange={(value) => setTime(value)}
        />
        < TextInput
          label="Image"
          placeholder="Enter image URL"
          value={image}
          onChange={(event) => setImage(event.currentTarget.value)}
        />
        <TagsInput
          label="Ingredients"
          placeholder="Enter ingredients (Enter to add)"
          value={ingredients}
          required
          onChange={setIngredients}
        />
        <Textarea
          label="Procedure"
          placeholder="Enter cooking instructions (Separate steps with a newline)"
          required
          value={procedure}
          onChange={(event) => setProcedure(event.currentTarget.value)}
          autosize
          minRows={2}
          maxRows={4}
        />
        <Button color="blue" fullWidth style={{marginTop: "2rem"}} onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </Paper>
  );
}

export default RecipeForm;
