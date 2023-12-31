
export default {
  
    props: 
    {
          auth: {}
    },
    
    data() {
        return {
                ServerUrl: '',
                isEditable: false,
                
                isValidUser: false,
                isValidName: false,
                isValidPass1: false,
                isValidPass2: false,
                isValidClient: false,
                isValidMail: false,
                isChangePassword: false,

                Admins : [],
                Clients : [],
                
                SearchAdminText: '',
                
                ErrorMessage: '',
                SuccessMessage: '',
                    
                showContent: true,
                showAdminContent: false,
                showDeleteAdminContent: false,
                showButtonPrev: false,
                showSpinLoading: false,
                
                titlePage: 'Administratorzy:',
              
                localName: '', 
                password1: '',
                password2: '',    
                updateAdminData: {},
                currentAdmins: 0,
                maxAdmins: 0,
  
                adminData: {}
              }
    },
    
    
    computed: {
      filterAdminsByName: function(){
              const text = this.SearchAdminText;
              if (text.length > 0)
                  return this.Admins.filter( admin => admin.username.toUpperCase().includes(text.toUpperCase()) );
              else
                  return this.Admins;
      },
  
      CheckForm:function() {
              if (this.adminData.type != 'global'){
                  if  (this.adminData.client < 1) {
                      this.isValidClient = false;
                      return false;
                  }
                    else
                    this.isValidClient = true; 
            }
  
              this.isValidUser = this.validateUserName();
              if  (!this.isValidUser) return false;  

              if  (this.adminData.name.length < 5) {
                  this.isValidName = false;
                  return false;
              }
                else
                this.isValidName = true;   
              
              this.isValidMail = this.validateEmail();
              if  (!this.isValidMail) return false;                
  
              if (this.isChangePassword){
                      if (this.password1.length < 8){
                        this.isValidPass1 = false;
                        return false;
                      }
                        else
                        this.isValidPass1 = true;   

                    
                      if (this.password1 != this.password2){
                        this.isValidPass2 = false;
                        return false;
                      }
                        else
                        this.isValidPass2 = true;  
              }
                else
                this.isValidPass1 = true;


              if (this.adminData.type != 'global'){
                  if (this.currentAdmins >= this.maxAdmins){
                    return false;
                  }
              }

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
      ChangePassword() {
          this.password1 = '';
          this.password2 = '';
          this.isChangePassword = true;
      },

      validateUserName() {
        if (this.adminData.username.length  < 3) return false;
        
        const regex = /[a-z0-9]$/g;
        if (regex.test(this.adminData.username)) {
          if (this.ErrorMessage == "Wprowadzono niedozwolone znaki w polu LOGIN !")
              this.ErrorMessage = "";   
       
          return true;
        }
        else {
          this.ErrorMessage = "Wprowadzono niedozwolone znaki w polu LOGIN !";    
          return false;
        }
      }, 


      validateEmail() {
        if (this.adminData.mail.length  < 6) return false;
        
        const regex = /^[a-z\d]+[\w\d.-]*@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i;
        if (regex.test(this.adminData.mail)) {
          if (this.ErrorMessage == "Nieprawidłowy format adresu E-Mail !")
              this.ErrorMessage = "";   
       
          return true;
        }
        else {
          this.ErrorMessage = "Nieprawidłowy format adresu E-Mail !";    
          return false;
        }
      },      

      changeClientData(){
          console.log("change: "+this.adminData.client);
          this.localName = '';
          var temp = this.Clients.find(client => client.id == this.adminData.client);
          if (temp){
              console.log('NIP: '+temp.nip);
              this.localName = '@'+temp.nip;
              this.currentAdmins = temp.admins;
              this.maxAdmins = temp.admins;

              this.GetCountAdmins();
          }
      },

      changeAdminType(){
        this.localName = '';
        this.adminData.client = null;
        this.adminData.username = '';
        this.isValidUser = false;
    },      

    BackPage(){
          console.log("BACK !!!");
          if (this.isEditable){
              var temp = this.Admins.find(admin => admin.username == this.updateAdminData.username);
              if (temp){
                    temp.name = this.updateAdminData.name;
                    temp.mail = this.updateAdminData.mail;
                    temp.client = this.updateAdminData.client;
                    temp.username = this.updateAdminData.username;
              }
          }
  
  
          this.ShowAdmins();
      },
  
      CopyData(client){
          this.updateAdminData = {username: '', name: '', mail: '', type: '', client: null};
          this.updateAdminData.name = client.name;
          this.updateAdminData.mail = client.mail;
          this.updateAdminData.type = client.type;
          this.updateAdminData.username = client.username;
          this.updateAdminData.client = client.client;
      },
  
  
      AddNewAdmin() {
            this.isEditable =false;
            this.isDisableInputs = false;
            this.isValidUser = false;
            this.isValidName = false;
            this.isValidPass1 = false;
            this.isValidPass2 = false;
            this.isValidMail = false;
            this.isValidClient = false;
            this.isChangePassword = true;
  
            this.showSpinLoading = false;
            this.ErrorMessage = '';
            this.SuccessMessage = '';

            this.currentAdmins = 0;
            this.maxAdmins = 0;

            this.password1 = '';
            this.password2 = '';
            this.localName = '';
  
            this.adminData=  {'username':'','name':'', 'type': 'dedicated','password': '', client: -1, 'mail': ''};
  
            if (!this.auth.isGlobalAdmin){
              const temp = this.Clients[0];
              if (temp){
                this.adminData.client = temp.id;
                console.log("CHANGE CLIENT "+this.adminData.client );
                this.changeClientData();
              }
            }


            this.titlePage = 'Nowy administrator:';
            this.showContent = false;
            this.showButtonPrev = true;
            this.showAdminContent = true;
      },
  
      EditAdmin(client) {
            console.log("---[ SHOW PAGE EDIT ADMIN ]-----");
            this.isEditable = true;

            this.currentAdmins = 0;
            this.maxAdmins = 0;

            this.CopyData(client);
            this.adminData = client;

            this.isValidMail = false;  
            this.isValidUser = true;
            this.isValidName = true;
            this.isValidPass1 = true;
            this.isValidPass2 = false;
            this.isValidClient = true;
            this.isChangePassword = false;  
   
  
            this.showSpinLoading = false;
            this.ErrorMessage = '';
            this.SuccessMessage = '';

            this.password1 = 'password';
            this.password2 = 'password';
            this.localName = '';            
  
          
            this.titlePage = 'Edycja administratora:  '+client.username;
            this.showContent = false;
            this.showButtonPrev = true;
            this.showAdminContent = true;
      },    
      
      ShowDeletePage() {
            this.showSpinLoading = false;
            this.showButtonPrev = true;
            this.showAdminContent = false;
            this.showDeleteAdminContent = true;
            this.showContent = false;
            this.titlePage = 'Usuwanie administratora:  '+this.adminData.username;
      },
      
      ShowAdmins() {
            console.log("---[ SHOW PAGE ADMINS ]-----");
            this.showSpinLoading = false;
            this.showButtonPrev = false;
            this.showAdminContent = false;
            this.showDeleteAdminContent = false;
            this.showContent = true;
            this.titlePage = 'Lista administratorów:';
      },
      
      SaveNewAdmin() {
        console.log("---[ CREATE NEW ADMIN ]-----");

        var passwordHash = CryptoJS.MD5(this.password1);
        const passwordHashString = passwordHash.toString(); 

        this.adminData.password = passwordHashString;
        this.adminData.username = this.adminData.username+this.localName;

        var data = {  token  : this.auth.SessToken, 
                      admin : this.adminData};
  

        console.log(JSON.stringify(data));

                  
        this.showSpinLoading = true;

  
        fetch(  this.ServerUrl+'admins.php', {
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
                      this.ShowAdmins();
                    } else {
                      this.Admins.push(json.result);
                      this.SuccessMessage = "Administrator "+json.result.name+" została utworzony..";
                      this.ShowAdmins();
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
                    this.ShowAdmins();
              });
      },
  
      CheckUpdateData(){
          if ( (this.adminData.name != this.updateAdminData.name) ||
               (this.adminData.mail != this.updateAdminData.mail))
              return true;

          if (this.isChangePassword) return true;
  
          return false;
      },
  
      UpdateData(){
          if (!this.CheckUpdateData()) {
            this.SuccessMessage = 'Dane są aktualne, nie ma nic do zrobienia.';
            return;
          }

          var passwordHash = CryptoJS.MD5(this.password1);
          const passwordHashString = passwordHash.toString(); 
          
          if (this.isChangePassword) {
              this.adminData.password = passwordHashString;
          }

          var data = {  token  : this.auth.SessToken, 
                        admin : this.adminData};
    
    
          this.showSpinLoading = true;
          console.log('----[ UPDATE DOMAIN ]-----');
          console.log(JSON.stringify(data));

          fetch(  this.ServerUrl+'admins.php', {
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
                        this.SuccessMessage = "Dane administratora "+json.result.username+" zostały zaaktualizowane.";
                        this.ShowAdmins();
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
  
  
      DeleteData(){
  
        var data = {  token  : this.auth.SessToken, 
                      admin : this.adminData};
  
  
        this.showSpinLoading = true;
        console.log('----[ DELETE ADMINS ]-----');
        console.log(JSON.stringify(data));
  
        fetch(  this.ServerUrl+'admins.php', {
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
                      this.SuccessMessage = "Administrator "+json.result.username+" został usunięty.";
                      
                      var idx = this.Admins.indexOf(this.adminData);
                      console.log('IDX = '+idx);
                      if (idx !== -1) {
                          this.Admins.splice(idx, 1);
                      }
  
                      this.ShowAdmins();
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
            this.SaveNewAdmin();
          else
            this.UpdateData();
      },
  
      
  
      GetAdmins() {
            fetch( this.ServerUrl +'admins.php?token=' + this.auth.SessToken)
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
                      this.Admins = json.result.admins;
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
        
        GetCurrentClient() {
          fetch( this.ServerUrl +'clients.php?token=' + this.auth.SessToken+'&client=current')
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

        GetCountAdmins() {
          fetch( this.ServerUrl +'admins.php?token=' + this.auth.SessToken+'&client='+this.adminData.client)
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
                    this.currentAdmins = json.result.active_admins;
                    console.log('Current admins: '+this.currentAdmins);
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
        
        ShowProfileEvent(payload) {
          console.log('Received event data admin module:', payload.eventData);
        },
        
    },
    
    mounted() {
        const url = new URL(document.URL);
        const protocol = url.protocol;
        const host = url.host;

        this.ServerUrl = protocol+'//'+host+'/api/v1/';

        this.GetAdmins();
        if (this.auth.isGlobalAdmin)
          this.GetClients();
        else
          this.GetCurrentClient();
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
  
    <div v-if="showDeleteAdminContent">
        <h5 class="text-warning" style="margin-bottom:10px;"><b>OSTRZEŻENIE</b></h5>
        <div class="text-danger" style="margin-bottom:20px;">
        Operacja jest nie odwracalna !.
        </div>
  
        <h5 class="text-danger" style="margin-bottom:10px;"><b>CZY NAPEWNO USUNĄĆ ADMINISTRATORA ?</b></h5>
  
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
  
  
    <div v-if="showAdminContent">
            <div v-if="adminData.type == 'dedicated'">
                <h5 class="text-primary">Kontrahent:</h5>
      
                <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                  <div class="col-8">
                      <select :class="isValidClient ? 'form-select' : 'form-select is-invalid'"  aria-label="wybierz z listy" v-model="adminData.client" :disabled="isDisableInputs || isEditable || !auth.isGlobalAdmin" @change="changeClientData">
                        <option v-for="client in Clients" :key="client.id" :value="client.id">
                        {{ client.name }}
                        </option>
                      </select>
                  </div>
                </div>

                <div  style="margin-bottom: 20px;" :class="currentAdmins < maxAdmins ? 'text-success' : 'text-danger'" v-if="!isEditable">
                  Ilość wykorzystanych kont {{ currentAdmins }} z {{ maxAdmins }}
                </div>
            </div>

         

            <h5 class="text-primary">Ustawienia:</h5>

            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
              <div class="col-2">
                <label class="col-form-label">Typ konta:</label>
              </div>
              <div class="col-4">
                  <select class="form-select"  aria-label="wybierz z listy" v-model="adminData.type" @change="changeAdminType" :disabled="isDisableInputs || isEditable || !auth.isGlobalAdmin">
                    <option value="dedicated">DEDYKOWANY</option>
                    <option value="global">GLOBALNY</option>
                  </select>
              </div>
            </div>              

            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Login:  </label>
                </div>
                <div class="col-4">
                  <input type="text" maxlength="25" :class="isValidUser ? 'form-control is-valid' : 'form-control is-invalid'" v-model="adminData.username"  :disabled="isDisableInputs || isEditable">
                </div>
                <div class="col-4" v-if="!isEditable && adminData.type === 'dedicated'">
                  <input type="text" maxlength="20" class="form-control" v-model="localName"  disabled>
                </div>
            </div>


            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Nazwa:  </label>
                </div>
                <div class="col-4">
                  <input type="text" maxlength="45" :class="isValidName ? 'form-control is-valid' : 'form-control is-invalid'" v-model="adminData.name"  :disabled="isDisableInputs">
                </div>
            </div>       

            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">E-mail:  </label>
                </div>
                <div class="col-4">
                  <input type="text" maxlength="65" :class="isValidMail ? 'form-control is-valid' : 'form-control is-invalid'" v-model="adminData.mail"  :disabled="isDisableInputs">
                </div>
            </div> 

            <h5 class="text-primary">Hasło dostępu:</h5>

            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Hasło:  </label>
                </div>
                <div class="col-4">
                  <input type="password" maxlength="25" :class="isValidPass1 ? 'form-control' : 'form-control is-invalid'" v-model="password1"  :disabled="isDisableInputs || !isChangePassword">
                </div>
                <div class="col-4">
                  <div v-if="!isChangePassword">
                      <button class="btn btn-outline-primary" v-on:click="ChangePassword" :disabled="isDisableInputs">Zmień</button>
                  </div>
                  <div v-else>min. 8 znaków</div>
                </div>                
            </div>
            
            <div class="row g-3 align-items-center" style="margin-bottom: 20px;" v-if="isChangePassword">
                <div class="col-2">
                  <label class="col-form-label">Powtórz:  </label>
                </div>
                <div class="col-4">
                  <input type="password" maxlength="25" :class="isValidPass2 ? 'form-control is-valid' : 'form-control is-invalid'" v-model="password2"  :disabled="isDisableInputs">
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
                      <button class="btn btn-outline-primary"  v-on:click="AddNewAdmin">
                      <i class="fa fa-plus"></i>    Dodaj administatora</button>
                  </div>
                          <div  class="col-auto">
                      <input class="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj" v-model="SearchAdminText">
                  </div>    
              </div>
              
              
              
               <div class="table-responsive">
                  <table class="table table-striped table-hover">
                      <thead class="table-dark">
                                  <tr>
                                    <th scope="col" style="width: 50px;">#</th>
                                    <th scope="col" style="width: 50%;">Użytkownik</th>
                                    <th scope="col">Typ</th>
                                    <th scope="col" style="width: 150px;">Akcja</th>
                                  </tr>
                      </thead>
                      <tbody>
                                    <tr v-for="(admin,index) in filterAdminsByName">
                                      <th scope="row">{{ index+1 }}</th>
                                      <td>{{ admin.username }}</td>
                                      <td>{{ admin.type }}</td>
                                      <td>
                                          <button type="button" class="btn btn-outline-primary" style="width: 100px;" @click="EditAdmin(admin)">
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
               
  