import React from 'react';
import { Paper, Text, Grid, Container, Button, Center, Avatar } from '@mantine/core';

function ProfileCard() {
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const email = localStorage.getItem('email');

  return (
    // Mantine profile card
    < Container >
      <Paper p="xl" shadow="xs" >
        <Grid>
          <Grid.Col span={12} >
            <Center>
              <Text size="xl" weight={500} >
                Profile
              </Text>
            </Center>
          </Grid.Col>
          <Grid.Col span={12} >
            <Center>
              <Avatar size={100} src="/logo.jfif" alt="User avatar" />
            </Center>
          </Grid.Col>
          <Grid.Col span={12} >
            <Center>
              <Text size="xl" weight={500} >
                {firstName}
              </Text>
            </Center>
            < Center >
            <Text size="xl" weight={500} >
              {lastName}
            </Text>
            </Center>
          </Grid.Col>
          <Grid.Col span={12}>
            <Center>
              <Text size="md" weight={500} >
                {email}
              </Text>
            </Center>
          </Grid.Col>
          <Grid.Col span={12} >
            <Button component="a" href="/logout" color="red" variant="outline" style={{ width: '100%' }}>
              Logout
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ProfileCard;
