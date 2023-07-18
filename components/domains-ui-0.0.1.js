
export default {
  
  props: {
		isglobal: '',
		token: '',
		serverurl: ''
  },
  
  data() {
	  return {
		  Domains : [],
		  SearchDomainText: '',
		  ErrorMessage: '',
		  showContent: true,
          showDomainContent: false,
          showButtonPrev: false,
          createdAdminAccount: false,
          titlePage: 'Domeny zarejestrowane:',
          
          domainName: '',
          domainComment: '',
	  }
  },
  
  
  computed: {
    filterDomainByName: function(){
        const text = this.SearchDomainText;
        if (text.length > 0)
            return this.Domains.filter( domain => domain.domain.toUpperCase().includes(text.toUpperCase()) );
        else
            return this.Domains;
    }
  },  
  
  methods: {
    
    CheckText(){
        if (this.domainName.length < 5)
        {
            this.createdAdminAccount = false;
        }
    },
    
	AddNewDomain() {
        this.createdAdminAccount = false;
        this.domainName = '';
        this.domainComment = '';
        
      
        this.titlePage = 'Rejestracja nowej domeny:';
		this.showContent = false;
        this.showButtonPrev = true;
        this.showDomainContent = true;
        
		console.log('hide');
	},
	
    showAdminAccountPanel(){
        if (this.domainName.length < 5) this.createdAdminAccount = false; 
      
        if (this.createdAdminAccount) {
            this.createdAdminAccount = false;  
        }
          else
            this.createdAdminAccount = true;  
    },
    
	ShowDomains() {
        this.showButtonPrev = false;
        this.showDomainContent = false;
		this.showContent = true;
        this.titlePage = 'Domeny zarejestrowane:';
	},	

  
	  GetDomains() {
                    fetch(this.serverurl+'domains.php?token='+this.token)
						.then(res=>res.json()).then((response) => {
                           console.log(response.result);
						   this.Domains = response.result;

                        }).catch( (error) => {
                            console.log(error);
                            this.ErrorMessage = error;
                        });		  
	  }
  },
  
  mounted() {
		this.GetDomains();
  },
  
  components: {
             
  },

  template: `
    <div style="margin-bottom: 25px;">
      <div class="row">
              <div class="col-1" style="width: 50px;" v-if="showButtonPrev">
                  <button class="btn btn-outline-primary" v-on:click="ShowDomains">
                    <i class="fas fa-chevron-left"></i>
                  </button>
              </div>
              <div class="col-xl">
                <h3 class="text-primary">{{ titlePage }}</h3>
              </div>
      </div>
      <hr style="color: blue;">
   </div>

    <div v-if="showDomainContent">
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label"><b>Nazwa domeny:</b>  </label>
            </div>
            <div class="col-4">
              <input type="text" class="form-control" v-model="domainName" @input="CheckText">
            </div>
          </div>
          
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label">Komentarz: </label>
            </div>
            <div class="col-4">
              <input type="text" class="form-control">
            </div>
          </div>
          
          <h5 class="text-primary">Usługi:</h5>
          
          <div class="row g-3" style="margin-bottom: 20px;">
                <div class="col-4">
                    <div class="list-group" >
                          <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="checkbox" value="">
                            <span>
                              WorkFlow
                              <small class="d-block text-body-secondary">Aktywacja platformy WorkFlow</small>
                            </span>
                          </label>
                          <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="checkbox" value="">
                            <span>
                              Chat
                              <small class="d-block text-body-secondary">Aktywacja usługi Chat</small>
                            </span>
                          </label>                          
                    </div>
                </div>
                 <div class="col-4">
                      <div class="list-group">
                          <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="checkbox" value="">
                            <span>
                              Online-Files
                              <small class="d-block text-body-secondary">Aktywacja platformy Online-Files</small>
                            </span>
                          </label>
                        </div>
                 </div>
  
          </div>  
          
          <h5 class="text-primary">Funkcje dodatkowe:</h5>
          <div class="list-group" style="margin-bottom: 20px;">
                <label class="list-group-item d-flex gap-2">
                  <input class="form-check-input flex-shrink-0" type="checkbox" value="" v-model="createdAdminAccount" :disabled="domainName.length < 5">
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
                  <input type="text" class="form-control">
                </div>
            </div>
            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Adres E-mail:</label>
                </div>
                <div class="col-2">
                  <input type="text" class="form-control">
                </div>                
                <div class="col-2">
                  <input type="text" class="form-control" :value="'@'+domainName" disabled>
                </div>
            </div>            
             <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Hasło:</label>
                </div>
                <div class="col-4">
                  <input type="password" class="form-control">
                </div>
            </div>
             <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Powtórz:</label>
                </div>
                <div class="col-4">
                  <input type="password" class="form-control">
                </div>
            </div>               
            
            <div class="list-group" style="margin-bottom: 20px;">
                  <label class="list-group-item d-flex gap-2">
                    <input class="form-check-input flex-shrink-0" type="checkbox" value="">
                    <span>
                      WorkFlow
                      <small class="d-block text-body-secondary">Aktywuj konto administratora na platformie WorkFlow.</small>
                    </span>
                  </label>
                  <label class="list-group-item d-flex gap-2">
                    <input class="form-check-input flex-shrink-0" type="checkbox" value="">
                    <span>
                      RocketChat
                      <small class="d-block text-body-secondary">Aktywuj konto administratora na platformie RocketChat.</small>
                    </span>
                  </label>
                  <label class="list-group-item d-flex gap-2">
                    <input class="form-check-input flex-shrink-0" type="checkbox" value="">
                    <span>
                      Online-Disk
                      <small class="d-block text-body-secondary">Aktywuj konto administratora na platformie Online-Disk.</small>
                    </span>
                  </label>                     
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
                                        <button type="button" class="btn btn-outline-primary" style="width: 100px;" v-on:click="EditDomain(domain.domain)" v-if="isglobal">
                                          <i class="fas fa-pen"></i>
                                          Edycja
                                        </button>
                                        <div style="margin-top: 10px;" v-if="isglobal">
                                          <button type="button" class="btn btn-outline-danger" style="width: 100px;" v-on:click="DeleteDomain(domain.domain)">
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
             
