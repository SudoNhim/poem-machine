import CssBaseline from "@material-ui/core/CssBaseline";
import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { setGraph, setUser } from "./actions";
import { getGraph, getUser } from "./api";
import About from "./components/About";
import Document from "./components/Document";
import AppBar from "./components/layout/AppBar";
import ContentContainer from "./components/layout/ContentContainer";
import SideBar from "./components/layout/SideBar";
import Login from "./components/Login";
import SearchResults from "./components/SearchResults";

interface IProps {
  isReady: boolean;
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
        <AppBar />
        <SideBar />
        <ContentContainer>
          {ready ? (
            <Switch>
              <Route exact path="/" component={Document} />
              <Route path="/doc/:docId" component={Document} />
              <Route path="/search/:searchTerm" component={SearchResults} />
              <Route exact path="/about" component={About} />
              <Route exact path="/login" component={Login} />
            </Switch>
          ) : (
            <p>Loading...</p>
          )}
        </ContentContainer>
      </div>
    </BrowserRouter>
  );
};

const App = hot(module)(AppImpl);

export default connect(null, { setGraph, setUser })(App);
