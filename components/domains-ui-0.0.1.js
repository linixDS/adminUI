export default {
  
  props: 
  {
        isglobal: '',
        token: '',
        serverurl: ''
  },
  
  data() {
	  return {
              Domains : [],
              Services: [],
              
              SearchDomainText: '',
              
              ErrorMessage: '',
              SuccessMessage: '',
              SuccessMessageSlave: '',
		          
              AdminPanel: true,
              showDeleteDomainContent: false,
              showContent: true,
              showDomainContent: false,
              showButtonPrev: false,
		          showSpinLoading: false,
              showPassword: false,
              createdAdminAccount: false,
              
              titlePage: 'Domeny zarejestrowane:',
              
              password2: '',
              mailUser : '',
              mailDomain: '',
              
              domainObj: {},
              adminObj: {},
              domainServices: [],
              domainChoiceServices: [],
              adminChoiceServices: [],
              
              currentDomainObj: [],
              currentServices: []
    }
  },
  
  
  computed: {
    filterDomainByName: function(){
            const text = this.SearchDomainText;
            if (text.length > 0)
                return this.Domains.filter( domain => domain.domain.toUpperCase().includes(text.toUpperCase()) );
            else
                return this.Domains;
    },

    isDisableInputs: function() {
            if (this.showSpinLoading)
              return true;
            else
              return false;
    },

	
	  filterDomainServices: function(){
            return this.domainServices;
	  },
	
    CheckForm:function() {
            if (this.domainObj.domain < 5) return false;
            if (!this.createdAdminAccount) return true;
                
            if (this.adminObj.name.length < 3) return false;
            if (this.mailUser.length < 2) return false;
            if (this.mailDomain.length < 3) return false;
            if (this.adminObj.password.length < 8) return false;
            if (this.adminObj.password != this.password2) return false;
               
            return true;
    },


  },  
  
  methods: {
    ToggleViewPassword(){
        if (this.showPassword)
            this.showPassword=false;
        else
            this.showPassword=true;
    },

    CheckText(){
            if (this.domainObj.domain.length < 5)
            {
                this.createdAdminAccount = false;
            }
            this.mailDomain = '@'+this.domainObj.domain;
    },

    SelectDomain(selected) {
        this.currentDomainObj = selected;
        console.log('show delete dialog');
        this.titlePage = "Usuwanie domeny: "+selected.domain;
        this.showDeleteDomainContent=true;
        this.showButtonPrev=true;
        this.showContent=false;
    },

    IsUpdateDomain() {
          console.log('Update domain:');

          console.log('Comment: '+this.domainObj.comment+' <> '+this.currentDomainObj.comment );
          console.log('Limit admins: '+this.domainObj.limit_admins+' <> '+this.currentDomainObj.limit_admins );
          console.log('Limit mails: '+this.domainObj.limit_mails+' <> '+this.currentDomainObj.limit_mails );
          if  (  this.domainObj.comment != this.currentDomainObj.comment ||
                this.domainObj.limit_admins != this.currentDomainObj.limit_admins ||
                this.domainObj.limit_mails != this.currentDomainObj.limit_mails
              ) return true;
            else
                return false;
    },

	
    ChangeServicesDomain() {

          console.log('ChangeServicesDomain');
          this.domainServices = [];
          this.adminChoiceServices = [];
          
          console.log(this.domainChoiceServices);
          console.log(this.domainChoiceServices.length);
          for (const item of this.domainChoiceServices) {
              console.log('Read choice: '+item);
              const domain = this.Services.filter(service => service.id == item);
              if (domain.length == 1) {
                console.log('Push: '+domain[0]);
                this.domainServices.push(domain[0]);
                this.adminChoiceServices.push(item);
              }
          }
    },
    

    EditDomain(selected) {
        console.log('Edit domain: '+selected.domain);
        this.GetServicesDomain(selected.domain);
        this.currentDomainObj = selected;
        this.AdminPanel = false;
        console.log('-----------------');
        console.log(selected);
        console.log('-----------------');
        this.showSpinLoading = false;
        this.ErrorMessage = '';
        this.SuccessMessage = '';
        this.SuccessMessageSlave = '';
        this.password2 = '';
        this.mailUser = '';
        this.mailDomain = '';
        
        this.domainObj=  selected;
        this.adminObj=  {'name':'', 'username':'','password':''};
        this.domainChoiceServices = [];
        this.adminChoiceServices = [];
        this.domainServices = [];


        this.createdAdminAccount = false;

      
        this.titlePage = 'Edycja domeny: '+selected.domain;
        this.showContent = false;
        this.showButtonPrev = true;
        this.showDomainContent = true;
    },


    AddNewDomain() {
          this.AdminPanel = true;
          this.showSpinLoading = false;
          this.ErrorMessage = '';
          this.SuccessMessage = '';
          this.SuccessMessageSlave = '';
          this.password2 = '';
          this.mailUser = '';
          this.mailDomain = '';
          
          this.domainObj=  {'domain':'', 'comment':'','limit_mails':100,'limit_admins':5};
          this.adminObj=  {'name':'', 'username':'','password':''};

          this.domainObj.limit_mails = '100';
          this.domainObj.limit_admins = '5';
          this.domainChoiceServices = [];
          this.adminChoiceServices = [];
          this.domainServices = [];
      
          const temp = this.Services.filter(service => service.com_checked == 1);

          for (const element of temp) {
            this.domainChoiceServices.push(element.id);
            this.domainServices.push(element);
            this.adminChoiceServices.push(element.id);
          }
      

          this.createdAdminAccount = false;
        
          this.titlePage = 'Rejestracja nowej domeny:';
          this.showContent = false;
          this.showButtonPrev = true;
          this.showDomainContent = true;
    },
	
    showAdminAccountPanel(){
          if (this.domainObj.domain.length < 5) this.createdAdminAccount = false; 
        
          if (this.createdAdminAccount) {
              this.createdAdminAccount = false;  
          }
            else
              this.createdAdminAccount = true;  
    },
    
    ShowDomains() {
          console.log('PAGE DOMAINS');
          this.showSpinLoading = false;
          this.showButtonPrev = false;
          this.showDomainContent = false;
          this.showContent = true;
          this.showDeleteDomainContent = false;
          this.titlePage = 'Domeny zarejestrowane:';
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
                    this.Domains = json.result;
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
                          this.Services = json.result;
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


    GetServicesDomain(domain) {
              console.log('GetServicesDomain: '+domain);
              fetch( this.serverurl+'services.php?token='+this.token+'&domain='+domain)
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
                      for (const element of json.result ) {
                        this.currentServices.push(element.service_id);
                        this.domainChoiceServices.push(element.service_id);
                      }
                      this.ChangeServicesDomain();
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

    UpdateDomain(){
        if (!this.IsUpdateDomain()) {
            this.SuccessMessage = "Dane domeny nie uległy zmienie.";
        }
          else
            this.SuccessMessage = "Aktualizowano.";
    },

    SaveNewDomain() {
            var data = {  token  : this.token, 
                          data   : this.domainObj,
                          services : this.domainChoiceServices};


            this.showSpinLoading = true;
            console.log('Save domain');
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
                  console.log(json);
                  console.log('JSONM saveDomain');
                  if (json.error) {
                    console.log(json.error);
                    this.ErrorMessage = json.error.message;
                  } else {
                    this.Domains.push(json.result);
                    this.SuccessMessage = "Domena "+json.result.domain+" została wprowadzona.";

                    if (this.createdAdminAccount)
                        this.CreateNewAdmin();
                    else
                      this.ShowDomains();
                  }

                  
            })
            .catch((error) => {
                  console.log('Error saveDomain');
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


    CreateNewAdmin() {
      console.log('Create admin dedicate');
      this.adminObj.username = this.mailUser+this.mailDomain;
      
      
      var data = {  token   : this.token, 
                    domain  : this.domainObj.domain,
                    admin   :  this.adminObj,
                    services: this.domainChoiceServices};
      
      
      console.log(JSON.stringify(data));

      this.showSpinLoading = true;

      this.ShowDomains();


      fetch(  this.serverurl+'admins.php', {
            headers: { 'Content-type': 'application/json' },
            method: "POST",
            body: JSON.stringify(data)})
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
              this.SuccessMessageSlave = "Administrator został utworzony "+json.result.username;
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
    
    DeleteDomain() {
       var data = {  token   : this.token, 
                     domain  : this.currentDomainObj.domain,
                  };


      this.showSpinLoading = true;


      console.log('Delete domain');
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
            console.log(json);
            if (json.error) {
              console.log(json.error);
              this.ErrorMessage = json.error.message;
            } else {
              this.SuccessMessage = "Administrator został utworzony "+json.result.username;
        }
        this.ShowDomains();
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


    SaveData() {

        if (this.AdminPanel) {
            this.SaveNewDomain();
        }
            else {
                this.UpdateDomain();
            }
    }

	  
  },
  
  mounted() {
		this.GetDomains();
		this.GetServices();
  },
  
  components: {
             
  },

  template: `
    <div style="margin-bottom: 25px;">
      <div class="row">
              <div class="col-1" style="width: 50px;" v-if="showButtonPrev">
                  <button class="btn btn-outline-primary" v-on:click="ShowDomains" :disabled="isDisableInputs">
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
        <div class="alert alert-success" v-if="SuccessMessageSlave" style="margin-bottom: 20px;">
          {{ SuccessMessageSlave }}
        </div>     
  </div>

  <div v-if="showDeleteDomainContent">
      <h5 class="text-warning" style="margin-bottom:10px;"><b>OSTRZEŻENIE</b></h5>
      <div class="text-danger" style="margin-bottom:20px;">
      Usunięcie domeny spowoduje automatyczne usunięcie kont pocztowych, kont administratorów dedykowanych przypisanych do domeny.<br>
      Jeśli administrator dedykowany jest przypisany do kilku domen (w tym do domeny usuwanej) - również zostanie usunięty!
      </diV>
      <h5 class="text-danger" style="margin-bottom:10px;"><b>CZY NAPEWNO USUNĄĆ DOMENĘ ?</b></h5>

      <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
          <div class="col-auto">
              <button type="button" class="btn btn-outline-danger" style="width: 100px;"  v-if="isglobal">
                TAK
              </button>      
          </div>
          <div class="col-auto">
              <button type="button" class="btn btn btn-outline-success" style="width: 100px;" v-on:click="ShowDomains" v-if="isglobal">
                NIE
              </button>      
          </div>

      </div>

  </div>

  <div v-if="showDomainContent">
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label"><b>Nazwa domeny:</b>  </label>
            </div>
            <div class="col-4">
              <input type="text" class="form-control" v-model="domainObj.domain" @input="CheckText" :disabled="isDisableInputs || !AdminPanel">
            </div>
          </div>
          
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label">Komentarz: </label>
            </div>
            <div class="col-4">
              <input type="text" class="form-control" v-model="domainObj.comment" :disabled="isDisableInputs">
            </div>
          </div>
          
          <h5 class="text-primary">Usługi:</h5>
          
          <div class="row g-3" style="margin-bottom: 20px;">
                <div class="col-auto">
                    <div class="list-group" v-for="service in Services" >
                          <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="checkbox" :value="service.id" v-model="domainChoiceServices"  :disabled="service.com_disabled || isDisableInputs" @change="ChangeServicesDomain">
                            <span>
							{{ service.name }}
                              <small class="d-block text-body-secondary">{{ service.description }}</small>
                            </span>
                          </label>
                    </div>
                </div>
          </div>  
          
          <h5 class="text-primary">Funkcje dodatkowe:</h5>
		  
          <div class="row g-3 align-items-center" style="margin-bottom: 10px;">
            <div class="col-3">
              <label class="col-form-label">Limit kont pocztowych:</label>
            </div>
            <div class="col-2">
              <input type="number" class="form-control" :value="domainObj.limit_mails" :v-model="domainObj.limit_mails" :disabled="isDisableInputs">
            </div>
          </div>
		  
          <div class="row g-3 align-items-center" style="margin-bottom: 10px;">
            <div class="col-3">
              <label class="col-form-label">Limit administratorów:</label>
            </div>
            <div class="col-2">
              <input type="number" class="form-control" :value="domainObj.limit_admins" :v-model="domainObj.limit_admins" :disabled="isDisableInputs">
            </div>
          </div>			  
          <div class="list-group" style="margin-bottom: 20px;" v-if="AdminPanel">
                <label class="list-group-item d-flex gap-2">
                  <input class="form-check-input flex-shrink-0" type="checkbox" v-model="createdAdminAccount" :disabled="domainObj.domain.length < 5 || isDisableInputs">
                  <span>
                    Utwórz administratora
                    <small class="d-block text-body-secondary">Utwórz dedykowanego administratora domeny.</small>
                  </span>
                </label>  
        </div>
        
        <div v-if="createdAdminAccount" style="margin-bottom: 20px;">
        
            <h6 class="text-primary">Konto administratora dedykowanego:</h6>
            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Nazwa użytkownia:</label>
                </div>
                <div class="col-4">
                  <input type="text" class="form-control" v-model="adminObj.name" :disabled="isDisableInputs">
                </div>
            </div>
            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Adres E-mail:</label>
                </div>
                <div class="col-3">
                  <input type="text" class="form-control" v-model="mailUser" :disabled="isDisableInputs">
                </div>                
                <div class="col-5">
                  <input type="text" class="form-control" v-model="mailDomain" disabled>
                </div>
            </div>            
             <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Hasło:</label>
                </div>
                <div class="col-4">
                  <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="adminObj.password" :disabled="isDisableInputs">
                </div>
            </div>
            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Powtórz:</label>
                </div>
                <div class="col-4">
					        <div class="input-group-mb-3">
						          <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="password2" :disabled="isDisableInputs">
				        </div>
            </div>

				
            <div class="col-auto">
                <button class="btn btn-outline-secondary" v-on:click="ToggleViewPassword">
                        <i class="fa fa-eye"></i>
                  </button>
            </div>

        </div>               
            
            <div class="list-group" style="margin-bottom: 20px;">
				    <h6 class="text-primary">Uprawnienia administratora dedykowanego:</h6>
					<div class="list-group" v-for="service in filterDomainServices">
                        <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="checkbox" v-model="adminChoiceServices" :value="service.id" :checked="service.com_checked" :disabled="service.com_disabled || isDisableInputs">
							  <span>
							   {{ service.name }}
                              <small class="d-block text-body-secondary">{{ service.description }}</small>
                            </span>
                        </label>
                    </div>                           
          </div>            
          
		  
            
        </div>
        
        <div class="row g-3 align-items-center">
			<div class="col-auto">
				<button class="btn btn-success" v-if="CheckForm" v-on:click="SaveData" :disabled="isDisableInputs">
					<div v-if="showSpinLoading" class="spinner-border text-white spinner-border-sm" role="status"></div>&nbsp;&nbsp;Zapisz
				</button>
			</div>
			<div class="col-auto">
				<button class="btn btn-outline-danger" v-on:click="ShowDomains" :disabled="isDisableInputs">Zamknij</button>
			</div>			
		</div>
  </div>
    
    
	<div v-if="showContent">
            <div class="row" style="margin-bottom: 10px;">
                <div  style="width: 200px;">
                    <button class="btn btn-outline-primary"  v-on:click="AddNewDomain">
                    <i class="fa fa-plus"></i>   Dodaj domenę</button>
                </div>
				<div  style="width: 400px;">
                    <input class="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj" v-model="SearchDomainText">
                </div>    
            </div>
			
			
			
			 <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                                <tr>
                                  <th scope="col" style="width: 50px;">#</th>
                                  <th scope="col" style="width: 30%;">Domena</th>
                                  <th scope="col" style="width: 200px;">Utworzona</th>
                                  <th scope="col">Komentarz</th>
                                  <th scope="col" style="width: 150px;">Akcja</th>
                                </tr>
                    </thead>
                    <tbody>
								<tr v-for="(domain,index) in filterDomainByName">
                                    <th scope="row">{{ index+1 }}</th>
                                    <td>{{ domain.domain }}</td>
                                    <td>{{ domain.created }}</td>
                                    <td>{{ domain.comment }}</td>
                                    <td>
                                        <button type="button" class="btn btn-outline-primary" style="width: 100px;" @click="EditDomain(domain)" v-if="isglobal">
                                          <i class="fas fa-pen"></i>
                                          Edycja
                                        </button>
                                        <div style="margin-top: 10px;" v-if="isglobal">
                                          <button type="button" class="btn btn-outline-danger" style="width: 100px;" v-on:click="SelectDomain(domain)"  v-if="isglobal">
                                            <i class="fas fa-trash"></i>
                                            Usuń
                                          </button>
                                        </div>
                                    </td>
                                  </tr>   					
					</tbody>
				</table>
			</div>
	</div>
		  
  `
}
             
