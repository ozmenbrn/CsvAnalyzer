import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { InputBase, Paper } from "@material-ui/core";

const styles = {
  input: {
    marginLeft: 8,
    width: "100%",
    color: "#153b8e",
    flex: 1
  },
  search: {
    marginLeft: "20px",
    marginTop: "10px",
    width: "100%",
    flex: 1,
    borderRadius: "0% 0% 0 0",
    backgrounColor: "#ffffff",
    boxShadow: "none"
  }
};

class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      text: "",
      searchEvent: props.searchEvent
    };
  }

  handleSubmit() {
    const { text, searchEvent } = this.state;
    searchEvent(text);
  }

  render() {
    const { classes } = this.props;
    const { text } = this.state;

    return (
      <div>
        <Paper className={classes.search}>
          <form
            style={{ backgroundColor: "#e9e9e9" }}
            onSubmit={e => {
              e.preventDefault();
              this.handleSubmit();
            }}
          >
            <InputBase
              className={classes.input}
              value={text}
              placeholder={"Ara"}
              ref={this.textInput}
              onChange={event => {
                this.setState({ text: event.target.value });
              }}
            />
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SearchComponent);
