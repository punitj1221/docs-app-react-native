import React from 'react';
import { StyleSheet,KeyboardAvoidingView, Text, View,Image, TextInput, ScrollView, Button,TouchableOpacity} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import {useNavigation} from '@react-navigation/native';
import {Base64} from '../../Base64';
import { AuthContext } from '../../auth/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import { colors } from '../../extra/colors';

export default function LoginScreen() {
  const [select,setSelect] = React.useState('');
  const [username,setUsername] = React.useState('');
  const [pass,setPass] = React.useState('');
  const navigation = useNavigation();
  const {signIn} = React.useContext(AuthContext);

  const login = () => {
    if(username!="" && pass!=""){
      if(select=="Doctor"){
        let data = {
          Mobile : username,
          Password: pass,
        };
        data = Base64.encode(JSON.stringify(data));
        fetch('http://192.168.1.11:5000/login/doctors/'+data)
        .then(result => result.json())
        .then(resultJson => {
          console.log(resultJson);
          if(resultJson.status == "Success"){
            let obj;
            resultJson.data.forEach((val) =>{
              obj = val;
            });
            AsyncStorage.setItem('doctor',JSON.stringify(obj));
            signIn('doctor');
          }
          else{
            alert("Wrong Credentials");
          }
        })
        .catch(err => console.log(err));
      }
      else if(select=="Patient"){
        let data = {
          Mobile : username,
          Password: pass,
        };
        data = Base64.encode(JSON.stringify(data));
        fetch('http://192.168.1.11:5000/login/patients/'+data)
        .then(result => result.json())
        .then(resultJson => {
          console.log(resultJson);
          if(resultJson.status == "Success"){
            let obj;
            resultJson.data.forEach((val) =>{
              obj = val;
            });
            AsyncStorage.setItem('patient',JSON.stringify(obj));
            signIn('patient');
          }
          else{
            alert("Wrong Credentials");
          }
        })
        .catch(err => console.log(err));
      }
      else{
        alert("Please select the type above.");
      }
  }
  else{
    alert("Please enter the credentials correctly");
  }
  }
  
  const handlePass = (password) =>{
    setPass(password)
  }
  const handleUsername = (user) =>{
    setUsername(user);
  }

  return (
    <View style={styles.container}>
        <KeyboardAvoidingView style={styles.firstContainer}>
          {/* MMG Agar header daalna ho toh yaha daalo */}
          {/* PJ: koi header nahi aayega idhar */}
        
        <View style={styles.imgContainer}>
          <TouchableOpacity onPress={()=>{setSelect('Doctor')}}>
          <View style={{width:"40%",height:'70%'}}>
            <View style={select=="Doctor" ? styles.border : null}>
              <Image source={require('../../assets/doctor1.png')} style={styles.img1}/>
            </View>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{setSelect('Patient')}}>
          <View style={{width:"40%",height:'70%'}}>
            <View style={select=="Patient" ? styles.border : null}>
              <Image source={require('../../assets/patient1.jpg')} style={styles.img2}/>
            </View>
          </View>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
        
        <View style={styles.secondContainer}>
          <ScrollView>
            <View>
              <Text style={{  fontSize:30,alignSelf:'center',marginTop:'1%'}}>
                Login
              </Text>
            </View>
            <View style={styles.inStyle}>
              <AntDesign name="user" size={30} color="#555" style={{paddingRight:10}} />
              <TextInput value={username} maxLength={10} keyboardType="phone-pad" onChangeText={handleUsername} style={{fontSize:20,width:'100%'}} placeholder="Mobile Number" placeholderTextColor="#555"/>
            </View>
            <View style={styles.inStyle}>
              <AntDesign name="lock" size={30} color="#555" style={{paddingRight:10}} />
              <TextInput value={pass} onChangeText={handlePass} secureTextEntry={true} style={{fontSize:20,width:'100%'}} placeholder="Password" placeholderTextColor="#555"/>  
            </View>
            <View style={{justifyContent:'flex-end',flexDirection:'row',marginRight:"5%",marginTop:'3%'}}>
              <TouchableOpacity onPress={()=>{alert("Forgot Password Pressed")}}><Text style={{color:colors.themeColor}}>Forgot Password?</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>{login()}}>
              <View style={styles.button}>
                <Text style={{alignSelf:'center',width:"100%",textAlign:'center',fontWeight:"bold",fontSize:20,color:"white",marginTop:8,fontWeight:'bold'}}>Log In</Text>
              </View>
            </TouchableOpacity>
            <View style={{marginTop:"10%",alignSelf:'center'}}>
              <Text style={{alignSelf:'center',fontSize:20}}>
                New User?
              </Text>
              <TouchableOpacity onPress={()=>{
                if(select=="Doctor"){
                  navigation.navigate('SignUpDoctor')
                }
                else if(select=="Patient"){
                  navigation.navigate('SignUpPatient');
                }
                else{
                  alert("Please select the categories above to continue.");
                }
              }} >
                <Text style={{color:colors.themeColor,fontSize:20}}>
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
      backgroundColor:colors.themeColor,
      paddingTop:"5%"
    },
    firstContainer:{
      flex:2,
      backgroundColor:colors.themeColor,
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
      backgroundColor:colors.themeDark,
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
      borderColor:colors.grey,
      width:158,
      height:155,
      
    }

  });
