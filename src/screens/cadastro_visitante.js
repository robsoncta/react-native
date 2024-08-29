import React, { Component } from "react";
import { AsyncStorage, Platform, PermissionsAndroid} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Footer,
  FooterTab,
  Body,
  Left,
  Form,
  Toast,
  Text,
  Item,
  Input,
  H3,
  Icon,
  H1,
  View,
  CheckBox,
  Spinner
} from "native-base";
import styles from '../config/styles';
import ContactsWrapper from 'react-native-contacts-wrapper';
import axios from '../service/axios';
import TextInputMask from 'react-native-text-input-mask';



class CadastroVisitante extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Nome: '',
      Celular: '',
      Email: '',
      Prestador: false,
      checkboxN: true,
      buttonDisabled: false
    };
    this._buscarContatos = this._buscarContatos.bind(this);
    this._cadastrar = this._cadastrar.bind(this);
  }
 

  carregaInfo = async() => {

    this.getListContacts(); 
    }

    willFocus = this.props.navigation.addListener(
    'willFocus',
    (payload) => {
      this.setState({ 
        Nome: '',
        Email: '',
        Celular: false,
        Senha:'',
        Prestador:false,
        Documento:'',
        Servico:'',
        checkboxN: true,
        buttonDisabled: false
     })
    }
);


 


  _cadastrar = async  () => {
          let redirect =  this.props.navigation.getParam('page', 'no-page');
         
          this.setState({ buttonDisabled: true });
          let alertToaster = false;
          let textoToaster = "";
         // alert( this.state.Celular.length);
           if(!this.state.Nome){
            alertToaster = true;
            textoToaster = "Insira um nome!";
          }else if(!this.state.Celular || this.state.Celular.length <15){
            alertToaster = true;
            textoToaster = "Inisira um celular valido!";
          }else if(this.state.Prestador){
            if(!this.state.Documento){
              alertToaster = true;
              textoToaster = "Insira um documento";
            }else if(!this.state.Servico){
              alertToaster = true;
              textoToaster = "Insira um nome para o serviço.";
            }
          }
          
          if(alertToaster){
            Toast.show({
              text: textoToaster,
              buttonText: "Ok",
              position: "top",
              type: "danger"
            })
            this.setState({ buttonDisabled: false });
            return false
          }

          let id = await AsyncStorage.getItem('userID');

          axios.post(`/visitante/add`, {
              '_logado': id,
              'Nome':this.state.Nome,
              'Celular':this.state.Celular,
              'Email':this.state.Email,
              'Senha':this.state.Senha,
              'Prestador': this.state.Prestador,
              'Documento': this.state.Documento,
              'Servico': this.state.Servico,
              'id': ''
          })
          .then(res => {
            Toast.show({
              text: "Visitante cadastrado com sucesso!",
              buttonText: "Ok",
              position: "top",
              type: "success"
            });
            this.setState({ 
              Nome: '',
              Email: '',
              Celular: false,
              Senha:'',
              Prestador:false,
              Documento:'',
              Servico:'',
              checkboxN: true,
              buttonDisabled: false
           })
   
           if(redirect == "Sidebar"){
            // this.props.navigation.goBack();
            this.props.navigation.navigate("Contatos");
           }else{
            this.props.navigation.navigate("CadastroAcesso",{page:"CadastroVisitante"});
           }
          }).catch((e) => {
            //alert(JSON.stringify(e))
            this.setState({ buttonDisabled: false });
              Toast.show({
                text: "Ops... Algo deu errado! Tente novamente",
                buttonText: "Ok",
                position: "top",
                type: "danger"
              })
          });
  }


  toggleSwitchSim() {
    this.setState({
      Prestador: true,
      checkboxN: false
    });
  }
  toggleSwitchNao() {
    this.setState({
        Prestador: false,
        checkboxN: true
      });
  }
  _buscarContatos() {


    if(Platform.OS === 'ios'){
      ContactsWrapper.getContact().then((contact) => {
        // Replace this code
        let telefone = contact.phone.replace(/ /g, '');
         telefone = telefone.split(/ /)[0].replace(/[^\d]/g, '');
        telefone = telefone.substr(-11, 12);
        // if(contact.phone.substr(0, 2) == "55"){
        //   telefone = contact.phone.substr(2, 99);
        // }else if(contact.phone.substr(0, 1) == "0"){
        //   telefone = contact.phone.substr(1, 99);
        // }else{
        //   telefone = contact.phone;
        // }

       // alert(contact.phone.substr(0, 2))

        this.setState({ 
            Nome: contact.name,
            Email: contact.email,
            Celular: telefone,
        });
      });
    }else{
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'Este aplicativo gostaria de ver seus contatos.'
        }
      ).then(() => {
          ContactsWrapper.getContact().then((contact) => {
            // Replace this code

            let telefone = contact.phone.replace(/ /g, '');
            telefone = telefone.split(/ /)[0].replace(/[^\d]/g, '');
           telefone = telefone.substr(-11, 12);

            this.setState({ 
                Nome: contact.name,
                Email: contact.email,
                Celular: telefone,
            })
          //  alert(JSON.stringify(contact));
        })
        .catch((error) => {
            console.log("ERROR CODE: ", error.code);
            console.log("ERROR MESSAGE: ", error.message);
        });
      })
    }

    
    
    
}
  render() {
    return (
      <Container style={styles.container}>

        <Header style={styles.header}>
            <Left style={{width:10  }}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon name="arrow-back" style={{ color: '#fff' }} />
                </Button>
            </Left>
            <Body style={{flex:3 , justifyContent:"center", alignContent: "center" }}>
            <Title style={{ alignSelf: "center", fontSize: 16 , color: '#fff', textAlign: "center" }}>Cadastro de Convidados</Title>
            </Body>
            {/* <Right style={{flex:1}}/> */}
        </Header>

        <Content>
        {/* <H1 style={{margin:20, fontWeight:'bold', color:"#777"}}>Cadastro de Visitante</H1> */}
        <Form style={{ width:"90%" }}>
            <Item>
              <Input value={this.state.Nome} onChangeText={(Nome) => this.setState({ Nome })} placeholder="Nome " />
            </Item>
            <Item>
              {/* <Input value={this.state.Celular} onChangeText={(Celular) => this.setState({ Celular })} placeholder="Celular " /> */}
              <TextInputMask
               placeholder="Celular"
               value={this.state.Celular}
                refInput={ref => { this.input = ref }}
                onChangeText={(formatted, extracted) => {
                  this.setState({ Celular: formatted })
                  // this.setState({ Celular: extracted })
                  // console.log(formatted) // +1 (123) 456-78-90
                  // console.log(extracted) // 1234567890
                }}
                style={{
                  height:55,
                  fontSize: 18, 
                  width:'100%',
                  color:"rgba(153,153,153,1)"
                }}
                mask={"([00]) [0] [0000]-[0000]"}
              />
            
            </Item>
            <Item>
              <Input value={this.state.Email} onChangeText={(Email) => this.setState({ Email })} placeholder="E-mail" />
            </Item>
            <View>
                <Button transparent info style={{width:"100%",marginTop:10,justifyContent:"center"}}   onPress = {this._buscarContatos}>
                    <Text style={{textAlign:"center"}}>+ Buscar contatos da agenda</Text>
                </Button>
            </View>
            <H3 style={{ margin:15}}>Prestador de serviço</H3>
            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
              <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                   // onPress={() => this.setState({checked: !this.state.checked})}
                    checked={this.state.Prestador}
                  //hecked={this.state.checkbox1}
                  onPress={() => this.toggleSwitchSim()}
                />
                  <Text  style={{ marginLeft:15}}> Sim </Text>
              </Item>
              <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                checked={this.state.checkboxN}
                  //hecked={this.state.checkbox1}
                  onPress={() => this.toggleSwitchNao()}
                />
                  <Text  style={{ marginLeft:15}}> Não </Text>
              </Item>
            </View>
                {this.state.Prestador?(
                    <View style={{marginLeft: 20}}>
                        <Item>
                            <Input value={this.state.Documento} onChangeText={(Documento) => this.setState({ Documento })} placeholder="Documento de indentidade" />
                        </Item>
                        <Item>
                            <Input value={this.state.Servico} onChangeText={(Servico) => this.setState({ Servico })} placeholder="Nome do serviço" />
                        </Item>
                    </View>
                ):null}
                
          </Form>
          <Button disabled={this.state.buttonDisabled}  onPress={this._cadastrar} bordered info style={{width:Platform.OS === 'ios' ? "90%" : "85%", justifyContent:"center",   margin: 15,marginLeft: Platform.OS === 'ios'? 15 : 25, marginTop: 50 }}>
            {this.state.buttonDisabled?(
              <Spinner size="large" color="#0000ff" />
            ):(
              <Text style={{textAlign:"center"}} >SALVAR CONTATO</Text>
            )}
				
          </Button>
           
        </Content>
       
      </Container>
    );
  }
}

export default CadastroVisitante;
