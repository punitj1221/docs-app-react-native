import React from 'react'
import { Image,StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { Base64 } from '../../Base64';
import { colors } from '../../extra/colors';
export default function Reports(props) {
//   let reportsList=[{id:'1',name:'Mukund Madhav Goyal',condition:'No problem', time:'10:50-11:15'},
//                    {id:'2',name:'Punit Jain',condition:'Serious Heart Disease Due To Anwesha Singh', time:'11:50-12:15'},
//                    {id:'3',name:'Shivam Singhal',condition:'Serious Kidney Problem', time:'12:50-13:15'},
//                    {id:'4',name:'Mukund Madhav Goyal',condition:'No problem', time:'10:50-11:15'},
//                    {id:'5',name:'Punit Jain',condition:'Serious Heart Disease Due To Anwesha Singh', time:'11:50-12:15'},
//                    {id:'6',name:'Shivam Singhal',condition:'Serious Kidney Problem', time:'12:50-13:15'},
//                    {id:'7',name:'Mukund Madhav Goyal',condition:'No problem', time:'10:50-11:15'},
//                    {id:'8',name:'Punit Jain',condition:'Serious Heart Disease Due To Anwesha Singh', time:'11:50-12:15'},
//                    {id:'9',name:'Shivam Singhal',condition:'Serious Kidney Problem', time:'12:50-13:15'},
//                    {id:'10',name:'Mukund Madhav Goyal',condition:'No problem', time:'10:50-11:15'},
//                    {id:'11',name:'Punit Jain',condition:'Serious Heart Disease Due To Anwesha Singh', time:'11:50-12:15'},
//                    {id:'12',name:'Shivam Singhal',condition:'Serious Kidney Problem', time:'12:50-13:15'},
//                   ];
    const [doctorData,setDoctorData] = React.useState({});
    const [reportsList,setReportsList] = React.useState([]);

    React.useEffect(() => {
        getData()
    },[])
    
    const getData  = async() => {
        let doctor = await AsyncStorage.getItem('doctor');
        doctor = JSON.parse(doctor);
        setDoctorData(doctor);
        let get = {
            Doctor_Id : doctor['_id'],
        }
        get = Base64.encode(JSON.stringify(get));
        fetch('http://192.168.1.11:5000/retrieve/reports/'+get)
        .then(re => re.json())
        .then(resultJson => {
            if(resultJson.status == "Success"){
                setReportsList(resultJson.data);
                if(resultJson.data.length == 0){
                    alert("No Data Found");
                }
            }

        })
        .catch(err=>console.log(err))
    }

  return (
    <View>
        <FlatList
            data={reportsList}
            renderItem={({item})=>
            <Card style={styles.cardStyle}>
                <TouchableOpacity onPress={()=>{props.navigation.navigate('ShowReport'),{report:item}}}>
                        < View style={{flex:5,paddingVertical:20}}>
                            <Text style={{color:'#ffffff',fontSize:15}}>Patient Name: {item.Name}</Text>
                            <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            <Text style={{color:'#ffffff',fontSize:15}}>Condition: {item.Notes}</Text>
                            </View>
                            <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            <Text style={{color:colors.contrast,fontSize:15}}>Date: {item.Date}</Text>
                            </View>
                    </View>
                </TouchableOpacity>
            </Card>
            }
            keyExtractor={item=>item.id}

        />
        </View>
    )
}

const styles = StyleSheet.create({
    cardStyle:{
        flex:1,
        paddingTop:2,
        backgroundColor:colors.themeDark,
        margin:3,
        paddingLeft:5,
        borderColor:'#000000',
        borderWidth:3,
        borderRadius:10
    }
})
