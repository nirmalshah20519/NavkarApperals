import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
// In index.js or App.js
import 'bootstrap-icons/font/bootstrap-icons.css';


ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ThemeEditorProvider>
				<HashRouter>
					<Switch>						
						<Route path={`/admin`} component={AdminLayout} />						
						<Redirect from='/' to='/admin/customers' />
					</Switch>
				</HashRouter>
			</ThemeEditorProvider>
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById('root')
);
