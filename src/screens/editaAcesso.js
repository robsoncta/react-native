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
  Spinner
} from "native-base";
import styles from '../config/styles';
import {Switch, AsyncStorage, StyleSheet} from "react-native";
import axios from '../service/axios';
import { Dialog } from 'react-native-simple-dialogs';
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

class EditaAcesso extends Component {
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
      maiorDeIdade:false,
      modalVisible:false,
      contatos:[],
      contatoSelect:[],
      isDateTimePickerVisible: false,
      isDateInit: true,
      diasSemana:false,
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
      // CodAcesso: '',
      // CodAcessoAutomovel: '',
      checkBoxCheckedDias: [],
      checkBoxCheckedArea: [], //area de acesso
      DadosCopiados: true,
      date: null,
      focus: 'startDate',
      startDate: null,
      endDate: null,
      Nome: '',
      Inicio: '',
      Fim: '',
      PeriodoText: '',
      acesso:false,
      dialogVisible:false,
      finsSemana:false
    };

  this.toggleModal = this.toggleModal.bind(this);
  this._deletar = this._deletar.bind(this);
  }

	getCountryByCode(code) {
		return this.state.contatos.filter(
			function(data){ return data._id == code }
		);
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


  carregaInfo = async() => {
    this.getListAreas(); 
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    (payload) => {
      this.carregaInfo();
    }
  );

  getListAreas = async () => {
    let itemId =  this.props.navigation.getParam('itemId', 'NO-ID');
    let Nome =  this.props.navigation.getParam('Nome', 'NO-ID');
    let Inicio =  this.props.navigation.getParam('Inicio', 'NO-ID');
    let Fim =  this.props.navigation.getParam('Fim', 'NO-ID');
    let PeriodoText =  this.props.navigation.getParam('Periodo', 'NO-ID');

    this.setState({
      Nome:Nome,
      Inicio:Inicio,
      Fim:Fim,
      PeriodoAcesso:{value:PeriodoText}
			})




		axios.get(`/acessos/getAcesso/${itemId}`)
		.then(res => {


      let arraySemana = ["seg","ter","qua","qui","sex"];
			let arrayFins = ["sab","dom"];
			let contaFins = false;
			let contaSemana = 0
			for(d=0; d<arraySemana.length; d++){
				if(res.data.acesso.Weekdays.indexOf(arraySemana[d])!=-1){
					contaSemana ++;
				}
			}
			for(k=0; k<arrayFins.length; k++){
				if(res.data.acesso.Weekdays.indexOf(arrayFins[k])!=-1){
					contaFins ++;
				}
			}

		this.setState({
			areas: res.data.areas,
      loaderAcesso:false,
      acesso:res.data.acesso,
      checkBoxCheckedDias: res.data.acesso.Weekdays,
      checkBoxCheckedArea:res.data.AreasDeAcesso,
      AcessoEmFeriado: res.data.AcessoEmFeriado,
      diasSemana: contaSemana == 5,
			finsSemana: contaFins == 2,
      //,
     // NoWeekdays:res.data.NoWeekdays
			})

		}).catch((e) => {

			Toast.show({
				text: "Ops algo deu errado! Tente novamente",
				buttonText: "Ok",
				position: "top",
				type: "danger"
				})
		});
    }

    checkBoxChanged(id, value, thisval) {
      let tempCheckBoxChecked = thisval; 
      if(!value){
      tempCheckBoxChecked.push(id);
      }else{
        let getID = tempCheckBoxChecked.indexOf(id);
      if(getID != -1 ){
        tempCheckBoxChecked.splice(getID,1);
      }
      }
      this.setState({
      thisval: tempCheckBoxChecked
      })
    }


  _deletar = async () => {
    let itemId =  this.props.navigation.getParam('itemId', 'NO-ID');
    axios.post(`/acessos/delAcesso/${itemId}`)
      .then(res => {
        this.props.navigation.navigate('Home');
      }).catch((e) => {

        Toast.show({
          text: "Ops algo deu errado! Tente novamente",
          buttonText: "Ok",
          position: "top",
          type: "danger"
          })
      });
      
      this.setState({dialogVisible: !this.state.dialogVisible});
  }
    

  render() {
    const { checkboxValue, PeriodoAcesso } = this.state;

    return (
      <Container style={styles.container}>

        <Header style={styles.header}>
            <Left style={{width:10  }}>
                <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                    <Icon name="arrow-back" style={{color:"#fff"}} />
                </Button>
            </Left>
            <Body style={{flex:3 , justifyContent:"center", alignContent: "center" }}>
                <Title style={{ alignSelf: "center", fontSize:16, color:"#fff", textAlign:"center" }}>Seu Visitante</Title>
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

        <H2 style={{ marginTop: 25, marginLeft: 15, fontWeight: 'bold', color: "#777", paddingLeft: 20 }}>Código de acesso</H2>
        <Form style={{ width:"90%" }}>


        
              <View style={stylesList.listItemAdd}>
                  <View style={stylesList.avatar}>
                    <Thumbnail square source={avatar}/>
                  </View>
                  <View style={stylesList.infoContatoAdd}> 
                    <Text style={stylesList.textNome}>{this.state.Nome}</Text> 
                    <Text style={stylesList.textNomeAdd}>Cod.{this.state.acesso?this.state.acesso.CodAcesso:''} </Text>
                  </View>
                </View>
     

           <Text style={{ margin:15, fontSize:17, marginTop:30}}>Intevalo de dias</Text>
            <View style={{flexDirection:"row"}}>
				<Text style={{ marginLeft:30, marginTop:10, fontSize:16}}>De </Text>
			    <Text style={{ marginLeft:30, marginTop:10, fontSize:16, color: "#1292E7"}}>{this.state.Inicio}</Text>		
			</View>
			<View style={{flexDirection:"row"}}>
				<Text style={{ marginLeft:30, marginTop:10, fontSize:16}}>Até</Text>
				<Text style={{ marginLeft:30, marginTop:10, fontSize:16, color: "#1292E7"}}>{this.state.Fim}</Text>	
			</View>
           
            <Text style={{ marginLeft:15, marginRight: 15, marginTop:30, marginBottom: 2, fontSize:17}}>Dias disponíveis</Text>
            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
              <Item style={{flex:1,borderColor: '#fff'}}>
              <CheckBox
                checked={this.state.finsSemana}
                // onPress={() => this.setState({finsSemana: !this.state.finsSemana})}
                />
                  <Text style={{ marginLeft:15}}> Fins de semana </Text>
              </Item>
              <Item style={{flex:1,borderColor: '#fff',  marginLeft:20}}>
                <CheckBox
                  checked={this.state.diasSemana}
                  // onPress={() => this.setState({diasSemana: !this.state.diasSemana})}
                  />
                  <Text style={{ marginLeft:15}}> Dias da semana </Text>
              </Item>
            </View>

            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
            <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                  checked={this.state.AcessoEmFeriado}
                  // onPress={() => this.setState({AcessoEmFeriado: !this.state.AcessoEmFeriado})}
                />
                  <Text  style={{ marginLeft:15}}> Incluir feriados </Text>
              </Item>
              <Item style={{flex:1,borderColor: '#fff',  marginLeft:20}}>
                <CheckBox
                   value={this.state.checkBoxCheckedDias.indexOf["seg"]}
                   checked={this.state.checkBoxCheckedDias.indexOf("seg")== -1?false:true}
                  // onPress={() => this.checkBoxChanged("seg", this.state.checkBoxCheckedDias.indexOf("seg")== -1?false:true, this.state.checkBoxCheckedDias)}
                />
                  <Text  style={{ marginLeft:15}}> Segunda </Text>
              </Item>
            </View>

            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
              <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                 value={this.state.checkBoxCheckedDias.indexOf["ter"]}
                 checked={this.state.checkBoxCheckedDias.indexOf("ter")== -1?false:true}
                 //onPress={() => this.checkBoxChanged("ter", this.state.checkBoxCheckedDias.indexOf("ter")== -1?false:true, this.state.checkBoxCheckedDias)}
                />
                  <Text  style={{ marginLeft:15}}> Terça </Text>
              </Item>
              <Item style={{flex:1,borderColor: '#fff',  marginLeft:20}}>
                <CheckBox
                 value={this.state.checkBoxCheckedDias.indexOf["qua"]}
                 checked={this.state.checkBoxCheckedDias.indexOf("qua")== -1?false:true}
                 //onPress={() => this.checkBoxChanged("qua", this.state.checkBoxCheckedDias.indexOf("qua")== -1?false:true, this.state.checkBoxCheckedDias)}
                />
                  <Text  style={{ marginLeft:15}}> Quarta </Text>
              </Item>
            </View>

            <View style={{ flexDirection: 'row', border:"none", margin:15}}>

              <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                  value={this.state.checkBoxCheckedDias.indexOf["qui"]}
                  checked={this.state.checkBoxCheckedDias.indexOf("qui")== -1?false:true}
                  //onPress={() => this.checkBoxChanged("qui", this.state.checkBoxCheckedDias.indexOf("qui")== -1?false:true, this.state.checkBoxCheckedDias)}
                />
                  <Text  style={{ marginLeft:15}}> Quinta </Text>
              </Item>
              <Item style={{flex:1,borderColor: '#fff',  marginLeft:20}}>
              <CheckBox
                 value={this.state.checkBoxCheckedDias.indexOf["sex"]}
                 checked={this.state.checkBoxCheckedDias.indexOf("sex")== -1?false:true}
                 onPress={() => this.checkBoxChanged("sex", this.state.checkBoxCheckedDias.indexOf("sex")== -1?false:true, this.state.checkBoxCheckedDias)}
                  />
                  <Text  style={{ marginLeft:15}}> Sexta </Text>
              </Item>
            </View>

            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
            <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                 value={this.state.checkBoxCheckedDias.indexOf["sab"]}
                 checked={this.state.checkBoxCheckedDias.indexOf("sab")== -1?false:true}
              //onPress={() => this.checkBoxChanged("sab", this.state.checkBoxCheckedDias.indexOf("sab")== -1?false:true, this.state.checkBoxCheckedDias)}
                />
                  <Text  style={{ marginLeft:15}}> Sábado </Text>
              </Item>
              <Item style={{flex:1,borderColor: '#fff',  marginLeft:20}}>
                <CheckBox
                  value={this.state.checkBoxCheckedDias.indexOf["dom"]}
                  checked={this.state.checkBoxCheckedDias.indexOf("dom")== -1?false:true}
                  //onPress={() => this.checkBoxChanged("dom", this.state.checkBoxCheckedDias.indexOf("dom")== -1?false:true, this.state.checkBoxCheckedDias)}
                />
                  <Text  style={{ marginLeft:15}}> Domingo </Text>
              </Item>
            </View>
            <Text style={{ margin:15, fontSize:17}}>Periodo?</Text>
            <View style={{ flexDirection: 'row', border:"none", flexWrap:"wrap", marginLeft:5}}>
            
              {this.state.periodos.map((option, indexInArray) => {
                  return (
                    <View style={{width:'30.5%', flexDirection: 'row', border:"none", marginLeft:11}}>
                    <CheckBox
                      checked={option.value === PeriodoAcesso.value} // for current element
                     // onPress={(value, index) => this.CheckMe(option)} // pass index of toggled element
                    />
                    <View style={{flex:1, marginLeft:15, marginBottom: 10}}>
                      <Text  style={{width:100}}>{option.label} </Text>
                      <Text  style={[styles.textPeriodo, {marginLeft:0 , width: 100, fontSize:10}]}> {option.horario}</Text>
                    </View>
                    </View>
                  );
                })} 
            </View>
            <Text style={{ margin:15, fontSize:17}}>Áreas de acesso</Text>
            {this.state.loaderAcesso?(<Spinner color="blue" />):(
              <View style={styles.areasAcesso}>
              {this.state.areas.map(a => (
                <Item style={{borderColor: '#fff', marginBottom: 10}}>
                 
                  <CheckBox
                    value={this.state.checkBoxCheckedArea.indexOf[a._id['$oid']]}
                    checked={this.state.checkBoxCheckedArea.indexOf(a._id['$oid'])== -1?false:true}
                 //onPress={() => this.checkBoxChanged(a._id['$oid'], this.state.checkBoxCheckedArea.indexOf(a._id['$oid'])== -1?false:true, this.state.checkBoxCheckedArea)}
                  />
                  <Text  style={{ marginLeft:15}}>{a.AreaDeAcesso} </Text>
                  </Item>
                ))}   
            </View>
              )}

           
            
          </Form>
          <Button bordered  onPress={() => this.setState({dialogVisible: !this.state.dialogVisible})} danger style={{width:"90%", justifyContent:"center",   margin: 15, marginTop: 50 }}>
            <Text style={{textAlign:"center"}}>Excluir</Text>
          </Button>
          
        </Content>
       
      </Container>
    );
  }
}

export default EditaAcesso;
