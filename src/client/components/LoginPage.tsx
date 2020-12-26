import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { ISearchResults } from "../../shared/ApiTypes";
import { setUser } from "../actions";
import { getUser, login, register } from "../api";

const styles = {
  main: {
    width: "20em",
    margin: "3em",
    padding: "1em",
  },
  error: {
    color: "red",
  },
};

interface ILocationProps {
  prevPath: string;
}

interface IProps extends RouteComponentProps<{}, {}, ILocationProps> {
  searchResults: ISearchResults;
  classes: any;
  setUser: typeof setUser;
}

interface IState {
  username: string;
  password: string;
  failed: string;

  newUsername: string;
  newEmail: string;
  newPassword: string;
  registerFailed: string;
}

class LoginPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      failed: null,
      newUsername: "",
      newEmail: "",
      newPassword: "",
      registerFailed: null,
    };
  }

  private async handleLoginSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const suceeded = await login(this.state.username, this.state.password);
    if (suceeded) {
      const user = await getUser();
      this.props.setUser({
        username: user.username,
      });
      this.props.history.push(this.props.location.state.prevPath);
    } else {
      this.setState({
        failed: "Login failed",
        username: this.state.username,
        password: "",
      });
    }
  }

  private async handleRegisterSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
      await register(
        this.state.newUsername,
        this.state.newEmail,
        this.state.newPassword
      );
      const user = await getUser();
      this.props.setUser({
        username: user.username,
      });
      this.props.history.push(this.props.location.state.prevPath);
    } catch (err) {
      this.setState({
        ...this.state,
        registerFailed: err,
        newPassword: "",
      });
    }
  }

  public render(): JSX.Element {
    const logInForm = (
      <Paper className={this.props.classes.main} variant="elevation">
        <Grid item>
          <Typography component="h1" variant="h5">
            Existing User
          </Typography>
        </Grid>
        <Grid item>
          <form onSubmit={(evt) => this.handleLoginSubmit(evt)}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  placeholder="Email or username"
                  fullWidth
                  name="username"
                  variant="outlined"
                  value={this.state.username}
                  onChange={(event) =>
                    this.setState({
                      ...this.state,
                      username: event.target.value,
                    })
                  }
                  required
                  autoFocus
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  placeholder="Password"
                  fullWidth
                  name="password"
                  variant="outlined"
                  value={this.state.password}
                  onChange={(event) =>
                    this.setState({
                      ...this.state,
                      password: event.target.value,
                    })
                  }
                  required
                />
              </Grid>
              {this.state.failed && (
                <Grid item>
                  <Typography className={this.props.classes.error}>
                    {this.state.failed}
                  </Typography>
                </Grid>
              )}
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Log In
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Paper>
    );

    const registerForm = (
      <Paper className={this.props.classes.main} variant="elevation">
        <Grid item>
          <Typography component="h1" variant="h5">
            New User
          </Typography>
        </Grid>
        <Grid item>
          <form onSubmit={(evt) => this.handleRegisterSubmit(evt)}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  placeholder="Username"
                  type="text"
                  fullWidth
                  name="username"
                  variant="outlined"
                  value={this.state.newUsername}
                  onChange={(event) =>
                    this.setState({
                      ...this.state,
                      newUsername: event.target.value,
                    })
                  }
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  placeholder="Email"
                  type="email"
                  fullWidth
                  name="email"
                  variant="outlined"
                  value={this.state.newEmail}
                  onChange={(event) =>
                    this.setState({
                      ...this.state,
                      newEmail: event.target.value,
                    })
                  }
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  placeholder="Password"
                  fullWidth
                  name="password"
                  variant="outlined"
                  value={this.state.newPassword}
                  onChange={(event) =>
                    this.setState({
                      ...this.state,
                      newPassword: event.target.value,
                    })
                  }
                  required
                />
              </Grid>
              {this.state.registerFailed && (
                <Grid item>
                  <Typography className={this.props.classes.error}>
                    {this.state.registerFailed}
                  </Typography>
                </Grid>
              )}
              <Grid item>
                <Button
                  className={this.props.classes.rightButton}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Paper>
    );

    return (
      <div>
        {logInForm}
        {registerForm}
      </div>
    );
  }
}

export default connect(null, { setUser })(withStyles(styles)(LoginPage));
