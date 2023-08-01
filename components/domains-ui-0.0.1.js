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
              isValidMails: false,
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
              

            if  (this.domainData.name.length < 5) {
                this.isValidName = false;
                return false;
            }


            if (this.domainData.name.indexOf('.') == -1){
              this.isValidName = false;
              return false;
            }
            else
                  this.isValidName = true;             
    
            if  (this.domainData.mails < -1) {
              console.log('LIMIT IS INCORRECT !!!');
              this.isValidMails = false;
              return false;
            }
              else
              this.isValidMails = true;
      
             
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
                  temp.mails = this.updateDomainData.mails;
                  temp.created = this.updateDomainData.created;
                  temp.client = this.updateDomainData.client;
            }
        }


        this.ShowDomains();
    },

    CopyDomainData(client){
        this.updateDomainData = {name: '', mails: 100, client: -1};
        this.updateDomainData.name = client.name;
        this.updateDomainData.mails = client.mails;
        this.updateDomainData.created = client.created;
        this.updateDomainData.client = client.client;
    },


    AddNewDomain() {

          this.isEditable = false;
          this.isValidName =  false;
          this.isValidMails = false;
          this.isValidClient = false;

          this.showSpinLoading = false;
          this.ErrorMessage = '';
          this.SuccessMessage = '';

          this.domainData=  {'name':'', 'mails': 100, client: -1};

          this.titlePage = 'Nowa domena:';
          this.showContent = false;
          this.showButtonPrev = true;
          this.showDomainContent = true;
    },

    EditDomain(client) {
          console.log("---[ SHOW PAGE EDIT CLIENT ]-----");
          this.CopyDomainData(client);
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
      var data = {  token  : this.token, 
                    domain : this.domainData};


      this.showSpinLoading = true;
      console.log(JSON.stringify(data));

      fetch(  this.serverurl+'domains.php', {
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

    CheckUpdateData(){
        if ( (this.domainData.name != this.updateDomainData.name) ||
            (this.domainData.mail != this.updateDomainData.mails))
            return true;

        return false;
    },

    UpdateData(){
        if (!this.CheckUpdateData()) {
          this.SuccessMessage = 'Dane są aktualne, nie ma nic do zrobienia.';
          return;
        }

  
        var data = {  token  : this.token, 
                      domain : this.domainData};
  
  
        this.showSpinLoading = true;
        console.log('----[ UPDATE DOMAIN ]-----');
        console.log(JSON.stringify(data));
  
        fetch(  this.serverurl+'domains.php', {
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
                      this.SuccessMessage = "Dane domeny "+json.result.name+" zostały zaaktualizowane.";
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
                    this.BackPage();
              });

    },


    DeleteData(){

      var data = {  token  : this.token, 
                    domain : this.domainData};


      this.showSpinLoading = true;
      console.log('----[ DELETE DOMAIN ]-----');
      console.log(JSON.stringify(data));

      fetch(  this.serverurl+'domains.php', {
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
          this.SaveNewDomain();
        else
          this.UpdateData();
    },

    

    GetDomains() {
          fetch( this.serverurl +'domains.php?token=' + this.token)
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
                    this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.serverurl;
                  else
                    if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                        this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                    else
                      this.ErrorMessage = 'Wyjątek: ' + error;
                });
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
      
 
	  
  },
  
  mounted() {
		this.GetDomains();
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
      Aby usunąć domenę  z bazy, neleży wcześnij usunąć wszystkie konta pocztowe.
      </div>

      <h5 class="text-danger" style="margin-bottom:10px;"><b>CZY NAPEWNO USUNĄĆ DOMENĘ ?</b></h5>

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

          
          
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label">Limit kont: </label>
            </div>
            <div class="col-4">
              <input type="number" min="1" max="50" :class="isValidMails ? 'form-control' : 'form-control is-invalid'" v-model="domainData.mails" :disabled="isDisableInputs">
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
                    <button class="btn btn-outline-primary"  v-on:click="AddNewDomain"  v-if="isglobal">
                    <i class="fa fa-plus"></i>    Dodaj domenę</button>
                </div>
				        <div  class="col-auto">
                    <input class="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj" v-model="SearchDomainText">
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
                                        <button type="button" class="btn btn-outline-primary" style="width: 100px;" @click="EditDomain(domain)" v-if="isglobal">
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
             
