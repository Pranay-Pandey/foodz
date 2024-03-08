// src/components/ThemeToggle.jsx

import React from 'react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { FaRegSun } from "react-icons/fa";
import { BsFillMoonStarsFill } from "react-icons/bs";

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      color={isDarkTheme ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {isDarkTheme ? <BsFillMoonStarsFill size={18} /> : <FaRegSun size={18} />}
    </ActionIcon>
  );
}

export default ThemeToggle;
