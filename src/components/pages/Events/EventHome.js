import { Smart, Grid } from 'smart-webcomponents-react/grid';
import React, { useState, useRef, useEffect } from 'react'

function EventHome() {

    const dataSource = new Smart.DataAdapter({
        dataSource: [  
              { "firstName": "Beate", "lastName": "Wilson", "productName": "Caramel Latte"},   
              { "firstName": "Ian", "lastName": "Nodier", "productName": "Caramel Latte"},   
              { "firstName": "Petra", "lastName": "Vileid", "productName": "Green Tea"},   
              { "firstName": "Mayumi", "lastName": "Ohno", "productName": "Caramel Latte"},   
              { "firstName": "Mayumi", "lastName": "Saylor", "productName": "Espresso con Panna"},   
              { "firstName": "Regina", "lastName": "Fuller", "productName": "Caffe Americano" },  
              { "firstName": "Regina", "lastName": "Burke", "productName": "Caramel Latte"},   
              { "firstName": "Andrew", "lastName": "Petersen", "productName": "Caffe Americano"},  
              { "firstName": "Martin", "lastName": "Ohno", "productName": "Espresso con Panna"},   
              { "firstName": "Beate", "lastName": "Devling", "productName": "Green Tea"},   
              { "firstName": "Sven", "lastName": "Devling", "productName": "Espresso Truffle"},  
              { "firstName": "Petra", "lastName": "Burke", "productName": "Peppermint Mocha Twist"},  
              { "firstName": "Marco", "lastName": "Johnes", "productName": "Caffe Mocha"}  
         ],  
            dataFields: [
                'firstName: string',
                'lastName: string',
                'productName: string'
            ]
        })
    
        const columns = [{
            label: 'First Name',
            dataField: 'firstName'
        },
        {
            label: 'Last Name',
            dataField: 'lastName'
        },
        {
            label: 'Product',
            dataField: 'productName'
        }
        ]

    return (
      <>
         <div>
			<Grid
				dataSource={dataSource}
				columns={columns}
				>
			</Grid>
		</div>
      </>
    );
  }
  
  export default EventHome;