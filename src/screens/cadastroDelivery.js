import React, { Component } from "react";
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
  Thumbnail,
  Icon,
  H1,
  H2,
  View,
  CheckBox,
  Toast,
  Input
} from "native-base";
import styles from '../config/styles';
import {Switch, AsyncStorage, Modal, TouchableOpacity, FlatList, StyleSheet} from "react-native";
import { Dialog } from 'react-native-simple-dialogs';
import axios from '../service/axios';
import moment from 'moment';
const stylesList = StyleSheet.create({
  list: {
    paddingHorizontal: 15,
  },

  avatar: {
    flexDirection: 'row'
  },

  infoContato: {
    flexDirection: 'column', 
    marginLeft: 20
  },
  infoContatoSel: {
    flexDirection: 'row', 
    marginLeft: 20
  },

  infoContatoAdd: {
    flexDirection: 'column', 
    marginLeft: 10
  },

  textNome: {
    fontSize: 20
  },
  textNomeAdd: {
    fontSize: 25,
    marginTop:8
  },

  textCelular: {
    fontSize: 13
  },

  textFuncao: {
    fontSize: 13,
    marginBottom: 12
  },
  textFuncaoSel: {
    fontSize: 15,
    margin: 12,
    marginTop: 5
  },

  listItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomColor: '#777',
    borderBottomWidth: 0.3
  },
  listItemAdd: {
    flexDirection: "row",
    marginBottom: 5,
    marginTop:22,
    marginLeft: 30,
    paddingBottom:10,
    borderBottomColor: '#777',
    borderBottomWidth: 0.3
  },
});

const avatar = require("../../assets/contacts/person.png");
const novo_acesso = require("../../assets/cad_acesso.png");

class CadastroDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaderAcesso: true,
      areas: [],
      IdUsuario: '',
      IdResidencia: '',
      IdVisitante:'',
      TipoAcesso: 'V',
      AcessoEmFeriado: false,
      todaSemana:false,
      maiorDeIdade:false,
	  modalVisible:false,
	  contatos:[],
	  contatoSelect:[],
	  isDateTimePickerVisible: false,
	  isDateInit: true,
      periodos: [
        {value:'manha', label:'Manhã', horario: '7:00 às 11:59'},
        {value:'tarde', label:'Tarde', horario: '7:00 às 11:59'},
        {value:'noite', label:'Noite', horario: '7:00 às 11:59'},
        {value:'madrugada', label:'Madrugada', horario: '7:00 às 11:59'},
        {value:'DiaTodo', label:'24h', horario: '7:00 às 11:59'},
        {value:'comercial', label:'Comercial', horario: '7:00 às 11:59'},
      ],
      codigo:false,
      PeriodoAcesso: {},
      checkBoxCheckedDias: [],
      checkBoxCheckedArea: [], //area de acesso
	  DadosCopiados: true,
	  date: null,
	  focus: 'startDate',
	  startDate: null,
    endDate: null,
    TipoDelivery: '',
    CodAcesso: false,
    dialogVisible:false,
    buttonDisabled: false,
    Acesso:false
    };

	this.toggleModal = this.toggleModal.bind(this);
	this._cadastrar = this._cadastrar.bind(this);
  }

  



	getCountryByCode(code) {
		return this.state.contatos.filter(
			function(data){ return data._id == code }
		);
	}

	_cadastrar = async () => {
    let id = await AsyncStorage.getItem('userID');
    let _id_condominio = await AsyncStorage.getItem('CondominioID');
    let _id_residencia = await AsyncStorage.getItem('ResidenciaID');
    
    
    if(this.state.TipoDelivery == ""){
      Toast.show({
    text: "Insira a descrição do delivery!",
    buttonText: "Ok",
    position: "top",
    type: "danger"
        })
      return false;
  }
        if(!this.state.maiorDeIdade){
            Toast.show({
				text: "Somente para maiores de idade!",
				buttonText: "Ok",
				position: "top",
				type: "danger"
            })
            return false;
        }



		axios.post(`/acessos/add`, {
				'AcessoEmFeriado':'',
				'IdCondominio':_id_condominio,
				'IdUnidade':_id_residencia,
				'AreasDeAcesso':'',
				'TipoDelivery':this.state.TipoDelivery,
				'DataInicioAcesso':'',
				'DataFimAcesso':'',
				'PeriodoAcesso':'',
                'Weekdays':'',
                'TipoAcesso': 'D',
				'IdUsuario':id,
		})
		.then(res => {
				Toast.show({
				text: "Acesso cadastrado com sucesso!",
				buttonText: "Ok",
				position: "top",
				type: "success"
            })
            
         this.setState({ 
           CodAcesso: res.data.codigo,
           maiorDeIdade:false,
           Acesso:res.data.Acesso

          });
		}).catch((e) => {
            //alert(JSON.stringify(e));
			Toast.show({
				text: "Ops algo deu errado! Tente novamente",
				buttonText: "Ok",
				position: "top",
				type: "danger"
			})
		});	  
	}
  
  toggleModal(visible) {
    this.setState({ modalVisible: visible });
    if(visible){
      this.getListContacts();
    }
 }
  toggleTab1() {
   
  }
  toggleTab2() {
    this.props.navigation.navigate('Servicos');
  }


  carregaInfo = () => {
    let itemId =  this.props.navigation.getParam('itemId');
    let Nome =  this.props.navigation.getParam('Nome');
    let Codigo =  this.props.navigation.getParam('Codigo');
    //alert(Codigo);
    this.setState({
        TipoDelNomeivery:Nome,
        TipoDelivery:Nome,
        itemId:itemId,
        CodAcesso:Codigo
  })
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    (payload) => {
      this.carregaInfo();
    }
  );

    

    toggleSwitch = value => {
      this.setState({ maiorDeIdade: value });
	};
	
	

    _deletar = async () => {
      let itemId =  "";
      if(this.state.Acesso){
         itemId =  this.state.Acesso._id;
      }else{
         itemId =  this.props.navigation.getParam('itemId', 'NO-ID');
      }

        console.log(itemId);
        axios.post(`/acessos/delAcesso/${itemId}`)
          .then(res => {
            Toast.show({
              text: "Acesso deletado com sucesso!",
              buttonText: "Ok",
              position: "top",
              type: "success"
            })
            this.setState({
              dialogVisible: !this.state.dialogVisible,
              Acesso:false,
              TipoDelNomeivery:'',
              TipoDelivery:'',
              itemId:'',
              CodAcesso:'',
              Acesso:false
            });
            this.props.navigation.navigate('Servicos');
          }).catch((e) => {
            this.props.navigation.navigate('Servicos');
            Toast.show({
              text: "Ops algo deu errado! Tente novamente",
              buttonText: "Ok",
              position: "top",
              type: "danger"
              });
              this.setState({
                dialogVisible: !this.state.dialogVisible,
                TipoDelNomeivery:'',
                TipoDelivery:'',
                itemId:'',
                CodAcesso:'',
                Acesso:false
              });
          });
          
          
      }


    

  render() {
 

    return (
      <Container style={styles.container}>

        <Header style={styles.header}>
            <Left style={{width:10  }}>
                <Button transparent onPress={() => this.props.navigation.navigate("Servicos")}>
                    <Icon name="arrow-back" style={{color:"#fff"}} />
                </Button>
            </Left>
            <Body style={{flex:3 , justifyContent:"center", alignContent: "center" }}>
                <Title style={{ alignSelf: "center", fontSize:16, color:"#fff", textAlign:"center" }}>Cadastro de Delivery</Title>
            </Body>
        </Header>

        <Content>
            <Dialog
                visible={this.state.dialogVisible}
                title="Atenção"
                onTouchOutside={() => this.setState({dialogVisible: false})} >
                <View style={{textAlign:"center"}}>
                <Text style={{width:"100%", textAlign:"center"}}>Deseja excluir esse acesso?</Text>
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
        <H2 style={{ marginTop: 25, marginLeft: 15, fontWeight: 'bold', color: "#777", paddingLeft: 20 }}>Gerar senha para Entregador</H2>
        <Form style={{ width:"90%", margin:15 }}>

        
            {this.state.CodAcesso?(
                <View style={{ marginTop:15, marginBottom:15}}>
                    <Item regular style={{height: 50, textAlign:"center", justifyContent: "center"}}> 
                        <H1 style={{textAlign:"center"}}>{this.state.CodAcesso}</H1>
                    </Item>
                    <Item  style={{height: 50, marginTop:10}}>
                        <Input disabled style={{width:'100%'}} value={this.state.TipoDelivery}  placeholder="Descrição da entrega" />
                    </Item>
                </View>
            ):( 
                <View style={{ marginTop:15, marginBottom:15}}>
                    <Item  style={{height: 50}}>
                        <Input style={{width:'100%'}} value={this.state.TipoDelivery} onChangeText={(TipoDelivery) => this.setState({TipoDelivery})} placeholder="Tipo de delivery" />
                    </Item>
                </View>
            )}
        

        {!this.state.CodAcesso?(
            <View style={{flexDirection:"row", marginTop:15}}>
              <Switch
              onValueChange={this.toggleSwitch}
              value={this.state.maiorDeIdade}
               />
              <Text style={{width:"85%", fontSize:13, marginLeft:10}}>
                  Sou maior de 18 anos e me responsabilizo pelo acesso que estou gerando.
              </Text>
            </View>):null}
          </Form>
          {this.state.CodAcesso?(
                <Button disabled={this.state.buttonDisabled} bordered onPress={() => this.setState({dialogVisible: !this.state.dialogVisible})} danger style={{width:"90%", justifyContent:"center",   margin: 15, marginTop: 20 }}>
                    
                    {this.state.buttonDisabled?(
                      <Spinner size="large" color="#0000ff" />
                    ):(
                      <Text style={{textAlign:"center"}}>EXCLUIR</Text>
                    )}
                </Button>
          ):( 
                <Button disabled={this.state.buttonDisabled} bordered onPress ={this._cadastrar} info style={{width:"90%", justifyContent:"center",   margin: 15, marginTop: 20 }}>   
                    {this.state.buttonDisabled?(
                        <Spinner size="large" color="#0000ff" />
                    ):(
                        <Text style={{textAlign:"center"}}>GERAR CÓDIGO</Text>
                    )}
                </Button>
          )}

        </Content>
       
      </Container>
    );
  }
}

export default CadastroDelivery;
