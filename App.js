import React from 'react';
import Constants from 'expo-constants';
import 'react-native-gesture-handler';
import {View} from 'react-native';
import {MaterialCommunityIcons,AntDesign} from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-community/async-storage';
import {Base64} from './Base64';
import {QrIcon} from './extra/QrIcon';
import {QrScanIcon} from './extra/QrScanIcon';


// Navigation methods and functions
import {NavigationContainer,useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
// import {DrawerContent} from './Drawer';

// Auth imports
import {AuthContext} from './auth/AuthContext';
import {firebase} from './auth/firebase/firebase';

// Auth Screens 
import LoginScreen from './Screens/Login/LoginScreen';
import SignUpDoctor from './Screens/Login/SignUpDoctor';
import SignUpPatient from './Screens/Login/SignUpPatient';
// import Tesseract from './extra/tesseract';

// Patient Screens
import DummyPatient from './Screens/Patient/DummyPatient';
import DoctorsList from './Screens/Patient/DoctorsList';
import DiseaseList from './Screens/Patient/DiseaseList';
import DoctorDetails from './Screens/Patient/DoctorDetails';
import BookAppointment from './Screens/Patient/BookAppointment';
import PatientDashboard from './Screens/Patient/PatientDashboard';
import QRCodePatient from './Screens/Patient/QRCodePatient';
import AddReports from './Screens/Patient/AddReports';
import records from './Screens/Patient/records';
import MyAppointments from './Screens/Patient/MyAppointments';

// Doctor Screens
import DrawerNavigationDoctor from './Screens/Doctor/DrawerNavDoc';
import ShowReport from './Screens/Doctor/ShowReport';
// import FirstPageDoc from './Screens/Doctor/firstPageDoc';
// import Appointments from './Screens/Doctor/Appointments';
// import Reports from './Screens/Doctor/reports';
// import Patients from './Screens/Doctor/patients';
// import PatientViewTab from './Screens/Doctor/PatientViewTab';
// import ScanQRCode from './Screens/Doctor/ScanQRCode';
// import DummyDoctor from './Screens/Doctor/DummyDoctor';

import { Entypo } from '@expo/vector-icons';
import { colors } from './extra/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-generator';

const Stack = createStackNavigator();

// const ObjectId = require('mongodb').ObjectID;
const abortController = new AbortController;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});



// registration for sending notifications
async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } 
    else 
    {
      alert('Must use physical device for Push Notifications');
    } 
    return token;
}


export default function App({props}){
    
    const [expoToken,setExpoToken] = React.useState('');
    const [notification,setNotification] = React.useState(false);
    const notificationListener = React.useRef();
    const responseListener = React.useRef();


    // updating collection with expo token for notification
    updateToken = async(ptoken,type) => {
        let token = {
          ExpoToken : ptoken,
        }
        if(type=="doctor"){
            let doctor = await AsyncStorage.getItem('doctor');
            doctor = JSON.parse(doctor);
            console.log(doctor['_id'])
            let where ={
                "Mobile" : doctor.Mobile,
            };
            where = Base64.encode(JSON.stringify(where));
            token = Base64.encode(JSON.stringify(token));
            // console.log('http://192.168.1.11:5000/update/doctors/'+token+'/'+where);
            fetch('http://192.168.1.11:5000/update/doctors/'+token+'/'+where,{signal:abortController.signal})
            .then(response => response.json())
            .then((responseJson) => {
                if(responseJson.status==="Success")
                { 
                    console.log("Doctor Notification Token Updated Successfully");
                }
            })
            .catch(error => alert(error))
        }
        else{
            let patient = await AsyncStorage.getItem('patient');
            let where = {
                "Mobile" : patient.Mobile,
            }
            where = Base64.encode(JSON.stringify(where));
            token = Base64.encode(JSON.stringify(token));
            // console.log('http://192.168.1.11:5000/update/patients/'+token+'/'+where);
            fetch('http://192.168.1.11:5000/update/patients/'+token+'/'+where,{signal:abortController.signal})
            .then(response => response.json())
            .then((responseJson) => {
                if(responseJson.status==="Success")
                { 
                    console.log("Patient Notification Token Updated Successfully");
                }
            })
            .catch(error => alert(error))
        }
    }

    //reducer to maintain state of the app

    const initialState = {
        isLoading: true,
        userToken: null,
        loginType:null,
    }

    const reducer = (prevState, action) => {
        switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            loginType: action.lType,
            };
        case 'SIGN_IN':
            return {
            ...prevState,
            userToken: action.token,
            loginType:action.lType,
            };
        case 'SIGN_OUT':
            return {
            ...prevState,
            loginType:null,
            userToken: null,
            };
        }
    }
    const [loginState,dispatch] = React.useReducer(reducer,initialState);

    const authContext = React.useMemo(
        () => ({
          signIn: async (userType) => {
            if(userType === "doctor"){
            registerForPushNotificationsAsync().then(token => {
              let ptoken  = token;
              updateToken(ptoken,"doctor");
              }
            );
            }
            else{
              
              registerForPushNotificationsAsync().then(token => {
                let ptoken  = token;
                updateToken(ptoken,"patient");
                }
              );
            }
  
            dispatch({ type: 'SIGN_IN',token:true,lType:userType });
          },
          signOut: async() => {
            try{
            AsyncStorage.removeItem('doctor');
            AsyncStorage.removeItem('patient');
            }
            catch(e){
              console.log(e);
            }
                firebase.auth().signOut().then(function() {
                    console.log("Sign Out Successful");
                }).catch(function(error) {
                  alert(error+"Error signing out!! Please try again later or clear user data of the app.");
                });
                
            dispatch({ type: 'SIGN_OUT'});
          }
        }),
        []
    );

    React.useEffect(() =>
    {

        // HEADER - Notifications 
            registerForPushNotificationsAsync().then(token => setExpoToken(token))
        

            // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                const data = response.notification.request.content.data;
                console.log(data);
                if(data.action="customer-orders")
                {
                props.navigation.navigate('Root',{screen: 'orderDetails',params: {type:"get",order:data.orderId}});
                // navigation.navigate('orderDetails',{order:data.orderId})
                }
                else if(data.action="admin-orders")
                {
                props.navigation.navigate('Root',{screen: 'orderDetails',params: {type:"get",order:data.orderId}});
                // navigation.navigate('orderDetails',{order:data.orderId})
                }
                else if(data.action="change-shop")
                {
                AsyncStorage.getItem( 'user' )
                    .then( recData => {

                    // the string value read from AsyncStorage has been assigned to data
                    

                    // transform it back to an object
                    let dat = JSON.parse( recData );

                    // Decrement
                    dat.Store_Id = data.storeId;

                    //save the value to AsyncStorage again
                    AsyncStorage.setItem( 'user', JSON.stringify( dat ));
                    

                    }).done();
                    this.props.emptyCart();
                    props.navigation.navigate('Root',{screen: 'Home',params: {reload:true}});
                    // navigation.navigate('orderDetails',{order:data.orderId})
                }
            });
        // END - Notifications

        // Restoring for userToken and choosing the navigation accordingly
            const bootstrapAsync = async () => {
                let userToken = null;
                let loginType = null;

                    try {
                        let patient = await AsyncStorage.getItem('patient');
                        if(patient!=null)
                        {
                            userToken = true;
                            loginType = 'patient';
                        }
                        let doctor = await AsyncStorage.getItem('doctor');
                        if(doctor!=null){
                            userToken = true;
                            loginType = 'doctor';
                        }
                    }
                    
                    
                    catch (e) {
                        console.log("error-"+e+"(userToken could not be restored)");
                    }
                

                // After restoring token, we may need to validate it in production apps

                // This will switch to the App screen or Auth screen and this loading
                // screen will be unmounted and thrown away.
                dispatch({ type: 'RESTORE_TOKEN', token: userToken,lType: loginType });
            };
        // END - Restore UserToken

        // Calling and clearing of the functions
            bootstrapAsync();
        
            return function cleanUp(){
                Notifications.removeNotificationSubscription(notificationListener);
                Notifications.removeNotificationSubscription(responseListener);
            };
        // End

    },[]
    );
    const headerIcon=()=>{
        return(
          <Entypo name="menu" size={30} color="black" style={{marginLeft:20}} onPress={()=>props.navigation.openDrawer()}/>
        );
      };

    return(
        <NavigationContainer>
            <AuthContext.Provider value={authContext}>
            <Stack.Navigator 
            screenOptions={{
                headerStyle: {
                backgroundColor: colors.themeColor,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                // fontWeight: 'bold',
                alignSelf:"center",
                justifyContent:"center"
                },
            }}>
                {loginState.isLoading == true ? (
                    <Stack.Screen name="Splash" component={LoginScreen} options={{headerShown:null}}/>
                ) : (
                    <>
                    {loginState.userToken == null ? (
                        <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{title:"Login",headerShown:null}}/>
                        <Stack.Screen name="SignUpPatient" component={SignUpPatient} options={{title:"Sign Up - Patient"}}/>
                        <Stack.Screen name="SignUpDoctor" component={SignUpDoctor} options={{title:"Sign Up - Doctor"}}/>
                        </>
                    ) : (
                        <>
                        {loginState.loginType == "doctor" ? (
                            // Doctor Screens
                            <>

                                <Stack.Screen name="DrawerNavigationDoctor" component={DrawerNavigationDoctor} options={{headerShown:false}}/>
                                {/* <Stack.Screen name="DummyDoctor" component={DummyDoctor} options={{headerRight:()=>
                                    <View  style={{flexDirection:'row'}}>
                                        <QrScanIcon {...props}/>
                                    </View>}}/> */}
                                {/* <Stack.Screen name="ScanQRCode" component={ScanQRCode} options={{
                                    title:"Scan QR Code",
                                }}
                                /> */}
                                {/* <Stack.Screen name="firstPageDoc" component={FirstPageDoc} options={{headerLeft:headerIcon,title:"Home"}}/>
                                <Stack.Screen name="appointments" component={Appointments} options={{headerLeft:headerIcon,title:"Appointments"}}/>
                                <Stack.Screen name="Reports" component={Reports} options={{headerLeft:headerIcon,title:"Reports"}}/>
                                <Stack.Screen name="Patients" component={Patients} options={{headerLeft:headerIcon,title:"Patients"}}/>
                                <Stack.Screen name="PatientViewTab" component={PatientViewTab} options={{headerLeft:headerIcon,title:'PatientView'}}/> */}
                            </>
                        ) : (
                            // Patients Screens
                            <>
                            
                                <Stack.Screen name="PatientDashboard" component={PatientDashboard} options={{
                                    title:"Dashboard",
                                    headerLeft:() => 
                                    <View style={{padding:16,flexDirection:'row',justifyContent:'space-between' }}>
                                        <MaterialCommunityIcons name='text' color="white" size={30} />
                                    </View>,
                                    headerRight:()=>
                                    <View  style={{flexDirection:'row'}}>
                                        <AntDesign name="user" size={25} color="white" style={{marginRight:10}}/> 
                                        <QrIcon {...props}/>
                                    </View>}}
                                />

                                <Stack.Screen name="records" component={records} options={{
                                    title:"Medical Records",
                                    headerLeft:() => 
                                    <View style={{padding:16,flexDirection:'row',justifyContent:'space-between' }}>
                                        <MaterialCommunityIcons name='text' color="white" size={30} />
                                    </View>,
                                    headerRight:()=>
                                    <View  style={{flexDirection:'row'}}>
                                        <AntDesign name="user" size={25} color="white" style={{marginRight:10}}/> 
                                        <QrIcon {...props}/>
                                    </View>}}
                                />

                                <Stack.Screen name="MyAppointments" component={MyAppointments} options={{
                                    title:"My Appointments",
                                    headerLeft:() => 
                                    <View style={{padding:16,flexDirection:'row',justifyContent:'space-between' }}>
                                        <MaterialCommunityIcons name='text' color="white" size={30} />
                                    </View>,
                                    headerRight:()=>
                                    <View  style={{flexDirection:'row'}}>
                                        <AntDesign name="user" size={25} color="white" style={{marginRight:10}}/> 
                                        <QrIcon {...props}/>
                                    </View>}}
                                />
                                <Stack.Screen name="Add Reports" component = {AddReports}/>
                                <Stack.Screen name="QRCodePatient" component={QRCodePatient}/>
                                
                                <Stack.Screen name="DiseaseList" component={DiseaseList} options={{title:"Diseases/Symptoms",headerRight:()=>
                                    <View  style={{flexDirection:'row'}}>
                                        <AntDesign name="user" size={25} color="white" style={{marginRight:10}}/> 
                                        <QrIcon {...props}/>
                                    </View>}}
                                />
                                
                                <Stack.Screen name="DoctorsList" component={DoctorsList} options={{
                                    title:"Doctors",
                                    headerLeft:() => 
                                    <View style={{padding:16,flexDirection:'row',justifyContent:'space-between' }}>
                                        <MaterialCommunityIcons name='text' color="white" size={30} />
                                    </View>,
                                    headerRight:() =>
                                    <View  style={{flexDirection:'row'}}>
                                        <AntDesign name="user" size={25} color="white" style={{marginRight:10}}/>              
                                    </View>}}
                                />

                                <Stack.Screen name="DoctorDetails" component={DoctorDetails} options={{headerRight:() =>
                                    <View  style={{flexDirection:'row'}}>
                                        <AntDesign name="user" size={25} color="white" style={{marginRight:10}}/>              
                                    </View>}} 
                                />

                                <Stack.Screen name="BookAppointment" component={BookAppointment} options={{title:"Book Appointment",headerRight:()=>
                                    <View  style={{flexDirection:'row'}}>
                                        <AntDesign name="user" size={25} color="white" style={{marginRight:10}}/> 
                                        <QrIcon {...props}/>
                                    </View>}}
                                />
                                                                
                                {/* <Stack.Screen name="dummyPatient" component={DummyPatient}/> */}
                            </>
                        )}
                        </>
                    )}

                    </>
                )}
                
            </Stack.Navigator>
            </AuthContext.Provider>
        </NavigationContainer>
    )
}

// PJ: do not uncomment the commented lines.

// You keep on adding the screens in the screens folder and add them here. We will take care of navigation more later.
// export default function App(){
    
// }