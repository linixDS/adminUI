export default {
  
  props: 
  {
        isglobal: '',
        token: '',
        serverurl: ''
  },
  
  data() {
	  return {
              isEditable: false,
              isValidName: false,
              isValidNIP: false,
              isValidMail: false,
              isValidAdmins: false,

              Clients : [],
              Services: [],
              
              SearchClientText: '',
              
              ErrorMessage: '',
              SuccessMessage: '',
		          
              showContent: true,
              showClientContent: false,
              showDeleteClientContent: false,
              showButtonPrev: false,
		          showSpinLoading: false,
              
              titlePage: 'Kontrahenci:',
            
            
              updateClientData: {},
              updateClientServices: [],
              updateSelectServices: [],

              clientData: {},
              clientChoiceServices: [],
              clientServices: []
            }
  },
  
  
  computed: {
    filterClientByName: function(){
            const text = this.SearchClientText;
            if (text.length > 0)
                return this.Clients.filter( client => client.name.toUpperCase().includes(text.toUpperCase()) );
            else
                return this.Clients;
    },

    CheckForm:function() {
            if  (this.clientData.name.length < 5) {
                this.isValidName = false;
                return false;
            }
              else
              this.isValidName = true;

            if  (this.clientData.nip.length < 10) {
                this.isValidNIP = false;
                return false;
            }
              else
              this.isValidNIP = true;              

            if  (this.clientData.mail.length < 6) {
                this.isValidMail = false;
                return false;
            }

            if  (this.clientData.admins < 1 || this.clientData.admins > 50) {
              console.log('LIMIT IS INCORRECT !!!');
              this.isValidAdmins = false;
              return false;
            }
              else
              this.isValidAdmins = true;
      
   

            if (this.clientData.mail.indexOf('@') == -1 || this.clientData.mail.indexOf('.') == -1){
                  this.isValidMail = false;
                  return false;
            }
            else
                  this.isValidMail = true; 
            
            if (this.clientChoiceServices.length < 1 && !this.isEditable)
                return false;

              
            return true;
    },    

    isDisableInputs: function() {
            if (this.showSpinLoading)
              return true;
            else
              return false;
    },

  },


  
  methods: {
    BackPage(){
        console.log("BACK !!!");
        var temp = this.Clients.find(client => client.id == this.updateClientData.id);
        if (temp){
              temp.name = this.updateClientData.name;
              temp.nip = this.updateClientData.nip;
              temp.city = this.updateClientData.city;
              temp.mail = this.updateClientData.mail;
              temp.admins = this.updateClientData.admins;
        }


        this.ShowClients();
    },

    CopyClientData(client){
        this.updateClientData = {id: 0, name: '', nip: '', city: '', mail: '', admins: 5};
        this.updateClientData.id = client.id;
        this.updateClientData.name = client.name;
        this.updateClientData.nip = client.nip;
        this.updateClientData.city = client.city;
        this.updateClientData.mail = client.mail;
        this.updateClientData.admins = client.admins;
    },

    RestoreServices(){
        this.clientServices = [];
        for (const item of this.Services) {
            let service = {id: 0, name: '', description: '', limit_accounts: 0};
            service.id = item.id;
            service.name = item.name;
            service.description = item.description;
            service.limit_accounts = item.limit_accounts;

            this.clientServices.push(service);
        }
    },

    AddNewClient() {
          this.RestoreServices();

          this.isEditable = false;
          this.isValidName =  false;
          this.isValidNIP = false;
          this.isValidMail = false;
          this.isValidAdmins = false;

          this.showSpinLoading = false;
          this.ErrorMessage = '';
          this.SuccessMessage = '';

             

          this.clientData=  {'name':'', 'nip':'','city':'','mail':'','admins': 5};

          this.clientChoiceServices = [];

          this.titlePage = 'Nowy kontrahent:';
          this.showContent = false;
          this.showButtonPrev = true;
          this.showClientContent = true;
    },

    EditClient(client) {
          console.log("---[ SHOW PAGE EDIT CLIENT ]-----");
          this.RestoreServices();
          this.CopyClientData(client);
          this.clientData = client;

          this.isEditable = true;
          

          this.GetServicesClient(client.id);
          this.isValidName =  false;
          this.isValidNIP = false;
          this.isValidMail = false;
          this.isValidAdmins = false;

          this.showSpinLoading = false;
          this.ErrorMessage = '';
          this.SuccessMessage = '';

          
          this.clientChoiceServices = [];

        
          this.titlePage = 'Edycja kontrahenta: '+client.name;
          this.showContent = false;
          this.showButtonPrev = true;
          this.showClientContent = true;
    },    
	
    ShowDeletePage() {
      this.showSpinLoading = false;
      this.showButtonPrev = true;
      this.showClientContent = false;
      this.showDeleteClientContent = true;
      this.showContent = false;
      this.titlePage = 'Kontrahenci:';
    },
    
    ShowClients() {
          console.log("---[ SHOW PAGE CLIENTS ]-----");
          this.showSpinLoading = false;
          this.showButtonPrev = false;
          this.showClientContent = false;
          this.showDeleteClientContent = false;
          this.showContent = true;
          this.titlePage = 'Kontrahenci:';
    },
    
    SaveNewClient() {
      var servicesList = [];
      for (var item of this.clientChoiceServices){
           var temp =  this.clientServices.find( service => service.id == item );
           if (temp){
               let service = {id: temp.id, limit_accounts: temp.limit_accounts};
               servicesList.push(service);
           }
      }


      var data = {  token  : this.token, 
                    client : this.clientData,
                    services: servicesList};


      this.showSpinLoading = true;
      console.log('----[ ADD NEW CLIEN ]-----');
      console.log(JSON.stringify(data));

      fetch(  this.serverurl+'clients.php', {
            headers: { 'Content-type': 'application/json' },
            method: "POST",
            body: JSON.stringify(data)})
            .then((res) => {
                  console.log('StatusCode: ' + res.status);
                  return res.json(); // Dodajemy return, aby zwrócić wynik jako Promise
            })
            .then((json) => {
                  console.log('-> RESULT:');
                  console.log(json);

                  if (json.error) {
                    console.log(json.error);
                    this.ErrorMessage = json.error.message;
                    this.ShowClients();
                  } else {
                    this.Clients.push(json.result);
                    this.SuccessMessage = "Nowy kontrahent "+json.result.name+" została wprowadzony.";
                    this.ShowClients();
                  }

                  
            })
            .catch((error) => {
                  console.log('Error saveClient');
                  if (error == "TypeError: Failed to fetch")
                    this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.serverurl;
                  else
                    if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                        this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                    else
                      this.ErrorMessage = 'Wyjątek: ' + error;
                  this.ShowClients();
            });
    },

    CheckUpdateData(){
        if ( (this.clientData.name != this.updateClientData.name) ||
            (this.clientData.city != this.updateClientData.city) ||
            (this.clientData.mail != this.updateClientData.mail) || 
            (this.clientData.admins != this.updateClientData.admins))
            return true;


        let len1 = this.clientChoiceServices.length;
        let len2 = this.updateSelectServices.length;
        if (len1 !== len2)  return true;

        for (const item of this.clientChoiceServices) {
            var temp =  this.updateSelectServices.indexOf(item);
            if (temp == -1) return true;
        }

        for (const item of this.clientChoiceServices) {
          var temp1 =  this.clientServices.find(service => service.id == item);
          var temp2 =  this.updateClientServices.find(service => service.id == item);
          if (temp1 && temp2) {
                if (temp1.limit_accounts !== temp2.limit_accounts) {
                    console.log('temp1 <> temp2');
                    return true;
                }
          }
            else {
                console.log('temp is null');
                return false;
            }
        }        

        return false;
    },

    UpdateData(){
        if (!this.CheckUpdateData()) {
          this.SuccessMessage = 'Dane są aktualne, nie ma nic do zrobienia.';
          return;
        }

        var servicesList = [];
        for (var item of this.clientChoiceServices){
             var temp =  this.clientServices.find( service => service.id == item );
             if (temp){
                 let service = {id: temp.id, limit_accounts: temp.limit_accounts};
                 servicesList.push(service);
             }
        }
  
  
        var data = {  token  : this.token, 
                      client : this.clientData,
                      services: servicesList};
  
  
        this.showSpinLoading = true;
        console.log('----[ UPDATE CLIENT ]-----');
        console.log(JSON.stringify(data));
  
        fetch(  this.serverurl+'clients.php', {
              headers: { 'Content-type': 'application/json' },
              method: "PUT",
              body: JSON.stringify(data)})
              .then((res) => {
                    console.log('StatusCode: ' + res.status);
                    return res.json(); // Dodajemy return, aby zwrócić wynik jako Promise
              })
              .then((json) => {
                    console.log('-> RESULT:');
                    console.log(json);
  
                    if (json.error) {
                      console.log(json.error);
                      this.ErrorMessage = json.error.message;
                      this.BackPage();
                    } else {
                      this.SuccessMessage = "Dane kontrahenta "+json.result.name+" zostały zaaktualizowane.";
                      this.ShowClients();
                    }
  
                    
              })
              .catch((error) => {
                    console.log('Error saveClient');
                    if (error == "TypeError: Failed to fetch")
                      this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.serverurl;
                    else
                      if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                          this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                      else
                        this.ErrorMessage = 'Wyjątek: ' + error;
                    this.BackPage();
              });

    },


    DeleteData(){

      var data = {  token  : this.token, 
                    client : this.clientData};


      this.showSpinLoading = true;
      console.log('----[ DELETE CLIENT ]-----');
      console.log(JSON.stringify(data));

      fetch(  this.serverurl+'clients.php', {
            headers: { 'Content-type': 'application/json' },
            method: "DELETE",
            body: JSON.stringify(data)})
            .then((res) => {
                  console.log('StatusCode: ' + res.status);
                  return res.json(); // Dodajemy return, aby zwrócić wynik jako Promise
            })
            .then((json) => {
                  console.log('-> RESULT:');
                  console.log(json);

                  if (json.error) {
                    console.log(json.error);
                    this.ErrorMessage = json.error.message;
                    this.BackPage();
                  } else {
                    this.SuccessMessage = "Kontrahent "+json.result.name+" został usunięty.";
                    
                    var idx = this.Clients.indexOf(this.clientData);
                    console.log('IDX = '+idx);
                    if (idx !== -1) {
                        this.Clients.splice(idx, 1);
                    }

                    this.ShowClients();
                  }

                  
            })
            .catch((error) => {
                  console.log('Error saveClient');
                  if (error == "TypeError: Failed to fetch")
                    this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.serverurl;
                  else
                    if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                        this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                    else
                      this.ErrorMessage = 'Wyjątek: ' + error;
                  this.BackPage();
            });

  },    
    
    SaveData(){
        this.SuccessMessage = '';
        this.ErrorMessage = '';

        if (!this.isEditable)
          this.SaveNewClient();
        else
          this.UpdateData();
    },

    

    GetClients() {
          fetch( this.serverurl +'clients.php?token=' + this.token)
                .then((res) => {
                  console.log('StatusCode: ' + res.status);
                  return res.json(); // Dodajemy return, aby zwrócić wynik jako Promise
                })
                .then((json) => {
                  console.log(json);
                  if (json.error) {
                    console.log(json.error);
                    this.ErrorMessage = json.error.message;
                  } else {
                    this.Clients = json.result.clients;
                  }
                })
                .catch((error) => {
                  console.log(error);
                  if (error == "TypeError: Failed to fetch")
                    this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.serverurl;
                  else
                    if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                        this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                    else
                      this.ErrorMessage = 'Wyjątek: ' + error;
                });

    },
      
    GetServices() {
          fetch( this.serverurl+'services.php?token='+this.token)
                  .then((res) => {
                        console.log('StatusCode: ' + res.status);
                        return res.json(); // Dodajemy return, aby zwrócić wynik jako Promise
                  })
                  .then((json) => {
                        console.log(json);
                        if (json.error) {
                          console.log(json.error);
                          this.ErrorMessage = json.error.message;
                        } else {
                          this.Services = json.result.services;
                        }
                  })
                  .catch((error) => {
                        console.log(error);
                        if (error == "TypeError: Failed to fetch")
                          this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.serverurl;
                        else
                          if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                              this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                          else
                            this.ErrorMessage = 'Wyjątek: ' + error;
                  });	  
    },

    GetServicesClient(clientId) {
      console.log('GetServicesClient: '+this.serverurl+'services.php?token='+this.token+'&client='+clientId);
      fetch( this.serverurl+'services.php?token='+this.token+'&client='+clientId)
      .then((res) => {
            console.log('StatusCode: ' + res.status);
            return res.json(); // Dodajemy return, aby zwrócić wynik jako Promise
      })
      .then((json) => {
            console.log(json);
            this.updateClientServices = [];
            this.updateSelectServices = [];

            if (json.error) {
              console.log(json.error);
              this.ErrorMessage = json.error.message;
            } else {
              for (const item of json.result.services ) {
                this.clientChoiceServices.push(item.id);
                this.updateSelectServices.push(item.id);

                var temp =  this.clientServices.find( service => service.id == item.id );
                if (temp){
                    temp.limit_accounts = item.limit_accounts;
                    let service = {id: 0, limit_accounts: 0};
                    service.id = temp.id;
                    service.limit_accounts = temp.limit_accounts;

                    this.updateClientServices.push(service);
                }
                
              }



              console.log(this.clientChoiceServices);
            }
      })
      .catch((error) => {
            console.log(error);
            if (error == "TypeError: Failed to fetch")
              this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.serverurl;
            else
              if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                  this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
              else
                this.ErrorMessage = 'Wyjątek: ' + error;
      });	  
},    


	  
  },
  
  mounted() {
		this.GetClients();
		this.GetServices();
  },
  
  components: {
             
  },

  template: `
    <div style="margin-bottom: 25px;">
      <div class="row">
              <div class="col-1" style="width: 50px;" v-if="showButtonPrev">
                  <button class="btn btn-outline-primary" v-on:click="BackPage" :disabled="isDisableInputs">
                    <i class="fas fa-chevron-left"></i>
                  </button>
              </div>
              <div class="col-xl">
                <h3 class="text-primary">{{ titlePage }}</h3>
              </div>
      </div>
      <hr style="color: blue;">
   </div>

  <div>
        <div class="alert alert-danger" v-if="ErrorMessage" style="margin-bottom: 20px;">
          {{ ErrorMessage }}
        </div>
        <!--- Display success message --->
        <div class="alert alert-success" v-if="SuccessMessage" style="margin-bottom: 20px;">
          {{ SuccessMessage }}
        </div> 
  
  </div>

  <div v-if="showDeleteClientContent">
      <h5 class="text-warning" style="margin-bottom:10px;"><b>OSTRZEŻENIE</b></h5>
      <div class="text-danger" style="margin-bottom:20px;">
      Aby usunąć kontrahenta  z bazy, neleży wcześnij usunąć wszystkie wpisy związane z danym kontrahentem tj.:<br>
      <ul>
        <li>wyłączyć usługi,</li>
        <li>konta pocztowe,</li>
        <li>administratorów,</li>
        <li>domeny</li>
      </ul>
      </diV>
      <h5 class="text-danger" style="margin-bottom:10px;"><b>CZY NAPEWNO USUNĄĆ KONTRAHENTA ?</b></h5>

      <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
          <div class="col-auto">
              <button type="button" class="btn btn-outline-danger" style="width: 100px;"  v-if="isglobal" v-on:click="DeleteData">
                TAK
              </button>      
          </div>
          <div class="col-auto">
              <button type="button" class="btn btn btn-outline-success" style="width: 100px;" v-on:click="BackPage" v-if="isglobal">
                NIE
              </button>      
          </div>

      </div>

  </div>


  <div v-if="showClientContent">

          <h5 class="text-primary">Informacje ogólne:</h5>

          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label"><b>Nazwa:</b>  </label>
            </div>
            <div class="col-4">
              <input type="text" maxlength="200" :class="isValidName ? 'form-control is-valid' : 'form-control is-invalid'" v-model="clientData.name"  :disabled="isDisableInputs">
            </div>
          </div>
          
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label">NIP: </label>
            </div>
            <div class="col-4">
              <input type="text" maxlength="10" :class="isValidNIP ? 'form-control is-valid' : 'form-control is-invalid'" v-model="clientData.nip" :disabled="isDisableInputs || isEditable">
            </div>
          </div>

          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label">Miejscowość: </label>
            </div>
            <div class="col-4">
              <input maxlength="120" type="text" class="form-control" v-model="clientData.city" :disabled="isDisableInputs">
            </div>
          </div>
          
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label">E-mail: </label>
            </div>
            <div class="col-4">
              <input type="text" maxlength="85" :class="isValidMail ? 'form-control is-valid' : 'form-control is-invalid'" v-model="clientData.mail" :disabled="isDisableInputs">
            </div>
          </div>
          
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label">Limit kont adm: </label>
            </div>
            <div class="col-4">
              <input type="number" min="1" max="50" :class="isValidAdmins ? 'form-control' : 'form-control is-invalid'" v-model="clientData.admins" :disabled="isDisableInputs">
            </div>
          </div>            
          
          <h5 class="text-primary">Usługi:</h5>
          
          <div class="row g-3" style="margin-bottom: 20px;">
                <div class="col-auto">

                    <div class="list-group" v-for="(service,index) in clientServices" >
                        <div class="row" style="margin-bottom: 20px;">
                              <div class="col-8">
                                  <label class="list-group-item d-flex gap-2">
                                          <input class="form-check-input flex-shrink-0" type="checkbox" :value="service.id" v-model="clientChoiceServices">
                                          <span>{{ service.name }}
                                          <small class="d-block text-body-secondary">{{ service.description }}</small>
                                          </span>
                                  </label>
                              </div>
                              <div class="col">
                                  Limit kont:
                              </div>

                              <div class="col">
                                  <input type="number" class="form-control" v-model="service.limit_accounts" :key="index" :disabled="isDisableInputs">
                              </div> 

                        </div>
                    </div>

                </div>
          </div>            
          
      
        
          <div class="row g-3 align-items-center">
              <div class="col-auto">
                <button class="btn btn-success" :disabled="isDisableInputs" v-if="CheckForm" v-on:click="SaveData">
                  <div v-if="showSpinLoading" class="spinner-border text-white spinner-border-sm" role="status"></div>&nbsp;&nbsp;Zapisz
                </button>
              </div>
              <div class="col-auto">
                <button class="btn btn-outline-primary" v-on:click="BackPage" :disabled="isDisableInputs">Zamknij</button>
              </div>	
              <div class="col" style="margin-left: 40px;">
                <button type="button" class="btn btn-outline-danger" style="width: 100px;" v-on:click="ShowDeletePage"  v-if="isglobal">
                  <i class="fas fa-trash"></i>
                  Usuń
                </button>
              </div>             
          </div>          


  </div>
    
    
	<div v-if="showContent">
            <div class="row" style="margin-bottom: 10px;">
                <div  class="col-auto">
                    <button class="btn btn-outline-primary"  v-on:click="AddNewClient">
                    <i class="fa fa-plus"></i>    Dodaj kontrahenta</button>
                </div>
				        <div  class="col-auto">
                    <input class="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj" v-model="SearchClientText">
                </div>    
            </div>
			
			
			
			 <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                                <tr>
                                  <th scope="col" style="width: 50px;">#</th>
                                  <th scope="col" style="width: 50%;">Nazwa</th>
                                  <th scope="col">Miejscowość</th>
                                  <th scope="col" style="width: 150px;">Akcja</th>
                                </tr>
                    </thead>
                    <tbody>
								        <tr v-for="(client,index) in filterClientByName">
                                    <th scope="row">{{ index+1 }}</th>
                                    <td>{{ client.name }}</td>
                                    <td>{{ client.city }}</td>
                                    <td>
                                        <button type="button" class="btn btn-outline-primary" style="width: 100px;" @click="EditClient(client)" v-if="isglobal">
                                          <i class="fas fa-pen"></i>
                                          Edycja
                                        </button>
                                    </td>
                        </tr>   					
					          </tbody>
				        </table>
			</div>


	</div>
		  
  `
}
             
