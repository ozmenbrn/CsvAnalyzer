import React, { Component } from "react";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Grid } from "@material-ui/core/es";
import uploadIcon from "../assets/images/upload.png";
import downloadIcon from "../assets/images/download.png";
import deleteIcon from "../assets/images/delete.jpg";
import calenderIcon from "../assets/images/calender.png";
import splitIcon from "../assets/images/split.png";
import combineIcon from "../assets/images/combine.png";
import { CSVLink } from "react-csv";

class Csv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showMenu: false,
      filterMethodString: props.filterMethodString,
      filterMethod: props.filterMethod,
      downloadData: [],
      changeFilterMethod: props.changeFilterMethod,
      filtered: []
    };
  }

  showMenu(showMenu) {
    this.setState({ showMenu: !showMenu });
  }

  selectFilter(i, filterMethodString) {
    const { changeFilterMethod, filtered } = this.state;

    this.setState({
      showMenu: false,
      filterMethodString: filterMethodString,
      filterMethod: i
    });

    changeFilterMethod(i, filterMethodString, filtered);
  }

  uploadCsv() {
    const { putDataToDB, csvHeader } = this.props;

    var name = prompt("Please enter name for csv");

    var visibleModels = this.selectTable.getResolvedState().sortedData;

    for (let i = 0; i < visibleModels.length; i++) {
      delete visibleModels[i]["_index"];
      delete visibleModels[i]["_original"];
      delete visibleModels[i]["_nestingLevel"];
      delete visibleModels[i]["_subRows"];
    }

    putDataToDB(name, visibleModels, csvHeader);
  }

  deleteCsv() {
    const { deleteFromDB } = this.props;
    deleteFromDB();
  }

  combineEvent() {
    const { combineInto } = this.props;

    var name = prompt("Please enter exact column name to combine");

    combineInto(name, this.selectTable.getResolvedState().sortedData);
  }

  splitEvent() {
    const { splitPipe } = this.props;

    var name = prompt("Please enter exact column name to split pipe");

    splitPipe(name, this.selectTable.getResolvedState().sortedData);
  }

  calenderEvent() {
    const { reOrderCalender } = this.props;

    var name = prompt("Please enter exact column name to orginize date");

    reOrderCalender(name);
  }

  downloadCsv() {
    var downloadedData = this.selectTable.getResolvedState().sortedData;

    for (let i = 0; i < downloadedData.length; i++) {
      delete downloadedData[i]["_index"];
      delete downloadedData[i]["_original"];
      delete downloadedData[i]["_nestingLevel"];
      delete downloadedData[i]["_subRows"];
    }

    this.setState({ downloadData: downloadedData });
  }

  render() {
    const { showMenu, filterMethodString, downloadData } = this.state;
    const { csvData, csvHeader } = this.props;

    if (!csvData) {
      return <div />;
    }

    return (
      <div>
        <Grid container>
          <Grid item xs={4}>
            <div>
              <button onClick={() => this.showMenu(showMenu)}>
                {"Filter Method"}
              </button>
              <span> {filterMethodString} </span>
            </div>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={1}>
            <img
              alt="weFantastic"
              src={splitIcon}
              onClick={() => this.splitEvent()}
              style={{
                width: "30px"
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <img
              alt="weFantastic"
              src={combineIcon}
              onClick={() => this.combineEvent()}
              style={{
                width: "30px"
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <img
              alt="weFantastic"
              src={calenderIcon}
              onClick={() => this.calenderEvent()}
              style={{
                width: "30px"
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <img
              alt="weFantastic"
              src={uploadIcon}
              onClick={() => this.uploadCsv()}
              style={{
                width: "30px"
              }}
            />
            <CSVLink data={downloadData}>
              <img
                alt="weFantastic"
                src={downloadIcon}
                onClick={() => this.downloadCsv()}
                style={{
                  width: "26px",
                  marginLeft: "20px"
                }}
              />
            </CSVLink>
            <img
              alt="weFantastic"
              onClick={() => this.deleteCsv()}
              src={deleteIcon}
              style={{
                width: "22px",
                marginLeft: "20px"
              }}
            />
          </Grid>
        </Grid>

        {showMenu && (
          <div className="menu">
            <button onClick={() => this.selectFilter(0, "Starts With")}>
              {" "}
              Starts With
            </button>
            <button onClick={() => this.selectFilter(1, "Includes")}>
              {" "}
              Includes{" "}
            </button>
            <button onClick={() => this.selectFilter(2, "Not Includes")}>
              {" "}
              Not Includes{" "}
            </button>
            <button onClick={() => this.selectFilter(3, "Greater Than")}>
              {" "}
              Greater Than{" "}
            </button>
            <button onClick={() => this.selectFilter(4, "Lower Than")}>
              {" "}
              Lower Than{" "}
            </button>
            <button onClick={() => this.selectFilter(5, "Combine")}>
              {" "}
              Combine{" "}
            </button>
          </div>
        )}

        {csvHeader && csvData && (
          <ReactTable
            style={{ marginTop: "20px" }}
            data={csvData}
            columns={csvHeader}
            defaultPageSize={10}
            className="-striped -highlight"
            onFilteredChange={filtered => this.setState({ filtered })}
            ref={r => {
              this.selectTable = r;
            }}
          />
        )}
      </div>
    );
  }
}

export default Csv;
