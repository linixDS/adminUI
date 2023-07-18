
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
		  ErrorMessage: ''
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
            <div class="row" style="margin-bottom: 10px;">
                <div  style="width: 200px;">
                    <button class="btn btn-outline-primary">
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
                                        <button type="button" class="btn btn-outline-primary" style="width: 100px;" v-on:click="EditDomain(domain.domain)">
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
		  
  `
}
             