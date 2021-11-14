import React, { FC, useCallback, useContext, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { Tab, Tabs } from '@mui/material';

import { useLayoutTitle } from '../../components/layout';
import { AuthenticatedContext } from '../../contexts/authentication';
import { WiFiNetwork } from '../../types';

import { WiFiConnectionContext } from './WiFiConnectionContext';
import WiFiStatusForm from './WiFiStatusForm';

const WiFiConnectionRouting: FC = () => {
  useLayoutTitle("WiFi Connection");

  const history = useHistory();
  const { url } = useRouteMatch();
  const authenticatedContext = useContext(AuthenticatedContext);
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork>();

  const selectNetwork = useCallback((network: WiFiNetwork) => {
    setSelectedNetwork(network);
    history.push('/wifi/settings');
  }, [history]);

  const deselectNetwork = useCallback(() => {
    setSelectedNetwork(undefined);
  }, []);

  const handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    history.push(path);
  };

  return (
    <WiFiConnectionContext.Provider
      value={{
        selectedNetwork,
        selectNetwork,
        deselectNetwork
      }}
    >
      <Tabs value={url} onChange={handleTabChange} variant="fullWidth">
        <Tab value="/wifi/status" label="WiFi Status" />
        <Tab value="/wifi/scan" label="Scan Networks" disabled={!authenticatedContext.me.admin} />
        <Tab value="/wifi/settings" label="WiFi Settings" disabled={!authenticatedContext.me.admin} />
      </Tabs>
      <Switch>
        {
          // TODO - protected routes.. "admin only route"
          // <Route exact path="/wifi/scan" component={WiFiNetworkScanner} />
          // <Route exact path="/wifi/settings" component={WiFiSettingsController} />
        }
        <Route exact path="/wifi/status">
          <WiFiStatusForm />
        </Route>
        <Redirect to="/wifi/status" />
      </Switch>
    </WiFiConnectionContext.Provider>
  );

};

const WiFiConnection: FC = () => {
  return (
    <Switch>
      <Route exact path={`/wifi/*`}>
        <WiFiConnectionRouting />
      </Route>
      <Redirect to="/wifi/status" />
    </Switch>
  );
};

export default WiFiConnection;
