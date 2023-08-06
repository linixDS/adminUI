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
                ChoiceServices: [],
                
                SearchMailText: '',
                
                ErrorMessage: '',
                SuccessMessage: '',
                    

                isEditable: false,

                showContent: true,
                showButtonPrev: false,
                showSpinLoading: false,
                isDisableInputs: false,    

             
                
                titlePage: 'Konta pocztowe:',


                ClientId: -1,
                DomainId: -1
              }
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
            this.showSpinLoading = false;
            this.showButtonPrev = false;
            this.showContent = true;
            this.titlePage = 'Konta pocztowe:';
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
                                <th scope="col" style="width: 45px;">#</th>
                                <th scope="col">Użytkownik</th>
                              </tr>
                  </thead>
                  <tbody>
                                <tr v-for="(mail,index) in filterMailsByName">
                                  <th scope="row">{{ index+1 }}</th>
                                  <td :class="mail.active==1 ? 'text-success' : 'text-danger'">{{ mail.username }}</td>
                                </tr>   					
                            </tbody>
                      </table>
            </div>

      </div>
            
    `
  }
               
  