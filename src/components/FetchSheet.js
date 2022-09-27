
import useGoogleSheets from 'use-google-sheets';


function FetchSheet() {

    const { data, loading, error } = useGoogleSheets({

        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
        sheetsOptions: [{ id: 'Register' }],
    });
    
    if (loading) {
    return <div>Loading...</div>;
    }
    
    if (error) {
    return <div>Error!</div>;
    }

    var dataString = JSON.stringify(data);
      
    let mytable = '';
    const userObj = JSON.parse(dataString, (key, value) => {

        if (key === 'People_Coming_As_Of_Now') {
          console.log(value);
          mytable = value;
        }
     });
     console.log(userObj);
      
      return (
        <>
            <div>LIVE!!! Number of people coming till now {mytable} </div>
        </>
      );

    
}

export default FetchSheet;