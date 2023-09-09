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
                    ForwardName: '',
                    ForwardsList: []                   
              }
    },
    
    
    computed: {
    },
  
    methods: {
            BackPage(){
                console.log("BACK !!!");
            },

            AddForward(){
                if (this.ForwardName.lenght < 6) return;

                const aliaData = {forward: this.ForwardName,  mail: this.mail.username};

                const data = {token: this.auth.SessToken,
                              forward: aliaData};

                console.log('----[ ADD FORWARD ]-----');
                console.log(JSON.stringify(data));
                     
                this.AliasName = '';
                        
                fetch(  this.ServerUrl+'forwards.php', {
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
                                            this.ForwardsList.push(json.result);
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


            DeleteForward(forwardData){

                const structAlias = {forward: forwardData.forward,  mail: this.mail.username};

                const data = {token: this.auth.SessToken,
                              forward: structAlias};

                console.log('----[ DELETE FORWARD ]-----');
                console.log(JSON.stringify(data));
                     
                        
                fetch(  this.ServerUrl+'forwards.php', {
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
                                            var idx = this.ForwardsList.indexOf(forwardData);
                                            console.log('IDX = '+idx);
                                            if (idx !== -1) {
                                                this.ForwardsList.splice(idx, 1);
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

            GetForwards() {

              this.ErrorMessage = '';
              this.SuccessMessage = '';
              this.ForwardsList = [];

              console.log('GET FORWARDS');
              var url = this.ServerUrl+'forwards.php?token='+this.auth.SessToken+'&mail='+this.mail.id;
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
                      this.ForwardsList = json.result.forwards;
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
      console.log("Mounted module: forwards-ui")
 

      const url = new URL(document.URL);
      const protocol = url.protocol;
      const host = url.host;
  
      this.ServerUrl = protocol+'//'+host+'/api/v1/';
      this.GetForwards();
    },
    
    components: {
    },
  
    template: `

    <h5 class="text-primary" style="margin-bottom: 20px;">Przekierowania:</h5>

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
                  <button class="btn btn-outline-success" type="button" @click="AddForward">Dodaj</button>
              </div>
              <input type="text" v-model="ForwardName" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1">
          </div>
          <hr style="color: blue; margin-bottom: 20px;">

          <div class="input-group mb-3 w-75" v-for="(forward,index) in ForwardsList">
              <input type="text" v-model="forward.forward" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" disabled>
              <div class="input-group-prepend">
                  <button class="btn btn-outline-danger" type="button" @click="DeleteForward(forward)">Usuń</button>
              </div>
          </div>
          
    </div>

           
    `
  }
               
  