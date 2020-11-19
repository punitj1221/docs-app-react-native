import React from 'react';
import { StyleSheet, Text, View,Image, TextInput, ScrollView, Button,TouchableOpacity} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
export default function LoginScreen(props) {
  const [select,setSelect] = React.useState('');
  const LoginSelection=()=>{
    if(select=='Doctor')
    {
        props.navigation.navigate("DrawerNavigationDoctor");
    }
    else if(select=='Patient')
    {
         props.navigation.navigate("DrawerNavigation");   
    }
  }
  return (
    <View style={styles.container}>
        <View style={styles.firstContainer}>
        
        <View style={styles.imgContainer}>
          <TouchableOpacity onPress={()=>{setSelect('Doctor')}}>
          <View style={{width:"40%",height:'70%'}}>
            <View style={select=="Doctor" ? styles.border : null}>
              <Image source={require('./assets/doctor1.png')} style={styles.img1}/>
            </View>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{setSelect('Patient')}}>
          <View style={{width:"40%",height:'70%'}}>
            <View style={select=="Patient" ? styles.border : null}>
              <Image source={require('./assets/patient1.jpg')} style={styles.img2}/>
            </View>
          </View>
          </TouchableOpacity>
        </View>
        </View>
        
        <View style={styles.secondContainer}>
          <ScrollView>
            <View>
              <Text style={{  fontSize:30,alignSelf:'center',marginTop:'1%'}}>
                Login
              </Text>
            </View>
          <View style={styles.inStyle}>
          <AntDesign name="user" size={30} color="#555" style={{paddingRight:10}} />
          <TextInput style={{fontSize:20,width:'100%'}} placeholder="Username" placeholderTextColor="#555"/>
          </View>
          <View style={styles.inStyle}>
          <AntDesign name="lock" size={30} color="#555" style={{paddingRight:10}} />
          <TextInput secureTextEntry={true} style={{fontSize:20,width:'100%'}} placeholder="Password" placeholderTextColor="#555"/>  
          </View>
          <View style={{justifyContent:'flex-end',flexDirection:'row',marginRight:"5%",marginTop:'3%'}}>
          <TouchableOpacity onPress={()=>{alert("Forgot Password Pressed")}}><Text style={{color:"blue"}}>Forgot Password?</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={LoginSelection}>
            <View style={styles.button}>
              <Text style={{alignSelf:'center',fontSize:20,color:"#dddddd",marginTop:8,fontWeight:'bold'}}>Log In</Text>
            </View>
          </TouchableOpacity>
          <View style={{marginTop:"10%",alignSelf:'center'}}>
            <Text style={{alignSelf:'center'}}>
            New User?
            </Text>
            <TouchableOpacity onPress={()=>{alert("create account pressed")}}>
            <Text style={{color:"blue"}}>
            Create Account
            </Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>     
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'#224D80',
      paddingTop:"5%"
    },
    firstContainer:{
      flex:2,
      backgroundColor:'#224D80',
      marginTop:"10%",
    },
    secondContainer:{
      flex:4,
      backgroundColor:'#fff',
      borderWidth:1,
      borderTopLeftRadius:30,
      borderTopRightRadius:30,

    },
    img1:{
      height:150,
      width:150,
      borderRadius:500,
      resizeMode:'contain'
    },
    img2:{
      height:150,
      width:150,
      borderRadius:500,
      resizeMode:'contain'
    },
    imgContainer:{
      flex:1,
      height:'100%',
      width:'100%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    inStyle:{
     flexDirection:'row',
     borderWidth:0.5,
     padding:10,
     borderRadius:20,
     marginHorizontal:"3%",
     marginTop:"8%"
    },
    button:{
      marginTop:"10%",
      backgroundColor:"#224D80",
      marginHorizontal:"4%",
      borderRadius:50,
      width:"90%",
      height:45,
    },
    border:{
      alignContent:"center",
      alignItems:"center",
      justifyContent:"center",
      marginHorizontal:0,
      borderWidth:10,
      borderRadius:500,
      borderColor:"#000588",
      width:158,
      height:155,
      
    }

  });