export default {
  
    props: 
    {
        auth: {}
    },
    
    data() {
        return {
                Clients : [],
                Domains : [],
                Accounts : [],
                Services : [],
                currentSessServiceLimit: [],
                ChoiceServices: [],
                cacheChoiceServices: [],
                
                SearchAccountText: '',
                
                ErrorMessage: '',
                SuccessMessage: '',
                    

                isEditable: false,
                isValidUser: false,
                isValidMail: false,
                isValidName: false,
                isValidPass1: false,
                isValidPass2: false,
                isNeedMail: true,
                isChangePassword: false,
                showContent: true,
               
                showAccountContent: false,
                showButtonPrev: false,
                showSpinLoading: false,
                showAddBtn: false,
                showDeleteAccountContent: false,
                isDisableInputs: false,    

                
                ErrorMessage: '',
                SuccessMessage: '',
                    
                password1: '',
                password2: '',    
             
                
                titlePage: 'Konta użytkowników:',


                ClientId: -1,
                DomainId: -1,
                DomainName: '',
                accountData: {username: '', name: '', mail:''},
                updateAccountData: {}
              }
    },
    
    
    computed: {
      filterAccountsByName: function(){
              const text = this.SearchAccountText;
              if (text.length > 0)
                  return this.Accounts.filter( account => account.username.toUpperCase().includes(text.toUpperCase()) );
              else
                  return this.Accounts;
      },

      CheckForm:function() {
              if  (this.accountData.username.length < 3) {
                this.isValidUser = false;
                return false;
              }
                else
              this.isValidUser = true;   

              if  (this.accountData.name.length < 3) {
                  this.isValidName = false;
                  return false;
              }
                else
                this.isValidName = true;   
              
              if (this.isNeedMail && this.accountData.mail != null){
                    if  (this.accountData.mail.length < 5) {
                        this.isValidMail = false;
                        return false;
                    }
                      else
                    this.isValidMail = true;

              }

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

              if (this.ChoiceServices.length < 1 && !this.isEditable)
                return false;                

              return true;
        },        
    
    },
  
  
    
    methods: {
      BackPage(){
          console.log("BACK !!!");

          if (this.isEditable){
            var temp = this.Accounts.find(account => account.username == this.updateAccountData.username);
            if (temp){
                  temp.name = this.updateAccountData.name;
                  temp.mail = this.updateAccountData.mail;
            }
          }          
          this.ShowAccounts();
      },

      ReloadServices(){
          for (const item of this.currentSessServiceLimit){
              const found = this.Services.find(service => service.id == item.id);
              if (found){
                  found.active_accounts = item.active_accounts;
              }
          }
      },

      CheckLimit(service){
          if (!this.isEditable){
              if (service.active_accounts >= service.limit_accounts)
                  return true;
                else
                  return false;
          }
            else{
                    const found = this.cacheChoiceServices.indexOf(service.id);
                    if (found > -1)
                        return false;
                    else {
                      if (service.active_accounts >= service.limit_accounts)
                          return true;
                        else
                          return false;
                    }
            }
      },

      UncheckChoiceService(id){
          const indexToRemove = this.ChoiceServices.indexOf(id);
          if (indexToRemove !== -1) {
              this.ChoiceServices.splice(indexToRemove, 1);
          }
      },

      handleCheckboxChange(event) {
          const id = event.target.value;
          const state = event.target.checked;

          console.log('event: '+id+' state: '+state);
          if (id == 1){
                if (state)
                  this.isNeedMail = false;
                else
                  this.isNeedMail = true;
          }

          const limits = this.currentSessServiceLimit.find(service => service.id == id);
          if (limits){
              if (limits.active_accounts <= limits.limit_accounts && state == true)
                limits.active_accounts++;
                if (limits.active_accounts > 0 && state == false)
                limits.active_accounts--;
          }
      },

      ChangePassword() {
        this.password1 = '';
        this.password2 = '';
        this.isChangePassword = true;
      },      
      
      ChangeClient(){
        this.showAddBtn = false;
        this.Accounts = [];
        this.Domains = [];
        this.Services = [];
        console.log('Change client: '+this.ClientId);
        this.GetDomains(this.ClientId);
        this.GetServicesClient(this.ClientId);
      },

      ChangeDomain(){
        console.log('Change domain: '+this.DomainId);

        var domain = this.Domains.find(domain => domain.id == this.DomainId);
        if (domain){
            this.DomainName = '@'+domain.name;
            this.showAddBtn = true;
        }

        this.GetAccounts(this.DomainId);
      },      
       
      ShowAccounts() {
            console.log("---[ SHOW PAGE ACCOUNTS ]-----");
            this.showSpinLoading = false;
            this.showButtonPrev = false;
            this.showAccountContent = false;
            this.showDeleteAccountContent = false;
            this.showContent = true;
            this.titlePage = 'Konta użytkowników:';
      },

      CopyData(account){
          if (account){
              this.updateAccountData = {username: '', name: ''};
              this.updateAccountData.name = account.name;
              this.updateAccountData.id = account.id;
              this.updateAccountData.username = account.username;
              this.updateAccountData.mail = account.mail;
              this.updateAccountData.created = account.created;
              this.updateAccountData.client = this.ClientId;
              this.updateAccountData.domain = this.DomainId;

              for (const choice of this.ChoiceServices){
                    this.cacheChoiceServices.push(choice);
              }
          }

          this.currentSessServiceLimit = [];
          for (const item of this.Services){
              const obj = {id: item.id, active_accounts: item.active_accounts, limit_accounts: item.limit_accounts};
              this.currentSessServiceLimit.push(obj);
          }

      },
      
  
      DeleteData(){
        var dataAccount = {id: this.accountData.id, username: this.accountData.username, client: this.ClientId};
        var data = {  token  : this.auth.SessToken, 
                      account : dataAccount};
  
  
        this.showSpinLoading = true;
        console.log('----[ DELETE ACCOUNT ]-----');
        console.log(JSON.stringify(data));
  
        fetch(  this.ServerUrl+'accounts.php', {
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
                      
                      var idx = this.Accounts.indexOf(this.accountData);
                      console.log('IDX = '+idx);
                      if (idx !== -1) {
                          this.Accounts.splice(idx, 1);
                      }
  
                      this.ShowAccounts();
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
      

      AddNewAccount() {
        console.log('---[ Services ]-----' );
        console.log(this.Services);
        this.CopyData(null);
        this.ErrorMessage = '';
        this.SuccessMessage ='';
        this.ChoiceServices = [];
        this.updateAccountData = {};

        this.showDeleteAccountContent=false;
        this.isEditable =false;
        this.isDisableInputs = false;
        this.isValidName = false;
        this.isValidPass1 = false;
        this.isValidPass2 = false;
        this.isValidMail = false;
        this.isChangePassword = true;
        this.isNeedMail = true;
        this.accountData = {username: '', name: '', mail: ''};

        this.password1 = '';
        this.password2 = '';

 
        this.titlePage = 'Nowe konto:';
        this.showContent = false;
        this.showButtonPrev = true;
        this.showAccountContent = true;
    },

    EditAccount(account) {
      console.log("---[ SHOW PAGE EDIT ACCOUNT ]-----");
      console.log(account);
      this.ChoiceServices = [];

      this.GetServicesAccount(account.id);
      this.isEditable = true;
      this.showDeleteAccountContent=false;      

      this.CopyData(account);
      this.accountData = account;

      this.isNeedMail = true;
      this.isValidUser = true;
      this.isValidName = true;
      this.isValidPass1 = true;
      this.isValidPass2 = false;
      this.isValidMail = false;
      this.isChangePassword = false;  

      this.showSpinLoading = false;
      this.ErrorMessage = '';
      this.SuccessMessage = '';

      this.password1 = 'password';
      this.password2 = 'password';
    
      this.titlePage = 'Edycja konta:  '+account.username;
      this.showContent = false;
      this.showButtonPrev = true;
      this.showAccountContent = true;
    },    
    
    ShowDeletePage() {
      this.showSpinLoading = false;
      this.showButtonPrev = true;
      this.showAccountContent = false;
      this.showDeleteAccountContent = true;
      this.showContent = false;
      this.titlePage = 'Usuwanie konta:  '+this.accountData.username;
    },    
    
    SaveData(){
        this.SuccessMessage = '';
        this.ErrorMessage = '';

        if (!this.isEditable)
          this.SaveNewAccount();
        else
          this.UpdateData();
    },
    
    SaveNewAccount() {
        console.log("---[ CREATE NEW ACCOUNT ]-----");
        var servicesList = [];

        for (var item of this.ChoiceServices){
          let service = {id: item};
          servicesList.push(service);
       }        

        var passwordHash = CryptoJS.MD5(this.password1);
        const passwordHashString = passwordHash.toString(); 

        this.accountData.password = passwordHashString;
        this.accountData.username = this.accountData.username+this.DomainName;
        if (!this.isNeedMail)
          this.accountData.mail = this.accountData.username;

        this.accountData.client = this.ClientId;
        this.accountData.domain = this.DomainId;

        var data = {  token  : this.auth.SessToken, 
                      account : this.accountData,
                      services: servicesList
                    };


        console.log(JSON.stringify(data));


                  
        this.showSpinLoading = true;


        fetch(  this.ServerUrl+'accounts.php', {
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
                      this.ShowAccounts();
                    } else {
                      this.Accounts.push(json.result);
                      this.SuccessMessage = "Konto "+json.result.name+" zostało utworzone.";
                      this.ReloadServices();
                      this.ShowAccounts();
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
                    this.ShowAccounts();
              });
    },  
    

    CheckUpdateData(){
      if (this.accountData.name != this.updateAccountData.name)
          return true;

      if (this.accountData.mail != this.updateAccountData.mail && this.isNeedMail)
          return true;

      if (this.isChangePassword) return true;

      let len1 = this.ChoiceServices.length;
      let len2 = this.cacheChoiceServices.length;
      if (len1 !== len2)  return true;

      for (const item of this.ChoiceServices) {
          var temp =  this.cacheChoiceServices.indexOf(item);
          if (temp == -1) return true;
      }

      return false;
  },    
    UpdateData(){
      if (!this.CheckUpdateData()) {
        this.SuccessMessage = 'Dane są aktualne, nie ma nic do zrobienia.';
        return;
      }

      var servicesList = [];

      for (var item of this.ChoiceServices){
            var service = {id: item};
            servicesList.push(service);
      }     

      var dataAccount = {id: this.accountData.id, username: this.accountData.username, name: this.accountData.name, client: this.ClientId};
      var passwordHash = CryptoJS.MD5(this.password1);
      const passwordHashString = passwordHash.toString(); 

      if (!this.isNeedMail)
        dataAccount.mail = this.accountData.username;
      if (this.isChangePassword)
        dataAccount.password = passwordHashString;



      var data = {  token  : this.auth.SessToken, 
                    account : dataAccount,
                    services: servicesList};

 


      this.showSpinLoading = true;
      console.log('----[ UPDATE ACCOUNT ]-----');
      console.log(JSON.stringify(data));

      fetch(  this.ServerUrl+'accounts.php', {
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
                    this.SuccessMessage = "Konto "+json.result.username+" zostało zaaktualizowane.";
                    this.ShowAccounts();
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
      
     
  
      GetClients() {
            var url = this.ServerUrl +'clients.php?token=' + this.auth.SessToken;
            if (!this.auth.isGlobalAdmin)
                url = url+'&client=current';
            console.log(url);
            fetch(url)
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

                      if (!this.auth.isGlobalAdmin){
                        const temp = this.Clients[0];
                        if (temp){
                            this.ClientId = temp.id;
                            this.GetDomains(this.ClientId);
                        }
                      }

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
        
      GetDomains(clientId) {
            console.log('GET DOMAINS');
            var url = this.ServerUrl+'domains.php?token='+this.auth.SessToken;
            if (this.auth.isGlobalAdmin)
                url = url+'&client='+clientId;

            fetch( url)
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

        GetAccounts(domainId) {
            console.log('GET DOMAINS');
            var url = this.ServerUrl+'accounts.php?token='+this.auth.SessToken+'&domain='+domainId+'&client='+this.ClientId;


            fetch( url)
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
                    this.Accounts = json.result.accounts;
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
  

        GetServicesClient(clientId) {
            console.log('GET SERVICES');
            var url = this.ServerUrl+'services.php?token='+this.auth.SessToken+'&client='+clientId+'&account=1';
                fetch( url)
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
                                console.log('Services');
                                console.log(this.Services);
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
        
        GetServicesAccount(accountId) {
              var url = this.ServerUrl+'services.php?token='+this.auth.SessToken+'&account='+accountId;
              console.log(url);
              fetch( url)
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
                      
                      for (const item of json.result.services ) {
                        if (item.id == 1) this.isNeedMail = false;
                        this.ChoiceServices.push(item.id);
                        this.cacheChoiceServices.push(item.id);
                      }
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
        
        
    },
    
    mounted() {
      const url = new URL(document.URL);
      const protocol = url.protocol;
      const host = url.host;
  
      this.ServerUrl = protocol+'//'+host+'/api/v1/';

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
  

    <div v-if="showDeleteAccountContent">
      <h5 class="text-warning" style="margin-bottom:10px;"><b>OSTRZEŻENIE</b></h5>
      <div class="text-danger" style="margin-bottom:20px;">
      Aby usunąć konto z bazy, należy wcześnij usunąć wszystkie wpisy powiązane tj.:<br>
      <ul>
        <li>odpiąć usługi,</li>
      </ul>
      </diV>
      <h5 class="text-danger" style="margin-bottom:10px;"><b>CZY NAPEWNO USUNĄĆ KONTO ?</b></h5>

      <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
          <div class="col-auto">
              <button type="button" class="btn btn-outline-danger" style="width: 100px;"  v-if="auth.isGlobalAdmin" v-on:click="DeleteData">
                TAK
              </button>      
          </div>
          <div class="col-auto">
              <button type="button" class="btn btn btn-outline-success" style="width: 100px;" v-on:click="BackPage">
                NIE
              </button>      
          </div>

      </div>

  </div>    

  
  
    <div v-if="showAccountContent">

                <h5 class="text-primary">Dane do logowania:</h5>

                <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                    <div class="col-2">
                    <label class="col-form-label">Login:  </label>
                    </div>
                    <div class="col-4">
                        <input type="text" maxlength="25" :class="isValidUser ? 'form-control is-valid' : 'form-control is-invalid'" v-model="accountData.username"  :disabled="isDisableInputs || isEditable">
                    </div>
                    <div class="col-4" v-if="!isEditable">
                        <input type="text" maxlength="20" class="form-control" v-model="DomainName"  disabled>
                    </div>
                </div>   

                <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                    <div class="col-2">
                      <label class="col-form-label">Nazwa:  </label>
                    </div>
                    <div class="col-4">
                      <input type="text" maxlength="45" :class="isValidName ? 'form-control is-valid' : 'form-control is-invalid'" v-model="accountData.name"  :disabled="isDisableInputs">
                    </div>
                </div> 
                
                <div class="row g-3 align-items-center" style="margin-bottom: 20px;" v-if="isNeedMail">
                    <div class="col-2">
                      <label class="col-form-label">E-mail:  </label>
                    </div>
                    <div class="col-4">
                      <input type="text" maxlength="45" :class="isValidMail ? 'form-control is-valid' : 'form-control is-invalid'" v-model="accountData.mail"  :disabled="isDisableInputs">
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
                
                <h5 class="text-primary">Podłączenie do usług:</h5>


                <div class="row g-3" style="margin-bottom: 20px;">
                    <div class="col-auto">

                        <div class="list-group" v-for="(service,index) in Services" >
                            <div class="row" style="margin-bottom: 20px;">
                                <div class="col-8">
                                    <label class="list-group-item d-flex gap-2">
                                            <input class="form-check-input flex-shrink-0" type="checkbox" 
                                                        :value="service.id" @change="handleCheckboxChange"  v-model="ChoiceServices" 
                                                        :disabled="CheckLimit(service)">
                                            <span>{{ service.name }}
                                            <small class="d-block text-body-secondary">{{ service.description }}</small>
                                            </span>
                                    </label>
                                </div>
                                <div class="col text-danger" v-if="CheckLimit(service)">
                                    Limit kont wykorzystany
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
                      <button type="button" class="btn btn-outline-danger" style="width: 100px;" v-on:click="ShowDeletePage"  v-if="isEditable">
                        <i class="fas fa-trash"></i>
                        Usuń
                      </button>
                    </div>             
                </div>                 

    </div>
      
      
      <div v-if="showContent">

            <div v-if="auth.isGlobalAdmin">
                <h6 class="text-primary">Kontrahent:</h6>

                <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                    <div class="col-8">
                            <select class="form-select" aria-label="wybierz z listy" v-model="ClientId"  :disabled="isDisableInputs || !auth.isGlobalAdmin" @change="ChangeClient">
                            <option v-for="client in Clients" :key="client.id" :value="client.id">
                            {{ client.name }}
                            </option>
                            </select>
                    </div>
                </div>
            </div>

            <h6 class="text-primary">Domena:</h6>

            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-8">
                        <select class="form-select" aria-label="wybierz z listy" v-model="DomainId"  :disabled="isDisableInputs" @change="ChangeDomain">
                        <option v-for="domain in Domains" :key="domain.id" :value="domain.id">
                        {{ domain.name }}
                        </option>
                        </select>
                </div>
            </div>            


              <div class="row" style="margin-bottom: 10px;">
                  <div  class="col-auto">
                      <button class="btn btn-outline-primary"  v-on:click="AddNewAccount" v-if="showAddBtn">
                      <i class="fa fa-plus"></i>    Dodaj konto</button>
                  </div>
                          <div  class="col-auto">
                      <input class="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj" v-model="SearchAccountText">
                  </div>    
              </div>
              
              
  
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                  <thead class="table-dark">
                              <tr>
                                <th scope="col" style="width: 45px;">#</th>
                                <th scope="col">Użytkownik</th>
                                <th scope="col" style="width: 80px;">Akcja</th>
                              </tr>
                  </thead>
                  <tbody>
                                <tr v-for="(account,index) in filterAccountsByName">
                                  <th scope="row">{{ index+1 }}</th>
                                  <td :class="account.active==1 ? 'text-success' : 'text-danger'">{{ account.username }}</td>
                                  <td>
                                      <button type="button" class="btn btn-outline-primary" style="width: 100px;" v-on:click="EditAccount(account)">
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
               
  