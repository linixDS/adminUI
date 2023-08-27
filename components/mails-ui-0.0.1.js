import AliasUi from './alias-ui-0.0.1.js';
import ForwardsUi from './forwards-ui-0.0.1.js';

export default {
  
    props: 
    {
        auth: {}
    },
    
    data() {
        return {
                Clients : [],
                Domains : [],
                Mails : [],
                SelectMails: [],
                
                SearchMailText: '',
                
                ErrorMessage: '',
                SuccessMessage: '',
                AllSelected: false,

                isDisableInputs: false,
                showContent: true,
                showEmailContent: false,
                showButtonPrev: false,
                showForwardsContent: false,
                showAliasContent: false,

             
                titlePage: 'Konta pocztowe:',
                mailData: [],

                ClientId: -1,
                DomainId: -1
              }
    },
    
    components: {
      AliasUi,
      ForwardsUi
    },    
    
    computed: {
      filterMailsByName: function(){
              const text = this.SearchMailText;
              if (text.length > 0)
                  return this.Mails.filter( mail => mail.username.toUpperCase().includes(text.toUpperCase()) );
              else
                  return this.Mails;
      },
    },
  
  
    
    methods: {
      BackPage(){
          console.log("BACK !!!");
          this.showButtonPrev = false;
          this.showEmailContent = false;


          this.showForwardsContent = false;
          this.showAliasContent = false;
          this.showContent = true;
      },
      
      ChangeClient(){
        this.Mails = [];
        this.Domains = [];
        console.log('Change client: '+this.ClientId);
        this.GetDomains(this.ClientId);
      },

      ChangeDomain(){
        console.log('Change domain: '+this.DomainId);
        this.GetMails(this.DomainId);
      },      
       
      ShowMails() {
            console.log("---[ SHOW PAGE MAILS ]-----");
            this.showButtonPrev = false;
            this.showContent = true;
            this.titlePage = 'Konta pocztowe:';
      },

      GlobalSelect() {
          this.SelectMails = [];
          if (!this.AllSelected) return;
          for (const item of this.Mails){
              this.SelectMails.push(item.id);
          }
      },

      ShowAlias() {
        this.showForwardsContent = false;
        this.showAliasContent = true;        
      },

      ShowForwards() {
        this.showAliasContent = false; 
        this.showForwardsContent = true;;
      },

      EditMailBox(mail) {
        console.log("---[ SHOW PAGE EDIT MAIL ]-----");

        this.mailData = mail;

        this.ErrorMessage = '';
        this.SuccessMessage = '';
      
        this.titlePage = 'Edycja konta:  '+mail.username;
        this.showContent = false;
        this.showButtonPrev = true;
        this.showEmailContent = true;
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

        GetMails(domainId) {
            this.SelectMails = [];
            console.log('GET DOMAINS');
            var url = this.ServerUrl+'mails.php?token='+this.auth.SessToken+'&domain='+domainId+'&client='+this.ClientId;


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
                    this.Mails = json.result.mails;
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
    
 
    template: `
      <div style="margin-bottom: 25px;">
        <div class="row">
                <div class="col-1" style="width: 50px;" v-if="showButtonPrev">
                    <button class="btn btn-outline-primary" v-on:click="BackPage">
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
  
    <div v-if="showEmailContent">
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
              <div class="col-2">
                <label class="col-form-label">E-mail:  </label>
              </div>
              <div class="col-6">
                <input type="text" maxlength="85" class="form-control" v-model="mailData.username"  disabled>
              </div>
          </div> 

          <hr style="color: blue; margin-bottom: 20px;">

          <div class="row g-3 align-items-center" style="margin-bottom: 20px">
              <div class="col-auto">
                <button :class="showAliasContent ? 'btn btn-primary' : 'btn btn-outline-primary'" v-on:click="ShowAlias">Alias</button>
              </div>
              <div class="col-auto">
                <button :class="showForwardsContent ? 'btn btn-primary' : 'btn btn-outline-primary'" v-on:click="ShowForwards">Przekierowania</button>
              </div>	
              <div class="col-auto">
                <button class="btn btn-outline-primary" v-on:click="BackPage">Podpis</button>
              </div>	                            	
          </div>
          
          <hr style="color: blue; margin-bottom: 20px;">

          
          <Alias-ui  :auth="auth" :mail="mailData"  v-if="showAliasContent">  </Alias-ui>              
          
          <Forwards-ui  :auth="auth" :mail="mailData"  v-if="showForwardsContent">  </Forwards-ui>    

          
        

          
          <div class="row g-3 align-items-center" style="margin-top: 50px">
              <div class="col-auto">
                <button class="btn btn-outline-primary" v-on:click="BackPage">Zamknij</button>
              </div>	
          </div>           
    </div>
      
      
      <div v-if="showContent">


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
                      <input class="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj" v-model="SearchMailText">
                    </div>    
              </div>
              
              
  
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                  <thead class="table-dark">
                              <tr>
                                <th scope="col" style="width: 45px;">
                                <input type="checkbox" class="form-check-input flex-shrink-0"  v-model="AllSelected" @change="GlobalSelect()">
                                </th>
                                <th scope="col">Konto</th>
                                <th scope="col" style="width: 150px;">Akcja</th>
                              </tr>
                  </thead>
                  <tbody>
                                <tr v-for="(mail,index) in filterMailsByName">
                                  <th scope="row"><input type="checkbox" :value="mail.id" v-model="SelectMails" class="form-check-input flex-shrink-0"></th>
                                  <td :class="mail.active==1 ? 'text-success' : 'text-danger'">{{ mail.username }}</td>
                                  <td>
                                      <button type="button" class="btn btn-outline-primary" style="width: 100px;" @click="EditMailBox(mail)">
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
               
  