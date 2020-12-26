import CssBaseline from "@material-ui/core/CssBaseline";
import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { setGraph, setUser } from "./actions";
import { getGraph, getUser } from "./api";
import Chat from "./components/Chat";
import Document from "./components/Document";
import Home from "./components/Home";
import AppLayout from "./components/layout/AppLayout";
import Login from "./components/Login";
import SearchResults from "./components/SearchResults";

interface IProps {
  setGraph: typeof setGraph;
  setUser: typeof setUser;
}

const AppImpl: React.FunctionComponent<IProps> = (props: IProps) => {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const graph = await getGraph();
      props.setGraph(graph);
      setReady(true);
      const user = await getUser();
      if (user) props.setUser({ username: user.username });
    })();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <CssBaseline />
        <AppLayout>
          {ready ? (
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/chat" component={Chat} />
              <Route path="/doc/:docId" component={Document} />
              <Route path="/search/:searchTerm" component={SearchResults} />
              <Route exact path="/login" component={Login} />
            </Switch>
          ) : (
            <p>Loading...</p>
          )}
        </AppLayout>
      </div>
    </BrowserRouter>
  );
};

const App = hot(module)(AppImpl);

export default connect(null, { setGraph, setUser })(App);
