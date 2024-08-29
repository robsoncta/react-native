import React, { Component } from "react";
import { Image, Platform, AsyncStorage, ScrollView } from "react-native";
import {
  Container,
  Text,
  View,
  Button,
  Content,
  Form,
  Item,
  Input,
  Header,
  Left,
  Spinner,
  Body,
  Toast,
  Right  
} from "native-base";
import axios from '../service/axios';
import { Grid, Row } from "react-native-easy-grid";
import styles from '../config/styles';
import { onSignIn } from "../service/auth";
import { Dialog } from 'react-native-simple-dialogs';
const logo = require("../../assets/logo.png");
const redes = require("../../assets/redes.png");

class LoginSenha extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '', 
			pass: '',
      userInfo: '',
      error: null,
      dialogVisible:false,
      recuperar:false,
      buttonDisabled:false,
      emailRecuperar:false,
      userRec:false
    };
    this._logar = this._logar.bind(this);
    this._storeData = this._storeData.bind(this);
  }


  // _recuperarSenha = () => {
  //   this.setState({
  //     recuperar:true,
  //     dialogVisible: !this.state.dialogVisible
  //   });
  //  }
   _recuperarSenha = () => {
      this.setState({buttonDisabledR: true});
        axios.get(`/usuario/perdeuSenha/`+this.state.userRec)
        .then(res => {


          let email = "";
          email += res.data.usuario.Email.split('@')[0].substr(0, 2);
          email += '*********';
          email += res.data.usuario.Email.split('@')[1];

          this.setState({
            recuperar:true,
            buttonDisabledR:false,
            emailRecuperar: email
           // dialogVisible: !this.state.dialogVisible
          });
        }).catch((e) => {
            Toast.show({
              text: "Usuario não encontrado!",
              buttonText: "Ok",
              position: "top",
              type: "danger"
            })
            this.setState({
              recuperar:false,
              dialogVisible: !this.state.dialogVisible,
              buttonDisabledR: false
            });
            
        });
   }

  _logar = () => {

      // alert(this.state.user);
      // alert(this.state.pass);
 
      this.setState({buttonDisabled: true});

      let email = this.state.user.replace(/ /g, '');

      if( this.state.user.indexOf('@') ==-1){
        email = email.split(/ /)[0].replace(/[^\d]/g, '');
        // alert(email)
        this.setState({user:email})
      }
      //http://localhost/niot-api/public/users
      // axios.get(`/users`)
      // .then(res => {
      //   alert(JSON.stringify(e));
      //   this.setState({buttonDisabled: false});
      // }).catch((e) => {
      //   alert(JSON.stringify(e));
      //   this.setState({buttonDisabled: false});
      // });

			axios.post(`/usuario/login`, {
					'email':email,
					'pass':this.state.pass,
			})
				.then(res => {
          if(res.data.usuario){
            this._storeData(res.data.usuario);
            onSignIn().then(() => console.log('ok'));
          }else{
            Toast.show({
              text: "Login ou senha incorretos! Tente novamente",
              buttonText: "Ok",
              position: "top",
              type: "danger"
            })
          }
          this.setState({buttonDisabled: false});
        }).catch((e) => {
          alert(JSON.stringify(e));
					  Toast.show({
									text: "Login ou senha incorretos! Tente novamente",
									buttonText: "Ok",
									position: "top",
									type: "danger"
                })
                this.setState({buttonDisabled: false});
				});
        
	}

  _storeData = async (user) => {
    try {
     await AsyncStorage.setItem('userID', "" +user._id);
     //await AsyncStorage.setItem('CondominioID', "" +user.CondominioUnidades.Condominio['$oid']);
     //await AsyncStorage.setItem('ResidenciaID', "" +user.CondominioUnidades.Unidades[0]['$oid']);
     await AsyncStorage.setItem('userName', user.Nome);
     
     //await AsyncStorage.setItem('userPic', user.base_picture);
     if(user.first == 0){
      this.props.navigation.navigate('TrocaSenha');
     }else{
       this.props.navigation.navigate('Condominios');
     }

    } catch (error) {
      alert(error)
    }
  };






  render() {
    return (
      <Container>
        <Dialog
            visible={this.state.dialogVisible}
            title="Recuperação de senha"
            onTouchOutside={() =>  this.setState({dialogVisible: this.state.buttonDisabledR})   } >
              {!this.state.recuperar?(
                 <Form>
                 <Item regular style={{height: 50, width:280}}>
                   <Input  value={this.state.userRec} onChangeText={(userRec) => this.setState({userRec})}  placeholder="Numero de celular" />
                 </Item>
                 <Button  disabled={this.state.buttonDisabledR}  onPress= {this._recuperarSenha} style={{marginTop: 20, height: 50, width:280, justifyContent:'center', backgroundColor: '#DC6B2F'}}>
                 {this.state.buttonDisabledR?(
                      <Spinner size="large" color="#0000ff" />
                    ):(
                      <Text>Recuperar senha</Text>
                    )}
                 </Button>
               </Form> 
              ):(
                  <View>
                    <View style={{textAlign:"center"}}>
                      <Text style={{width:"100%", color:"#000", textAlign:"center"}}>Um e-mail de recuperação de senha foi enviado para o email {this.state.emailRecuperar}</Text>
                    </View>
                    <View style={{textAlign:"center", flexDirection:"row",  justifyContent:"center"}}>
                     
                      <Button onPress={() => this.setState({dialogVisible: !this.state.dialogVisible, recuperar:false})} transparent info style={{width:"30%", justifyContent:"center",marginLeft:10, marginTop: 10 }}>
                        <Text style={{textAlign:"center"}}>Ok</Text>
                      </Button>
                    </View>
                  </View>
              )}

        </Dialog>
        
        <ScrollView keyboardShouldPersistTaps='always' style={{backgroundColor: '#484848'}}>
        <Grid style={{marginTop:30}}>
          <Row style={{height: 200, backgroundColor: "#484848", justifyContent: 'center', alignItems: 'center'}}>
              <Image square style={styles.logo}  source={logo} />           
          </Row>

          <Row style={{ backgroundColor: "#484848", 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch'}}>

           <View style={{flex:1, justifyContent:"center", alignItems: 'center', height:20, marginTop: Platform.OS === 'ios' ? 20 : 0, marginBottom:20}}>
            <Text style={{color:"#fff"}}>Login com Senha</Text>
           </View>

           <View style={{flex:1, flexDirection: 'column', alignItems:'center', marginTop:-10,
           justifyContent: "center"}}>      
              <Form>
                <Item regular style={{height: 50, width:300}}>
                  <Input value={this.state.user} onChangeText={(user) => this.setState({user})} placeholder="E-mail ou Número de Celular" />
                </Item>
                <Item regular style={{marginTop: 8, height: 50, width:300}}>
                  <Input autoCapitalize = "none" secureTextEntry onChangeText={(pass) => this.setState({pass})} placeholder="Senha" />
                </Item>
                <Button  disabled={this.state.buttonDisabled}  onPress={this._logar} style={{marginTop: 20, height: 50, width:300, justifyContent:'center', backgroundColor: '#DC6B2F'}}>
                 
                  {this.state.buttonDisabled?(
                      <Spinner size="large" color="#0000ff" />
                    ):(
                      <Text>Entrar</Text>
                    )}
                </Button>
              </Form>            
           </View>

           <View style={{marginTop: Platform.OS === 'ios' ? 70 : 40, marginLeft: 35, height: 20, width: 305, 
                          flexDirection: 'row', alignItems:'center'}}>
            <Button transparent style={{flex:1, height:5}} onPress={() => this.setState({dialogVisible: !this.state.dialogVisible})}>                            
              <View style={{flex: 0.3, height:1, width: 16, backgroundColor:'#fff'}}></View>
              <View style={{flex: 1, height:20}}>
                <Text style={{textAlign: "center", color:"#fff"}}>Esqueci minha senha</Text>
              </View>
              <View style={{flex: 0.3, height:1, width: 16, backgroundColor:'#fff'}}></View>
            </Button>
          </View>
            
          
          <View style={{flex:1,justifyContent:"center", alignItems: 'center'}}>
            <Text style={{fontSize:13, paddingLeft:32, paddingRight:32, marginTop: Platform.OS === 'ios' ? 20 : 10, textAlign: "center", color:"#fff"}}>Ao cadastrar-me, declaro que eu sou maior de idade e aceito a Politica de Privacidade e os Termos e condições do aplicativo.</Text>
          </View>
          </Row>
        </Grid>
      </ScrollView>
      </Container>
    );
  }
}

export default LoginSenha;
