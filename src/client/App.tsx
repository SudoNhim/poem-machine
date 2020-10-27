import CssBaseline from "@material-ui/core/CssBaseline";
import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { setUser } from "./actions";
import { getUser } from "./api";
import About from "./components/About";
import AppBar from "./components/layout/AppBar";
import ContentContainer from "./components/layout/ContentContainer";
import SideBar from "./components/layout/SideBar";
import Login from "./components/Login";
import PoemMachine from "./components/PoemMachine";
import SearchResults from "./components/SearchResults";

interface IProps {
  setUser: typeof setUser;
}

class AppImpl extends React.Component<IProps> {
  public async componentDidMount() {
    const user = await getUser();
    if (user) this.props.setUser({ username: user.username });
  }

  public render(): JSX.Element {
    return (
      <BrowserRouter>
        <div>
          <CssBaseline />
          <AppBar />
          <SideBar />
          <ContentContainer>
            <Switch>
              <Route exact path="/" component={PoemMachine} />
              <Route path="/doc/:docId" component={PoemMachine} />
              <Route path="/search/:searchTerm" component={SearchResults} />
              <Route exact path="/about" component={About} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </ContentContainer>
        </div>
      </BrowserRouter>
    );
  }
}

const App = hot(module)(AppImpl);

export default connect(null, { setUser })(App);
