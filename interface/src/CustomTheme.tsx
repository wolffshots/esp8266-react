import { FC, useEffect, useState } from "react";

import { CssBaseline } from "@mui/material";
import {
	createTheme,
	responsiveFontSizes,
	ThemeProvider,
} from "@mui/material/styles";
import {
	indigo,
	blueGrey,
	orange,
	red,
	green,
	grey,
} from "@mui/material/colors";

const lightTheme = responsiveFontSizes(
	createTheme({
		palette: {
			background: {
				default: "#fafafa",
			},
			primary: indigo,
			secondary: blueGrey,
			info: {
				main: indigo[500],
			},
			warning: {
				main: orange[500],
			},
			error: {
				main: red[500],
			},
			success: {
				main: green[500],
			},
		},
	})
);

const darkTheme = responsiveFontSizes(
	createTheme({
		palette: {
			mode: "dark",
			text: {
				primary: "#fff",
				secondary: grey[500],
			},
			primary: {
				main: indigo[500],
			},
			secondary: {
				main: blueGrey[800],
			},
			info: {
				main: indigo[800],
			},
			warning: {
				main: orange[800],
			},
			error: {
				main: red[800],
			},
			success: {
				main: green[800],
			},
		},
	})
);

const CustomTheme: FC = ({ children }) => {
	const userDarkColorScheme = window.matchMedia(
		"(prefers-color-scheme: dark)"
	).matches;
	const [darkMode, setDarkMode] = useState(userDarkColorScheme);
	useEffect(() => {
		setDarkMode(userDarkColorScheme);
	}, [userDarkColorScheme]);

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};

export default CustomTheme;
