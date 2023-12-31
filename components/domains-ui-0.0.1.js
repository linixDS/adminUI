export default {
  
  props: 
  {
      auth: {}
  },
  
  data() {
	  return {
              ServerUrl: '',
              isEditable: false,
              isValidName: false,
              isValidClient: false,

              Domains : [],
              Clients : [],
              
              SearchDomainText: '',
              
              ErrorMessage: '',
              SuccessMessage: '',
		          
              showContent: true,
              showDomainContent: false,
              showDeleteDomainContent: false,
              showButtonPrev: false,
		          showSpinLoading: false,
              
              titlePage: 'Domeny:',
            
            
              updateDomainData: {},

              domainData: {}
            }
  },
  
  
  computed: {
    filterDomainByName: function(){
            const text = this.SearchDomainText;
            if (text.length > 0)
                return this.Domains.filter( domain => domain.name.toUpperCase().includes(text.toUpperCase()) );
            else
                return this.Domains;
    },

    CheckForm:function() {
            if  (this.domainData.client < 1) {
                this.isValidClient = false;
                return false;
            }
              else
              this.isValidClient = true;
              

            this.isValidName = this.validateDomainName();
            if  (!this.isValidName) return false;
            
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
        if (this.isEditable){
            var temp = this.Domains.find(domain => domain.name == this.updateDomainData.name);
            if (temp){
                  temp.name = this.updateDomainData.name;
                  temp.created = this.updateDomainData.created;
                  temp.client = this.updateDomainData.client;
            }
        }


        this.ShowDomains();
    },

    validateDomainName() {

      if (this.domainData.name.length  < 4) return false;

      const regex = /^[a-zA-Z0-9][-a-zA-Z0-9]+[a-zA-Z0-9].[a-z]{2,3}(.[a-z]{2,3})?(.[a-z]{2,3})?$/i;

      if (regex.test(this.domainData.name)) {
        if (this.ErrorMessage == "Nieprawidłowy format nazwy domeny !")
            this.ErrorMessage = "";   
     
        return true;
      }
      else {
        this.ErrorMessage = "Nieprawidłowy format nazwy domeny !";    
        return false;
      }
    },    

    CopyDomainData(client){
        this.updateDomainData = {name: '', client: -1};
        this.updateDomainData.name = client.name;
        this.updateDomainData.created = client.created;
        this.updateDomainData.client = client.client;
    },


    AddNewDomain() {
          this.isEditable = false;
          this.isValidName =  false;
          this.isValidClient = false;

          this.showSpinLoading = false;
          this.ErrorMessage = '';
          this.SuccessMessage = '';

          this.domainData=  {'name':'', client: -1};

          this.titlePage = 'Nowa domena:';
          this.showContent = false;
          this.showButtonPrev = true;
          this.showDomainContent = true;
    },

    EditDomain(client) {
          console.log("---[ SHOW PAGE EDIT CLIENT ]-----");
          this.domainData = client;

          this.isEditable = true;
          this.isValidName =  true;
          this.isValidMails = true;
          this.isValidClient = true;          

          this.showSpinLoading = false;
          this.ErrorMessage = '';
          this.SuccessMessage = '';

        
          this.titlePage = 'Edycja domeny: '+client.name;
          this.showContent = false;
          this.showButtonPrev = true;
          this.showDomainContent = true;
    },    
	
    ShowDeletePage() {
          this.showSpinLoading = false;
          this.showButtonPrev = true;
          this.showDomainContent = false;
          this.showDeleteDomainContent = true;
          this.showContent = false;
          this.titlePage = 'Usuwanie domeny:'+this.domainData.name;
    },
    
    ShowDomains() {
          console.log("---[ SHOW PAGE DOMAINS ]-----");
          this.showSpinLoading = false;
          this.showButtonPrev = false;
          this.showDomainContent = false;
          this.showDeleteDomainContent = false;
          this.showContent = true;
          this.titlePage = 'Domeny:';
    },
    
    SaveNewDomain() {
      var data = {  token  : this.auth.SessToken, 
                    domain : this.domainData};


      this.showSpinLoading = true;
      console.log(JSON.stringify(data));

      fetch(  this.ServerUrl+'domains.php', {
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
                    this.ShowDomains();
                  } else {
                    this.Domains.push(json.result);
                    this.SuccessMessage = "Nowa domena "+json.result.name+" została zarejestrowana.";
                    this.ShowDomains();
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
                  this.ShowDomains();
            });
    },


    DeleteData(){

      var data = {  token  : this.auth.SessToken, 
                    domain : this.domainData};


      this.showSpinLoading = true;
      console.log('----[ DELETE DOMAIN ]-----');
      console.log(JSON.stringify(data));

      fetch(  this.ServerUrl+'domains.php', {
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
                    this.SuccessMessage = "Domena "+json.result.name+" została usunięta.";
                    
                    var idx = this.Domains.indexOf(this.domainData);
                    console.log('IDX = '+idx);
                    if (idx !== -1) {
                        this.Domains.splice(idx, 1);
                    }

                    this.ShowDomains();
                  }

                  
            })
            .catch((error) => {
                  console.log('Error saveClient');
                  if (error == "TypeError: Failed to fetch")
                    this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.ServerUrl;
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
          this.SaveNewDomain();
    },

    

    GetDomains() {
          this.ErrorMessage = '';
          this.SuccessMessage = '';      
          console.log('GET DOMAINS');
          fetch( this.ServerUrl+'domains.php?token='+this.auth.SessToken)
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
                    this.Domains = json.result.domains;
                  }
                })
                .catch((error) => {
                  console.log(error);
                  if (error == "TypeError: Failed to fetch")
                    this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.ServerUrl;
                  else
                    if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                        this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                    else
                      this.ErrorMessage = 'Wyjątek: ' + error;
                });
    },


    GetClients() {
      this.ErrorMessage = '';
      this.SuccessMessage = '';      
      console.log('GET clients');
      fetch( this.ServerUrl +'clients.php?token=' + this.auth.SessToken)
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
                this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.ServerUrl;
              else
                if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                    this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                else
                  this.ErrorMessage = 'Wyjątek: ' + error;
            });

      }, 
      
      
      SendCommand(){
        this.ErrorMessage = '';
        this.SuccessMessage = '';
        var commandData = {name: 'sogo', action: 'reload'};
        var data = {  token  : this.auth.SessToken, 
                      command : commandData};
  
  
        this.showSpinLoading = true;
        console.log('----[ SEND COMMAND ]-----');
        console.log(JSON.stringify(data));
  
        fetch(  this.ServerUrl+'command.php', {
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
                    } else {
                      this.SuccessMessage = "Polecenie zostanie wykonane.";
                    }
  
                    
              })
              .catch((error) => {
                    if (error == "TypeError: Failed to fetch")
                      this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.ServerUrl;
                    else
                      if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                          this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                      else
                        this.ErrorMessage = 'Wyjątek: ' + error;
              });
  
    },        
 
	  
  },
  
  mounted() {
    console.log("LOAD MODULE: domains");
    const url = new URL(document.URL);
    const protocol = url.protocol;
    const host = url.host;

    this.ServerUrl = protocol+'//'+host+'/api/v1/';

    console.log('AUTH= '+this.auth.SessToken);

		this.GetDomains();
    if (this.auth.isGlobalAdmin)
      this.GetClients();
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

  <div v-if="showDeleteDomainContent">
      <h5 class="text-warning" style="margin-bottom:10px;"><b>OSTRZEŻENIE</b></h5>
      <div class="text-danger" style="margin-bottom:20px;">
      Aby usunąć domenę z bazy, należy wcześnij usunąć wszystkie konta.
      </div>

      <h5 class="text-danger" style="margin-bottom:10px;"><b>CZY NAPEWNO USUNĄĆ DOMENĘ ?</b></h5>

      <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
          <div class="col-auto">
              <button type="button" class="btn btn-outline-danger" style="width: 100px;"  v-if="auth.isGlobalAdmin" v-on:click="DeleteData">
                TAK
              </button>      
          </div>
          <div class="col-auto">
              <button type="button" class="btn btn btn-outline-success" style="width: 100px;" v-on:click="BackPage" v-if="auth.isGlobalAdmin">
                NIE
              </button>      
          </div>

      </div>

  </div>


  <div v-if="showDomainContent">
          <h5 class="text-primary">Właściciel domeny:</h5>

          <div class="row g-3 align-items-center" style="margin-bottom: 20px;" >
            <div class="col-8">
                <select :class="isValidClient ? 'form-select' : 'form-select is-invalid'"  aria-label="wybierz z listy" v-model="domainData.client" :disabled="isDisableInputs || isEditable">
                  <option v-for="client in Clients" :key="client.id" :value="client.id">
                   {{ client.name }}
                  </option>
                </select>
            </div>
          </div>


          <h5 class="text-primary">Informacje ogólne:</h5>

          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label"><b>Nazwa:</b>  </label>
            </div>
            <div class="col-4">
              <input type="text" maxlength="200" :class="isValidName ? 'form-control is-valid' : 'form-control is-invalid'" v-model="domainData.name" :disabled="isDisableInputs || isEditable">
            </div>
          </div>

        
          <div class="row g-3 align-items-center">
              <div class="col-auto">
                <button class="btn btn-success" :disabled="isDisableInputs" v-if="CheckForm && !isEditable" v-on:click="SaveData">
                  <div v-if="showSpinLoading" class="spinner-border text-white spinner-border-sm" role="status"></div>&nbsp;&nbsp;Zapisz
                </button>
              </div>
              <div class="col-auto">
                <button class="btn btn-outline-primary" v-on:click="BackPage" :disabled="isDisableInputs">Zamknij</button>
              </div>	
              <div class="col" style="margin-left: 40px;">
                <button type="button" class="btn btn-outline-danger" style="width: 100px;" v-on:click="ShowDeletePage"  v-if="isEditable">
                  <i class="fas fa-trash"></i>
                  Usuń
                </button>
              </div>             
          </div>          


  </div>
    
    
	<div v-if="showContent">
            <div class="row" style="margin-bottom: 10px;">
                <div  class="col-auto">
                    <button class="btn btn-outline-primary"  v-on:click="AddNewDomain"  v-if="auth.isGlobalAdmin">
                    <i class="fa fa-plus"></i>    Dodaj domenę</button>
                </div>
				        <div  class="col-auto">
                    <input class="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj" v-model="SearchDomainText">
                </div> 
                <div  class="col-auto" v-if="auth.isGlobalAdmin">
                  <button class="btn btn-outline-danger"  v-on:click="SendCommand"  v-if="auth.isGlobalAdmin">
                  <i class="fa-solid fa-rotate-right"></i>  Przeładuj usługę SOGo</button>
                </div>   
            </div>
			
			
			
			 <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                                <tr>
                                  <th scope="col" style="width: 50px;">#</th>
                                  <th scope="col" style="width: 50%;">Nazwa</th>
                                  <th scope="col">Data utworzenia</th>
                                  <th scope="col" style="width: 150px;">Akcja</th>
                                </tr>
                    </thead>
                    <tbody>
								        <tr v-for="(domain,index) in filterDomainByName">
                                    <th scope="row">{{ index+1 }}</th>
                                    <td>{{ domain.name }}</td>
                                    <td>{{ domain.created }}</td>
                                    <td>
                                        <button type="button" class="btn btn-outline-primary" style="width: 100px;" @click="EditDomain(domain)" v-if="auth.isGlobalAdmin">
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
             
