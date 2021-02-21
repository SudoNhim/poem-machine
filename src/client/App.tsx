import CssBaseline from "@material-ui/core/CssBaseline";
import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { setGraph, setUser } from "./actions";
import { getGraph, getUser } from "./api";
import ChatPage from "./components/ChatPage";
import DocumentPage from "./components/DocumentPage";
import EditorPage from "./components/EditorPage";
import HomePage from "./components/HomePage";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./components/LoginPage";
import SearchResultsPage from "./components/SearchResultsPage";

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
              <Route exact path="/" component={HomePage} />
              <Route exact path="/chat" component={ChatPage} />
              <Route path="/doc/:docId" component={DocumentPage} />
              <Route path="/edit/:docId" component={EditorPage} />
              <Route path="/create" component={EditorPage} />
              <Route exact path="/login" component={LoginPage} />
              <Route path="/search/:searchTerm" component={SearchResultsPage} />
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
