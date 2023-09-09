export default {
  
    props: 
    {
        auth: {},
        mail: {},
    },
    
    data() {
        return {
                    ServerUrl: '',
                    ErrorMessage: '',
                    SuccessMessage: '', 
                    DomainMame: '',
                    AliasName: '',
                    AliasList: []                   
              }
    },
    
    
    computed: {
    },
  
    methods: {
            BackPage(){
                console.log("BACK !!!");
            },

            AddAlias(){
                if (this.AliasName.lenght < 3) return;

                const name = this.AliasName+this.DomainMame;
                const aliaData = {alias: name,  mail: this.mail.username};

                const data = {token: this.auth.SessToken,
                              alias: aliaData};

                console.log('----[ ADD ALIAS ]-----');
                console.log(JSON.stringify(data));
                     
                this.AliasName = '';
                        
                fetch(  this.ServerUrl+'alias.php', {
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
                                            this.AliasList.push(json.result);
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
                });                              
                
            },


            DeleteAlias(aliasData){

                const structAlias = {alias: aliasData.alias,  mail: this.mail.username};

                const data = {token: this.auth.SessToken,
                              alias: structAlias};

                console.log('----[ DELETE ALIAS ]-----');
                console.log(JSON.stringify(data));
                     
                        
                fetch(  this.ServerUrl+'alias.php', {
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
                                        } else {
                                            var idx = this.AliasList.indexOf(aliasData);
                                            console.log('IDX = '+idx);
                                            if (idx !== -1) {
                                                this.AliasList.splice(idx, 1);
                                            }
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
                });                              
                
            },            

            GetAlias() {
              this.ErrorMessage = '';
              this.SuccessMessage = '';
              this.AliasList = [];

              console.log('GET ALIAS');
              var url = this.ServerUrl+'alias.php?token='+this.auth.SessToken+'&mail='+this.mail.id;
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
                      this.AliasList = json.result.alias;
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
      console.log("Mounted module: alias-ui")
      const addressMail = this.mail.username.split("@");
      console.log(addressMail);
      this.DomainMame = '@'+addressMail[1];
      console.log(this.DomainMame);


      const url = new URL(document.URL);
      const protocol = url.protocol;
      const host = url.host;
  
      this.ServerUrl = protocol+'//'+host+'/api/v1/';
      this.GetAlias();
    },
    
    components: {
    },
  
    template: `

    <h5 class="text-primary" style="margin-bottom: 20px;">Alias:</h5>

    <div>
          <div class="alert alert-danger" v-if="ErrorMessage" style="margin-bottom: 20px;">
            {{ ErrorMessage }}
          </div>
          <!--- Display success message --->
          <div class="alert alert-success" v-if="SuccessMessage" style="margin-bottom: 20px;">
            {{ SuccessMessage }}
          </div> 
    
    </div>

    <div class="p-3 mb-2 bg-light text-dark" style="margin-bottom: 80px;">
          
          <div class="input-group mb-3 w-75" style="margin-bottom: 30px;">
              <div class="input-group-prepend">
                  <button class="btn btn-outline-success" type="button" @click="AddAlias">Dodaj</button>
              </div>
              <input type="text" v-model="AliasName" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1">
              <input type="text" v-model="DomainMame" class="form-control" disabled>
          </div>
          <hr style="color: blue; margin-bottom: 20px;">

          <div class="input-group mb-3 w-75" v-for="(alias,index) in AliasList">
              <input type="text" v-model="alias.alias" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" disabled>
              <div class="input-group-prepend">
                  <button class="btn btn-outline-danger" type="button" @click="DeleteAlias(alias)">Usuń</button>
              </div>
          </div>
          
    </div>

           
    `
  }
               
  