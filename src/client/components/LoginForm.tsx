import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { connect } from "react-redux";

import { ISearchResults } from "../../shared/IApiTypes";
import { IAppState } from "../model";

// const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface IProps {
  searchResults: ISearchResults;
}

interface IState {
  username: string;
  password: string;
}

class LoginForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  private handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    console.log(this.state);
  }

  public render(): JSX.Element {
    return (
      <Paper variant="elevation">
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
                  type="email"
                  placeholder="Email"
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

export default connect(mapStateToProps, null)(LoginForm);
