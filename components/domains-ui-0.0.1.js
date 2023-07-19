
export default {
  
  props: {
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
		  showContent: true,
          showDomainContent: false,
          showButtonPrev: false,
		  showSpinLoading: false,
          createdAdminAccount: false,
          titlePage: 'Domeny zarejestrowane:',
          password2: '',
		  mailUser : '',
		  mailDomain: '',
		  
		  domainObj: {},
		  adminObj: {},
		  domainServices: [],
		  domainChoiceServices: [],
		  adminChoiceServices: []
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
	
	filterDomainServices: function(){
		return this.domainServices;
	},
	CheckForm:function() {
		if (this.domainObj.name < 5) return false;
		if (!this.createdAdminAccount) return true;
		
		if (this.adminObj.name.length < 3) return false;
		if (this.mailUser.length < 3) return false;
		if (this.mailDomain.length < 3) return false;
		if (this.adminObj.password.length < 8) return false;
		if (this.adminObj.password != this.password2) return false;
		
		return true;
	},
  },  
  
  methods: {
    CheckText(){
        if (this.domainObj.name.length < 5)
        {
            this.createdAdminAccount = false;
        }
		this.mailDomain = '@'+this.domainObj.name;
    },
	
	ChangeServicesDomain() {
		this.domainServices = [];
		this.adminChoiceServices = [];
		
		console.log(this.domainChoiceServices);
		console.log(this.domainChoiceServices.length);
		for (const item of this.domainChoiceServices) {
			const domain = this.Services.filter(service => service.id == item);
			if (domain.length == 1) {
				this.domainServices.push(domain[0]);
				this.adminChoiceServices.push(item);
			}

		}
		
		console.log('Admin chice');
		console.log(this.adminChoiceServices);
	},
    
	AddNewDomain() {
		this.password2 = '';
		this.mailUser = '';
		this.mailDomain = '';
		
		this.domainObj=  {'name':'', 'comment':'','limit_mails':100,'limit_admin':100};
		this.adminObj=  {'name':'', 'username':'','password':''};
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
        this.domainName = '';
        this.domainComment = '';
      
        this.titlePage = 'Rejestracja nowej domeny:';
		this.showContent = false;
        this.showButtonPrev = true;
        this.showDomainContent = true;
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
	  },
	  
	GetServices() {
                    fetch(this.serverurl+'services.php?token='+this.token)
						.then(res=>res.json()).then((response) => {
                           console.log(response.result);
						   this.Services = response.result;

                        }).catch( (error) => {
                            console.log(error);
                            this.ErrorMessage = error;
                        });		  
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
              <input type="text" class="form-control" v-model="domainObj.name" @input="CheckText">
            </div>
          </div>
          
          <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
            <div class="col-2">
              <label class="col-form-label">Komentarz: </label>
            </div>
            <div class="col-4">
              <input type="text" class="form-control" v-model="domainObj.comment">
            </div>
          </div>
          
          <h5 class="text-primary">Usługi:</h5>
          
          <div class="row g-3" style="margin-bottom: 20px;">
                <div class="col-auto">
                    <div class="list-group" v-for="service in Services">
                          <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="checkbox" :value="service.id" v-model="domainChoiceServices"  :checked="service.com_checked" :disabled="service.com_disabled" @change="ChangeServicesDomain">
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
              <input type="number" class="form-control" :value="domainObj.limit_mails" :v-model="domainObj.limit_mails" >
            </div>
          </div>
		  
          <div class="row g-3 align-items-center" style="margin-bottom: 10px;">
            <div class="col-3">
              <label class="col-form-label">Limit administratorów:</label>
            </div>
            <div class="col-2">
              <input type="number" class="form-control" :value="domainObj.limit_admin" :v-model="domainObj.limit_admin">
            </div>
          </div>			  
          <div class="list-group" style="margin-bottom: 20px;">
                <label class="list-group-item d-flex gap-2">
                  <input class="form-check-input flex-shrink-0" type="checkbox" value="" v-model="createdAdminAccount" :disabled="domainObj.name.length < 5">
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
                  <input type="text" class="form-control" v-model="adminObj.name">
                </div>
            </div>
            <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Adres E-mail:</label>
                </div>
                <div class="col-3">
                  <input type="text" class="form-control" v-model="mailUser">
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
                  <input type="password" class="form-control" v-model="adminObj.password">
                </div>
            </div>
             <div class="row g-3 align-items-center" style="margin-bottom: 20px;">
                <div class="col-2">
                  <label class="col-form-label">Powtórz:</label>
                </div>
                <div class="col-4">
					<div class="input-group-mb-3">
						<input type="password" class="form-control" v-model="password2">
					</div>
				</div>
				
				<div class="col-auto">
	           <button class="btn btn-outline-secondary" v-on:click="">
                    <i class="fa fa-eye"></i>
                  </button>
				</div>
            </div>               
            
            <div class="list-group" style="margin-bottom: 20px;">
				    <h6 class="text-primary">Uprawnienia administratora dedykowanego:</h6>
					<div class="list-group" v-for="service in filterDomainServices">
                        <label class="list-group-item d-flex gap-2">
                            <input class="form-check-input flex-shrink-0" type="checkbox" v-model="adminChoiceServices" :value="service.id" :checked="service.com_checked" :disabled="service.com_disabled">
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
				<button class="btn btn-success" v-if="CheckForm">
					<div v-if="showSpinLoading" class="spinner-border text-white spinner-border-sm" role="status"></div>&nbsp;&nbsp;Zapisz
				</button>
			</div>
			<div class="col-auto">
				<button class="btn btn-outline-danger" v-on:click="ShowDomains">Zamknij</button>
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
             
