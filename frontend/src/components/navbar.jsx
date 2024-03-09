import React, {useState} from "react";
import { Paper, Grid, Container, Text, ActionIcon, Popover } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IoMdLogIn } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import ThemeToggle from "./themeToogle";
import { useMediaQuery } from '@mantine/hooks';

const Navbar = () => {
    const [hovered, setHovered] = useState([false, false, false, false]);
    const handleMouseEnter = (index) => {
        setHovered((prevHovered) => {
          const newHovered = [...prevHovered];
          newHovered[index] = true;
          return newHovered;
        });
      }

      const handleMouseLeave = (index) => {
        setHovered((prevHovered) => {
          const newHovered = [...prevHovered];
          newHovered[index] = false;
          return newHovered;
        });
      }
    
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    return (
        <Container 
            size="full"
            pt={4}
            pb={6}
            pl={isSmallScreen ? 20 : 150}
            pr={isSmallScreen ? 20 : 150}
            style={{ backgroundColor: "var(--mantine-color-body)", position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}
      >
            <Paper p="md" shadow="xs" style={{ borderRadius: '0',
            border: "none", margin: "none", outline: "none", boxShadow: "none" }}>
                <Grid justify="center">
                    <Grid.Col span={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to={'/'} style={{ textDecoration: 'none' , color: "var(--mantine-color-text)"}}>
                            <Text size="xl" weight={500} >
                                Foodz
                            </Text>
                        </Link>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '10rem' }}>
                            <Popover position="bottom" withArrow shadow="md" opened={hovered[0]} onMouseEnter={() => handleMouseEnter(0)} onMouseLeave={() => handleMouseLeave(0)} closeOnClickOutside={true}>
                                <Popover.Target>
                                    <ActionIcon component={Link} to="/" title="Home">
                                        <FaHome />
                                    </ActionIcon>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Text size="sm">Home Page</Text>
                                </Popover.Dropdown>
                            </Popover>
                            <Popover position="bottom" withArrow shadow="md" opened={hovered[1]} onMouseEnter={() => handleMouseEnter(1)} onMouseLeave={() => handleMouseLeave(1)} closeOnClickOutside={true}>
                                <Popover.Target>
                                    <ActionIcon component={Link} to="/login" title="Login">
                                        <IoMdLogIn />
                                    </ActionIcon>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Text size="sm">Login</Text>
                                </Popover.Dropdown>
                            </Popover>
                            <Popover position="bottom" withArrow shadow="md" opened={hovered[2]} onMouseEnter={() => handleMouseEnter(2)} onMouseLeave={() => handleMouseLeave(2)} closeOnClickOutside={true}>
                                <Popover.Target>
                                    <ActionIcon component={Link} to="/register" title="Register">
                                        <FaRegUser />
                                    </ActionIcon>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Text size="sm">Register</Text>
                                </Popover.Dropdown>
                            </Popover>
                            <Popover position="bottom" withArrow shadow="md" opened={hovered[3]} onMouseEnter={() => handleMouseEnter(3)} onMouseLeave={() => handleMouseLeave(3)} closeOnClickOutside={true}>
                                <Popover.Target>
                                    <ActionIcon component={Link} to="/logout" title="Logout">
                                        <BiLogOut />
                                    </ActionIcon>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Text size="sm">Logout</Text>
                                </Popover.Dropdown>
                            </Popover>
                            
                            < ThemeToggle />
                        </div>
                    </Grid.Col>
                </Grid>
            </Paper>
        </Container>
    )
}

export default Navbar;
