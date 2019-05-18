import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Grid } from "@material-ui/core/es";
import Csv from "../components/Csv";
import { makeCsvData } from "../utils/Utils";
import CSVReader from "react-csv-reader";
import logo from "../assets/images/wpwflogo.png";
import SearchComponent from "../components/SearchComponent";
import { ListItem, List } from "@material-ui/core";
import axios from "axios";

const styles = {
  root: {
    flexGrow: 1,
    overflow: "hidden"
  },
  menu: {
    backgroundColor: "#ffffff",
    height: "100%"
  },
  rhsHeader: {
    backgroundColor: "#ffffff",
    height: "100%",
    alignItems: "center",
    display: "flex",
    marginLeft: "40px",
    fontSize: "20px",
    fontWeight: "bold",
    fontStyle: "normal",
    fontStretch: "normal",
    lineHeight: "0.92",
    letterSpacing: "1px",
    color: "#ffffff"
  },
  rhsMain: {
    backgroundColor: "#f4f4f4",
    padding: 30,
    height: "100%",
    overflow: "auto"
  },
  menuHeaderText: {
    color: "#ffffff",
    height: "100%",
    alignItems: "center",
    display: "flex",
    marginLeft: "40px",
    fontSize: "18px",
    fontWeight: "normal",
    fontStyle: "normal",
    fontStretch: "normal",
    lineHeight: "normal"
  },
  menuListItem: {
    height: "92%"
  },
  csvListItem: {
    height: "45px"
  },
  csvContainer: {
    height: "90%",
    overflow: "auto"
  },
  listItem: {
    fontSize: "16px",
    display: "-webkit-box",
    width: "100%",
    margin: "0 auto",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
};

class Cms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
      csvHeader: null,
      csvData: null,
      filterMethodString: "Starts With",
      filterMethod: 0,
      searchQuery: "",
      selectedItem: null,
      csvList: [],
      csvName: null,
      id: 0,
      csvName: null,
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null,
      modalOpen: false
    };
  }

  getDataFromDb = key => {
    const { csvList } = this.state;

    fetch(`http://localhost:3001/api/getData?name=${csvList[key]}`)
      .then(data => data.json())
      .then(res => {
        this.setState({ csvData: res.data.data.body });
        this.setState({ csvHeader: res.data.data.columns });
        this.setState({ csvName: res.data.data.name });
      });
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (csvName, csvData, csvHeader) => {
    const { csvList } = this.state;

    let currentIds = csvList.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios
      .post("http://localhost:3001/api/putData", {
        id: idToBeAdded,
        name: csvName,
        columns: csvHeader,
        body: csvData
      })
      .then(response => {
        this.getCsvListFromDb();
      })
      .catch(err => {
        console.log(err);
      });
  };

  getCsvListFromDb = () => {
    fetch("http://localhost:3001/api/listData")
      .then(data => data.json())
      .then(res => {
        this.setState({ csvList: res.data });
      });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = () => {
    const { csvName } = this.state;

    fetch(`http://localhost:3001/api/deleteData?name=${csvName}`)
      .then(response => {
        this.getCsvListFromDb();
      })
      .catch(err => {
        console.log(err);
      });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    const { csvList } = this.state;

    let objIdToUpdate = null;
    csvList.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { csvName: updateToApply }
    });
  };

  componentDidMount() {
    this.resizeEvent();
    window.addEventListener("resize", () => this.resizeEvent());

    this.getCsvListFromDb();
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  uploadCsv = event => {
    if (!event) {
      return;
    }

    let columns = [];
    let accessors = [];
    let csvBody = [];

    for (let i = 0; i < event[0].length; i++) {
      let headerElement = {
        Header: event[0][i],
        accessor: event[0][i],
        filterable: true,
        filterMethod: (filter, row) =>
          // row[filter.id].endsWith(filter.value) &&
          row[filter.id].startsWith(filter.value)
      };
      columns.push(headerElement);
      accessors.push(event[0][i]);
    }

    for (let i = 1; i < event.length; i++) {
      let tempArray = [];
      for (let j = 0; j < event[0].length; j++) {
        tempArray.push(event[i][j]);
      }
      csvBody.push(tempArray);
    }

    this.setState({
      csvHeader: columns,
      csvData: makeCsvData(csvBody, accessors)
    });
  };

  handleDarkSideForce() {
    console.log("DARKSIDE");
  }

  searchEvent = text => {
    this.setState({ searchQuery: text });
  };

  resizeEvent() {
    this.setState({ height: window.innerHeight });
  }

  onSelectMenuItem = key => {
    this.setState({ selectedItem: key });
    this.getDataFromDb(key);
  };

  renderCsvItems = () => {
    const { classes } = this.props;
    const { selectedItem, csvList } = this.state;

    return csvList.map((item, i) => {
      return (
        <ListItem
          selected={selectedItem === i ? true : false}
          divider
          key={i}
          className={classes.csvListItem}
          onClick={() => this.onSelectMenuItem(i)}
        >
          <div className={classes.listItem}>{item}</div>
        </ListItem>
      );
    });
  };

  render() {
    const { height, csvHeader, csvData } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={0} style={{ height: height }}>
          <Grid container style={{ height: "8%", backgroundColor: "#ffffff" }}>
            <Grid item xs={4}>
              <div>
                <img
                  alt="weFantastic"
                  src={logo}
                  style={{
                    width: "160px",
                    marginTop: "10px",
                    marginLeft: "40px"
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={6} />
            <Grid item xs={2}>
              <div style={{ marginTop: "8px" }}>
                <CSVReader
                  cssClass="csv-reader-input"
                  label="+ Add New Csv File"
                  onFileLoaded={this.uploadCsv}
                  onError={this.handleDarkSideForce}
                  inputId="csv"
                  inputStyle={{ color: "red" }}
                />
              </div>
            </Grid>
          </Grid>
          <Grid container style={{ height: "92%" }}>
            <Grid item xs={2} style={{ height: "100%" }}>
              <Grid container style={{ height: "10%" }}>
                <SearchComponent searchEvent={this.searchEvent} />
              </Grid>
              <Grid container className={classes.csvContainer}>
                <List component="nav" style={{ width: "100%" }}>
                  {this.renderCsvItems()}
                </List>
              </Grid>
            </Grid>
            <Grid item xs={10} className={classes.rhsMain}>
              <Csv
                csvHeader={csvHeader}
                csvData={csvData}
                putDataToDB={this.putDataToDB}
                deleteFromDB={this.deleteFromDB}
                updateDB={this.updateDB}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Cms);
