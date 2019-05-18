import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { TextField, Button } from "@material-ui/core";
import backgroundImage from "../assets/images/background.png";

const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    backgroundColor: "#AAAAAA",
    position: "absolute",
    backgroundImage: `url(${backgroundImage})`
  },
  input: {
    width: "80%",
    marginTop: "20px",
    flex: 1
  },
  field: {
    width: "300px",
    height: "350px",
    backgroundColor: "#FFFFFF",
    opacity: 0.85,
    position: "absolute",
    textAlign: "center",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  },
  button: {
    margin: theme.spacing.unit,
    width: "65%",
    height: "40",
    borderRadius: 32,
    marginTop: "30px"
  }
});

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authEvent: props.authEvent,
      username: "",
      password: ""
    };
  }

  handleSubmit() {
    const { authEvent, username, password } = this.state;
    authEvent(username, password);
  }

  render() {
    const { classes } = this.props;
    const { username, password } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.field}>
          <div
            style={{
              marginTop: "30px",
              marginBottom: "10px",
              color: "#187285",
              fontWeight: "bold"
            }}
          >
            {"WeFantastic"}
          </div>
          <TextField
            label={"username"}
            className={classes.input}
            value={username}
            onChange={event => {
              this.setState({ username: event.target.value });
            }}
          />
          <TextField
            label={"password"}
            className={classes.input}
            value={password}
            type={"password"}
            onChange={event => {
              this.setState({ password: event.target.value });
            }}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => this.handleSubmit()}
          >
            Login
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Auth);
