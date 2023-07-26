export default {
  
    props: 
    {
          isglobal: '',
          token: '',
          serverurl: ''
    },
    
    data() {
        return {
                ErrorMessage: '',
                SuccessMessage: '',
                SearchCompanyText: '',
                showContent: true,
                showCompanyContent: false,
                showButtonPrev: false,
                showSpinLoading: false,

                
               
                titlePage: 'Kontrahenci:',

      }
    },
    
    
    computed: {
        isDisableInputs: function() {
            if (this.showSpinLoading)
              return true;
            else
              return false;
        },        
    },  
    
    methods: {
        ShowCompanyList() {
            this.showSpinLoading = false;
            this.showButtonPrev = false;
            this.showDomainContent = false;
            this.showContent = true;
            this.showCompanyContent = false;
            this.showDeleteDomainContent = false;
            this.titlePage = 'Kontrahenci:';
      },	        
    },

    
    mounted() {

    },
    
    components: {
               
    },
  
    template: `
      <div style="margin-bottom: 25px;">
        <div class="row">
                <div class="col-1" style="width: 50px;" v-if="showButtonPrev">
                    <button class="btn btn-outline-primary" v-on:click="ShowCompanyList" :disabled="isDisableInputs">
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
  
  
    <div v-if="showCompanyContent">
        
    </div>
      
      
    <div v-if="showContent">
              <div class="row" style="margin-bottom: 10px;">
                  <div  style="width: 200px;">
                      <button class="btn btn-outline-primary">
                      <i class="fa fa-plus"></i> Dodaj kontahenta</button>
                  </div>
                  <div  style="width: 400px;">
                      <input class="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj" v-model="SearchCompanyText">
                  </div>    
              </div>
              
              
              
               
     </div>
            
    `
  }
               
  