
export default {
  
    props: 
    {
        auth: ''
    },
    
    data() {
        return {
                    ErrorMessage: '',
                    SuccessMessage: '',
                    titlePage: 'Moje konto',
                    ServerUrl: '',


                    isValidName: false,
                    isValidPass1: false,
                    isValidPass2: false,
                    showSpinLoading: false,
                    isChangePassword: false,
                    showSaveBtn : true,
                    password1: 'password',
                    password2: '',


                    adminData: {name: '', username: '', type: '', mail: ''},
                    updateAdminData: {},
              }
    },
    
    
    computed: {
      CheckForm:function() {
              if (this.adminData.name.length < 5)
              {
                  this.isValidName = false;
                  return false;
              }             
                else
                this.isValidName = true;

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

        CheckUpdateData(){
          console.log(this.adminData);
          console.log(this.updateAdminData);
          if ( (this.adminData.name != this.updateAdminData.name) ||
               (this.adminData.mail != this.updateAdminData.mail)){
              return true;
          }

          if (this.isChangePassword) {
            return true;
          }

          return false;
        }, 
        
        CopyData(client){
          this.adminData.username = client.UserName;
          if (this.auth.isGlobalAdmin)
              this.adminData.type = 'global';
          else
              this.adminData.type = 'dedicated';
  
          this.adminData.name = client.DisplayName;
          this.adminData.mail = client.Email;

          this.updateAdminData = {name: '', mail: ''};
          this.updateAdminData.name = client.DisplayName;
          this.updateAdminData.mail = client.Email;

          this.isChangePassword = false;
          this.password1 = 'password';
          this.password2 = '';       
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
          console.log('----[ UPDATE PROFILE ]-----');
          console.log(JSON.stringify(data));

          fetch(  this.ServerUrl+'admins.php', {
                headers: { 'Content-type': 'application/json' },
                method: "PUT",
                body: JSON.stringify(data)})
                .then((res) => {
                      console.log('StatusCode: ' + res.status);
                      this.showSpinLoading = false;
                      return res.json(); // Dodajemy return, aby zwrócić wynik jako Promise
                })
                .then((json) => {
                      console.log('-> RESULT:');
                      console.log(json);
    
                      if (json.error) {
                        console.log(json.error);
                        this.ErrorMessage = json.error.message;
                      } else {
                        this.SuccessMessage = "Dane administratora "+json.result.username+" zostały zaaktualizowane.";
                        
                        this.auth.DisplayName = json.result.name;
                        this.auth.mail = json.result.mail;

                        this.CopyData(this.auth);
                      }
    
                      
                })
                .catch((error) => {
                      this.showSpinLoading = false;
                      console.log('Error saveClient');
                      if (error == "TypeError: Failed to fetch")
                        this.ErrorMessage = "Nie można nawiązać połączenia z serwerem "+this.ServerUrl;
                      else
                        if (error == "SyntaxError: Unexpected token '<', \"<?xml vers\"... is not valid JSON")
                            this.ErrorMessage = "Błąd: nie odnaleziono zasobu.";
                        else
                          this.ErrorMessage = 'Wyjątek: ' + error;
                });
  
      },

        SaveData(){
          this.SuccessMessage = '';
          this.ErrorMessage = '';
  
          this.UpdateData();
      },        
    },
    
    mounted() {
        console.log('LOAD MODULE: profile-ui');

        this.CopyData(this.auth);

        const url = new URL(document.URL);
        const protocol = url.protocol;
        const host = url.host;

        this.ServerUrl = protocol+'//'+host+'/api/v1/';

    },
    
    components: {
    },
  
    template: 
    `
    <div style="margin-bottom: 25px;">
        <div class="row">
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

    <h5 class="text-primary">Profil:</h5>

    <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
      <div class="col-2">
        <label class="col-form-label">Typ konta:</label>
      </div>
      <div class="col-4">
          <select class="form-select"  aria-label="wybierz z listy" v-model="adminData.type" disabled>
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
          <input type="text" maxlength="25" class="form-control" v-model="adminData.username"  disabled>
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
          <input type="text" maxlength="65" class="form-control" v-model="adminData.mail"  :disabled="isDisableInputs">
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
    
  
    <div class="row g-3 align-items-center" v-if="showSaveBtn">
        <div class="col-auto">
          <button class="btn btn-success" :disabled="isDisableInputs" v-if="CheckForm" v-on:click="SaveData">
            <div v-if="showSpinLoading" class="spinner-border text-white spinner-border-sm" role="status"></div>&nbsp;&nbsp;Zapisz
          </button>
        </div>
          
    </div>          
   
    `
  }
               
  