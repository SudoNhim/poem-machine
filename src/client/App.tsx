import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { setUser } from "./actions";
import { getUser } from "./api";
import { About } from "./components/About";
import AppBar from "./components/AppBar";
import LoginForm from "./components/LoginForm";
import PoemMachine from "./components/PoemMachine";

interface IProps {
  setUser: typeof setUser;
}

class AppImpl extends React.Component<IProps> {
  public async componentDidMount() {
    const user = await getUser();
    this.props.setUser({ username: user.username });
  }

  public render(): JSX.Element {
    return (
      <BrowserRouter>
        <div>
          <AppBar />
          <Switch>
            <Route exact path="/" component={PoemMachine} />
            <Route path="/doc/:docId" component={PoemMachine} />
            <Route path="/search/:searchTerm" component={PoemMachine} />
            <Route exact path="/about" component={About} />
            <Route exact path="/login" component={LoginForm} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const App = hot(module)(AppImpl);

export default connect(null, { setUser })(App);
