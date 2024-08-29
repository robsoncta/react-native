import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Body,
  Left,
  Form,
  Text,
  Item,
  Input,
  Icon,
  H1,
  View,
  Toast
} from "native-base";
import styles from '../config/styles';
import axios from '../service/axios';

class CadastroComSenha extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Nome: '',
        Celular: '',
        Email:'',
        Senha:'',
        SenhaF:''
    };
    this._cadastro = this._cadastro.bind(this);
  }

  _cadastro = () => {

        if(this.state.Senha != this.state.SenhaF){
            Toast.show({
                text: "As senhas não conferem...",
                buttonText: "Ok",
                position: "top",
                type: "danger"
              })
            return false;
        }


        axios.post(`/usuario/add`, {
                'Nome':this.state.Nome,
                'Celular':this.state.Celular,
                'Email':this.state.Email,
                'Senha':this.state.Senha,
        })
        .then(res => {
        if(res.data.usuario){
            this._storeData(res.data.usuario);
            Toast.show({
                text: "Usuario cadastrado com sucesso!",
                buttonText: "Ok",
                position: "top",
                type: "success"
              })
        }else{
          Toast.show({
            text: "Ops... Algo deu errado! Tente novamente",
            buttonText: "Ok",
            position: "top",
            type: "danger"
          })
        }
      }).catch((e) => {
         // alert(JSON.stringify(e));
        Toast.show({
            text: "Ops... Algo deu errado! Tente novamente",
            buttonText: "Ok",
            position: "top",
            type: "danger"
          })
    });
      
  }

  _storeData = async (user) => {
    try {
     await AsyncStorage.setItem('userID', "" +user._id);
     await AsyncStorage.setItem('userName', user.Nome);
     this.props.navigation.navigate('Home');
    } catch (error) {
      alert(error)
    }
  };

  render() {
    return (
      <Container style={styles.container}>

        <Header style={styles.header}>
            <Left style={{width:10  }}>
                <Button transparent onPress={() => this.props.navigation.navigate('Login')}>
                    <Icon name="arrow-back" style={{color:'#fff'}}/>
                </Button>
            </Left>
            <Body style={{flex:3 , justifyContent:"center", alignContent: "center" }}>
                <Title style={{ alignSelf: "center", fontSize:19, color: '#fff', textAlign:"center" }}>Cadastro de Visitante</Title>
            </Body>
        </Header>

        <Content>
        
        <H1 style={{margin:20, fontWeight:'bold', color:"#777"}}>Cadastro de Visitante</H1>

        <Form style={{ width:"90%" }}>            
            <Item style={{marginTop: 15}}>
              <Input onChangeText={(Nome) => this.setState({Nome})} placeholder="Nome" />
            </Item>
            <Item style={{marginTop: 15}}>
              <Input  keyboardType={'phone-pad'} onChangeText={(Celular) => this.setState({Celular})}  placeholder="Celular" />
            </Item>
            <Item style={{marginTop: 15}}>
              <Input keyboardType={'email-address'} onChangeText={(Email) => this.setState({Email})} placeholder="E-mail " />
            </Item>
            <Item style={{marginTop: 15}}>
              <Input autoCapitalize = "none"  onChangeText={(Senha) => this.setState({Senha})} placeholder="Senha" />
            </Item>
            <Item style={{marginTop: 15}}>
              <Input autoCapitalize = "none" onChangeText={(SenhaF) => this.setState({SenhaF})} placeholder="Confirmar Senha" />
            </Item>
          </Form>
          <Button onPress={this._cadastro} bordered info style={{width:"90%", justifyContent:"center",   margin: 15, marginTop: 100 }}>
            <Text style={{textAlign:"center"}}>CADASTRAR</Text>
          </Button>
           
        </Content>
       
      </Container>
    );
  }
}

export default CadastroComSenha
