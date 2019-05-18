import React, { Component } from "react";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Grid } from "@material-ui/core/es";
import uploadIcon from "../assets/images/upload.png";
import downloadIcon from "../assets/images/download.png";
import deleteIcon from "../assets/images/delete.jpg";

class Csv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showMenu: false,
      filterMethodString: "Starts With",
      filterMethod: 0
    };
  }

  showMenu(showMenu) {
    this.setState({ showMenu: !showMenu });
  }

  selectFilter(i, filterMethodString) {
    this.setState({
      showMenu: false,
      filterMethodString: filterMethodString,
      filterMethod: i
    });
  }

  uploadCsv() {
    const { putDataToDB, csvData, csvHeader } = this.props;

    var name = prompt("Please enter name for csv");

    putDataToDB(name, csvData, csvHeader);
  }

  deleteCsv() {
    const { deleteFromDB } = this.props;
    deleteFromDB();
  }

  downloadCsv() {
    const { updateDB } = this.props;
    updateDB(0, "NABER");
    console.log("download");
  }

  render() {
    const { showMenu, filterMethodString } = this.state;
    const { csvData, csvHeader } = this.props;

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
          <Grid item xs={6} />
          <Grid item xs={2}>
            <img
              alt="weFantastic"
              src={uploadIcon}
              onClick={() => this.uploadCsv()}
              style={{
                width: "30px"
              }}
            />
            <img
              alt="weFantastic"
              src={downloadIcon}
              onClick={() => this.downloadCsv()}
              style={{
                width: "26px",
                marginLeft: "20px"
              }}
            />
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
            <button onClick={() => this.selectFilter(1, "Ends With")}>
              {" "}
              Ends With{" "}
            </button>
            <button onClick={() => this.selectFilter(2, "Not Includes")}>
              {" "}
              Not Includes{" "}
            </button>
            <button onClick={() => this.selectFilter(3, "Exact Match")}>
              {" "}
              Exact Match{" "}
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
          />
        )}
      </div>
    );
  }
}

export default Csv;
