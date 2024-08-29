import React, { Component } from "react";
import { AsyncStorage } from "react-native";
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
import { Dialog } from 'react-native-simple-dialogs';
import TextInputMask from 'react-native-text-input-mask';

class Visitante extends Component {
  constructor(props) {
    super(props);
    this.state = {
        idVisitante:'',
      Nome: '',
      Celular: '',
      Email: '',
      Prestador: false,
      checkboxN: false,
      dialogVisible:false,
      buttonDisabled:false,
      buttonDisabledS:false
    };
    this._buscarContatos = this._buscarContatos.bind(this);
    this._cadastrar = this._cadastrar.bind(this);
    this._deletar = this._deletar.bind(this);
  }



  carregaInfo = async() => {

        this.getListContacts(); 
        }

        willFocus = this.props.navigation.addListener(
        'willFocus',
        (payload) => {
        this.carregaInfo();
        }
    );

    getListContacts = async () => {

        let itemId =  this.props.navigation.getParam('itemId', 'NO-ID');
        let Nome =  this.props.navigation.getParam('Nome', 'NO-ID');
        let Celular =  this.props.navigation.getParam('Celular', 'NO-ID');
        let Prestador =  this.props.navigation.getParam('Prestador', 'NO-ID');
        let Email =  this.props.navigation.getParam('Email', 'NO-ID');
        let Documento =  this.props.navigation.getParam('Documento', 'NO-ID');
        let Servico =  this.props.navigation.getParam('Servico', 'NO-ID');
 
        this.setState({ 
            idVisitante: itemId,
            Nome: Nome,
            Celular: Celular,
            Prestador: Prestador,
            Email: Email,
            Documento: Documento,
            Servico: Servico
        })


        if(Documento){
            this.setState({
                Prestador: true,
                checkboxN: false
              });
        }else{
            this.setState({
                Prestador: false,
                checkboxN: true
              });
        }
    }


  

  _cadastrar = async  () => {
      let id = this.state.idVisitante;

      this.setState({ buttonDisabledS: true });

      let alertToaster = false;
          let textoToaster = "";

           if(!this.state.Nome){
            alertToaster = true;
            textoToaster = "Insira um nome!";
          }else if(!this.state.Celular || this.state.Celular.length <=14){
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
            this.setState({ buttonDisabledS: false });
            return false
          }
    
        axios.post(`/visitante/edit/${id}`, {
              'Nome':this.state.Nome,
              'Celular':this.state.Celular,
              'Email':this.state.Email,
              'Senha':this.state.Senha,
              'Prestador': this.state.Prestador,
              'Documento': this.state.Documento,
              'Servico': this.state.Servico
          })
          .then(res => {


            Toast.show({
              text: "Visitante Editado com sucesso!",
              buttonText: "Ok",
              position: "top",
              type: "success"
            });
            this.setState({ 
              Nome: '',
              Email: '',
              Celular: '',
              Senha:'',
              Prestador:false,
              Documento:'',
              Servico:'',
              checkboxN: false
           })
           this.setState({ buttonDisabledS: false });
            this.props.navigation.navigate("Contatos");
          }).catch((e) => {
            this.setState({ buttonDisabledS: false });
              Toast.show({
                text: "Ops... Algo deu errado! Tente novamente",
                buttonText: "Ok",
                position: "top",
                type: "danger"
              })
          });
  }

  _deletar = async  () => {
    let id = this.state.idVisitante;
    this.setState({ buttonDisabled: true });
    axios.get(`/visitante/delete/${id}`)
      .then(res => {
        Toast.show({
          text: "Visitante Excluido com sucesso!",
          buttonText: "Ok",
          position: "top",
          type: "success"
        });
        this.setState({ 
          Nome: '',
          Email: '',
          Celular: '',
          Senha:'',
          Prestador:false,
          Documento:'',
          Servico:'',
          checkboxN: false
       })
        this.setState({ 
          buttonDisabled: false,
          dialogVisible: !this.state.dialogVisible
        });
        
        this.props.navigation.navigate("Contatos");
      }).catch((e) => {
          Toast.show({
            text: "Ops... Algo deu errado! Tente novamente",
            buttonText: "Ok",
            position: "top",
            type: "danger"
          })
          this.setState({ buttonDisabled: false });
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
    ContactsWrapper.getContact()
    .then((contact) => {
        // Replace this code
        this.setState({ 
            Nome: contact.name,
            Email: contact.email,
            Celular: contact.phone,
         })
      //  alert(JSON.stringify(contact));
    })
    .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MESSAGE: ", error.message);
    });
}
  render() {
    return (
      <Container style={styles.container}>

        <Header style={styles.header}>
            <Left style={{width:10  }}>
                <Button transparent onPress={() => this.props.navigation.navigate('Contatos')}>
                    <Icon name="arrow-back" style={{ color: '#fff' }} />
                </Button>
            </Left>
            <Body style={{flex:3 , justifyContent:"center", alignContent: "center" }}>
            <Title style={{ alignSelf: "center", fontSize: 16 , color: '#fff', textAlign: "center" }}>Cadastro de Visitante</Title>
            </Body>
            {/* <Right style={{flex:1}}/> */}
        </Header>

        <Content>
            <Dialog
                visible={this.state.dialogVisible}
                title="Atenção"
                onTouchOutside={() => this.setState({dialogVisible: false})} >
                <View style={{textAlign:"center"}}>
                <Text style={{width:"100%", textAlign:"center"}}>
                    Deseja excluir esse visitante da sua lista? Caso o mesmo seja excluído, perderá todos acessos atribuídos até o dado momento.
                </Text>
                </View>
                <View style={{textAlign:"center", flexDirection:"row",  justifyContent:"center"}}>
                <Button transparent onPress ={this._deletar} info style={{width:"30%", justifyContent:"center",  marginTop: 10 }}>
                    <Text style={{textAlign:"center"}}>Sim</Text>
                </Button>

                <Button transparent  onPress={() => this.setState({dialogVisible: !this.state.dialogVisible})} info style={{width:"30%", justifyContent:"center",marginLeft:10, marginTop: 10 }}>
                    <Text style={{textAlign:"center"}}>Não</Text>
                </Button>
                </View>

            </Dialog>
        

        <H1 style={{margin:20, fontWeight:'bold', color:"#777"}}>Cadastro de Visitante</H1>
        <Form style={{ width:"90%" }}>
            <Item>
              <Input value={this.state.Nome} onChangeText={(Nome) => this.setState({ Nome })} placeholder="Nome " />
            </Item>
            <Item>
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
              {/* <Input value={this.state.Celular} onChangeText={(Celular) => this.setState({ Celular })} placeholder="Celular " /> */}
            </Item>
            <Item>
              <Input value={this.state.Email} onChangeText={(Email) => this.setState({ Email })} placeholder="E-mail" />
            </Item>

            <H3 style={{ margin:15}}>Prestador de serviço</H3>
            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
              <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                    checked={this.state.Prestador}
                  onPress={() => this.toggleSwitchSim()}
                />
                  <Text  style={{ marginLeft:15}}> Sim </Text>
              </Item>
              <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                checked={this.state.checkboxN}
                  onPress={() => this.toggleSwitchNao()}
                />
                  <Text  style={{ marginLeft:15}}> Não </Text>
              </Item>
            </View>
                {this.state.Prestador?(
                    <View style={{ margin:15}}>
                        <Item>
                            <Input value={this.state.Documento} onChangeText={(Documento) => this.setState({ Documento })} placeholder="Documento de indentidade" />
                        </Item>
                        <Item>
                            <Input value={this.state.Servico} onChangeText={(Servico) => this.setState({ Servico })} placeholder="Nome do serviço" />
                        </Item>
                    </View>
                ):null}
                
          </Form>
          <Button disabled={this.state.buttonDisabledS}   onPress={this._cadastrar} bordered info style={{width:"90%", justifyContent:"center",   margin: 15, marginTop: 50 }}>
            
            {this.state.buttonDisabledS?(
              <Spinner size="large" color="#0000ff" />
            ):(
              <Text style={{textAlign:"center"}} >SALVAR ALTERAÇAO</Text>
            )}
          </Button>
          <Button disabled={this.state.buttonDisabled} onPress={() => this.setState({dialogVisible: !this.state.dialogVisible})}  bordered danger style={{width:"90%", justifyContent:"center",   margin: 15, marginTop: 10 }}>
            
            {this.state.buttonDisabled?(
              <Spinner size="large" color="#0000ff" />
            ):(
              <Text style={{textAlign:"center"}}>EXCLUIR</Text>
            )}
          </Button>
           
        </Content>
       
      </Container>
    );
  }
}

export default Visitante;
