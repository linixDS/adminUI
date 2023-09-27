
export default {
  
    props: 
    {
        auth: ''
    },
    
    data() {
        return {
                    ErrorMessage: '',
                    ServicesInfo : [],
                    SystemInfo : [],
                    titlePage: 'Panel Administracyjny'
              }
    },
   
    computed: {
    },
    
    methods: {
        GetServicesInfo() {
            this.ErrorMessage = '';
            console.log("GET INFO");
            fetch( this.ServerUrl +'info.php?token=' + this.auth.SessToken)
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
                      this.ServicesInfo = json.result.services;
                      this.SystemInfo = json.result.system;
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
        console.log("PANEL INFO");
        this.GetServicesInfo();
    },
    
    components: {
    },
  
    template: 
    `
    <div style="margin-bottom: 45px;">
        <div class="row">
                <div class="col-xl">
                  <h3 class="text-primary">{{ titlePage }}</h3>
                </div>
        </div>
        <hr style="color: blue;">
    </div>

    <div style="margin-bottom: 25px;">
        <h5 class="text-primary" style="margin-bottom: 15px;">Informacje o usługach:</h5>


        <div class="row g-3 align-items-center" v-for="(service) in ServicesInfo" >
            <div class="col-4">
                <label class="col-form-label">{{ service.desc}}:</label>
            </div>
            <div class="col-2">
            {{ service.value}}
            </div>
        </div>  
    </div>

 


    `
  }
               
  