import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Grid, CircularProgress } from "@material-ui/core/es";
import Csv from "../components/Csv";
import { makeCsvData } from "../utils/Utils";
import CSVReader from "react-csv-reader";
import logo from "../assets/images/wpwflogo.png";
import SearchComponent from "../components/SearchComponent";
import Auth from "../components/Auth";
import { ListItem, List } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import CryptoJS from "crypto-js";

const baseUrl = "http://localhost:3001/api/";
const username = "5342745714";
const password = "password";

const styles = theme => ({
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
  },
  progress: {}
});

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
      loading: false,
      authorized: false,
      token: "",
      event: null
    };
  }

  getDataFromDb = key => {
    const { csvList, token } = this.state;

    this.setState({ loading: true, csvData: null, csvHeader: null });

    let hashString = token + moment().unix();

    let hash = this.generateHash(hashString);

    fetch(`${baseUrl}getData?name=${csvList[key]}&param=${hash}`)
      .then(data => data.json())
      .then(res => {
        this.setState({
          csvData: res.data.data.body,
          csvHeader: res.data.data.columns,
          csvName: res.data.data.name,
          loading: false
        });
      });
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (csvName, csvData, csvHeader) => {
    const { csvList, searchQuery, token } = this.state;

    let currentIds = csvList.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    this.setState({ loading: true });

    let hashString = token + moment().unix();

    let hash = this.generateHash(hashString);

    axios
      .post(`${baseUrl}putData?param=${hash}`, {
        id: idToBeAdded,
        name: csvName,
        columns: csvHeader,
        body: csvData,
        param: hash
      })
      .then(response => {
        this.getCsvListFromDb(searchQuery);
        this.setState({ loading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  getCsvListFromDb = text => {
    const { token } = this.state;

    let hashString = token + moment().unix();

    let hash = this.generateHash(hashString);

    fetch(`${baseUrl}listData?query=${text}&param=${hash}`)
      .then(data => data.json())
      .then(res => {
        this.setState({ csvList: res.data });
        this.setState({ loading: false });
      });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = () => {
    const { csvName, searchQuery, token } = this.state;

    this.setState({ loading: true });

    let hashString = token + moment().unix();

    let hash = this.generateHash(hashString);

    fetch(`${baseUrl}deleteData?name=${csvName}&param=${hash}`)
      .then(response => {
        this.getCsvListFromDb(searchQuery);
        this.setState({
          loading: false,
          selectedItem: null,
          csvData: null,
          csvHeader: null
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    const { searchQuery } = this.state;
    this.resizeEvent();
    window.addEventListener("resize", () => this.resizeEvent());

    if (
      localStorage.getItem("username") === username &&
      localStorage.getItem("password") === password
    ) {
      this.setState({
        authorized: true,
        token:
          localStorage.getItem("username") + localStorage.getItem("password")
      });
    }

    setTimeout(() => {
      this.getCsvListFromDb(searchQuery);
    }, 1000);
  }

  generateHash(text) {
    var hash = CryptoJS.AES.encrypt(JSON.stringify(text), "Mine Secret");

    return encodeURIComponent(hash);
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  uploadCsv = (event, fileName) => {
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
      csvData: makeCsvData(csvBody, accessors),
      loading: false,
      selectedItem: null,
      csvName: fileName,
      event: event
    });
  };

  handleDarkSideForce() {
    console.log("DARKSIDE");
  }

  changeFilterMethod(i, filterName) {
    console.log(i);
    console.log(filterName);
  }

  searchEvent = text => {
    this.setState({ searchQuery: text });
    this.getCsvListFromDb(text);
  };

  authEvent = (str1, str2) => {
    const { searchQuery } = this.state;

    localStorage.setItem("username", str1);
    localStorage.setItem("password", str2);

    if (str1 === username && str2 === password) {
      this.setState({ authorized: true, token: str1 + str2 });
      setTimeout(() => {
        this.getCsvListFromDb(searchQuery);
      }, 1000);
    } else {
      window.alert("Wrong Credentials");
    }
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
      let csvItem = item.substring(0, item.length - 5);
      return (
        <ListItem
          selected={selectedItem === i ? true : false}
          divider
          key={i}
          className={classes.csvListItem}
          onClick={() => this.onSelectMenuItem(i)}
        >
          <div className={classes.listItem}>{csvItem}</div>
        </ListItem>
      );
    });
  };

  render() {
    const {
      height,
      csvHeader,
      csvData,
      loading,
      authorized,
      filterMethod,
      filterMethodString,
      csvName
    } = this.state;
    const { classes } = this.props;

    if (!authorized) {
      return <Auth authEvent={this.authEvent} />;
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={0} style={{ height: height }}>
          <Grid
            container
            style={{ height: "8%", backgroundColor: "#ffffff", zIndex: 200 }}
          >
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
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    textAlign: "center",
                    left: "55%"
                  }}
                >
                  <CircularProgress className={classes.progress} />
                </div>
              )}
              <Csv
                csvName={csvName}
                csvHeader={csvHeader}
                csvData={csvData}
                putDataToDB={this.putDataToDB}
                deleteFromDB={this.deleteFromDB}
                updateDB={this.updateDB}
                filterMethod={filterMethod}
                filterMethodString={filterMethodString}
                changeFilterMethod={this.changeFilterMethod}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Cms);
