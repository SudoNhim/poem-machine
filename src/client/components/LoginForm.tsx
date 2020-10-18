import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as React from "react";
import { connect } from "react-redux";

import { ISearchResults } from "../../shared/IApiTypes";
import { setUser } from "../actions";
import { getUser, login } from "../api";
import { IAppState } from "../model";

const styles = {
  main: {
    width: "20em",
    margin: "3em",
  },
};

interface IProps {
  searchResults: ISearchResults;
  classes: any;
  setUser: typeof setUser;
}

interface IState {
  username: string;
  password: string;
  failed: boolean;
}

class LoginForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      failed: false,
    };
  }

  private async handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const suceeded = await login(this.state.username, this.state.password);
    if (suceeded) {
      const user = await getUser();
      console.log(user);
      this.props.setUser({
        username: user.username,
      });
    } else {
      this.setState({
        failed: true,
        username: this.state.username,
        password: "",
      });
    }
  }

  public render(): JSX.Element {
    return (
      <Paper className={this.props.classes.main} variant="elevation">
        <Grid item>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
        </Grid>
        <Grid item>
          <form onSubmit={(evt) => this.handleSubmit(evt)}>
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
                  <Typography>Login failed</Typography>
                </Grid>
              )}
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className="button-block"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  searchResults: state.search,
});

export default connect(mapStateToProps, { setUser })(
  withStyles(styles)(LoginForm)
);
