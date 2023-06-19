
import React, { useMemo } from 'react';
import './Classes.css';
import Navbar from '../Navbar';
import { useTable } from "react-table";

function Classes() {


    const columns = useMemo(
        () => [
          {
            Header: "Place",
            columns: [
              {
                Header: "Location",
                accessor: "show.location"
              }
            ]
          },
          {
            Header: "Day/Time/Group",
            columns: [
              {
                Header: "Day",
                accessor: "show.day"
              },
              {
                Header: "Time",
                accessor: "show.time"
              },
              {
                Header: "Age",
                accessor: "show.age"
              }
            ]
          }
        ]
      );
    
    
    
    const data = useMemo(
        () => [
            {
                "show": {
                "location": "Goals Ipswich",
                "time": " 7-8 pm",
                "day": "Wednesday",
                "age": "Womens Group"
                } 
            },
            {
                "show": {
                "location": "Goals Ipswich",
                "time": " 6-7 pm",
                "day": "Friday",
                "age": "Beginners"
                } 
            },
            {
                "show": {
                "location": "Goals Ipswich",
                "time": " 7-8 pm",
                "day": "Friday",
                "age": "Intermediate"
                } 
            }, 
            {
                "show": {
                "location": "Dance HQ Colchester",
                "time": " 3-4 pm",
                "day": "Saturday",
                "age": "Beginners"
                } 
            }
            , 
            {
                "show": {
                    "location": "Dance HQ Colchester",
                "time": " 4-5 pm",
                "day": "Saturday",
                "age": "Intermediate"
                } 
            }
    ] );



    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
      } = useTable({
        columns,
        data
      });


  return (
    <>
        <Navbar />
        <table {...getTableProps()} className="form" border='1'>
        <thead>
            {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
            </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
            prepareRow(row);
            return (
                <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
                </tr>
            );
            })}
        </tbody>
        </table>

        <form className="formtest">
            <div><h2>CLASSES</h2>
                    <div>
                        <div>
                            <p>Our classes cover a variety of dance styles in a good fun and energitic environment.  We make sure all classes are sutiable for the students who are taking the course. </p>
                            <br/>
                            <p>We offer classes for children aged 5 to adults.</p>
                            <br/><br/>

                            <h3>ABOUT OUR DANCE STYLES  </h3>

<p>We mainly focus on Bollywood, Contemporary and Freestyle/Street, we love, adapt and introduce new and different styles within the FDC group. </p>
<br/>
<h3>Bollywood</h3>
<p>Bollywood Dance is the name given to the dance-form used in Indian (Hindi) films. The most energetic and colorful Indian dance styles. They merged with other dance forms from around the world, and now is the famous Bollywood dance</p>
<br/>
<h3>Contemporary</h3>
<p>Contemporary uses various moves and creating stories within routines like lyrical dancing.</p>
<br/>
<p>Contemporary is an important genre of dance performed in societies around the world, celebrated by people both young and old. Developed during the 20th century, contemporary dance involves incorporating aspects of movement from several other genres such as jazz, modern and ballet</p>
                        </div>
                        
                    </div>
                </div> 
        </form>
        {/* <div>
            <h2 className='timetable'>Ipswich Timetable</h2>
            <h3 className='timetable'>Timetable updated September 2022<br/></h3>
            <br/><br/>
            <p className='timetable'><strong>Wednesday<br/>Suffolk New College College Drive of, Grimwade St, Ipswich IP4 1LT</strong></p>
            <br/>
            <p className='timetable'>
                6.00pm - 7.00pm         Kids (Beginners)           
                <br/>                                    
                7.00pm - 8.00pm         Adults (any level Beginners, Intermediate)
                <br/>
            </p>
            <br/><br/>
            <p className='timetable'><strong>Friday<br/>Suffolk New College College Drive of, Grimwade St, Ipswich IP4 1LT</strong></p>
            <br/>
            <p className='timetable'>
                5.30pm - 6.30pm         Kids (Beginners)           
                <br/>                                    
                6.30pm - 7.30pm         Kids (Intermediate)
                <br/>
                6.30pm - 7.30pm         Adults (any level Beginners, Intermediate)
            </p>
            <br/><br/><br/><br/><br/>
            <p>
                <table className="form">
                    <tr>
                        <th>
                            Time
                        </th>
                        <th>
                            Group
                        </th>
                    </tr>
                    <tr>
                        <td>
                        5.30pm - 6.30pm
                        </td>
                        <td>
                        Kids (age 5 - 9 years)           
                        </td>
                    </tr>
                    <tr>
                        <td>
                        6.30pm - 7.30pm
                        </td>
                        <td>
                        Adults (any level Beginners, Intermediate)
                        </td>
                    </tr>
                </table>
            </p>
        </div> */}
    </>
  );
}

export default Classes;