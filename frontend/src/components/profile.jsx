import { Paper, Grid, Text , Button} from '@mantine/core';
import {Link } from 'react-router-dom';

function ProfileCard() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const email = localStorage.getItem('email');
  return (
    
    <Grid align='center' style={{margin: "auto"}}>
        
      <Grid.Col align="center" span={20} >
    <Paper p="md" shadow="xs">
        <Text size="xl" weight={500}>{firstName}</Text>
        <Text size="xl" weight={500}>{lastName}</Text>
        <Text size="sm" color="gray">{email}</Text>
      
    </Paper>
    <Link to="/logout">
        <Button style={{marginTop: "2rem"}}>
            Logout
        </Button>
    </Link>
    
      
    </Grid.Col>

    </Grid>
  );
}

export default ProfileCard;
