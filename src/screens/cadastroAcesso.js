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
	import {Switch, Image, Platform, AsyncStorage, Modal, TouchableOpacity, FlatList, StyleSheet} from "react-native";
	import DateTimePicker from "react-native-modal-datetime-picker";
	import axios from '../service/axios';
	import moment from 'moment';
	const stylesList = StyleSheet.create({
	list: {
		paddingHorizontal: 15,
	},

	avatar: {
		flexDirection: 'row',
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
		fontSize: 20,
		marginTop: 8
	},
	textNomeAdd: {
		fontSize: 20,
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
	setLista: {
		width: 15,
		height: 15,
		textAlign: "right",
		marginLeft: Platform.OS === 'ios' ? 250 : 230,
		marginTop: -30
	}
	});

	const avatar = require("../../assets/contacts/person.png");
	const novo_acesso = require("../../assets/cad_acesso.png");
	const setLista = require("../../assets/setLista.png");

	class CadastroAcesso extends Component {
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
		finsSemana:false,
		diasSemana:false,
		maiorDeIdade:false,
		modalVisible:false,
		contatos:[],
		contatoSelect:[],
		isDateTimePickerVisible: false,
		isDateInit: true,
		periodos: [
			{value:'manha', label:'Manhã', horario: '07:00 às 11:59'},
			{value:'tarde', label:'Tarde', horario: '12:00 às 17:59'},
			{value:'noite', label:'Noite', horario: '18:00 às 23:59'},
			{value:'madrugada', label:'Madrugada', horario: '00:00 às 06:59'},
			{value:'DiaTodo', label:'24h', horario: '00:00 às 23:59'},
			{value:'comercial', label:'Comercial', horario: '09:00 às 18:00'},
		],
		codigo:false,
		PeriodoAcesso: {},
		checkBoxCheckedDias: [],
		checkBoxCheckedArea: [], 
		DadosCopiados: true,
		date: null,
		focus: 'startDate',
		startDate: null,
		endDate: null,
		boxToaster: false,
		buttonDisabled: false,
		CstartDate:false
		};

		this.toggleModal = this.toggleModal.bind(this);
		this._cadastrar = this._cadastrar.bind(this);
		this._todosOsDias = this._todosOsDias.bind(this);
		this._diasFDS = this._diasFDS.bind(this);
	}

	showDateTimePicker = (val) => {
		this.setState({ isDateTimePickerVisible: true, isDateInit:val });
	};
	
	hideDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: false });
	};
	
	handleDatePicked = date => {
		let dateF = moment(new Date(date.toString().substr(0, 16))).format('DD/MM/YYYY');
		let dateFComp = moment(new Date(date.toString().substr(0, 16))).format('YYYY-MM-DD');

		if(this.state.isDateInit){
			let hj = moment(new Date()).format('YYYY-MM-DD');
			if(moment(''+hj).isAfter(''+ dateFComp)){
				Toast.show({
					text: 'Selecione uma data igual ou maior que a data de hoje.',
					buttonText: "Ok",
					position: "top",
					type: "danger"
				});
				this.hideDateTimePicker();
			}else{
				this.setState({startDate:dateF, CstartDate:dateFComp});
			}
		}else{

			
			
			if(moment(''+this.state.CstartDate).isAfter(''+ dateFComp)){
				Toast.show({
					text: 'Selecione uma data igual ou maior que a data inicial.',
					buttonText: "Ok",
					position: "top",
					type: "danger"
				});
				this.hideDateTimePicker();
			}else if(!this.state.CstartDate){
				Toast.show({
					text: 'Selecione a data inicial.',
					buttonText: "Ok",
					position: "top",
					type: "danger"
				});
				this.hideDateTimePicker();
			}else{
				this.setState({endDate:dateF});
			}
		}
		this.hideDateTimePicker();
	};


		getCountryByCode(code) {
			return this.state.contatos.filter(
				function(data){ return data._id == code }
			);
		}

		_cadastrar = async () => {

			this.setState({ buttonDisabled: true });

			let alertToaster = false;
			let textoToaster = "";

			if(this.state.contatoSelect.length <=0){
				alertToaster = true;
				textoToaster = "Selecione um contato da agenda";
			}else if(!this.state.startDate){
				alertToaster = true;
				textoToaster = "Selecione a data de inicio!";
			}else if(!this.state.endDate){
				alertToaster = true;
				textoToaster = "Selecione a data de termino!";
			}
			// else if(!this.state.AcessoEmFeriado && !this.state.finsSemana && !this.state.diasSemana){
			// 	alertToaster = true;
			// 	textoToaster = "Selecione os dias de acesso ao condominio!";
			// }
			else if(this.state.PeriodoAcesso.value == null){
				alertToaster = true;
				textoToaster = "Selecione um periodo de acesso!";
			}else if(this.state.checkBoxCheckedArea.length <=0){
				alertToaster = true;
				textoToaster = "Selecione uma área de acesso!";
			}else if(!this.state.maiorDeIdade){
				alertToaster = true;
				textoToaster = "Somente para maiores de idade!";
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
		let _id_condominio = await AsyncStorage.getItem('CondominioID');
		let _id_residencia = await AsyncStorage.getItem('ResidenciaID');
		
			axios.post(`/acessos/add`, {
				'Usuarios':this.state.contatoSelect,
				'AcessoEmFeriado':this.state.AcessoEmFeriado,
				'IdCondominio':_id_condominio,
				'IdUnidade':_id_residencia,
				'AreasDeAcesso':this.state.checkBoxCheckedArea,
				'TipoAcesso':this.state.TipoAcesso,
				'DataInicioAcesso':this.state.startDate,
				'DataFimAcesso':this.state.endDate,
				'PeriodoAcesso':this.state.PeriodoAcesso.value,
				'Weekdays':this.state.checkBoxCheckedDias,
				'NoWeekdays':this.state.finsSemana,
				'AllWeekdays':this.state.diasSemana,
				'IdUsuario':id
			})
			.then(res => {
					Toast.show({
					text: "Acesso cadastrado com sucesso!",
					buttonText: "Ok",
					position: "top",
					type: "success"
			})
			this.setState({	
				contatoSelect:false,
				contatoSelect:false,
				AcessoEmFeriado:false,
				checkBoxCheckedArea:false,
				TipoAcesso:false,
				startDate:false,
				endDate:false,
				AcessoEmFeriado: false,
				finsSemana:false,
				diasSemana:false,
				contatoSelect:[],
				PeriodoAcesso: {},
				checkBoxCheckedDias: [],
				checkBoxCheckedArea: [],
				maiorDeIdade:false
			});
			//this.setState({ codigo: res.data.codigo });
			//alert(JSON.stringify(res.data));
			this.setState({ buttonDisabled: false });
			this.props.navigation.navigate('Home');
				}).catch((e) => {
					//alert(JSON.stringify(e))
					Toast.show({
						text: "Ops algo deu errado! Tente novamente",
						buttonText: "Ok",
						position: "top",
						type: "danger"
					})
					this.setState({ buttonDisabled: false });
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

	getListContacts = async () => {
		let id = await AsyncStorage.getItem('userID');

		axios.get(`/usuario/getContatos/${id}`)

		.then(res => {

		this.setState({
			contatos: res.data.contatos,
			carregar:true
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

	
	_todosOsDias() {
		

		if(!this.state.diasSemana){
			
			let dias = ['seg','ter','qua','qui', 'sex'];
			let TempcheckBoxCheckedDias = this.state.checkBoxCheckedDias;
			
			if(TempcheckBoxCheckedDias.length == 0){
				this.setState({
					diasSemana: !this.state.diasSemana,
					checkBoxCheckedDias: dias
				})
				return false;
			}		
			for(var i=0; i<TempcheckBoxCheckedDias.length; i++){
				for(j=0; j<dias.length; j++){
					if(TempcheckBoxCheckedDias.indexOf(dias[j]) == -1){
						TempcheckBoxCheckedDias.push(dias[j]);
					}
				}
			}
			this.setState({
				diasSemana: !this.state.diasSemana,
				checkBoxCheckedDias: TempcheckBoxCheckedDias
			})
		}else{
			let dias = ["seg","ter","qua","qui","sex"];
			let TempcheckBoxCheckedDias = this.state.checkBoxCheckedDias;

			for(h=0; h<dias.length; h++){
				let i =  TempcheckBoxCheckedDias.indexOf(dias[h]);
				if(i != -1){
					TempcheckBoxCheckedDias.splice(i, 1);
				}
			}
			this.setState({
				diasSemana: !this.state.diasSemana,
				checkBoxCheckedDias: TempcheckBoxCheckedDias
			});
				
		}
		
		
	}
	_diasFDS() {
		let dias = ["sab","dom"];
		let TempcheckBoxCheckedDias = this.state.checkBoxCheckedDias;
		if(!this.state.finsSemana){
			for(var i=0; i<TempcheckBoxCheckedDias.length; i++){
				for(j=0; j<dias.length; j++){
					let x =  TempcheckBoxCheckedDias.indexOf(dias[j]);
					if(x != -1){
						TempcheckBoxCheckedDias.splice(x, 1);
					}
				}
			}
			TempcheckBoxCheckedDias.push("sab", "dom");
		}else{
			for(var i=0; i<TempcheckBoxCheckedDias.length; i++){
				for(j=0; j<dias.length; j++){
					let x =  TempcheckBoxCheckedDias.indexOf(dias[j]);
					if(x != -1){
						TempcheckBoxCheckedDias.splice(x, 1);
					}
				}
			}
		}


		this.setState({
			finsSemana: !this.state.finsSemana,
			checkBoxCheckedDias: TempcheckBoxCheckedDias
		})
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
		
		let redirect =  this.props.navigation.getParam('page', 'no-page');
	
		if(redirect !="Sidebar"){
			this.toggleModal(true);
		}
		let id = await AsyncStorage.getItem('CondominioID');
		//if (this.state.loading) { return; }
		// this.setState({ loading: true });
			axios.get(`/condominio/getAreasAcesso/${id}`)
			.then(res => {
		//alert(JSON.stringify(res.data));
			this.setState({
				areas: res.data.areas,
				loaderAcesso:false
				})

			}).catch((e) => {
		// alert(JSON.stringify(res.data));
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
			
			let arraySemana = ["seg","ter","qua","qui","sex"];
			let arrayFins = ["sab","dom"];
			let contaFins = false;
			let contaSemana = 0
			for(d=0; d<arraySemana.length; d++){
				if(tempCheckBoxChecked.indexOf(arraySemana[d])!=-1){
					contaSemana ++;
				}
			}
			for(k=0; k<arrayFins.length; k++){
				if(tempCheckBoxChecked.indexOf(arrayFins[k])!=-1){
					contaFins ++;
				}
			}
				
			this.setState({
				diasSemana: contaSemana == 5,
				finsSemana: contaFins == 2,
				thisval: tempCheckBoxChecked
			})

		}
	

		CheckMe = PeriodoAcesso => {
		this.setState({ PeriodoAcesso }); // update selected item
		// alert(JSON.stringify(PeriodoAcesso.value))
		};

		toggleSwitch = value => {
		this.setState({ maiorDeIdade: value });
		};
		
		addContactVisit =  (x) => { 
			//alert(x);
			//this.checkBoxChanged("sex", this.state.checkBoxCheckedDias.indexOf("sex")== -1?false:true, this.state.checkBoxCheckedDias)
		}



		renderItem = ({ item }) => (
		<TouchableOpacity  onPress = {() => {
			this.toggleModal(!this.state.modalVisible)
			this.checkBoxChanged(item._id, this.state.contatoSelect.indexOf(item._id)== -1?false:true, this.state.contatoSelect)}}>
			<View style={[stylesList.listItem]}>
			<View style={stylesList.avatar}>
				<Thumbnail style={{width:37, height:37, marginTop: 10}} square source={avatar}/>
			</View>
			<View style={[stylesList.infoContato, {marginBottom: 8}]}>
				<Text style={stylesList.textNome}> {item.Nome} </Text>
				<Text style={stylesList.textCelular}>Celular: {item.Celular}</Text>
				{item.Prestador 
					? (<Text style={stylesList.textFuncao}> Prestador : {item.Prestador}</Text>) 
					: null }
				<View>
				<Image square style={stylesList.setLista} source={setLista}/>
				</View>
			</View>
			</View>
		</TouchableOpacity>
		);

		renderContatoSelected = ({ item }) => (
		<TouchableOpacity  onPress = {() => {
			this.checkBoxChanged(item, this.state.contatoSelect.indexOf(item)== -1?false:true, this.state.contatoSelect)}}>
		<View style={[stylesList.listItem, {marginLeft: 17}]}>
			<View style={[stylesList.avatar]}>
			<Thumbnail square source={avatar} style={{width: 46, height:46, marginBottom: 8}}/>
			</View>
			<View style={[stylesList.infoContatoSel]}>
			<Text style={stylesList.textNome}> {this.getCountryByCode(item)[0].Nome}</Text>
			<View style={{marginLeft: 110, marginTop: 8}}>
			<Text style={stylesList.textFuncaoSel}>X</Text>
			</View>
		</View>
		</View>
		</TouchableOpacity>
		);


		renderContatos() {
		// const avatar = require("../../assets/contacts/avatar.png");
		const { flashMode, currentCameraType } = this.state;
		
		return (
			<Container style={styles.container}>
			<Header style={styles.header}>
			<Left style={{ width: 10 }}>
				<Button transparent  onPress = {() => {
						this.toggleModal(!this.state.modalVisible)}}>
				<Icon name="arrow-back" style={{ color: '#fff' }} />
				</Button>
			</Left>
			<Body style={{ flex: 3, justifyContent: "center", alignContent: "center" }}>
				<Title style={{ alignSelf: "center", fontSize: 19, color: '#fff', textAlign: "center" }}>Lista de contatos</Title>
			</Body>
			</Header>
			<Content>
			<H1 style={{ marginTop: 25, marginLeft: 15, fontWeight: 'bold', color: "#777", paddingLeft: 20 }}>Lista de Contatos</H1>
			<FlatList
				style={{ marginTop: 30}}
				contentContainerStyle={[stylesList.list]}
				data={this.state.contatos}
				renderItem={this.renderItem}
				keyExtractor={item => item.Nome}
			/>
			<View>
				<Button transparent info style={{ width: "100%", marginTop: 10, justifyContent: "center" }}
					onPress = {() => {
					this.toggleModal(!this.state.modalVisible)
					this.props.navigation.navigate('CadastroVisitante',{page: 'CadastroAcesso'})
				}}>
				<Text style={{ textAlign: "center", fontSize: 20 }}>+ Criar novo contato</Text>
				</Button>
			</View>
			</Content>
		</Container>
		);
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
					<Title style={{ alignSelf: "center", fontSize:15, color:"#fff", textAlign:"center" }}>Cadastro de Acessos</Title>
				</Body>
				{/* <Right style={{flex:1}}/> */}
			</Header>

			<Content>
			<H2 style={{ marginTop: 25, marginLeft: 15, fontWeight: 'bold', color: "#777", paddingLeft: 20 }}>Adicionar Novo Acesso</H2>
			<Form style={{ width:"90%" }}>


				<Modal animationType = {"slide"} transparent = {false}
				visible = {this.state.modalVisible}
				//onRequestClose = {() => { console.log("Modal has been closed.") } }
				>
				{/* {this.state.codigo?(<H2 style={{fontSize:25, margin:20, color: "#777"}}>
					{this.state.codigo}
				</H2>):()} */}
				{this.renderContatos()}
				</Modal>

				<DateTimePicker
					isVisible={this.state.isDateTimePickerVisible}
					onConfirm={this.handleDatePicked}
					onCancel={this.hideDateTimePicker}
					locale={'pt'}
					/>
				
				{/* <TouchableOpacity onPress = {() => {this.toggleModal(true)}}>
				<Text style = {styles.text}>Open Modal</Text>
				</TouchableOpacity> */}

				<TouchableOpacity onPress = {() => {this.toggleModal(true)}}>
				<View style={stylesList.listItemAdd}>
					<View style={stylesList.avatar}>
						<Thumbnail square source={novo_acesso}/>
					</View>
					<View style={stylesList.infoContatoAdd}>
						<Text style={stylesList.textNomeAdd}>  Adicionar convidado</Text>
					</View>
					</View>
				</TouchableOpacity>

				<FlatList
				style={{ marginTop: 10, marginLeft: 15 }}
				contentContainerStyle={{}}
				data={this.state.contatoSelect}
				renderItem={this.renderContatoSelected}
				keyExtractor={item => item.name}
			/>

			<Text style={{ margin:15, fontSize:17, marginTop:30}}>Selecione um intevalo de dias</Text>
				<View style={{flexDirection:"row"}}>
					<Text style={{ marginLeft:30, marginTop:10, fontSize:16}}>De </Text>
					<Button onPress={() => {
						this.showDateTimePicker(true)
					}}  transparent>
						
						{/* {this.state.startDate?(<Text>{this.state.startDate}</Text>):(<Text>Selecionar dia</Text>)} */}
						{this.state.startDate?(<Text>
							{this.state.startDate}
						</Text>):(<Text>
							Selecionar dia 	
						</Text>)}
						
					</Button>
				</View>
				<View style={{flexDirection:"row"}}>
					<Text style={{ marginLeft:30, marginTop:10, fontSize:16}}>Até</Text>
					<Button  onPress={() => {
						this.showDateTimePicker(false)
					}}transparent>
						{this.state.endDate?(<Text>
							{this.state.endDate}
						</Text>):(<Text>
							Selecionar dia 	
						</Text>)}
					</Button>
				</View>
			
				<Text style={{ margin:15, fontSize:17}}>Permitir apenas:</Text>
				<View style={{ flexDirection: 'row', border:"none", margin:15}}>
				<Item style={{flex:1,borderColor: '#fff'}}>
					<CheckBox
					checked={this.state.finsSemana}
					onPress ={this._diasFDS}
					//onPress={() => this.setState({finsSemana: !this.state.finsSemana})}
					/>
					<Text style={{ marginLeft:15}}> Fins de Semana </Text>
				</Item>
				<Item style={{flex:1,borderColor: '#fff', marginLeft: 20}}>
					<CheckBox
					checked={this.state.diasSemana}
					onPress ={this._todosOsDias}
					//onPress={() => this.setState({diasSemana: !this.state.diasSemana})}
					/>
					<Text style={{ marginLeft:15}}> Dias da Semana </Text>
				</Item>
				</View>

				<View style={{ flexDirection: 'row', border:"none", margin:15}}>
				
				<Item style={{flex:1,borderColor: '#fff'}}>
					<CheckBox
					value={this.state.checkBoxCheckedDias.indexOf["seg"]}
					checked={this.state.checkBoxCheckedDias.indexOf("seg")== -1?false:true}
					onPress={() => this.checkBoxChanged("seg", this.state.checkBoxCheckedDias.indexOf("seg")== -1?false:true, this.state.checkBoxCheckedDias)}
					/>
					<Text  style={{ marginLeft:15}}> Segunda </Text>
				</Item>
				<Item style={{flex:1,borderColor: '#fff', marginLeft: 20}}>
					<CheckBox
					value={this.state.checkBoxCheckedDias.indexOf["ter"]}
					checked={this.state.checkBoxCheckedDias.indexOf("ter")== -1?false:true}
					onPress={() => this.checkBoxChanged("ter", this.state.checkBoxCheckedDias.indexOf("ter")== -1?false:true, this.state.checkBoxCheckedDias)}
					/>
					<Text  style={{ marginLeft:15}}> Terça </Text>
				</Item>
				</View>

				<View style={{ flexDirection: 'row', border:"none", margin:15}}>
				

				<Item style={{flex:1,borderColor: '#fff'}}>
					<CheckBox
					value={this.state.checkBoxCheckedDias.indexOf["qua"]}
					checked={this.state.checkBoxCheckedDias.indexOf("qua")== -1?false:true}
					onPress={() => this.checkBoxChanged("qua", this.state.checkBoxCheckedDias.indexOf("qua")== -1?false:true, this.state.checkBoxCheckedDias)}
					/>
					<Text  style={{ marginLeft:15}}> Quarta </Text>
				</Item>
				<Item style={{flex:1,borderColor: '#fff', marginLeft: 20}}>
					<CheckBox
					value={this.state.checkBoxCheckedDias.indexOf["qui"]}
					checked={this.state.checkBoxCheckedDias.indexOf("qui")== -1?false:true}
					onPress={() => this.checkBoxChanged("qui", this.state.checkBoxCheckedDias.indexOf("qui")== -1?false:true, this.state.checkBoxCheckedDias)}
					/>
					<Text  style={{ marginLeft:15}}> Quinta </Text>
				</Item>
				</View>

				<View style={{ flexDirection: 'row', border:"none", margin:15}}>
				

				<Item style={{flex:1,borderColor: '#fff'}}>
				<CheckBox
					value={this.state.checkBoxCheckedDias.indexOf["sex"]}
					checked={this.state.checkBoxCheckedDias.indexOf("sex")== -1?false:true}
					onPress={() => this.checkBoxChanged("sex", this.state.checkBoxCheckedDias.indexOf("sex")== -1?false:true, this.state.checkBoxCheckedDias)}
					/>
					<Text  style={{ marginLeft:15}}> Sexta </Text>
				</Item>
				<Item style={{flex:1,borderColor: '#fff', marginLeft: 20}}>
					<CheckBox
					value={this.state.checkBoxCheckedDias.indexOf["sab"]}
					checked={this.state.checkBoxCheckedDias.indexOf("sab")== -1?false:true}
					onPress={() => this.checkBoxChanged("sab", this.state.checkBoxCheckedDias.indexOf("sab")== -1?false:true, this.state.checkBoxCheckedDias)}
					/>
					<Text  style={{ marginLeft:15}}> Sábado </Text>
				</Item>
			
				</View>

				<View style={{ flexDirection: 'row', border:"none", margin:15}}>
				
				<Item style={{flex:1,borderColor: '#fff'}}>
					<CheckBox
					value={this.state.checkBoxCheckedDias.indexOf["dom"]}
					checked={this.state.checkBoxCheckedDias.indexOf("dom")== -1?false:true}
					onPress={() => this.checkBoxChanged("dom", this.state.checkBoxCheckedDias.indexOf("dom")== -1?false:true, this.state.checkBoxCheckedDias)}
					/>
					<Text  style={{ marginLeft:15}}> Domingo </Text>
				</Item>
				
				<Item style={{flex:1,borderColor: '#fff', marginLeft: 20}}>
					<CheckBox
					//hecked={this.state.checkbox1}
					// onPress={() => this.toggleSwitch1()}
					checked={this.state.AcessoEmFeriado}
					onPress={() => this.setState({AcessoEmFeriado: !this.state.AcessoEmFeriado})}
					/>
					<Text  style={{ marginLeft:15}}> Permitir feriado </Text>
				</Item>
				</View>
				<Text style={{ margin:15, fontSize:17}}>Periodo?</Text>
				<View style={{ flexDirection: 'row', border:"none", flexWrap:"wrap", marginLeft:5}}>
				
				{this.state.periodos.map((option, indexInArray) => {
					return (
						<View style={{width:'46%', flexDirection: 'row', border:"none", marginLeft:11}}>
						<CheckBox
						checked={option.value === PeriodoAcesso.value} // for current element
						onPress={(value, index) => this.CheckMe(option)} // pass index of toggled element
						/>
						<View style={{flex:1, marginLeft:15, marginBottom: 10}}>
						<Text  style={{width:100}}>{option.label} </Text>
						<Text style={[styles.textPeriodosss, {marginLeft:0 , width: 120, fontSize:12, fontWeight:'bold'}]}> {option.horario}</Text>
						</View>
						</View>
					);
					})} 
				</View>
				<Text style={{ margin:15, marginBottom: 5, fontSize:17}}>Áreas de acesso</Text>
				{this.state.loaderAcesso?(<Spinner color="blue" />):(
				<View style={styles.areasAcesso}>
				{this.state.areas.map(a => (
					<Item style={{borderColor: '#fff', marginBottom: 10}}>
					<CheckBox
					value={this.state.checkBoxCheckedArea.indexOf[a._id['$oid']]}
					checked={this.state.checkBoxCheckedArea.indexOf(a._id['$oid'])== -1?false:true}
					onPress={() => this.checkBoxChanged(a._id['$oid'], this.state.checkBoxCheckedArea.indexOf(a._id['$oid'])== -1?false:true, this.state.checkBoxCheckedArea)}
					/>
					<Text  style={{ marginLeft:15}}>{a.AreaDeAcesso} </Text>
					</Item>
				))}   
			</View>
				)}

				<View style={{flexDirection:"row", marginLeft:15, marginTop:15}}>
				<Switch
				onValueChange={this.toggleSwitch}
				value={this.state.maiorDeIdade}
				/>
				<Text style={{width:"85%", fontSize:13, marginLeft:10}}>
					Sou maior de 18 anos e me responsabilizo pelo acesso que estou gerando.
				</Text>
				</View>
				
			</Form>
			<Button disabled={this.state.buttonDisabled} bordered onPress ={this._cadastrar} info style={{width:"90%", justifyContent:"center",   margin: 15, marginTop: 50 }}>
				{this.state.buttonDisabled?(
					<Spinner size="large" color="#0000ff" />
				):(
					<Text style={{textAlign:"center"}}>ENVIAR ACESSO</Text>
				)}
				
			</Button>
			
			</Content>
		
		</Container>
		);
	}
	}

	export default CadastroAcesso;
